import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ModuleForm from './components/ModuleForm';
import ToastNotification from './components/ToastNotification';
import ShareModal from './components/ShareModal';
import BriefingsDashboardDrawer from './components/BriefingsDashboardDrawer';
import AdminDashboardDrawer from './components/AdminDashboardDrawer';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import AuthScreen from './components/AuthScreen';
import './App.css';

import { ChevronUp } from 'lucide-react';
import { BRIEFING_MODULES, INITIAL_HEADER } from './data/briefingModules';
import { isSupabaseConfigured } from './lib/supabase';
import { 
  generateBriefingId, 
  getBriefingById, 
  saveBriefingToCloud,
  listAllBriefingsFromCloud
} from './services/briefingService';
import { onAuthStateChange, signOut, getCurrentUser, isAdminUser } from './services/authService';

const STORAGE_KEY = 'clinica_estetica_briefing_draft_v3';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminEditingClinicName, setAdminEditingClinicName] = useState(null);

  // Active briefing state
  const [briefingId, setBriefingId] = useState('');
  const [headerData, setHeaderData] = useState(INITIAL_HEADER);
  const [answers, setAnswers] = useState({});

  const [activeModuleId, setActiveModuleId] = useState(BRIEFING_MODULES[0].id);
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'light');
  const [toast, setToast] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Salvo localmente');
  const [isCloudLoading, setIsCloudLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Modais e Drawers
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  const saveTimeoutRef = useRef(null);

  // Listen to Auth State
  useEffect(() => {
    getCurrentUser().then(user => {
      setCurrentUser(user);
      if (user && isAdminUser(user)) {
        setIsAdminDashboardOpen(true);
      }
      setAuthInitialized(true);
    });

    const { data: { subscription } } = onAuthStateChange((event, user) => {
      setCurrentUser(user);
      if (user && isAdminUser(user)) {
        setIsAdminDashboardOpen(true);
      }
      if (!user) {
        setBriefingId('');
        setHeaderData(INITIAL_HEADER);
        setAnswers({});
        if (window.location.search) {
          window.history.pushState({}, '', window.location.pathname);
        }
      }
      setAuthInitialized(true);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const userKeyPrefix = currentUser?.id ? `user_${currentUser.id}` : 'guest';

  // Synchronize theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Load briefing data safely after user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setDataLoaded(false);
      return;
    }

    const prefix = `user_${currentUser.id}`;
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');

    const initializeUserBriefing = async () => {
      setIsCloudLoading(true);
      setSaveStatus('Buscando da nuvem...');

      let targetId = idFromUrl || localStorage.getItem(`${STORAGE_KEY}_${prefix}_active_id`);

      // 1. Try loading specific briefing if targetId exists
      if (isSupabaseConfigured && targetId) {
        const { data, error } = await getBriefingById(targetId);
        if (!error && data) {
          if (!data.user_id || data.user_id !== currentUser.id) {
            await saveBriefingToCloud(data.id, data.header_data || INITIAL_HEADER, data.answers || {}, currentUser.id);
          }
          setBriefingId(targetId);
          setHeaderData(data.header_data || INITIAL_HEADER);
          setAnswers(data.answers || {});
          setSaveStatus('Carregado da Nuvem');
          setIsCloudLoading(false);
          setDataLoaded(true);
          return;
        }
      }

      // 2. Search user's cloud briefings by user_id
      if (isSupabaseConfigured) {
        const { data: userBriefings } = await listAllBriefingsFromCloud(currentUser.id);
        if (userBriefings && userBriefings.length > 0) {
          const latest = userBriefings[0];
          setBriefingId(latest.id);
          setHeaderData(latest.header_data || INITIAL_HEADER);
          setAnswers(latest.answers || {});
          setSaveStatus('Carregado da Nuvem');
          setIsCloudLoading(false);
          setDataLoaded(true);
          return;
        }

        // 2b. If no briefing found linked to user_id, search all cloud briefings to link existing briefing
        const { data: allBriefings } = await listAllBriefingsFromCloud(null);
        if (allBriefings && allBriefings.length > 0) {
          const userEmail = currentUser.email?.toLowerCase();
          let matched = allBriefings.find(b => 
            b.header_data?.responsibleEmail?.toLowerCase() === userEmail
          );

          if (!matched) {
            // Pick unlinked briefing or latest existing briefing in cloud
            matched = allBriefings.find(b => !b.user_id) || allBriefings[0];
          }

          if (matched) {
            // Auto-link this briefing to current user
            await saveBriefingToCloud(matched.id, matched.header_data || INITIAL_HEADER, matched.answers || {}, currentUser.id);
            setBriefingId(matched.id);
            setHeaderData(matched.header_data || INITIAL_HEADER);
            setAnswers(matched.answers || {});
            setSaveStatus('Carregado da Nuvem');
            setIsCloudLoading(false);
            setDataLoaded(true);
            return;
          }
        }
      }

      // 3. Fallback: try localStorage for prefix
      if (targetId) {
        setBriefingId(targetId);
        try {
          const localHeader = localStorage.getItem(`${STORAGE_KEY}_${prefix}_header_${targetId}`);
          const localAnswers = localStorage.getItem(`${STORAGE_KEY}_${prefix}_answers_${targetId}`);
          if (localHeader) setHeaderData(JSON.parse(localHeader));
          if (localAnswers) setAnswers(JSON.parse(localAnswers));
        } catch (e) {
          setHeaderData(INITIAL_HEADER);
          setAnswers({});
        }
      } else {
        // Fresh new briefing ID for brand new user
        const newId = generateBriefingId();
        setBriefingId(newId);
        setHeaderData(INITIAL_HEADER);
        setAnswers({});
      }

      setSaveStatus('Salvo localmente');
      setIsCloudLoading(false);
      setDataLoaded(true);
    };

    initializeUserBriefing();
  }, [currentUser]);

  // Debounced auto-save (ONLY when user is logged in AND initial data load completed)
  useEffect(() => {
    if (!currentUser || !dataLoaded || !briefingId) return;

    try {
      localStorage.setItem(`${STORAGE_KEY}_${userKeyPrefix}_active_id`, briefingId);
      localStorage.setItem(`${STORAGE_KEY}_${userKeyPrefix}_header_${briefingId}`, JSON.stringify(headerData));
      localStorage.setItem(`${STORAGE_KEY}_${userKeyPrefix}_answers_${briefingId}`, JSON.stringify(answers));
    } catch (e) {
      console.error('Erro ao salvar localmente', e);
    }

    if (isSupabaseConfigured) {
      setSaveStatus('Salvando...');

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        const { error } = await saveBriefingToCloud(briefingId, headerData, answers, currentUser.id);
        if (!error) {
          const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          setSaveStatus(`Salvo na Nuvem (${time})`);
        } else {
          setSaveStatus('Erro na nuvem (Salvo local)');
        }
      }, 1200);
    } else {
      setSaveStatus('Salvo localmente');
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [briefingId, headerData, answers, currentUser, dataLoaded]);

  const clearPendingSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  };

  const showToastNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignOut = async () => {
    clearPendingSave();
    await signOut();
    setCurrentUser(null);
    setDataLoaded(false);
    setAdminEditingClinicName(null);
    setBriefingId('');
    setHeaderData(INITIAL_HEADER);
    setAnswers({});
    if (window.location.search) {
      window.history.pushState({}, '', window.location.pathname);
    }
    showToastNotification('Você saiu da sua conta.', 'info');
  };

  const handleSelectBriefing = async (newId) => {
    clearPendingSave();
    setBriefingId(newId);
    const newUrl = `${window.location.pathname}?id=${encodeURIComponent(newId)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    if (isSupabaseConfigured) {
      setSaveStatus('Buscando da nuvem...');
      const { data, error } = await getBriefingById(newId);
      if (!error && data) {
        setHeaderData(data.header_data || INITIAL_HEADER);
        setAnswers(data.answers || {});
        showToastNotification(`Briefing "${data.clinic_name}" carregado!`, 'success');
      }
    } else {
      const localHeader = localStorage.getItem(`${STORAGE_KEY}_${userKeyPrefix}_header_${newId}`);
      const localAnswers = localStorage.getItem(`${STORAGE_KEY}_${userKeyPrefix}_answers_${newId}`);
      setHeaderData(localHeader ? JSON.parse(localHeader) : INITIAL_HEADER);
      setAnswers(localAnswers ? JSON.parse(localAnswers) : {});
    }
  };

  const handleAdminEditBriefing = (briefing) => {
    clearPendingSave();
    setBriefingId(briefing.id);
    setHeaderData(briefing.header_data || INITIAL_HEADER);
    setAnswers(briefing.answers || {});
    setAdminEditingClinicName(briefing.clinic_name || 'Clínica');
    setIsAdminDashboardOpen(false);
    showToastNotification(`Editando briefing da clínica "${briefing.clinic_name}"`, 'info');
  };

  const handleCreateNewBriefing = () => {
    clearPendingSave();
    const newId = generateBriefingId();
    setBriefingId(newId);
    setHeaderData(INITIAL_HEADER);
    setAnswers({});

    const newUrl = `${window.location.pathname}?id=${encodeURIComponent(newId)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    showToastNotification('Novo briefing iniciado!', 'info');
  };

  const activeModuleIndex = BRIEFING_MODULES.findIndex(m => m.id === activeModuleId);
  const currentModule = BRIEFING_MODULES[activeModuleIndex] || BRIEFING_MODULES[0];

  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const scrollToTop = () => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
    const scrollOptions = { top: 0, left: 0, behavior: 'smooth' };
    window.scrollTo(scrollOptions);
    try {
      document.documentElement.scrollTo(scrollOptions);
    } catch (e) {}
    try {
      document.body.scrollTo(scrollOptions);
    } catch (e) {}
  };

  const handleSelectModule = (moduleId) => {
    setActiveModuleId(moduleId);
    scrollToTop();
  };

  // Auto-scroll to top smoothly whenever active module changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToTop();
  }, [activeModuleId]);

  const handleNextModule = () => {
    if (activeModuleIndex < BRIEFING_MODULES.length - 1) {
      handleSelectModule(BRIEFING_MODULES[activeModuleIndex + 1].id);
    } else {
      showToastNotification('Parabéns! Você chegou ao final do briefing.', 'info');
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      handleSelectModule(BRIEFING_MODULES[activeModuleIndex - 1].id);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja limpar este briefing? As respostas serão apagadas.')) {
      setHeaderData(INITIAL_HEADER);
      setAnswers({});
      localStorage.removeItem(`${STORAGE_KEY}_${userKeyPrefix}_header_${briefingId}`);
      localStorage.removeItem(`${STORAGE_KEY}_${userKeyPrefix}_answers_${briefingId}`);
      setActiveModuleId(BRIEFING_MODULES[0].id);
      showToastNotification('Briefing limpo com sucesso!', 'info');
    }
  };

  const progressPercentage = useMemo(() => {
    const allQuestions = BRIEFING_MODULES.flatMap(m => m.questions);
    const totalCount = allQuestions.length;
    const answeredCount = allQuestions.filter(q => (answers[q.key] || '').trim().length > 0).length;
    return Math.round((answeredCount / totalCount) * 100);
  }, [answers]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // 1. Loading state while checking auth
  if (!authInitialized) {
    return (
      <div className="auth-loading-screen">
        <div className="spin-loader"></div>
        <p>Carregando sistema...</p>
      </div>
    );
  }

  // 2. Auth Gate: Show full-screen Login Screen if not authenticated
  if (!currentUser) {
    return (
      <AuthScreen 
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (isAdminUser(user)) {
            setIsAdminDashboardOpen(true);
          }
          showToastNotification(`Bem-vindo, @${user.user_metadata?.username || user.email?.split('@')[0]}!`, 'success');
        }} 
      />
    );
  }

  // 3. Admin Standalone Full-Page View (Option A)
  if (isAdminDashboardOpen) {
    return (
      <div className="app-shell">
        <Header
          headerData={headerData}
          setHeaderData={setHeaderData}
          theme={theme}
          toggleTheme={toggleTheme}
          onReset={handleReset}
          saveStatus={saveStatus}
          progressPercentage={progressPercentage}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          isAdminView={true}
          onCloseAdminView={() => setIsAdminDashboardOpen(false)}
        />

        <AdminDashboardDrawer
          isOpen={true}
          onClose={() => setIsAdminDashboardOpen(false)}
          showToastNotification={showToastNotification}
          isFullPage={true}
          onEditBriefing={handleAdminEditBriefing}
        />

        <ToastNotification toast={toast} />
      </div>
    );
  }

  // 4. Authenticated App Layout (Briefing Collector)
  return (
    <div className="app-shell">
      <Header
        headerData={headerData}
        setHeaderData={setHeaderData}
        theme={theme}
        toggleTheme={toggleTheme}
        onReset={handleReset}
        saveStatus={saveStatus}
        progressPercentage={progressPercentage}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {adminEditingClinicName && (
        <div className="admin-editing-banner">
          <span>✏️ <strong>Modo Administrador:</strong> Editando briefing da clínica <strong>"{adminEditingClinicName}"</strong></span>
          <button onClick={() => setIsAdminDashboardOpen(true)} className="btn-bw-secondary btn-xs">
            ← Voltar à Lista Admin
          </button>
        </div>
      )}

      <div className="app-container">
        <Sidebar
          modules={BRIEFING_MODULES}
          activeModuleId={activeModuleId}
          setActiveModuleId={setActiveModuleId}
          onSelectModule={handleSelectModule}
          answers={answers}
          headerData={headerData}
          setHeaderData={setHeaderData}
          progressPercentage={progressPercentage}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        <main className="app-main">
          {isCloudLoading || !dataLoaded ? (
            <div className="cloud-loading-container">
              <h3>Carregando briefing da nuvem...</h3>
            </div>
          ) : (
            <ModuleForm
              module={currentModule}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onNextModule={handleNextModule}
              onPrevModule={handlePrevModule}
              isFirstModule={activeModuleIndex === 0}
              isLastModule={activeModuleIndex === BRIEFING_MODULES.length - 1}
            />
          )}
        </main>
      </div>

      {/* Modais e Drawers */}
      <ShareModal
        briefingId={briefingId}
        clinicName={headerData.clinicName}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        showToastNotification={showToastNotification}
      />

      <BriefingsDashboardDrawer
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        currentBriefingId={briefingId}
        onSelectBriefing={handleSelectBriefing}
        onCreateNewBriefing={handleCreateNewBriefing}
        onOpenShareModal={(id, name) => {
          setBriefingId(id);
          setIsShareModalOpen(true);
        }}
        showToastNotification={showToastNotification}
        currentUser={currentUser}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />

      <ToastNotification toast={toast} />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          title="Voltar ao Topo"
          aria-label="Voltar ao Topo"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}
