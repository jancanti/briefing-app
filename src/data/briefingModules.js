export const INITIAL_HEADER = {
  clientName: '',
  clinicName: '',
  cityState: '',
  date: new Date().toISOString().split('T')[0],
  interviewer: ''
};

export const BRIEFING_MODULES = [
  {
    id: 'identity',
    title: '1. Identidade & Posicionamento',
    shortTitle: 'Identidade',
    icon: 'Sparkles',
    description: 'História da clínica, proposta de valor, público-alvo e tom de voz.',
    questions: [
      {
        key: 'history',
        label: '1. História da Clínica',
        hint: 'Quando começou, o que motivou a criação e qual a trajetória até hoje?',
        placeholder: 'Ex: A clínica foi fundada em 2018 pela Dra. Ana, motivada por trazer tratamentos de rejuvenescimento de alta tecnologia para a região...',
        quickTags: ['Fundada recente (menos de 2 anos)', 'Mais de 5 anos no mercado', 'Tradição familiar', 'Nova unidade / Expansão']
      },
      {
        key: 'purpose',
        label: '2. Propósito & Missão',
        hint: 'Qual é o objetivo principal da clínica além dos tratamentos?',
        placeholder: 'Ex: Elevar a autoestima e promover o rejuvenescimento natural e elegante, sem excessos...',
        quickTags: ['Elevar a autoestima', 'Rejuvenescimento natural & sem exageros', 'Estética de alta performance', 'Bem-estar e autocuidado integral']
      },
      {
        key: 'differentials',
        label: '3. Diferenciais Competitivos',
        hint: 'O que a clínica oferece que os concorrentes da região não oferecem?',
        placeholder: 'Ex: Equipamentos de última geração exclusivos na cidade, atendimento VIP humanizado com café especial...',
        quickTags: ['Tecnologias de ponta exclusivas', 'Atendimento VIP & Humanizado', 'Estacionamento próprio com Valet', 'Protocolos autorais exclusivos', 'Acompanhamento pós-procedimento 24h']
      },
      {
        key: 'targetAudience',
        label: '4. Público-Alvo & Persona',
        hint: 'Quem é o cliente ideal (idade, gênero, desejos e receios)?',
        placeholder: 'Ex: Mulheres entre 30 e 55 anos, classe A/B, executivas ou empresárias que buscam prevenir o envelhecimento com naturalidade...',
        quickTags: ['Mulheres 25 a 45 anos', 'Mulheres 45 a 65+ anos', 'Público Misto (Feminino & Masculino)', 'Classe A/B Premium', 'Têm receio de dor ou agulhas', 'Prezam por naturalidade']
      },
      {
        key: 'toneOfVoice',
        label: '5. Tom de Voz & Personalidade da Marca',
        hint: 'Como a clínica se comunica com os pacientes?',
        placeholder: 'Ex: Comunicação elegante, acolhedora e altamente profissional, transmitindo segurança e sofisticação...',
        quickTags: ['Sofisticado & Elegante', 'Acolhedor & Humano', 'Científico & Técnico', 'Jovem & Moderno', 'Exclusivo & Minimalista']
      }
    ]
  },
  {
    id: 'services',
    title: '2. Serviços & Tratamentos',
    shortTitle: 'Serviços',
    icon: 'Stethoscope',
    description: 'Catálogo de procedimentos, destaques carro-chefe, indicações e FAQ.',
    questions: [
      {
        key: 'allServices',
        label: '6. Catálogo Completo de Procedimentos',
        hint: 'Liste os tratamentos oferecidos (Faciais, Corporais, Capilares, etc.):',
        placeholder: 'Ex: Faciais: Toxina Botulínica, Preenchimento Hialurônico, Bioestimuladores de Colágeno (Sculptra/Radiesse), Peeling...\nCorporais: Criolipólise, Depilação a Laser...',
        quickTags: ['Harmonização Facial', 'Toxina Botulínica (Botox)', 'Preenchimento Labial', 'Bioestimuladores de Colágeno', 'Lifting Facial / Ultraformer', 'Depilação a Laser', 'Tratamentos Capilares / Microagulhamento', 'Estética Íntima']
      },
      {
        key: 'heroServices',
        label: '7. Serviços Carro-Chefe (Destaques no Site)',
        hint: 'Quais são os 3 a 5 tratamentos mais vendidos ou mais lucrativos?',
        placeholder: 'Ex: 1. Harmonização Natural, 2. Bioestimulador de Colágeno Corporal, 3. Laser Lavieen Glow...',
        quickTags: ['Protocolo Rejuvenescimento Express', 'Lifting Sem Cortes', 'Lipo Enzimática Sem Cirurgia', 'Protocolo Noiva / Red Carpet']
      },
      {
        key: 'serviceDetails',
        label: '8. Detalhes & Tecnologia dos Tratamentos',
        hint: 'Indicações, número de sessões, durabilidade e tempo de recuperação:',
        placeholder: 'Ex: Procedimentos rápidos, com anestésico tópico, sem tempo de repouso (paciente volta ao trabalho no mesmo dia)...',
        quickTags: ['Sem tempo de recuperação (Zero Downtime)', 'Recuperação leve (1 a 3 dias)', 'Resultados imediatos', 'Sessões progressivas (3 a 6 sessões)', 'Durabilidade de 12 a 18 meses']
      },
      {
        key: 'frequentlyAskedQuestions',
        label: '9. Dúvidas Mais Frequentes (FAQ)',
        hint: 'Quais perguntas os pacientes mais fazem no WhatsApp ou recepção?',
        placeholder: 'Ex: "Qual a idade ideal para aplicar botox?", "O procedimento dói?", "Quantas sessões preciso para ver resultado?"...',
        quickTags: ['Dói para aplicar?', 'Quanto tempo duram os resultados?', 'Posso tomar sol após o procedimento?', 'Qual a idade mínima recomendada?', 'Em quanto tempo vejo o resultado?']
      },
      {
        key: 'pricingPolicy',
        label: '10. Política de Preços & Avaliações',
        hint: 'Valores serão exibidos no site ou o foco é agendar avaliação?',
        placeholder: 'Ex: Valores são passados apenas em consulta presencial personalizada após avaliação técnica...',
        quickTags: ['Valores apenas sob consulta/WhatsApp', 'Exibir faixa de preço inicial ("a partir de")', 'Avaliação gratuita', 'Avaliação paga (valor revertido no tratamento)']
      }
    ]
  },
  {
    id: 'team',
    title: '3. Corpo Clínico & Autoridade',
    shortTitle: 'Equipe',
    icon: 'UserCheck',
    description: 'Profissionais, especializações, conselhos de classe e certificações.',
    questions: [
      {
        key: 'teamMembers',
        label: '11. Profissionais & Registros',
        hint: 'Nome, área de atuação e registro profissional (CRM, COFEN, CRF, CFF, etc.):',
        placeholder: 'Ex: Dra. Mariana Silva - Médica Dermatologista (CRM/SP 123456, RQE 7890)\nDr. Lucas Mendes - Biomédico Esteta (CRBM 4321)...',
        quickTags: ['Médico(a) Dermatologista', 'Cirurgião(ã) Plástico(a)', 'Enfermeiro(a) Esteta', 'Biomédico(a) Esteta', 'Farmacêutico(a) Esteta', 'Esteticista & Cosmetóloga']
      },
      {
        key: 'certifications',
        label: '12. Cursos & Certificações de Destaque',
        hint: 'Formações internacionais, congressos, artigos publicados ou mentorias:',
        placeholder: 'Ex: Speaker oficial de marca de preenchedores, Especialização em Harvard Medical School, Membro da Sociedade Brasileira de Dermatologia...',
        quickTags: ['Speaker oficial de marca internacional', 'Cursos nos EUA / Europa', 'Master em Anatomia Facial', 'Especialista em Tecnologias de Ponta']
      }
    ]
  },
  {
    id: 'space',
    title: '4. Estrutura Física & Experiência',
    shortTitle: 'Estrutura',
    icon: 'Building2',
    description: 'Ambiente da clínica, localização, comodidades e recursos de mídia.',
    questions: [
      {
        key: 'physicalSpace',
        label: '13. Comodidades & Estrutura da Clínica',
        hint: 'Como é o ambiente físico e quais mimos os pacientes recebem?',
        placeholder: 'Ex: Salas de atendimento privativas, recepção aconchegante com menu de cafés e espumante, som ambiente relaxante...',
        quickTags: ['Salas individuais privativas', 'Espaço de café VIP & Espumante', 'Estacionamento próprio com Valet', 'Acessibilidade total PCD', 'Ambiente aromatizado e climatizado']
      },
      {
        key: 'location',
        label: '14. Localização & Facilidade de Acesso',
        hint: 'Endereço, bairro, pontos de referência e fácil localização:',
        placeholder: 'Ex: Localizada no coração do bairro Jardins, no Edifício Medical Center, 8º andar...',
        quickTags: ['Bairro nobre e seguro', 'Centro médico / comercial renomado', 'Fácil acesso por transporte público', 'Vagas gratuitas na porta']
      },
      {
        key: 'mediaAssets',
        label: '15. Fotos e Vídeos Disponíveis',
        hint: 'Qual o acervo visual atual da clínica?',
        placeholder: 'Ex: Já possuem ensaio fotográfico profissional do espaço e da equipe em alta resolução...',
        quickTags: ['Fotos profissionais prontas', 'Vídeo institucional pronto', 'Tour virtual 360° disponível', 'Necessário contratar ensaio fotográfico']
      }
    ]
  },
  {
    id: 'socialProof',
    title: '5. Prova Social & Ética',
    shortTitle: 'Depoimentos',
    icon: 'Award',
    description: 'Depoimentos, política de Antes & Depois, autorizações e mídia.',
    questions: [
      {
        key: 'testimonials',
        label: '16. Depoimentos e Avaliações de Pacientes',
        hint: 'Onde estão as avaliações reais dos clientes (Google, WhatsApp, vídeo)?',
        placeholder: 'Ex: Possuem mais de 120 avaliações 5 estrelas no Google Meu Negócio e vídeos curtos de depoimentos de pacientes...',
        quickTags: ['Nota 5.0 no Google Meu Negócio', 'Depoimentos gravados em vídeo', 'Prints de WhatsApp autorizados', 'Avaliações verificadas no Doctoralia']
      },
      {
        key: 'beforeAfterPolicy',
        label: '17. Fotos de "Antes e Depois" & Regras Éticas',
        hint: 'Como pretendem divulgar os resultados dos tratamentos no site?',
        placeholder: 'Ex: Divulgação autorizada mediante termo assinado de uso de imagem, respeitando as normas éticas do conselho profissional...',
        quickTags: ['Uso com autorização por termo assinado', 'Exibir apenas em galeria restrita/privada', 'Seguir normas do conselho profissional (CFM/COFEN/CRBM)', 'Não publicar fotos de Antes e Depois']
      },
      {
        key: 'pressAndCelebrities',
        label: '18. Imprensa, Famosos e Influenciadores',
        hint: 'A clínica atende personalidades ou já saiu em matérias de comunicação?',
        placeholder: 'Ex: Clínica frequentada por influenciadores locais renomados e matéria publicada no portal G1...',
        quickTags: ['Atende influenciadores de destaque', 'Matérias em portais / jornais / TV', 'Parcerias ativas no Instagram']
      }
    ]
  },
  {
    id: 'booking',
    title: '6. Agendamento & Funcionalidades',
    shortTitle: 'Agendamento',
    icon: 'CalendarCheck',
    description: 'Canais de agendamento, formulários e horário de atendimento.',
    questions: [
      {
        key: 'bookingMethod',
        label: '19. Canal Principal de Agendamento',
        hint: 'Como o visitante do site deve agendar a consulta?',
        placeholder: 'Ex: Botão direto em destaque para o WhatsApp da central de relacionamento...',
        quickTags: ['WhatsApp Direto com Recepção', 'Sistema de Agendamento Online (Trinks/Belle/Simples)', 'Formulário de Pré-Agendamento', 'Integração com Doctoralia']
      },
      {
        key: 'businessHours',
        label: '20. Horários de Atendimento & Suporte',
        hint: 'Dias, horários e suporte pós-procedimento:',
        placeholder: 'Ex: Segunda a Sexta das 08h às 20h, Sábados das 08h às 14h. Canal de emergência 24h para pacientes em pós-procedimento...',
        quickTags: ['Segunda a Sexta: 08h às 20h', 'Sábados: 08h às 14h', 'Atendimento estritamente com hora marcada', 'Canal de suporte pós-procedimento 24h']
      }
    ]
  },
  {
    id: 'design',
    title: '7. Design & Identidade Visual',
    shortTitle: 'Design',
    icon: 'Palette',
    description: 'Manual de marca, paleta de cores, referências visuais e preferências.',
    questions: [
      {
        key: 'brandAssets',
        label: '21. Arquivos da Identidade Visual',
        hint: 'Status da marca (logotipo vetorial, manual de identidade, fontes):',
        placeholder: 'Ex: Possuem manual completo da marca com códigos HEX (#C28285, #B89768) e logotipo em vetor (.SVG e .EPS)...',
        quickTags: ['Manual de marca completo disponível', 'Apenas logotipo em PNG', 'Necessário vetorizar/recriar logotipo', 'Paleta: Rosê Gold, Nude e Branco']
      },
      {
        key: 'visualStyle',
        label: '22. Estilo Visual Desejado',
        hint: 'Qual sensação e estética o site deve transmitir ao visitante?',
        placeholder: 'Ex: Estilo Clean, sofisticado, luminoso, transmitindo pureza, tecnologia e bem-estar...',
        quickTags: ['Clean, Minimalista & Iluminado', 'Luxuoso Dark com Dourado', 'Orgânico Nude com Tons Terrosos', 'Moderno, Clínico & Tecnológico']
      },
      {
        key: 'referenceWebsites',
        label: '23. Sites de Referência (O que Gosta)',
        hint: 'Links de sites de clínicas ou marcas de luxo que o cliente admira:',
        placeholder: 'Ex: https://exemploclinica.com.br - Gosta do layout da página inicial e da forma de apresentar a equipe...',
        quickTags: ['Estilo marca de luxo internacional', 'Estilo clínica de estética de SP/NY', 'Layout clean de dermatologia']
      },
      {
        key: 'dislikedElements',
        label: '24. O que EVITAR no Site',
        hint: 'Elementos, cores ou abordagens que o cliente NÃO quer ver de forma alguma:',
        placeholder: 'Ex: Evitar cores muito escuras/pesadas, pop-ups invasivos e excesso de texto técnico sem imagens...',
        quickTags: ['Evitar cores muito escuras ou pesadas', 'Evitar excesso de texto corrido', 'Evitar fotos de banco de imagem irreais', 'Evitar botões muito chamativos/poluídos']
      }
    ]
  },
  {
    id: 'techLegal',
    title: '8. Técnico, Legais & Marketing',
    shortTitle: 'Técnico',
    icon: 'ShieldCheck',
    description: 'Domínio, hospedagem, pixels de anúncios e compliance LGPD.',
    questions: [
      {
        key: 'domainHosting',
        label: '25. Domínio & Hospedagem',
        hint: 'Situação atual do endereço web e servidor:',
        placeholder: 'Ex: Domínio clinicaestetica.com.br já registrado no Registro.br. Hospedagem a ser configurada...',
        quickTags: ['Domínio .com.br já registrado', 'Precisa registrar novo domínio', 'Hospedagem atual ativa', 'Configurar nova hospedagem']
      },
      {
        key: 'marketingPixels',
        label: '26. Ferramentas de Marketing & Rastreamento',
        hint: 'Quais pixels de anúncios e métricas precisam ser instalados?',
        placeholder: 'Ex: Instalar Pixel do Meta (Facebook/Instagram), Google Analytics 4 (GA4) e Google Tag Manager...',
        quickTags: ['Pixel do Meta (Instagram / Facebook)', 'Google Analytics 4 (GA4)', 'Google Tag Manager (GTM)', 'Tag de Conversão do Google Ads']
      },
      {
        key: 'legalPrivacy',
        label: '27. Compliance LGPD & Termos',
        hint: 'Políticas de privacidade, gestão de consentimento e LGPD:',
        placeholder: 'Ex: Necessário aviso de cookies (LGPD) e página de Política de Privacidade e Termos de Uso...',
        quickTags: ['Possui política de privacidade pronta', 'Usar modelo padrão LGPD', 'Aviso de Cookies (Cookie Banner) obrigatório']
      }
    ]
  }
];

export function generateMarkdown(header, answers) {
  const dateStr = header.date || new Date().toISOString().split('T')[0];
  const clinicName = header.clinicName || 'Clínica de Estética';
  const clientName = header.clientName || 'Cliente';
  const cityState = header.cityState || 'Não especificado';
  const interviewer = header.interviewer || 'Não especificado';

  let md = `# 📋 Documento de Briefing - ${clinicName}\n\n`;
  md += `> **Data da Coleta:** ${dateStr}\n`;
  md += `> **Cliente / Contato:** ${clientName}\n`;
  md += `> **Cidade / Estado:** ${cityState}\n`;
  md += `> **Responsável pelo Briefing:** ${interviewer}\n\n`;
  md += `---\n\n`;

  BRIEFING_MODULES.forEach((mod) => {
    md += `## ${mod.title}\n\n`;
    mod.questions.forEach((q) => {
      const val = answers[q.key] ? answers[q.key].trim() : '';
      md += `### ${q.label}\n`;
      if (val) {
        md += `${val}\n\n`;
      } else {
        md += `*Não informado / Pendente*\n\n`;
      }
    });
    md += `---\n\n`;
  });

  md += `\n*Documento gerado automaticamente pelo Coletor de Briefing de Estética.*\n`;
  return md;
}
