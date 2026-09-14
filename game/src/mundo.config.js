// DADOS do mundo. Sem Babylon aqui: trocar o assunto é editar este arquivo.
// Cada estação = um princípio + uma metáfora física + UMA mudança visível (antes → depois).
// `demo` é o módulo em src/estacoes/ que constrói a mecânica; o texto fica todo aqui.

export const MUNDO = {
  marca: 'astra3dany',
  titulo: 'IA no dia a dia',
  subtitulo: 'Três hábitos que evitam problemas.',
  intro: 'Três máquinas pequenas. Três hábitos úteis. Um guia te leva de estação em estação e mostra cada ideia acontecendo.',
  publico: 'adultos que começam a usar IA no trabalho',
  mascote: { nome: 'Any', glb: null, cor: '#e0973a', corEscura: '#b46f21' },
  // Ritmo por estação (segundos): chegar → aproximar → demonstrar → segurar.
  ritmo: { intro: 3, chegar: 3, aproximar: 3, demo: 6, segurar: 5, saida: 6 },
  estacoes: [
    {
      id: 'portao', demo: 'portao', x: -3,
      nome: 'O portão', curto: 'Portão',
      principio: 'Confirme antes de agir',
      titulo: 'Uma checagem que pode parar uma ação.',
      subtitulo: 'Um pedido encontra uma checagem. A ação espera.',
      explicacao: 'O bloco amarelo é um pedido feito à IA. O portão é uma checagem obrigatória. A roda é a ação: enviar, pagar, apagar.',
      sequencia: ['Pedido', 'Checagem', 'Ação'],
      chegando: 'Veja o pedido se aproximar do portão.',
      aproximando: 'Damos a volta no portão pra ver a checagem e a ação.',
      observacoes: [
        [1.5, 'O pedido se aproxima. O portão continua fechado.'],
        [2.8, 'Checagem falhou: o pedido é desviado pra revisão, antes da ação.'],
        [6, 'Checagem passou: o portão abre e a ação roda.'],
      ],
      takeaway: 'Peça pra IA confirmar antes de agir: enviar, pagar, apagar.',
      camera: {
        wide: { position: [-1.1, 2.5, 4.5], target: [-3, 0.9, 0], fov: 43 },
        closeStart: { position: [-4.9, 1.85, 2.35], target: [-3, 1.3, 0], fov: 38 },
        closeEnd: { position: [-4.25, 1.7, 2.6], target: [-3, 1.28, 0], fov: 38 },
      },
    },
    {
      id: 'gavetas', demo: 'gavetas', x: 0,
      nome: 'As gavetas', curto: 'Gavetas',
      principio: 'Dê contexto onde a IA lê',
      titulo: 'Guarde as instruções onde todo mundo lê.',
      subtitulo: 'Instruções compartilhadas vão pra onde o time (e a IA) usa.',
      explicacao: 'O card amarelo são as instruções do trabalho. As gavetas são pessoal, projeto e tarefa. As duas luzes são colegas de time.',
      sequencia: ['Instruções', 'Gaveta do projeto', 'Os dois colegas'],
      chegando: 'Veja pra onde vai o card de instruções.',
      aproximando: 'De cima fica mais fácil enxergar dentro das gavetas.',
      observacoes: [
        [2.2, 'O card de instruções entra na gaveta do projeto.'],
        [6, 'Os dois colegas recebem a mesma orientação do projeto.'],
      ],
      takeaway: 'Guarde as instruções do projeto num lugar só. Todo mundo, e a IA, lê o mesmo.',
      camera: {
        wide: { position: [1.3, 2.8, 4.6], target: [0, 0.85, 0.1], fov: 43 },
        closeStart: { position: [1.1, 3.0, 2.15], target: [0, 1.25, 0], fov: 40 },
        closeEnd: { position: [-0.35, 3.15, 2.0], target: [0, 1.25, 0], fov: 40 },
      },
    },
    {
      id: 'conferencia', demo: 'conferencia', x: 3,
      nome: 'A conferência', curto: 'Conferência',
      principio: 'Confira a fonte',
      titulo: 'Campos certinhos podem guardar fatos errados.',
      subtitulo: 'Uma resposta encontra a sua fonte. O que não tem fonte fica em aberto.',
      explicacao: 'A placa da esquerda é a resposta da IA. A da direita é a fonte. Os dois selos conferem formato e fonte.',
      sequencia: ['Resposta', 'Fonte', 'Resposta conferida'],
      chegando: 'A fonte diz 20 + 30 + 40. A resposta bate?',
      aproximando: 'Chegamos mais perto pra comparar a resposta com a fonte.',
      observacoes: [
        [3, 'O formato passa. Agora comparamos a resposta com a fonte.'],
        [6, 'O total vira 90. A data não tem fonte, então fica em aberto.'],
      ],
      takeaway: 'Resposta bem formatada não é resposta certa. Confira contas e fontes.',
      dados: { fonte: '20 + 30 + 40 = 90', antes: { total: '100', data: '12/03' }, depois: { total: '90', data: 'desconhecida' } },
      camera: {
        wide: { position: [4.2, 2.6, 4.4], target: [3, 0.9, 0.1], fov: 43 },
        closeStart: { position: [2.0, 2.15, 2.7], target: [3, 1.42, 0], fov: 39 },
        closeEnd: { position: [3.5, 2.0, 2.65], target: [3, 1.4, 0], fov: 39 },
      },
    },
  ],
  camera: {
    overview: { position: [4.8, 6.5, 11.5], target: [0, 0.55, 0], fov: 44 },
    mascote: { position: [3.2, 1.5, 4.8], target: [2.1, 0.55, 1.25], fov: 43 },
    final: { position: [5.8, 6.8, 12.2], target: [0, 0.65, 0], fov: 44 },
  },
  recap: {
    titulo: 'Três hábitos pra levar.',
    texto: 'Cada máquina mostrou uma ideia acontecendo. Se lembrar destas três frases, já evita a maior parte dos problemas com IA no trabalho.',
  },
  fontes: [
    { rotulo: 'Field guide: Build a Learning World (Mark Kashef)', url: 'https://build-a-learning-world.markkashef.chatgpt.site/' },
    { rotulo: 'Repo da comunidade Early AI Adopters', url: 'https://github.com/promptadvisers/early-ai-dopters' },
    { rotulo: 'Babylon.js', url: 'https://doc.babylonjs.com/' },
  ],
};
