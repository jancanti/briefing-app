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

import { BRIEFING_MODULES, INITIAL_HEADER } from './data/briefingModules';
import { isSupabaseConfigured } from './lib/supabase';
import { 
  generateBriefingId, 
  getBriefingById, 
  saveBriefingToCloud 
} from './services/briefingService';
import { onAuthStateChange, signOut, getCurrentUser } from './services/authService';

const STORAGE_KEY = 'clinica_estetica_briefing_draft_v3';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    getCurrentUser().then(user => {
      setCurrentUser(user);
      setAuthInitialized(true);
    });

    const { data: { subscription } } = onAuthStateChange((event, user) => {
      setCurrentUser(user);
      setAuthInitialized(true);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const userKeyPrefix = currentUser?.id ? `user_${currentUser.id}` : 'guest';

  // Active briefing ID
  const [briefingId, setBriefingId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || localStorage.getItem(`${STORAGE_KEY}_${userKeyPrefix}_active_id`) || generateBriefingId();
  });

  const [headerData, setHeaderData] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${userKeyPrefix}_header_${briefingId}`);
      return saved ? JSON.parse(saved) : INITIAL_HEADER;
    } catch (e) {
      return INITIAL_HEADER;
    }
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${userKeyPrefix}_answers_${briefingId}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [activeModuleId, setActiveModuleId] = useState(BRIEFING_MODULES[0].id);
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'light');
  const [toast, setToast] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Salvo localmente');
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  // Modais e Drawers
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  const saveTimeoutRef = useRef(null);

  // Synchronize theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Load cloud briefing when user logs in or URL changes
  useEffect(() => {
    if (!currentUser) return;

    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');

    if (idFromUrl) {
      setBriefingId(idFromUrl);
      localStorage.setItem(`${STORAGE_KEY}_${userKeyPrefix}_active_id`, idFromUrl);

      if (isSupabaseConfigured) {
        setIsCloudLoading(true);
        setSaveStatus('Buscando da nuvem...');

        getBriefingById(idFromUrl).then(({ data, error }) => {
          if (!error && data) {
            if (data.header_data) setHeaderData(data.header_data);
            if (data.answers) setAnswers(data.answers);
            setSaveStatus('Carregado da Nuvem');
          } else if (error) {
            setSaveStatus('Erro ao carregar');
          }
          setIsCloudLoading(false);
        });
      }
    }
  }, [currentUser]);

  // Debounced auto-save
  useEffect(() => {
    if (!currentUser) return;

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
  }, [briefingId, headerData, answers, currentUser]);

  const showToastNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    showToastNotification('Você saiu da sua conta.', 'info');
  };

  const handleSelectBriefing = async (newId) => {
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

  const handleCreateNewBriefing = () => {
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

  const handleNextModule = () => {
    if (activeModuleIndex < BRIEFING_MODULES.length - 1) {
      setActiveModuleId(BRIEFING_MODULES[activeModuleIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToastNotification('Parabéns! Você chegou ao final do briefing.', 'info');
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleId(BRIEFING_MODULES[activeModuleIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          showToastNotification(`Bem-vindo, @${user.user_metadata?.username || user.email?.split('@')[0]}!`, 'success');
        }} 
      />
    );
  }

  // 3. Authenticated App Layout
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

      <div className="app-container">
        <Sidebar
          modules={BRIEFING_MODULES}
          activeModuleId={activeModuleId}
          setActiveModuleId={setActiveModuleId}
          answers={answers}
          headerData={headerData}
          setHeaderData={setHeaderData}
          progressPercentage={progressPercentage}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        <main className="app-main">
          {isCloudLoading ? (
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

      <AdminDashboardDrawer
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        showToastNotification={showToastNotification}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />

      <ToastNotification toast={toast} />
    </div>
  );
}
