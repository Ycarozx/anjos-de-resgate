/**
 * Plataforma de Adoção de Animais – Lógica do protótipo (MVP)
 * -----------------------------------------------------------------------------
 * IMPORTANTÍSSIMO (protótipo):
 * - Não existe backend. Login e dados ficam apenas no navegador (localStorage).
 * - Isso NÃO é seguro. Em produção, autenticação e persistência devem ser server-side.
 *
 * Onde editar:
 * - Credenciais demo do moderador: constante DEMO_MODERATOR.
 * - PIX padrão: constante DEFAULT_PIX_KEY.
 * - Dados iniciais (seed): DEFAULT_ANIMALS e DEFAULT_DONATION_ITEMS.
 *
 * Próximos passos / integração com backend (exemplos):
 * - POST /api/auth (login real, retornar JWT)
 * - GET  /api/animals, GET /api/animals/:id, POST/PUT/DELETE /api/animals
 * - GET  /api/donation-items, POST/PUT/DELETE /api/donation-items
 * - POST /api/donation-intents, PATCH /api/donation-intents/:id
 * - POST /api/adoptions
 */
const BASE_URL = "http://127.0.0.1:5000";

async function api(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + endpoint, options);
  return await res.json();
}
// Funções de DADOS
async function getAnimals() {
  const res = await api("/animals");

  if (res.success) {
    return res.data;
  } else {
    return [];
  }
}
// função principal da home
async function getAnimals() {
  const res = await api("/animals");

  if (res.success) {
    return res.data;
  } else {
    return [];
  }
}
  // ========== CONSTANTES / STORAGE ==========
  var STORAGE_KEYS = {
    animals: 'animals',
    donationItems: 'donationItems',
    donationIntents: 'donationIntents',
    moderators: 'moderators',
    moderatorToken: 'moderatorToken',
    adocoes: 'adocao_submissoes',
    lostPets: 'lost_pets',
    lostPetIntents: 'lost_pets_intents',
    adminNotifications: 'admin_notifications',
    moderationLogs: 'moderation_logs'
  };

  // Conta demo (protótipo). Em produção: remover isso e usar POST /api/auth + JWT.
  var DEMO_MODERATOR = { email: 'admin@ong.org', pass: 'admin123' };

  // Chave PIX padrão (editável também na tela doar.html). Pode ser CPF/Email/Telefone/Chave aleatória.
  var DEFAULT_PIX_KEY = 'admin@ong.org';

  function safeJsonParse(str, fallback) {
    try { return JSON.parse(str); } catch (e) { return fallback; }
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return safeJsonParse(raw, fallback);
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtém "agora" em ISO; facilitador para futuras trocas por backend.
  function nowIso() {
    return new Date().toISOString();
  }

  // ========== DADOS INICIAIS (SEED) ==========
  // Pets (fallback) – se localStorage.animals estiver vazio, estes serão criados automaticamente.
  var DEFAULT_ANIMALS = [
    {
      id: 1,
      nome: 'Luna',
      especie: 'Gato',
      idade: '2 anos',
      porte: 'Pequeno',
      genero: 'Fêmea',
      vacinada: true,
      castrada: true,
      historia: 'Luna foi resgatada em uma praça após ser abandonada. Está castrada, vacinada e muito carinhosa. Adora colo e brincadeiras com bolinhas. Ideal para apartamento.',
      imagens: [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80',
        'https://images.unsplash.com/photo-1595435934249-2d1d7d0e2b2e?w=600&q=80'
      ]
    },
    {
      id: 2,
      nome: 'Thor',
      especie: 'Cachorro',
      idade: '3 anos',
      porte: 'Grande',
      genero: 'Macho',
      vacinada: true,
      castrada: false,
      historia: 'Thor foi encontrado na rua magro e assustado. Hoje está saudável, vacinado e muito dócil. Gosta de passeios e de crianças. Precisa de espaço para correr.',
      imagens: [
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80',
        'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80'
      ]
    },
    {
      id: 3,
      nome: 'Mimi',
      especie: 'Gato',
      idade: 'Filhote',
      porte: 'Pequeno',
      genero: 'Fêmea',
      vacinada: true,
      castrada: false,
      historia: 'Mimi é uma filhote resgatada com a mãe. Muito brincalhona e curiosa. Já está com vacinas em dia. Será entregue após castração (inclusa no processo de adoção).',
      imagens: [
        'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=600&q=80',
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80'
      ]
    },
    {
      id: 4,
      nome: 'Rex',
      especie: 'Cachorro',
      idade: 'Adulto',
      porte: 'Médio',
      genero: 'Macho',
      vacinada: true,
      castrada: true,
      historia: 'Rex é um adulto tranquilo, castrado e vacinado. Foi devolvido por mudança da família e está pronto para um novo lar. Convive bem com outros cães e gatos.',
      imagens: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
        'https://images.unsplash.com/photo-1530281700549-e82e7bf97421?w=600&q=80'
      ]
    }
  ];

  // Itens de doação (fallback)
  var DEFAULT_DONATION_ITEMS = [
    {
      id: 1,
      nome: 'Ração 20kg',
      descricao: 'Ração para cães (preferência: premium).',
      quantidade: 5,
      categoria: 'ração'
    },
    {
      id: 2,
      nome: 'Leite em pó',
      descricao: 'Para apoio a filhotes em recuperação.',
      quantidade: 10,
      categoria: 'alimentos'
    },
    {
      id: 3,
      nome: 'Medicamentos antiparasitários',
      descricao: 'Vermífugo e antipulgas (diversos tamanhos).',
      quantidade: 12,
      categoria: 'remédio'
    }
  ];

  // Registros iniciais para o módulo de Animais Perdidos / Achados (protótipo)
  // Em produção estes viriam do backend (GET /api/lostpets).
  var DEFAULT_LOST_PETS = [
    {
      id: 1,
      type: 'lost',
      name: 'Estrela',
      species: 'Equino',
      breed: 'Mestiça',
      age: '6 anos',
      color: 'Marrom com estrela branca na testa',
      gender: 'Fêmea',
      size: 'Grande',
      microchip: '',
      city: 'São Sebastião do Paraíso',
      neighborhood: 'Zona rural – sítio Boa Vista',
      coordinates: null,
      lost_date: '2025-11-10',
      description: 'Égua muito mansa que se afastou da propriedade durante a madrugada após rompimento de cerca. Usa cabresto azul.',
      images: [
        'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80'
      ],
      owner_name: 'Marcos',
      contact_phone: '(35) 99999-0001',
      contact_email: 'marcos@example.com',
      status: 'approved',
      created_at: '2025-11-11T10:00:00Z'
    },
    {
      id: 2,
      type: 'found',
      name: 'Papagaio',
      species: 'Ave',
      breed: '',
      age: 'Adulto',
      color: 'Verde com detalhes amarelos',
      gender: 'Desconhecido',
      size: 'Pequeno',
      microchip: '',
      city: 'São Sebastião do Paraíso',
      neighborhood: 'Bairro Centro',
      coordinates: null,
      lost_date: '2025-11-05',
      description: 'Papagaio manso encontrado em uma varanda de apartamento. Parece acostumado com pessoas, fala algumas palavras.',
      images: [
        'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80'
      ],
      owner_name: 'Carla',
      contact_phone: '(35) 98888-2222',
      contact_email: 'carla@example.com',
      status: 'approved',
      created_at: '2025-11-05T18:30:00Z'
    },
    {
      id: 3,
      type: 'found',
      name: 'Cachorro sem coleira',
      species: 'Cachorro',
      breed: 'Sem raça definida',
      age: 'Adulto',
      color: 'Caramelo',
      gender: 'Macho',
      size: 'Médio',
      microchip: '',
      city: 'São Sebastião do Paraíso',
      neighborhood: 'Próximo ao centro',
      coordinates: null,
      lost_date: '2025-11-12',
      description: 'Cachorro muito dócil encontrado próximo à praça central. Sem coleira, aparenta estar bem cuidado.',
      images: [
        'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80'
      ],
      owner_name: 'ONG Anjos de Resgate',
      contact_phone: '(35) 97777-3333',
      contact_email: 'contato@anjosderesgate.org',
      status: 'approved',
      created_at: '2025-11-12T09:15:00Z'
    },
    {
      id: 4,
      type: 'lost',
      name: 'Nina',
      species: 'Gato',
      breed: 'Siamês',
      age: '3 anos',
      color: 'Bege com pontos escuros',
      gender: 'Fêmea',
      size: 'Pequeno',
      microchip: 'BR-123-999-XYZ',
      city: 'São Sebastião do Paraíso',
      neighborhood: 'Bairro Santa Luzia',
      coordinates: null,
      lost_date: '2025-11-15',
      description: 'Gata siamês castrada e muito dócil. Desapareceu após escapar pela janela. Usa coleira rosa.',
      images: [
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80'
      ],
      owner_name: 'Juliana',
      contact_phone: '(35) 96666-4444',
      contact_email: 'juliana@example.com',
      status: 'pending',
      created_at: '2025-11-15T21:00:00Z'
    },
    {
      id: 5,
      type: 'lost',
      name: '',
      species: 'Coelho',
      breed: '',
      age: 'Filhote',
      color: 'Branco com manchas cinzas',
      gender: 'Desconhecido',
      size: 'Pequeno',
      microchip: '',
      city: 'São Sebastião do Paraíso',
      neighborhood: 'Bairro São José',
      coordinates: null,
      lost_date: '2025-11-09',
      description: 'Coelho de estimação que escapou do quintal. Muito rápido e arisco, mas acostumado com humanos.',
      images: [
        'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80'
      ],
      owner_name: 'Família Silva',
      contact_phone: '(35) 95555-1111',
      contact_email: 'familiasilva@example.com',
      status: 'pending',
      created_at: '2025-11-10T08:45:00Z'
    }
  ];

  function ensureSeedData() {
    // Pets
    var animals = readJson(STORAGE_KEYS.animals, null);
    if (!Array.isArray(animals) || animals.length === 0) {
      writeJson(STORAGE_KEYS.animals, DEFAULT_ANIMALS);
    }

    // Itens de doação
    var items = readJson(STORAGE_KEYS.donationItems, null);
    if (!Array.isArray(items) || items.length === 0) {
      writeJson(STORAGE_KEYS.donationItems, DEFAULT_DONATION_ITEMS);
    }

    // Intenções
    var intents = readJson(STORAGE_KEYS.donationIntents, null);
    if (!Array.isArray(intents)) {
      writeJson(STORAGE_KEYS.donationIntents, []);
    }

    // Moderadores (protótipo)
    var mods = readJson(STORAGE_KEYS.moderators, null);
    if (!Array.isArray(mods) || mods.length === 0) {
      writeJson(STORAGE_KEYS.moderators, [{ email: DEMO_MODERATOR.email, pass: DEMO_MODERATOR.pass }]);
    }

    // Lost pets (protótipo)
    var lostPets = readJson(STORAGE_KEYS.lostPets, null);
    if (!Array.isArray(lostPets) || lostPets.length === 0) {
      writeJson(STORAGE_KEYS.lostPets, DEFAULT_LOST_PETS);
    }

    var lostIntents = readJson(STORAGE_KEYS.lostPetIntents, null);
    if (!Array.isArray(lostIntents)) {
      writeJson(STORAGE_KEYS.lostPetIntents, []);
    }

    var notifications = readJson(STORAGE_KEYS.adminNotifications, null);
    if (!Array.isArray(notifications)) {
      writeJson(STORAGE_KEYS.adminNotifications, []);
    }

    var logs = readJson(STORAGE_KEYS.moderationLogs, null);
    if (!Array.isArray(logs)) {
      writeJson(STORAGE_KEYS.moderationLogs, []);
    }
  }

  // Normalizar idade para filtro (mapear "2 anos" -> pode bater em "2 anos" ou "Adulto" conforme critério; aqui filtramos por string exata ou por termos)
  function normalizarIdadeParaFiltro(idade) {
    if (!idade) return '';
    var i = idade.toLowerCase();
    if (i.indexOf('filhote') !== -1) return 'Filhote';
    if (i.indexOf('ano') !== -1 || i === '1 ano' || i === '2 anos' || i === '3 anos') return i;
    if (i.indexOf('jovem') !== -1 || i === 'jovem') return 'Jovem';
    if (i.indexOf('adulto') !== -1) return 'Adulto';
    return idade;
  }

  /**
   * Retorna um animal pelo id (número ou string numérica).
   */
  function getAnimalById(id) {
    var num = parseInt(id, 10);
    if (isNaN(num)) return null;
    return getAnimals().find(function(a) { return a.id === num; }) || null;
  }

  function getAnimals() {
    ensureSeedData();
    return readJson(STORAGE_KEYS.animals, DEFAULT_ANIMALS);
  }

  function setAnimals(list) {
    writeJson(STORAGE_KEYS.animals, list);
  }

  /**
   * Filtra animais por critérios (espécie, porte, idade, gênero, nome).
   */
  function filtrarAnimais(opcoes) {
    var nome = (opcoes.nome || '').trim().toLowerCase();
    return getAnimals().filter(function(a) {
      if (opcoes.especie && a.especie !== opcoes.especie) return false;
      if (opcoes.porte && a.porte !== opcoes.porte) return false;
      if (opcoes.idade) {
        var idadeNorm = normalizarIdadeParaFiltro(a.idade);
        if (idadeNorm !== opcoes.idade) return false;
      }
      if (opcoes.genero && a.genero !== opcoes.genero) return false;
      if (nome && a.nome.toLowerCase().indexOf(nome) === -1) return false;
      return true;
    });
  }

  /**
   * Lê parâmetros da query string (ex: ?id=1 ou ?animalId=2).
   */
  function getQueryParam(param) {
    var params = new URLSearchParams(window.location.search);
    return params.get(param) || '';
  }

  // ========== PÁGINA INICIAL (index.html) ==========
  function renderCard(animal) {
    var img = animal.imagens && animal.imagens[0] ? animal.imagens[0] : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80';
    var alt = animal.nome + ', ' + animal.especie + ' ' + animal.porte.toLowerCase();
    return (
      '<article class="card-animal" role="listitem">' +
        '<a href="animal.html?id=' + animal.id + '">' +
          '<img src="' + img + '" alt="' + alt + '">' +
        '</a>' +
        '<div class="card-body">' +
          '<h3>' + escapeHtml(animal.nome) + '</h3>' +
          '<p class="card-meta">' + escapeHtml(animal.idade) + ' · ' + escapeHtml(animal.porte) + '</p>' +
          '<a href="animal.html?id=' + animal.id + '" class="btn btn-primary">Conhecer</a>' +
        '</div>' +
      '</article>'
    );
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function atualizarGrid(lista) {
    var grid = document.getElementById('grid-animais');
    var nenhum = document.getElementById('nenhum-resultado');
    if (!grid) return;
    grid.innerHTML = '';
    if (lista.length === 0) {
      if (nenhum) nenhum.hidden = false;
      return;
    }
    if (nenhum) nenhum.hidden = true;
    lista.forEach(function(a) {
      grid.insertAdjacentHTML('beforeend', renderCard(a));
    });
  }

  function initHomePage() {
    var buscaNome = document.getElementById('busca-nome');
    var filtroEspecie = document.getElementById('filtro-especie');
    var filtroPorte = document.getElementById('filtro-porte');
    var filtroIdade = document.getElementById('filtro-idade');
    var filtroGenero = document.getElementById('filtro-genero');

    function aplicarFiltros() {
      var opcoes = {
        nome: buscaNome ? buscaNome.value : '',
        especie: filtroEspecie ? filtroEspecie.value : '',
        porte: filtroPorte ? filtroPorte.value : '',
        idade: filtroIdade ? filtroIdade.value : '',
        genero: filtroGenero ? filtroGenero.value : ''
      };
      var resultado = filtrarAnimais(opcoes);
      atualizarGrid(resultado);
    }

    if (buscaNome) buscaNome.addEventListener('input', aplicarFiltros);
    if (filtroEspecie) filtroEspecie.addEventListener('change', aplicarFiltros);
    if (filtroPorte) filtroPorte.addEventListener('change', aplicarFiltros);
    if (filtroIdade) filtroIdade.addEventListener('change', aplicarFiltros);
    if (filtroGenero) filtroGenero.addEventListener('change', aplicarFiltros);

    aplicarFiltros();
    initMenuToggle();
  }

  // Menu mobile: abrir/fechar
  function initMenuToggle() {
    var btn = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function() {
      var aberto = nav.classList.toggle('aberto');
      btn.setAttribute('aria-expanded', aberto);
      btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
  }

  // Inicialização comum para páginas que só precisam do menu/basics.
  function initCommonPage() {
    ensureSeedData();
    initMenuToggle();
  }

  // ========== PÁGINA DO ANIMAL (animal.html) ==========
  function initAnimalPage() {
    var id = getQueryParam('id');
    var container = document.getElementById('animal-container');
    var loading = document.getElementById('animal-loading');
    var content = document.getElementById('animal-content');
    var notFound = document.getElementById('animal-not-found');

    if (!id) {
      if (loading) loading.hidden = true;
      if (content) content.hidden = true;
      if (notFound) notFound.hidden = false;
      return;
    }

    var animal = getAnimalById(id);
    if (!animal) {
      if (loading) loading.hidden = true;
      if (content) content.hidden = true;
      if (notFound) notFound.hidden = false;
      return;
    }

    if (loading) loading.hidden = true;
    if (notFound) notFound.hidden = true;
    if (content) content.hidden = false;

    var imgPrincipal = document.getElementById('animal-img-principal');
    var thumbs = document.getElementById('gallery-thumbs');
    if (imgPrincipal && animal.imagens && animal.imagens.length) {
      imgPrincipal.src = animal.imagens[0];
      imgPrincipal.alt = animal.nome + ', ' + animal.especie;
    }
    if (thumbs && animal.imagens) {
      thumbs.innerHTML = '';
      animal.imagens.forEach(function(url, idx) {
        var img = document.createElement('img');
        img.src = url;
        img.alt = animal.nome + ' – foto ' + (idx + 1);
        img.dataset.index = idx;
        if (idx === 0) img.classList.add('ativo');
        img.addEventListener('click', function() {
          if (imgPrincipal) {
            imgPrincipal.src = url;
            imgPrincipal.alt = img.alt;
          }
          thumbs.querySelectorAll('img').forEach(function(i) { i.classList.remove('ativo'); });
          img.classList.add('ativo');
        });
        thumbs.appendChild(img);
      });
    }

    setTextContent('animal-nome', animal.nome);
    setTextContent('animal-especie', animal.especie);
    setTextContent('animal-idade', animal.idade);
    setTextContent('animal-porte', animal.porte);
    setTextContent('animal-genero', animal.genero);
    setTextContent('animal-vacinado', animal.vacinada ? 'Sim' : 'Não');
    setTextContent('animal-castrado', animal.castrada ? 'Sim' : 'Não');
    setTextContent('animal-historia-texto', animal.historia);

    var btnAdotar = document.getElementById('btn-adotar');
    if (btnAdotar) {
      btnAdotar.href = 'formulario.html?animalId=' + animal.id;
    }

    document.title = animal.nome + ' – Adote um Amigo';
    initMenuToggle();
  }

  function setTextContent(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // ========== FORMULÁRIO (formulario.html) ==========
  function initFormPage() {
    var animalId = getQueryParam('animalId');
    var animalRef = document.getElementById('form-animal-ref');
    if (animalRef && animalId) {
      var animal = getAnimalById(animalId);
      animalRef.textContent = animal ? 'Você está se candidatando para adotar: ' + animal.nome + '.' : '';
    }

    var form = document.getElementById('form-adocao');
    var rowProprietario = document.getElementById('row-proprietario');
    var rowJaTeve = document.getElementById('row-ja-teve');
    var moradiaRadios = form && form.querySelectorAll('input[name="moradia"]');
    var petAgoraCheckboxes = form && form.querySelectorAll('input[name="pet_agora"]');
    var petNenhum = document.getElementById('pet_nenhum');

    // Wizard (3 etapas: 1=Dados, 2=Endereço+Residência, 3=Perguntas+Termo)
    var stepEls = form ? form.querySelectorAll('.form-step[data-step]') : null;
    var indicators = form ? form.querySelectorAll('[data-step-indicator]') : null;
    var btnProximo = document.getElementById('btn-proximo-etapa');
    var btnProximo2 = document.getElementById('btn-proximo-etapa-2');
    var btnVoltar = document.getElementById('btn-voltar-etapa');
    var currentStep = 1;

    function setStep(step) {
      currentStep = step;
      if (stepEls) {
        stepEls.forEach(function(el) {
          var s = parseInt(el.getAttribute('data-step'), 10);
          el.hidden = s !== step;
        });
      }
      if (indicators) {
        indicators.forEach(function(li) {
          var s2 = parseInt(li.getAttribute('data-step-indicator'), 10);
          if (s2 === step) li.classList.add('ativo');
          else li.classList.remove('ativo');
        });
      }
      // Leva o usuário ao topo do formulário ao trocar etapa (melhor UX no mobile)
      if (form && typeof form.scrollIntoView === 'function') {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    if (moradiaRadios && moradiaRadios.length && rowProprietario) {
      moradiaRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
          rowProprietario.hidden = radio.value !== 'Alugado';
          if (radio.value !== 'Alugado') {
            form.querySelectorAll('input[name="proprietario_permite"]').forEach(function(r) { r.checked = false; r.removeAttribute('required'); });
          } else {
            form.querySelectorAll('input[name="proprietario_permite"]').forEach(function(r) { r.setAttribute('required', 'required'); });
          }
        });
      });
    }

    function toggleJaTeve() {
      var nenhumMarcado = petNenhum && petNenhum.checked;
      var algumOutro = false;
      if (petAgoraCheckboxes) {
        petAgoraCheckboxes.forEach(function(cb) {
          if (cb !== petNenhum && cb.checked) algumOutro = true;
        });
      }
      if (rowJaTeve) rowJaTeve.hidden = !nenhumMarcado || algumOutro;
    }
    if (petAgoraCheckboxes) {
      petAgoraCheckboxes.forEach(function(cb) {
        cb.addEventListener('change', function() {
          if (cb === petNenhum) {
            if (cb.checked) petAgoraCheckboxes.forEach(function(c) { if (c !== petNenhum) c.checked = false; });
          } else if (cb.checked && petNenhum) petNenhum.checked = false;
          toggleJaTeve();
        });
      });
    }
    toggleJaTeve();

    // Modal do termo
    var modal = document.getElementById('modal-termo');
    var abrirTermo = document.getElementById('abrir-termo');
    var btnAceitoTermo = document.getElementById('btn-aceito-termo');
    var modalTermoAceito = document.getElementById('modal-termo-aceito');
    var modalTermoAviso = document.getElementById('modal-termo-aviso');
    var termoAceito = document.getElementById('termo-aceito');

    function abrirModal() {
      if (modal) {
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
      }
      // Reset do “check” dentro do modal sempre que abrir
      if (modalTermoAceito) modalTermoAceito.checked = false;
      if (modalTermoAviso) modalTermoAviso.hidden = true;
    }
    function fecharModal() {
      if (modal) {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
      }
    }
    if (abrirTermo) abrirTermo.addEventListener('click', function(ev) { ev.preventDefault(); abrirModal(); });
    if (modalTermoAceito) {
      // Se o usuário marcar/desmarcar, some o aviso
      var esconderAviso = function() { if (modalTermoAviso) modalTermoAviso.hidden = true; };
      modalTermoAceito.addEventListener('change', esconderAviso);
      modalTermoAceito.addEventListener('input', esconderAviso);
    }
    if (btnAceitoTermo) {
      btnAceitoTermo.addEventListener('click', function() {
        // Só permite aceitar se o usuário marcou o check no modal
        if (modalTermoAceito && !modalTermoAceito.checked) {
          if (modalTermoAviso) modalTermoAviso.hidden = false;
          modalTermoAceito.focus();
          return;
        }
        if (termoAceito) termoAceito.checked = true;
        fecharModal();
      });
    }

    // Navegação do wizard (3 etapas)
    if (btnProximo && form) {
      btnProximo.addEventListener('click', function() {
        var step1 = form.querySelector('.form-step[data-step="1"]');
        if (!step1) return;
        var ok = validarFormulario(form, step1);
        if (!ok) return;
        setStep(2);
      });
    }
    if (btnProximo2 && form) {
      btnProximo2.addEventListener('click', function() {
        var step2 = form.querySelector('.form-step[data-step="2"]');
        if (!step2) return;
        var ok = validarFormulario(form, step2);
        if (!ok) return;
        setStep(3);
      });
    }
    if (btnVoltar && form) {
      btnVoltar.addEventListener('click', function() {
        setStep(currentStep - 1);
      });
    }

    if (form) {
      form.addEventListener('submit', function(ev) {
        ev.preventDefault();
        // Validação final: valida tudo; se achar erro em etapa oculta, volta para ela.
        if (!validarFormulario(form)) return;
        var dados = obterDadosFormulario(form);
        dados.animalId = animalId || null;
        dados.dataEnvio = new Date().toISOString();
        salvarSubmissao(dados);
        mostrarConfirmacao(dados);
        var wrapper = form.closest('.form-wrapper');
        if (wrapper) wrapper.hidden = true;
        var conf = document.getElementById('confirmacao-envio');
        if (conf) conf.hidden = false;
      });
    }
    initMenuToggle();

    // Começa sempre na etapa 1
    setStep(1);
  }

  /**
   * Valida campos obrigatórios.
   * - Se `scopeEl` for informado, valida apenas os required dentro dele (usado na Etapa 1).
   * - No submit final (sem scope), valida tudo; se encontrar erro em uma etapa oculta, revela a etapa.
   */
  function validarFormulario(form, scopeEl) {
    var valid = true;
    var root = scopeEl || form;
    root.querySelectorAll('[required]').forEach(function(input) {
      // Se um bloco/linha estiver hidden, ignore (ex.: proprietário permite quando não é alugado)
      var hiddenAncestor = input.closest('[hidden]');
      if (hiddenAncestor) return;

      var row = input.closest('.form-row');
      if (input.type === 'radio' || input.type === 'checkbox') {
        var name = input.name;
        // Restringe a busca ao escopo quando estamos validando uma etapa
        var checked = (scopeEl || form).querySelector('input[name="' + name + '"]:checked');
        if (!checked && input.closest('.form-row')) {
          if (row && !row.querySelector('.erro-msg')) {
            var msg = document.createElement('span');
            msg.className = 'erro-msg';
            msg.style.color = 'var(--cor-erro)';
            msg.textContent = ' Obrigatório.';
            row.appendChild(msg);
          }
          valid = false;
        } else if (row) {
          var em = row.querySelector('.erro-msg');
          if (em) em.remove();
        }
      } else {
        if (!input.value.trim()) {
          input.classList.add('erro');
          if (row && !row.querySelector('.erro-msg')) {
            var m = document.createElement('span');
            m.className = 'erro-msg';
            m.style.color = 'var(--cor-erro)';
            m.textContent = ' Preencha este campo.';
            row.appendChild(m);
          }
          valid = false;
        } else {
          input.classList.remove('erro');
          if (row) {
            var e = row.querySelector('.erro-msg');
            if (e) e.remove();
          }
        }
      }
    });
    // Exige "proprietário permite" quando validando etapa 2 (residência) ou o formulário inteiro
    if (!scopeEl || (scopeEl && scopeEl.querySelector('#row-proprietario'))) {
      var moradiaAlugado = form.querySelector('input[name="moradia"][value="Alugado"]:checked');
      if (moradiaAlugado) {
        var propPermite = form.querySelector('input[name="proprietario_permite"]:checked');
        if (!propPermite) {
          valid = false;
          var rowProprietarioLocal = document.getElementById('row-proprietario');
          if (rowProprietarioLocal && !rowProprietarioLocal.querySelector('.erro-msg')) {
            var span = document.createElement('span');
            span.className = 'erro-msg';
            span.style.color = 'var(--cor-erro)';
            span.textContent = ' Informe se o proprietário permite animais.';
            rowProprietarioLocal.appendChild(span);
          }
        }
      }
    }

    // Se for validação completa e houver erro numa etapa oculta, revela a etapa do primeiro erro.
    if (!scopeEl && !valid) {
      var firstError = form.querySelector('.erro, .erro-msg');
      if (firstError) {
        var step = firstError.closest('.form-step[data-step]');
        if (step) {
          var stepNum = parseInt(step.getAttribute('data-step'), 10);
          form.querySelectorAll('.form-step[data-step]').forEach(function(s) {
            s.hidden = parseInt(s.getAttribute('data-step'), 10) !== stepNum;
          });
          form.querySelectorAll('[data-step-indicator]').forEach(function(li) {
            var sn = parseInt(li.getAttribute('data-step-indicator'), 10);
            if (sn === stepNum) li.classList.add('ativo');
            else li.classList.remove('ativo');
          });
        }
      }
    }
    return valid;
  }

  function obterDadosFormulario(form) {
    var d = {};
    var els = form.querySelectorAll('input, select, textarea');
    els.forEach(function(el) {
      var name = el.name;
      if (!name) return;
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (el.type === 'checkbox' && el.name === 'pet_agora') {
          if (!d[name]) d[name] = [];
          if (el.checked) d[name].push(el.value);
        } else if (el.checked) {
          d[name] = el.value;
        }
      } else {
        d[name] = el.value;
      }
    });
    if (d.pet_agora && Array.isArray(d.pet_agora)) d.pet_agora = d.pet_agora.join(', ');
    return d;
  }

  function salvarSubmissao(dados) {
    ensureSeedData();
    var list = readJson(STORAGE_KEYS.adocoes, []);
    list.push(dados);
    writeJson(STORAGE_KEYS.adocoes, list);
  }

  function mostrarConfirmacao(dados) {
    var resumo = document.getElementById('resumo-envio');
    if (!resumo) return;
    var animal = dados.animalId ? getAnimalById(dados.animalId) : null;
    var html = '<dl>';
    if (animal) html += '<dt>Animal</dt><dd>' + escapeHtml(animal.nome) + '</dd>';
    html += '<dt>Nome</dt><dd>' + escapeHtml(dados.nome || '') + '</dd>';
    html += '<dt>E-mail</dt><dd>' + escapeHtml(dados.email || '') + '</dd>';
    html += '<dt>Telefone</dt><dd>' + escapeHtml(dados.telefone || '') + '</dd>';
    html += '<dt>Endereço</dt><dd>' + escapeHtml(dados.endereco || '') + '</dd>';
    html += '<dt>Moradia</dt><dd>' + escapeHtml(dados.moradia || '') + '</dd>';
    html += '<dt>Tipo de moradia</dt><dd>' + escapeHtml(dados.tipo_moradia || '') + '</dd>';
    html += '</dl>';
    resumo.innerHTML = html;
  }

  // ========== DOAÇÕES (doar.html) ==========
  function getDonationItems() {
    ensureSeedData();
    return readJson(STORAGE_KEYS.donationItems, DEFAULT_DONATION_ITEMS);
  }

  function setDonationItems(list) {
    writeJson(STORAGE_KEYS.donationItems, list);
  }

  function getDonationIntents() {
    ensureSeedData();
    return readJson(STORAGE_KEYS.donationIntents, []);
  }

  function setDonationIntents(list) {
    writeJson(STORAGE_KEYS.donationIntents, list);
  }

  function nextId(list) {
    var max = 0;
    list.forEach(function(x) {
      if (x && typeof x.id === 'number' && x.id > max) max = x.id;
    });
    return max + 1;
  }

  // ========== LOST PETS (Animais Perdidos / Achados) ========== //

  function getLostPets() {
    ensureSeedData();
    return readJson(STORAGE_KEYS.lostPets, DEFAULT_LOST_PETS);
  }

  function setLostPets(list) {
    writeJson(STORAGE_KEYS.lostPets, list);
  }

  function getLostPetIntents() {
    ensureSeedData();
    return readJson(STORAGE_KEYS.lostPetIntents, []);
  }

  function setLostPetIntents(list) {
    writeJson(STORAGE_KEYS.lostPetIntents, list);
  }

  function addAdminNotification(message, meta) {
    var list = readJson(STORAGE_KEYS.adminNotifications, []);
    list.push({
      id: nextId(list),
      message: message,
      meta: meta || {},
      createdAt: nowIso(),
      read: false
    });
    writeJson(STORAGE_KEYS.adminNotifications, list);
  }

  function addModerationLog(action, lostPetId, extra) {
    var logs = readJson(STORAGE_KEYS.moderationLogs, []);
    logs.push({
      id: nextId(logs),
      action: action,
      lostPetId: lostPetId,
      at: nowIso(),
      extra: extra || {}
    });
    writeJson(STORAGE_KEYS.moderationLogs, logs);
  }

  function getLostPetById(id) {
    var num = parseInt(id, 10);
    if (isNaN(num)) return null;
    return getLostPets().find(function(p) { return p.id === num; }) || null;
  }

  function maskPhone(phone) {
    if (!phone) return '';
    var digits = phone.replace(/\D/g, '');
    if (digits.length < 8) return phone;
    return phone.replace(/(\d{2,3}).+(\d{4})/, '$1 ****-$2');
  }

  function maskEmail(email) {
    if (!email) return '';
    var parts = email.split('@');
    if (parts.length !== 2) return email;
    var name = parts[0];
    var domain = parts[1];
    if (name.length <= 2) return name[0] + '***@' + domain;
    return name[0] + '***' + name[name.length - 1] + '@' + domain;
  }

  function getSpeciesIcon(species) {
    var s = (species || '').toLowerCase();
    if (s.indexOf('cachorro') !== -1 || s.indexOf('cão') !== -1 || s.indexOf('cao') !== -1) return '🐶';
    if (s.indexOf('gato') !== -1) return '🐱';
    if (s.indexOf('ave') !== -1 || s.indexOf('papagaio') !== -1 || s.indexOf('pássaro') !== -1 || s.indexOf('passaro') !== -1) return '🦜';
    if (s.indexOf('réptil') !== -1 || s.indexOf('reptil') !== -1) return '🦎';
    if (s.indexOf('roedor') !== -1 || s.indexOf('coelho') !== -1) return '🐰';
    if (s.indexOf('equino') !== -1 || s.indexOf('cavalo') !== -1) return '🐴';
    if (['bovino', 'vaca', 'boi'].some(function(t) { return s.indexOf(t) !== -1; })) return '🐄';
    return '🐾';
  }

  // Intenção criada a partir de um item (usada se clicarmos em um item específico)
  function addDonationIntent(item) {
    var intents = getDonationIntents();
    var intent = {
      id: nextId(intents),
      itemId: item.id,
      itemNome: item.nome,
      status: 'Novo',
      createdAt: new Date().toISOString()
    };
    intents.push(intent);
    setDonationIntents(intents);
    return intent;
  }

  // Intenção criada a partir do formulário de doação de itens
  function addDonationIntentFromForm(data) {
    var intents = getDonationIntents();
    var intent = {
      id: nextId(intents),
      itemId: data.itemId || null,
      itemNome: data.itemNome || (data.tipo || 'Doação de itens'),
      tipo: data.tipo || '',
      descricao: data.descricao || '',
      quantidade: data.quantidade || '',
      contato: data.contato || '',
      petId: data.petId || null,
      petNome: data.petNome || '',
      status: 'Novo',
      createdAt: new Date().toISOString()
    };
    intents.push(intent);
    setDonationIntents(intents);
    return intent;
  }

  // ========== MODERADORES (protótipo) ==========
  function isModeratorLogged() {
    var token = localStorage.getItem(STORAGE_KEYS.moderatorToken);
    if (!token) return false;
    if (token === 'true') return true;
    var obj = safeJsonParse(token, null);
    return !!(obj && obj.email);
  }

  function setModeratorToken(email) {
    // Token simples (protótipo). Em produção: JWT com exp + refresh, via HTTPS.
    localStorage.setItem(STORAGE_KEYS.moderatorToken, JSON.stringify({ email: email, issuedAt: Date.now() }));
  }

  function clearModeratorToken() {
    localStorage.removeItem(STORAGE_KEYS.moderatorToken);
  }

  function getModerators() {
    ensureSeedData();
    return readJson(STORAGE_KEYS.moderators, [{ email: DEMO_MODERATOR.email, pass: DEMO_MODERATOR.pass }]);
  }

  async function login(email, senha) {
  const res = await api("/login", "POST", { email, senha });

  if (res.success) {
    localStorage.setItem("user", JSON.stringify(res.user));
    window.location.href = "index.html";
  } else {
    alert("Login inválido");
  }
}

  // ========== PÁGINA DOAR (doar.html) ==========
  function initDoarPage() {
    ensureSeedData();
    initMenuToggle();

    // Tabs (Dinheiro / Itens) – inspirado no protótipo de referência
    var tabMoney = document.getElementById('tab-money');
    var tabItems = document.getElementById('tab-items');
    var panelMoney = document.getElementById('panel-money');
    var panelItems = document.getElementById('panel-items');

    function setTab(which) {
      var moneyActive = which === 'money';
      if (tabMoney) {
        tabMoney.classList.toggle('ativo', moneyActive);
        tabMoney.setAttribute('aria-selected', moneyActive ? 'true' : 'false');
      }
      if (tabItems) {
        tabItems.classList.toggle('ativo', !moneyActive);
        tabItems.setAttribute('aria-selected', !moneyActive ? 'true' : 'false');
      }
      if (panelMoney) panelMoney.hidden = !moneyActive;
      if (panelItems) panelItems.hidden = moneyActive;
    }

    if (tabMoney) tabMoney.addEventListener('click', function() { setTab('money'); });
    if (tabItems) tabItems.addEventListener('click', function() { setTab('items'); });
    setTab('money');

    var pixInput = document.getElementById('pix-key');
    var btnGerar = document.getElementById('btn-gerar-pix');
    var qrImg = document.getElementById('pix-qr');
    var payloadEl = document.getElementById('pix-payload');
    var btnCopiar = document.getElementById('btn-copiar-payload');
    var feedback = document.getElementById('doar-feedback');

    if (pixInput && !pixInput.value) pixInput.value = DEFAULT_PIX_KEY;

    function gerarPix() {
      if (!pixInput || !qrImg || !payloadEl) return;
      var chave = (pixInput.value || '').trim();
      if (!chave) {
        if (feedback) feedback.textContent = 'Informe uma chave PIX.';
        return;
      }
      // Para protótipo: payload simples. Em produção, gerar payload EMVCo completo.
      var payload = 'PIX|' + chave + '|ONG_ADOTE_UM_AMIGO';
      payloadEl.value = payload;
      var url = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + encodeURIComponent(payload);
      qrImg.src = url;
      qrImg.alt = 'QR Code PIX para doação';
      if (feedback) feedback.textContent = 'QR Code gerado. Você pode copiar o payload.';
    }

    if (btnGerar) btnGerar.addEventListener('click', function(ev) { ev.preventDefault(); gerarPix(); });
    if (btnCopiar && payloadEl) {
      btnCopiar.addEventListener('click', function() {
        payloadEl.select();
        try {
          document.execCommand('copy');
          if (feedback) feedback.textContent = 'Payload copiado.';
        } catch (e) {
          if (feedback) feedback.textContent = 'Não foi possível copiar automaticamente. Selecione e copie.';
        }
      });
    }

    // Formulário de doação de itens (estrutura tipo a do exemplo)
    var itensForm = document.getElementById('doar-itens-form');
    var itensFeedback = document.getElementById('doar-itens-feedback');
    var petSelect = document.getElementById('doar-pet');
    var importantEl = document.getElementById('donation-important');

    // Preenche lista de pets para apadrinhar (opcional)
    if (petSelect) {
      var animals = getAnimals();
      animals.forEach(function(a) {
        var opt = document.createElement('option');
        opt.value = String(a.id);
        opt.textContent = a.nome + ' (' + a.especie + ')';
        petSelect.appendChild(opt);
      });
    }

    // Chips de itens mais necessários (a partir de donationItems)
    var selectedChipId = null;
    if (importantEl) {
      var items = getDonationItems();
      if (!items.length) {
        importantEl.innerHTML = '<span class="muted small">Nenhum item cadastrado ainda.</span>';
      } else {
        importantEl.innerHTML = items.map(function(it) {
          return '<button type="button" class="donation-chip" data-item-id="' + it.id + '">' + escapeHtml(it.nome) + '</button>';
        }).join('');
        importantEl.addEventListener('click', function(ev) {
          var chip = ev.target.closest('.donation-chip');
          if (!chip) return;
          var id = parseInt(chip.getAttribute('data-item-id'), 10);
          selectedChipId = id;
          importantEl.querySelectorAll('.donation-chip').forEach(function(c) {
            c.classList.toggle('ativo', c === chip);
          });
        });
      }
    }

    if (itensForm) {
      itensForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var tipoInput = itensForm.querySelector('input[name="doar_tipo"]:checked');
        var tipo = tipoInput ? tipoInput.value : '';
        var descricao = (itensForm.querySelector('[name="descricao"]').value || '').trim();
        var quantidade = (itensForm.querySelector('[name="quantidade"]').value || '').trim();
        var contato = (itensForm.querySelector('[name="contato"]').value || '').trim();
        var petIdVal = petSelect && petSelect.value ? parseInt(petSelect.value, 10) : null;
        var pet = petIdVal ? getAnimalById(petIdVal) : null;

        // Para protótipo, exigimos ao menos tipo + contato
        if (!tipo || !contato) {
          if (itensFeedback) itensFeedback.textContent = 'Informe ao menos o tipo do item e seus dados de contato.';
          return;
        }

        var associatedItem = null;
        if (selectedChipId) {
          associatedItem = getDonationItems().find(function(x) { return x.id === selectedChipId; });
        }

        addDonationIntentFromForm({
          itemId: associatedItem ? associatedItem.id : null,
          itemNome: associatedItem ? associatedItem.nome : null,
          tipo: tipo,
          descricao: descricao,
          quantidade: quantidade,
          contato: contato,
          petId: pet ? pet.id : null,
          petNome: pet ? pet.nome : ''
        });

        itensForm.reset();
        selectedChipId = null;
        if (importantEl) importantEl.querySelectorAll('.donation-chip').forEach(function(c) { c.classList.remove('ativo'); });
        if (itensFeedback) itensFeedback.textContent = 'Intenção registrada — em até 48h a ONG entrará em contato.';
      });
    }

    // Painel simplificado para moderador
    var modPanel = document.getElementById('moderator-panel');
    if (modPanel) modPanel.hidden = !isModeratorLogged();
  }

  // ========== PÁGINA LOST PETS (lost-pets.html) ==========

  function renderLostPetCard(pet) {
    var img = (pet.images && pet.images[0]) || 'https://source.unsplash.com/600x400/?pet';
    var title = pet.name && pet.name.trim() ? pet.name.trim() : (pet.species || 'Animal');
    var icon = getSpeciesIcon(pet.species);
    var location = [pet.city, pet.neighborhood].filter(Boolean).join(' – ');
    var dateLabel = pet.lost_date ? new Date(pet.lost_date).toLocaleDateString() : '-';
    var statusLabel = pet.status === 'found' ? 'Encontrado' : (pet.type === 'found' ? 'Achado' : 'Perdido');

    return (
      '<article class="card-animal" role="listitem" data-lost-id="' + pet.id + '">' +
        '<button type="button" class="lost-card-btn" data-lost-open="' + pet.id + '">' +
          '<img src="' + img + '" alt="' + escapeHtml(title || 'Animal perdido/achado') + '">' +
        '</button>' +
        '<div class="card-body">' +
          '<h3>' + icon + ' ' + escapeHtml(title) + '</h3>' +
          '<p class="card-meta">' + escapeHtml(pet.species || '') + ' · ' + escapeHtml(location || '') + '</p>' +
          '<p class="card-meta">Data: ' + escapeHtml(dateLabel) + '</p>' +
          '<span class="tag">' + escapeHtml(statusLabel) + '</span>' +
          '<button type="button" class="btn btn-primary btn-small lost-card-details" data-lost-open="' + pet.id + '">Ver detalhes</button>' +
        '</div>' +
      '</article>'
    );
  }

  function filterLostPets(options) {
    var text = (options.text || '').toLowerCase();
    var species = options.species || '';
    var city = (options.city || '').toLowerCase();
    var neighborhood = (options.neighborhood || '').toLowerCase();
    var dateFrom = options.dateFrom ? new Date(options.dateFrom) : null;
    var dateTo = options.dateTo ? new Date(options.dateTo) : null;
    var status = options.status || 'approved';

    return getLostPets().filter(function(p) {
      if (p.status !== 'approved' && p.status !== 'found') return false;
      if (status && p.status !== status) {
        // status === 'approved' significa "apenas aprovados que ainda não foram marcados como found"
        if (!(status === 'approved' && p.status === 'approved')) return false;
      }
      if (species && p.species !== species) return false;
      if (city && (!p.city || p.city.toLowerCase().indexOf(city) === -1)) return false;
      if (neighborhood && (!p.neighborhood || p.neighborhood.toLowerCase().indexOf(neighborhood) === -1)) return false;

      if (dateFrom || dateTo) {
        if (!p.lost_date) return false;
        var d = new Date(p.lost_date);
        if (dateFrom && d < dateFrom) return false;
        if (dateTo && d > dateTo) return false;
      }

      if (text) {
        var haystack = [
          p.name,
          p.species,
          p.breed,
          p.color,
          p.description,
          p.city,
          p.neighborhood
        ].filter(Boolean).join(' ').toLowerCase();
        if (haystack.indexOf(text) === -1) return false;
      }
      return true;
    });
  }

  function initLostPetsPage() {
    ensureSeedData();
    initMenuToggle();

    var searchInput = document.getElementById('lost-search');
    var speciesSelect = document.getElementById('lost-species');
    var cityInput = document.getElementById('lost-city');
    var neighborhoodInput = document.getElementById('lost-neighborhood');
    var dateFromInput = document.getElementById('lost-date-from');
    var dateToInput = document.getElementById('lost-date-to');
    var statusSelect = document.getElementById('lost-status');
    var grid = document.getElementById('lost-pets-grid');
    var emptyEl = document.getElementById('lost-pets-empty');

    function aplicar() {
      var list = filterLostPets({
        text: searchInput ? searchInput.value : '',
        species: speciesSelect ? speciesSelect.value : '',
        city: cityInput ? cityInput.value : '',
        neighborhood: neighborhoodInput ? neighborhoodInput.value : '',
        dateFrom: dateFromInput ? dateFromInput.value : '',
        dateTo: dateToInput ? dateToInput.value : '',
        status: statusSelect ? statusSelect.value : 'approved'
      });

      if (!grid) return;
      grid.innerHTML = '';
      if (!list.length) {
        if (emptyEl) emptyEl.hidden = false;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;
      list.forEach(function(p) {
        grid.insertAdjacentHTML('beforeend', renderLostPetCard(p));
      });
    }

    if (searchInput) searchInput.addEventListener('input', aplicar);
    if (speciesSelect) speciesSelect.addEventListener('change', aplicar);
    if (cityInput) cityInput.addEventListener('input', aplicar);
    if (neighborhoodInput) neighborhoodInput.addEventListener('input', aplicar);
    if (dateFromInput) dateFromInput.addEventListener('change', aplicar);
    if (dateToInput) dateToInput.addEventListener('change', aplicar);
    if (statusSelect) statusSelect.addEventListener('change', aplicar);

    if (grid) {
      grid.addEventListener('click', function(ev) {
        var btn = ev.target.closest('[data-lost-open]');
        if (!btn) return;
        var id = btn.getAttribute('data-lost-open');
        openLostPetModal(id);
      });
    }

    setupLostPetModals();
    aplicar();
  }

  function setupLostPetModals() {
    var modal = document.getElementById('lost-pet-modal');
    var intentModal = document.getElementById('lost-pet-intent-modal');

    if (modal) {
      modal.addEventListener('click', function(ev) {
        if (ev.target.hasAttribute('data-lost-modal-close')) {
          closeLostPetModal();
        }
      });
    }
    var closeBtns = modal ? modal.querySelectorAll('[data-lost-modal-close]') : null;
    if (closeBtns) {
      closeBtns.forEach(function(btn) {
        btn.addEventListener('click', closeLostPetModal);
      });
    }

    if (intentModal) {
      intentModal.addEventListener('click', function(ev) {
        if (ev.target.hasAttribute('data-lost-intent-close')) {
          closeLostPetIntentModal();
        }
      });
      var cBtns = intentModal.querySelectorAll('[data-lost-intent-close]');
      cBtns.forEach(function(btn) {
        btn.addEventListener('click', closeLostPetIntentModal);
      });
    }

    var intentForm = document.getElementById('lost-pet-intent-form');
    if (intentForm) {
      intentForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var name = intentForm.intent_name.value.trim();
        var contact = intentForm.intent_contact.value.trim();
        var message = intentForm.intent_message.value.trim();
        var petId = intentForm.dataset.lostPetId ? parseInt(intentForm.dataset.lostPetId, 10) : null;
        if (!name || !contact || !message || !petId) return;

        var intents = getLostPetIntents();
        intents.push({
          id: nextId(intents),
          lostPetId: petId,
          name: name,
          contact: contact,
          message: message,
          createdAt: nowIso()
        });
        setLostPetIntents(intents);
        addAdminNotification('Nova informação sobre animal perdido/achado #' + petId, { lostPetId: petId });
        intentForm.reset();
        closeLostPetIntentModal();
        window.alert('Sua informação foi registrada! Em breve a equipe entrará em contato.');
      });
    }
  }

  function openLostPetModal(id) {
    var pet = getLostPetById(id);
    var modal = document.getElementById('lost-pet-modal');
    if (!pet || !modal) return;

    var mainImg = document.getElementById('lost-pet-main-img');
    var thumbs = document.getElementById('lost-pet-thumbs');
    var titleEl = document.getElementById('lost-pet-name');

    if (mainImg) {
      var imgUrl = (pet.images && pet.images[0]) || 'https://source.unsplash.com/600x400/?pet';
      mainImg.src = imgUrl;
      mainImg.alt = pet.name || 'Animal perdido/achado';
    }
    if (thumbs) {
      thumbs.innerHTML = '';
      (pet.images || []).forEach(function(url, idx) {
        var img = document.createElement('img');
        img.src = url;
        img.alt = (pet.name || pet.species || 'Animal') + ' – foto ' + (idx + 1);
        if (idx === 0) img.classList.add('ativo');
        img.addEventListener('click', function() {
          if (mainImg) {
            mainImg.src = url;
            mainImg.alt = img.alt;
          }
          thumbs.querySelectorAll('img').forEach(function(i) { i.classList.remove('ativo'); });
          img.classList.add('ativo');
        });
        thumbs.appendChild(img);
      });
    }

    if (titleEl) titleEl.textContent = pet.name && pet.name.trim() ? pet.name : (pet.species || 'Animal');
    setTextContent('lost-pet-type', pet.type === 'found' ? 'Animal encontrado' : 'Animal perdido');
    setTextContent('lost-pet-species', pet.species || '');
    setTextContent('lost-pet-breed', pet.breed || '-');
    setTextContent('lost-pet-color', pet.color || '-');
    setTextContent('lost-pet-gender', pet.gender || '-');
    setTextContent('lost-pet-size', pet.size || '-');
    setTextContent('lost-pet-location', [pet.city, pet.neighborhood].filter(Boolean).join(' – '));
    setTextContent('lost-pet-date', pet.lost_date ? new Date(pet.lost_date).toLocaleDateString() : '-');
    setTextContent('lost-pet-status', pet.status === 'found' ? 'Marcado como encontrado' : 'Publicado');
    setTextContent('lost-pet-microchip', pet.microchip || '-');
    setTextContent('lost-pet-description', pet.description || '');
    setTextContent('lost-pet-owner', pet.owner_name || '');
    setTextContent('lost-pet-phone', maskPhone(pet.contact_phone));
    setTextContent('lost-pet-email', maskEmail(pet.contact_email));

    var btnIntent = document.getElementById('btn-lost-pet-intent');
    if (btnIntent) {
      btnIntent.onclick = function() {
        openLostPetIntentModal(pet.id);
      };
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeLostPetModal() {
    var modal = document.getElementById('lost-pet-modal');
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }

  function openLostPetIntentModal(petId) {
    var intentModal = document.getElementById('lost-pet-intent-modal');
    var form = document.getElementById('lost-pet-intent-form');
    if (!intentModal || !form) return;
    form.dataset.lostPetId = String(petId);
    intentModal.hidden = false;
    intentModal.setAttribute('aria-hidden', 'false');
  }

  function closeLostPetIntentModal() {
    var intentModal = document.getElementById('lost-pet-intent-modal');
    if (!intentModal) return;
    intentModal.hidden = true;
    intentModal.setAttribute('aria-hidden', 'true');
  }

  // ========== FORMULÁRIO REPORT LOST PET (report-lost-pet.html) ==========

  function initReportLostPetPage() {
    ensureSeedData();
    initMenuToggle();

    var form = document.getElementById('lost-pet-form');
    if (!form) return;

    var speciesSelect = document.getElementById('lost-species-select');
    var rowSpeciesOther = document.getElementById('row-species-other');
    var speciesOther = document.getElementById('lost-species-other');
    var hasMicrochip = document.getElementById('has-microchip');
    var rowMicrochip = document.getElementById('row-microchip');
    var btnLocation = document.getElementById('btn-use-location');
    var latInput = document.getElementById('lost-lat');
    var lngInput = document.getElementById('lost-lng');
    var wrapper = document.querySelector('.form-wrapper');
    var confirmSection = document.getElementById('lost-pet-confirmation');

    if (speciesSelect && rowSpeciesOther && speciesOther) {
      speciesSelect.addEventListener('change', function() {
        var isOther = speciesSelect.value === 'Outros';
        rowSpeciesOther.hidden = !isOther;
        if (isOther) {
          speciesOther.setAttribute('required', 'required');
        } else {
          speciesOther.removeAttribute('required');
          speciesOther.value = '';
        }
      });
    }

    if (hasMicrochip && rowMicrochip) {
      hasMicrochip.addEventListener('change', function() {
        var show = hasMicrochip.checked;
        rowMicrochip.hidden = !show;
        var input = document.getElementById('lost-microchip');
        if (input) {
          if (show) input.setAttribute('required', 'required');
          else {
            input.removeAttribute('required');
            input.value = '';
          }
        }
      });
    }

    if (btnLocation && latInput && lngInput && 'geolocation' in navigator) {
      btnLocation.addEventListener('click', function() {
        navigator.geolocation.getCurrentPosition(function(pos) {
          latInput.value = String(pos.coords.latitude.toFixed(6));
          lngInput.value = String(pos.coords.longitude.toFixed(6));
        }, function() {
          window.alert('Não foi possível obter a localização neste navegador.');
        });
      });
    }

    form.addEventListener('submit', function(ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });

      var speciesValue = data.species === 'Outros' && data.species_other ? data.species_other : data.species;
      var coords = null;
      if (data.lat && data.lng) {
        coords = { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
      }

      // Foto: priorizar URL, senão tentar arquivo (DataURL)
      var images = [];
      var url = (data.photo_url || '').trim();
      if (url) images.push(url);

      var fileInput = document.getElementById('lost-photo-upload');
      var file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

      function persistLostPet(imageList) {
        var existing = getLostPets();
        var record = {
          id: nextId(existing),
          type: data.type,
          name: data.name || '',
          species: speciesValue || '',
          breed: data.breed || '',
          age: data.age || '',
          color: data.color || '',
          gender: data.gender || '',
          size: data.size || '',
          microchip: data.microchip || '',
          city: data.city || '',
          neighborhood: data.neighborhood || '',
          coordinates: coords,
          lost_date: data.lost_date || '',
          description: data.description || '',
          images: imageList.length ? imageList : ['https://source.unsplash.com/600x400/?pet'],
          owner_name: data.owner_name || '',
          contact_phone: data.contact_phone || '',
          contact_email: data.contact_email || '',
          status: 'pending',
          created_at: nowIso()
        };

        existing.push(record);
        setLostPets(existing);
        addAdminNotification('Novo registro de animal perdido/achado pendente #' + record.id, { lostPetId: record.id });

        form.reset();
        if (wrapper) wrapper.hidden = true;
        if (confirmSection) confirmSection.hidden = false;
      }

      if (!url && file) {
        var reader = new FileReader();
        reader.onload = function(e) {
          images.push(String(e.target.result));
          persistLostPet(images);
        };
        reader.readAsDataURL(file);
      } else {
        persistLostPet(images);
      }
    });
  }

  // ========== ADMIN LOGIN (admin/login.html) ==========
  function initAdminLoginPage() {
    ensureSeedData();
    initMenuToggle();
    var form = document.getElementById('admin-login-form');
    var emailEl = document.getElementById('admin-email');
    var passEl = document.getElementById('admin-pass');
    var feedback = document.getElementById('admin-feedback');

    if (isModeratorLogged()) {
      window.location.href = 'admin/login.html';
      return;
    }

    if (form) {
      form.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var email = emailEl ? emailEl.value.trim() : '';
        var pass = passEl ? passEl.value : '';
        var ok = loginModerator(email, pass);
        if (!ok) {
          if (feedback) feedback.textContent = 'Login inválido. Use a conta demo indicada na página.';
          return;
        }
        window.location.href = 'admin/login.html';
      });
    }
  }

  // ========== ADMIN DASHBOARD (admin/dashboard.html) ==========
  function initAdminDashboardPage() {
    ensureSeedData();
    initMenuToggle();
    if (!isModeratorLogged()) {
      window.location.href = 'login.html';
      return;
    }

    var btnLogout = document.getElementById('admin-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', function() {
        clearModeratorToken();
        window.location.href = 'login.html';
      });
    }

    // ---- PETS CRUD ----
    var petForm = document.getElementById('pet-form');
    var petList = document.getElementById('pet-list');
    var petSearch = document.getElementById('pet-search');
    var petFilterEspecie = document.getElementById('pet-filter-especie');
    var petFilterPorte = document.getElementById('pet-filter_porte');

    function renderPets() {
      if (!petList) return;
      var animals = getAnimals();
      var q = (petSearch && petSearch.value ? petSearch.value.trim().toLowerCase() : '');
      var fe = petFilterEspecie ? petFilterEspecie.value : '';
      var fp = petFilterPorte ? petFilterPorte.value : '';
      animals = animals.filter(function(a) {
        if (q && a.nome.toLowerCase().indexOf(q) === -1) return false;
        if (fe && a.especie !== fe) return false;
        if (fp && a.porte !== fp) return false;
        return true;
      });

      if (!animals.length) {
        petList.innerHTML = '<p class="muted">Nenhum pet encontrado.</p>';
        return;
      }

      petList.innerHTML = animals.map(function(a) {
        return (
          '<div class="admin-row" data-pet-id="' + a.id + '">' +
            '<div class="admin-row-main">' +
              '<strong>' + escapeHtml(a.nome) + '</strong> <span class="muted">(' + escapeHtml(a.especie) + ', ' + escapeHtml(a.porte) + ', ' + escapeHtml(a.idade) + ')</span>' +
            '</div>' +
            '<div class="admin-row-actions">' +
              '<button type="button" class="btn btn-secondary btn-small" data-action="edit-pet">Editar</button>' +
              '<button type="button" class="btn btn-danger btn-small" data-action="delete-pet">Excluir</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    function fillPetForm(pet) {
      if (!petForm) return;
      petForm.querySelector('[name="id"]').value = pet.id || '';
      petForm.querySelector('[name="nome"]').value = pet.nome || '';
      petForm.querySelector('[name="especie"]').value = pet.especie || '';
      petForm.querySelector('[name="idade"]').value = pet.idade || '';
      petForm.querySelector('[name="porte"]').value = pet.porte || '';
      petForm.querySelector('[name="genero"]').value = pet.genero || '';
      petForm.querySelector('[name="vacinada"]').checked = !!pet.vacinada;
      petForm.querySelector('[name="castrada"]').checked = !!pet.castrada;
      petForm.querySelector('[name="historia"]').value = pet.historia || '';
      petForm.querySelector('[name="imagens"]').value = (pet.imagens || []).join('\\n');
    }

    if (petForm) {
      petForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var animals = getAnimals();
        var idRaw = petForm.querySelector('[name="id"]').value;
        var isEdit = !!idRaw;
        var id = isEdit ? parseInt(idRaw, 10) : nextId(animals);
        var imagensRaw = petForm.querySelector('[name="imagens"]').value || '';
        var imagens = imagensRaw.split(/\\r?\\n/).map(function(s) { return s.trim(); }).filter(Boolean);
        if (!imagens.length) imagens = ['https://source.unsplash.com/600x400/?pet'];

        var pet = {
          id: id,
          nome: petForm.querySelector('[name="nome"]').value.trim(),
          especie: petForm.querySelector('[name="especie"]').value,
          idade: petForm.querySelector('[name="idade"]').value.trim(),
          porte: petForm.querySelector('[name="porte"]').value,
          genero: petForm.querySelector('[name="genero"]').value,
          vacinada: petForm.querySelector('[name="vacinada"]').checked,
          castrada: petForm.querySelector('[name="castrada"]').checked,
          historia: petForm.querySelector('[name="historia"]').value.trim(),
          imagens: imagens
        };

        if (isEdit) {
          animals = animals.map(function(a) { return a.id === id ? pet : a; });
        } else {
          animals.push(pet);
        }
        setAnimals(animals);
        petForm.reset();
        petForm.querySelector('[name="id"]').value = '';
        renderPets();
      });
    }

    if (petList) {
      petList.addEventListener('click', function(ev) {
        var row = ev.target.closest('[data-pet-id]');
        if (!row) return;
        var id = parseInt(row.getAttribute('data-pet-id'), 10);
        if (ev.target.closest('[data-action="edit-pet"]')) {
          var pet = getAnimals().find(function(a) { return a.id === id; });
          if (pet) fillPetForm(pet);
        }
        if (ev.target.closest('[data-action="delete-pet"]')) {
          var ok = window.confirm('Tem certeza que deseja excluir este pet?');
          if (!ok) return;
          var animals = getAnimals().filter(function(a) { return a.id !== id; });
          setAnimals(animals);
          renderPets();
        }
      });
    }

    if (petSearch) petSearch.addEventListener('input', renderPets);
    if (petFilterEspecie) petFilterEspecie.addEventListener('change', renderPets);
    if (petFilterPorte) petFilterPorte.addEventListener('change', renderPets);
    renderPets();

    // ---- ITENS DE DOAÇÃO CRUD ----
    var itemForm = document.getElementById('donation-item-form');
    var itemList = document.getElementById('donation-item-list');

    function renderDonationItemsAdmin() {
      if (!itemList) return;
      var items = getDonationItems();
      if (!items.length) {
        itemList.innerHTML = '<p class="muted">Nenhum item cadastrado.</p>';
        return;
      }
      itemList.innerHTML = items.map(function(it) {
        return (
          '<div class="admin-row" data-item-id="' + it.id + '">' +
            '<div class="admin-row-main">' +
              '<strong>' + escapeHtml(it.nome) + '</strong> <span class="muted">(' + escapeHtml(it.categoria || '-') + ', qtd: ' + escapeHtml(String(it.quantidade || 0)) + ')</span><br>' +
              '<span class="muted">' + escapeHtml(it.descricao || '') + '</span>' +
            '</div>' +
            '<div class="admin-row-actions">' +
              '<button type="button" class="btn btn-secondary btn-small" data-action="edit-item">Editar</button>' +
              '<button type="button" class="btn btn-danger btn-small" data-action="delete-item">Excluir</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    function fillItemForm(it) {
      if (!itemForm) return;
      itemForm.querySelector('[name="id"]').value = it.id || '';
      itemForm.querySelector('[name="nome"]').value = it.nome || '';
      itemForm.querySelector('[name="descricao"]').value = it.descricao || '';
      itemForm.querySelector('[name="quantidade"]').value = it.quantidade || 0;
      itemForm.querySelector('[name="categoria"]').value = it.categoria || '';
    }

    if (itemForm) {
      itemForm.addEventListener('submit', function(ev) {
        ev.preventDefault();
        var items = getDonationItems();
        var idRaw = itemForm.querySelector('[name="id"]').value;
        var isEdit = !!idRaw;
        var id = isEdit ? parseInt(idRaw, 10) : nextId(items);
        var it = {
          id: id,
          nome: itemForm.querySelector('[name="nome"]').value.trim(),
          descricao: itemForm.querySelector('[name="descricao"]').value.trim(),
          quantidade: parseInt(itemForm.querySelector('[name="quantidade"]').value, 10) || 0,
          categoria: itemForm.querySelector('[name="categoria"]').value.trim()
        };
        if (isEdit) items = items.map(function(x) { return x.id === id ? it : x; });
        else items.push(it);
        setDonationItems(items);
        itemForm.reset();
        itemForm.querySelector('[name="id"]').value = '';
        renderDonationItemsAdmin();
      });
    }

    if (itemList) {
      itemList.addEventListener('click', function(ev) {
        var row = ev.target.closest('[data-item-id]');
        if (!row) return;
        var id = parseInt(row.getAttribute('data-item-id'), 10);
        if (ev.target.closest('[data-action="edit-item"]')) {
          var it = getDonationItems().find(function(x) { return x.id === id; });
          if (it) fillItemForm(it);
        }
        if (ev.target.closest('[data-action="delete-item"]')) {
          var ok = window.confirm('Excluir este item de doação?');
          if (!ok) return;
          var items = getDonationItems().filter(function(x) { return x.id !== id; });
          setDonationItems(items);
          renderDonationItemsAdmin();
        }
      });
    }
    renderDonationItemsAdmin();

    // ---- INTENÇÕES DE DOAÇÃO ----
    var intentsEl = document.getElementById('donation-intents-list');

    function renderIntents() {
      if (!intentsEl) return;
      var intents = getDonationIntents().slice().reverse();
      if (!intents.length) {
        intentsEl.innerHTML = '<p class="muted">Nenhuma intenção registrada ainda.</p>';
        return;
      }
      intentsEl.innerHTML = intents.map(function(i) {
        return (
          '<div class="admin-row" data-intent-id="' + i.id + '">' +
            '<div class="admin-row-main">' +
              '<strong>' + escapeHtml(i.itemNome || ('Item #' + i.itemId)) + '</strong> ' +
              '<span class="tag">' + escapeHtml(i.status || 'Novo') + '</span><br>' +
              '<span class="muted">Criado em: ' + escapeHtml(new Date(i.createdAt).toLocaleString()) + '</span>' +
            '</div>' +
            '<div class="admin-row-actions">' +
              '<button type="button" class="btn btn-secondary btn-small" data-action="status-contact">Contato realizado</button>' +
              '<button type="button" class="btn btn-primary btn-small" data-action="status-received">Recebido</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    function updateIntentStatus(id, status) {
      var intents = getDonationIntents();
      intents = intents.map(function(i) {
        if (i.id !== id) return i;
        return Object.assign({}, i, { status: status, updatedAt: new Date().toISOString() });
      });
      setDonationIntents(intents);
      renderIntents();
    }

    if (intentsEl) {
      intentsEl.addEventListener('click', function(ev) {
        var row = ev.target.closest('[data-intent-id]');
        if (!row) return;
        var id = parseInt(row.getAttribute('data-intent-id'), 10);
        if (ev.target.closest('[data-action="status-contact"]')) updateIntentStatus(id, 'Contato realizado');
        if (ev.target.closest('[data-action="status-received"]')) updateIntentStatus(id, 'Recebido');
      });
    }
    renderIntents();

    // ---- LOST PETS MODERAÇÃO ----
    var lostListEl = document.getElementById('lost-admin-list');
    var lostSearch = document.getElementById('lost-admin-search');
    var lostFilterSpecies = document.getElementById('lost-admin-species');
    var lostFilterStatus = document.getElementById('lost-admin-status');

    function renderLostAdminList() {
      if (!lostListEl) return;
      var list = getLostPets();
      var q = (lostSearch && lostSearch.value ? lostSearch.value.trim().toLowerCase() : '');
      var fs = lostFilterSpecies ? lostFilterSpecies.value : '';
      var st = lostFilterStatus ? lostFilterStatus.value : '';

      list = list.filter(function(p) {
        if (fs && p.species !== fs) return false;
        if (st && p.status !== st) return false;
        if (q) {
          var haystack = [
            p.name,
            p.species,
            p.city,
            p.neighborhood,
            p.description
          ].filter(Boolean).join(' ').toLowerCase();
          if (haystack.indexOf(q) === -1) return false;
        }
        return true;
      }).sort(function(a, b) {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });

      if (!list.length) {
        lostListEl.innerHTML = '<p class="muted">Nenhum registro encontrado.</p>';
        return;
      }

      lostListEl.innerHTML = list.map(function(p) {
        var icon = getSpeciesIcon(p.species);
        var location = [p.city, p.neighborhood].filter(Boolean).join(' – ');
        var dateLabel = p.lost_date ? new Date(p.lost_date).toLocaleDateString() : '-';
        var statusLabel = p.status === 'pending' ? 'Pendente' :
          p.status === 'approved' ? 'Aprovado' :
          p.status === 'rejected' ? 'Recusado' :
          'Encontrado';

        return (
          '<div class="admin-row" data-lost-id="' + p.id + '">' +
            '<div class="admin-row-main">' +
              '<strong>' + icon + ' ' + escapeHtml(p.name || p.species || 'Animal') + '</strong> ' +
              '<span class="tag">' + escapeHtml(statusLabel) + '</span><br>' +
              '<span class="muted small">' + escapeHtml(location || '') + ' · ' + escapeHtml(dateLabel) + '</span><br>' +
              '<span class="muted small">' + escapeHtml((p.description || '').slice(0, 120)) + '...</span>' +
            '</div>' +
            '<div class="admin-row-actions">' +
              '<button type="button" class="btn btn-secondary btn-small" data-action="lost-view">Ver</button>' +
              '<button type="button" class="btn btn-primary btn-small" data-action="lost-approve">Aprovar</button>' +
              '<button type="button" class="btn btn-secondary btn-small" data-action="lost-reject">Recusar</button>' +
              '<button type="button" class="btn btn-primary btn-small" data-action="lost-found">Marcar encontrado</button>' +
              '<button type="button" class="btn btn-danger btn-small" data-action="lost-delete">Excluir</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    if (lostSearch) lostSearch.addEventListener('input', renderLostAdminList);
    if (lostFilterSpecies) lostFilterSpecies.addEventListener('change', renderLostAdminList);
    if (lostFilterStatus) lostFilterStatus.addEventListener('change', renderLostAdminList);

    if (lostListEl) {
      lostListEl.addEventListener('click', function(ev) {
        var row = ev.target.closest('[data-lost-id]');
        if (!row) return;
        var id = parseInt(row.getAttribute('data-lost-id'), 10);
        var list = getLostPets();
        var pet = list.find(function(p) { return p.id === id; });
        if (!pet) return;

        if (ev.target.closest('[data-action="lost-view"]')) {
          window.alert(
            '[' + (pet.status || 'pending') + '] ' + (pet.name || pet.species || 'Animal') + '\n\n' +
            'Espécie: ' + (pet.species || '-') + '\n' +
            'Cidade/Bairro: ' + [pet.city, pet.neighborhood].filter(Boolean).join(' – ') + '\n' +
            'Data: ' + (pet.lost_date || '-') + '\n\n' +
            (pet.description || '')
          );
          return;
        }

        function updateStatus(newStatus) {
          list = list.map(function(p) {
            if (p.id !== id) return p;
            return Object.assign({}, p, { status: newStatus });
          });
          setLostPets(list);
          addModerationLog('status:' + newStatus, id, {});
          renderLostAdminList();
        }

        if (ev.target.closest('[data-action="lost-approve"]')) {
          updateStatus('approved');
          return;
        }
        if (ev.target.closest('[data-action="lost-reject"]')) {
          updateStatus('rejected');
          return;
        }
        if (ev.target.closest('[data-action="lost-found"]')) {
          updateStatus('found');
          return;
        }
        if (ev.target.closest('[data-action="lost-delete"]')) {
          if (!window.confirm('Excluir este registro de animal perdido/achado?')) return;
          list = list.filter(function(p) { return p.id !== id; });
          setLostPets(list);
          addModerationLog('delete', id, {});
          renderLostAdminList();
          return;
        }
      });
    }

    renderLostAdminList();
  }

  // Exportar funções para os scripts inline das páginas
  window.getAnimalById = getAnimalById;
  window.filtrarAnimais = filtrarAnimais;
  window.getQueryParam = getQueryParam;
  window.initHomePage = initHomePage;
  window.initAnimalPage = initAnimalPage;
  window.initFormPage = initFormPage;
  window.initCommonPage = initCommonPage;
  window.initDoarPage = initDoarPage;
  window.initAdminLoginPage = initAdminLoginPage;
  window.initAdminDashboardPage = initAdminDashboardPage;
  window.initLostPetsPage = initLostPetsPage;
  window.initReportLostPetPage = initReportLostPetPage;
})();
