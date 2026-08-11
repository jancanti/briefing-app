import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ModuleForm from './components/ModuleForm';
import MarkdownPreviewDrawer from './components/MarkdownPreviewDrawer';
import ToastNotification from './components/ToastNotification';
import { BRIEFING_MODULES, INITIAL_HEADER, generateMarkdown } from './data/briefingModules';

const STORAGE_KEY = 'clinica_estetica_briefing_draft_v1';

export default function App() {
  const [headerData, setHeaderData] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_header`);
      return saved ? JSON.parse(saved) : INITIAL_HEADER;
    } catch (e) {
      return INITIAL_HEADER;
    }
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_answers`);
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
  const [saveStatus, setSaveStatus] = useState('Salvo');

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_header`, JSON.stringify(headerData));
      localStorage.setItem(`${STORAGE_KEY}_answers`, JSON.stringify(answers));
      setSaveStatus('Salvo no navegador');
    } catch (e) {
      console.error('Error saving to LocalStorage', e);
    }
  }, [headerData, answers]);

  const showToastNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
    if (window.confirm('Tem certeza que deseja limpar todo o briefing? Todos os dados anotados serão apagados.')) {
      setHeaderData(INITIAL_HEADER);
      setAnswers({});
      localStorage.removeItem(`${STORAGE_KEY}_header`);
      localStorage.removeItem(`${STORAGE_KEY}_answers`);
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
      : `briefing_clinica_estetica_${headerData.date}.md`;

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
          <ModuleForm
            module={currentModule}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNextModule={handleNextModule}
            onPrevModule={handlePrevModule}
            isFirstModule={activeModuleIndex === 0}
            isLastModule={activeModuleIndex === BRIEFING_MODULES.length - 1}
          />
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

      <ToastNotification toast={toast} />
    </div>
  );
}
