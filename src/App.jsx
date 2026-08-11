import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ModuleForm from './components/ModuleForm';
import MarkdownPreviewDrawer from './components/MarkdownPreviewDrawer';
import ToastNotification from './components/ToastNotification';
import ShareModal from './components/ShareModal';
import BriefingsDashboardDrawer from './components/BriefingsDashboardDrawer';
import SupabaseConfigModal from './components/SupabaseConfigModal';

import { BRIEFING_MODULES, INITIAL_HEADER, generateMarkdown } from './data/briefingModules';
import { isSupabaseConfigured } from './lib/supabase';
import { 
  generateBriefingId, 
  getBriefingById, 
  saveBriefingToCloud 
} from './services/briefingService';

const STORAGE_KEY = 'clinica_estetica_briefing_draft_v1';

export default function App() {
  // Obter ID da URL se existir (ex: ?id=clinica-beleza-123)
  const [briefingId, setBriefingId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || localStorage.getItem(`${STORAGE_KEY}_active_id`) || generateBriefingId();
  });

  const [headerData, setHeaderData] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_header_${briefingId}`);
      return saved ? JSON.parse(saved) : INITIAL_HEADER;
    } catch (e) {
      return INITIAL_HEADER;
    }
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_answers_${briefingId}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [activeModuleId, setActiveModuleId] = useState(BRIEFING_MODULES[0].id);
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'light');
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Salvo localmente');
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  // Modais e Drawers
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSupabaseConfigOpen, setIsSupabaseConfigOpen] = useState(false);

  // Ref para debounce do Supabase
  const saveTimeoutRef = useRef(null);

  // Sincronizar tema com o DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Carregar dados da Nuvem se houver ID na URL e Supabase configurado
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');

    if (idFromUrl) {
      setBriefingId(idFromUrl);
      localStorage.setItem(`${STORAGE_KEY}_active_id`, idFromUrl);

      if (isSupabaseConfigured) {
        setIsCloudLoading(true);
        setSaveStatus('Buscando da nuvem...');

        getBriefingById(idFromUrl).then(({ data, error }) => {
          if (!error && data) {
            if (data.header_data) setHeaderData(data.header_data);
            if (data.answers) setAnswers(data.answers);
            setSaveStatus('Carregado da Nuvem');
            showToastNotification(`Briefing "${data.clinic_name}" carregado com sucesso!`, 'info');
          } else if (error) {
            setSaveStatus('Erro ao carregar da nuvem');
          }
          setIsCloudLoading(false);
        });
      }
    }
  }, []);

  // Auto-save no LocalStorage + Supabase (Debounced)
  useEffect(() => {
    // 1. Salvar no LocalStorage
    try {
      localStorage.setItem(`${STORAGE_KEY}_active_id`, briefingId);
      localStorage.setItem(`${STORAGE_KEY}_header_${briefingId}`, JSON.stringify(headerData));
      localStorage.setItem(`${STORAGE_KEY}_answers_${briefingId}`, JSON.stringify(answers));
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage', e);
    }

    // 2. Salvar no Supabase se configurado
    if (isSupabaseConfigured) {
      setSaveStatus('Salvando...');

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        const { error } = await saveBriefingToCloud(briefingId, headerData, answers);
        if (!error) {
          const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          setSaveStatus(`Salvo na Nuvem (${time})`);
        } else {
          setSaveStatus('Erro na nuvem (Salvo local)');
        }
      }, 1200); // 1.2 segundos de debounce
    } else {
      setSaveStatus('Salvo localmente');
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [briefingId, headerData, answers]);

  const showToastNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Alternar briefing ativo (da lista de briefings)
  const handleSelectBriefing = async (newId) => {
    setBriefingId(newId);
    // Atualizar a URL sem recarregar a página
    const newUrl = `${window.location.pathname}?id=${encodeURIComponent(newId)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    if (isSupabaseConfigured) {
      setSaveStatus('Buscando da nuvem...');
      const { data, error } = await getBriefingById(newId);
      if (!error && data) {
        setHeaderData(data.header_data || INITIAL_HEADER);
        setAnswers(data.answers || {});
        showToastNotification(`Carregado: ${data.clinic_name}`, 'success');
      }
    } else {
      // Carregar do LocalStorage
      const localHeader = localStorage.getItem(`${STORAGE_KEY}_header_${newId}`);
      const localAnswers = localStorage.getItem(`${STORAGE_KEY}_answers_${newId}`);
      setHeaderData(localHeader ? JSON.parse(localHeader) : INITIAL_HEADER);
      setAnswers(localAnswers ? JSON.parse(localAnswers) : {});
    }
  };

  // Criar um novo briefing
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

  // Answer handler
  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Navigation handlers
  const handleNextModule = () => {
    if (activeModuleIndex < BRIEFING_MODULES.length - 1) {
      setActiveModuleId(BRIEFING_MODULES[activeModuleIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToastNotification('Você chegou ao fim do briefing! Clique em "Baixar .MD" para salvar.', 'info');
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleId(BRIEFING_MODULES[activeModuleIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset briefing draft
  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o briefing atual? Todas as respostas deste briefing serão apagadas.')) {
      setHeaderData(INITIAL_HEADER);
      setAnswers({});
      localStorage.removeItem(`${STORAGE_KEY}_header_${briefingId}`);
      localStorage.removeItem(`${STORAGE_KEY}_answers_${briefingId}`);
      setActiveModuleId(BRIEFING_MODULES[0].id);
      showToastNotification('Briefing limpo com sucesso!', 'info');
    }
  };

  // Generate Markdown
  const markdownContent = useMemo(() => {
    return generateMarkdown(headerData, answers);
  }, [headerData, answers]);

  // Total Progress Calculation
  const progressPercentage = useMemo(() => {
    const allQuestions = BRIEFING_MODULES.flatMap(m => m.questions);
    const totalCount = allQuestions.length;
    const answeredCount = allQuestions.filter(q => (answers[q.key] || '').trim().length > 0).length;
    return Math.round((answeredCount / totalCount) * 100);
  }, [answers]);

  // Copy Markdown to Clipboard
  const handleCopyMd = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      showToastNotification('Markdown copiado para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToastNotification('Erro ao copiar texto', 'error');
    }
  };

  // Download Markdown file (.md)
  const handleDownloadMd = () => {
    const filename = headerData.clinicName
      ? `briefing_${headerData.clinicName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`
      : `briefing_clinica_estetica_${headerData.date || 'data'}.md`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToastNotification(`Arquivo "${filename}" baixado com sucesso!`, 'success');
  };

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const togglePreview = () => setShowPreview(prev => !prev);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        headerData={headerData}
        setHeaderData={setHeaderData}
        theme={theme}
        toggleTheme={toggleTheme}
        onReset={handleReset}
        onCopyMd={handleCopyMd}
        onDownloadMd={handleDownloadMd}
        togglePreview={togglePreview}
        showPreview={showPreview}
        saveStatus={saveStatus}
        progressPercentage={progressPercentage}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenSupabaseConfig={() => setIsSupabaseConfigOpen(true)}
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
        />

        <main className="app-main">
          {isCloudLoading ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--espresso-muted)' }}>
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

        {showPreview && (
          <MarkdownPreviewDrawer
            markdownContent={markdownContent}
            onClose={() => setShowPreview(false)}
            onCopy={handleCopyMd}
            onDownload={handleDownloadMd}
            copied={copied}
          />
        )}
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
      />

      <SupabaseConfigModal
        isOpen={isSupabaseConfigOpen}
        onClose={() => setIsSupabaseConfigOpen(false)}
      />

      <ToastNotification toast={toast} />
    </div>
  );
}
