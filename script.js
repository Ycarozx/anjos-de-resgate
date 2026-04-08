/**
 * Frontend Refatorado - Plataforma de Adoção de Animais
 * Conectado perfeitamente com o backend novo
 * Mantendo funcionalidades existentes com organização melhorada
 */

// =========================
// CONFIGURAÇÃO E CONSTANTES
// =========================
const BASE_URL = "http://127.0.0.1:5000";

// =========================
// FUNÇÕES DE API (BACKEND INTEGRATION)
// =========================
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

  try {
    const response = await fetch(BASE_URL + endpoint, options);
    return await response.json();
  } catch (error) {
    console.error(`Erro na API (${endpoint}):`, error);
    return {
      success: false,
      message: "Erro de conexão com o servidor"
    };
  }
}

// =========================
// AUTENTICAÇÃO
// =========================
class AuthManager {
  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  static removeUser() {
    localStorage.removeItem("user");
  }

  static isLoggedIn() {
    return !!this.getUser();
  }

  static isAdmin() {
    const user = this.getUser();
    return user && user.isAdmin === true;
  }

  static async login(email, senha) {
    const response = await api("/login", "POST", { email, senha });
    
    if (response.success) {
      this.setUser(response.user);
      return { success: true, user: response.user };
    }
    
    return { success: false, message: response.message };
  }

  static async register(userData) {
    const response = await api("/register", "POST", userData);
    
    if (response.success) {
      return { success: true, user: response.user };
    }
    
    return { success: false, message: response.message };
  }

  static logout() {
    this.removeUser();
    updateUIBasedOnUser();
    window.location.href = "index.html";
  }
}

// =========================
// GERENCIAMENTO DE UI
// =========================
function updateUIBasedOnUser() {
  const user = AuthManager.getUser();
  const headerActions = document.querySelector('.header-actions');
  const navAuth = document.querySelectorAll('.nav-auth');
  
  if (!headerActions) return;
  
  // Remover botões existentes sem quebrar estrutura
  const existingButtons = headerActions.querySelectorAll('a, button');
  existingButtons.forEach(btn => btn.remove());
  
  if (!user) {
    // Usuário não logado - mostrar login/cadastro
    const loginBtn = document.createElement('a');
    loginBtn.href = 'login.html';
    loginBtn.className = 'btn btn-secondary header-login';
    loginBtn.id = 'btn-login';
    loginBtn.textContent = 'Login';
    
    const registerBtn = document.createElement('a');
    registerBtn.href = 'register.html';
    registerBtn.className = 'btn btn-primary header-register';
    registerBtn.id = 'btn-register';
    registerBtn.textContent = 'Cadastro';
    
    headerActions.appendChild(loginBtn);
    headerActions.appendChild(registerBtn);
  } else {
    // Usuário logado
    if (user.isAdmin === true) {
      // Admin - mostrar botão de administração
      const adminBtn = document.createElement('a');
      adminBtn.href = 'admin.html';
      adminBtn.className = 'btn btn-primary header-cta';
      adminBtn.id = 'btn-admin';
      adminBtn.textContent = 'Administrar site';
      
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-secondary header-login';
      logoutBtn.textContent = 'Sair';
      logoutBtn.onclick = () => AuthManager.logout();
      
      headerActions.appendChild(adminBtn);
      headerActions.appendChild(logoutBtn);
    } else {
      // Usuário comum - mostrar sair
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'btn btn-secondary header-login';
      logoutBtn.textContent = 'Sair';
      logoutBtn.onclick = () => AuthManager.logout();
      
      headerActions.appendChild(logoutBtn);
    }
  }
  
  // Atualizar menu mobile também
  navAuth.forEach(element => {
    if (!user) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  });
}

// =========================
// GERENCIAMENTO DE ANIMAIS
// =========================
class AnimalsManager {
  static async getAll() {
    const response = await api("/animals");
    return response.success ? response.data : [];
  }

  static async create(animalData) {
    const response = await api("/animals", "POST", animalData);
    return response.success ? response.data : null;
  }

  static async update(id, animalData) {
    const response = await api(`/animals/${id}`, "PUT", animalData);
    return response.success ? response.data : null;
  }

  static async delete(id) {
    const response = await api(`/animals/${id}`, "DELETE");
    return response.success;
  }

  static async getById(id) {
    const animals = await this.getAll();
    return animals.find(animal => animal.id === parseInt(id)) || null;
  }

  static filter(animals, filters) {
    return animals.filter(animal => {
      const nomeMatch = !filters.nome || animal.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const especieMatch = !filters.especie || animal.especie === filters.especie;
      const porteMatch = !filters.porte || animal.porte === filters.porte;
      const idadeMatch = !filters.idade || animal.idade === filters.idade;
      const generoMatch = !filters.genero || animal.genero === filters.genero;
      
      return nomeMatch && especieMatch && porteMatch && idadeMatch && generoMatch;
    });
  }

  static renderAnimalCard(animal) {
    return `
      <div class="card">
        <img src="${animal.imagem || 'https://source.unsplash.com/600x400/?pet'}" alt="${animal.nome}">
        <div class="card-body">
          <h3 class="card-title">${animal.nome}</h3>
          <div class="card-meta">
            ${animal.especie} · ${animal.porte} · ${animal.idade} · ${animal.genero}
          </div>
          <p class="card-description">${animal.descricao}</p>
          <a href="animal.html?id=${animal.id}" class="btn btn-primary">Ver detalhes</a>
        </div>
      </div>
    `;
  }
}

// =========================
// GERENCIAMENTO DE ANIMAIS PERDIDOS
// =========================
class LostPetsManager {
  static async getAll() {
    const response = await api("/lost-pets");
    return response.success ? response.data : [];
  }

  static async create(petData) {
    const response = await api("/lost-pets", "POST", petData);
    return response.success ? response.data : null;
  }

  static async update(id, petData) {
    const response = await api(`/lost-pets/${id}`, "PUT", petData);
    return response.success ? response.data : null;
  }

  static async delete(id) {
    const response = await api(`/lost-pets/${id}`, "DELETE");
    return response.success;
  }

  static renderLostPetCard(pet) {
    const tipoClass = pet.tipo === 'perdido' ? 'perdido' : 'encontrado';
    const tipoText = pet.tipo === 'perdido' ? 'PERDIDO' : 'ENCONTRADO';
    
    return `
      <div class="card lost-pet-card">
        <div class="card-body">
          <span class="tipo ${tipoClass}">${tipoText}</span>
          <h3 class="card-title">${pet.nome || pet.especie}</h3>
          <div class="card-meta">
            ${pet.especie} · ${pet.local} · ${pet.data}
          </div>
          <p class="card-description">${pet.descricao}</p>
          <p><strong>Contato:</strong> ${pet.contato}</p>
        </div>
      </div>
    `;
  }
}

// =========================
// GERENCIAMENTO DE DOAÇÕES
// =========================
class DonationsManager {
  static async getConfig() {
    const response = await api("/donation-config");
    return response.success ? response.data : null;
  }

  static async updateConfig(config) {
    const response = await api("/donation-config", "POST", config);
    return response.success ? response.data : null;
  }

  static async getItems() {
    const response = await api("/donation-items");
    return response.success ? response.data : [];
  }

  static async createItem(itemData) {
    const response = await api("/donation-items", "POST", itemData);
    return response.success ? response.data : null;
  }

  static async updateItem(id, itemData) {
    const response = await api(`/donation-items/${id}`, "PUT", itemData);
    return response.success ? response.data : null;
  }

  static async deleteItem(id) {
    const response = await api(`/donation-items/${id}`, "DELETE");
    return response.success;
  }

  static renderDonationItem(item) {
    const urgenciaClass = item.urgencia.toLowerCase();
    const urgenciaText = item.urgencia.charAt(0) + item.urgencia.slice(1).toLowerCase();
    
    return `
      <div class="donation-item">
        <h3>${item.nome}</h3>
        <span class="urgencia ${urgenciaClass}">Urgência: ${urgenciaText}</span>
        <p><strong>Categoria:</strong> ${item.categoria}</p>
        <p>${item.descricao}</p>
      </div>
    `;
  }
}

// =========================
// UTILITÁRIOS
// =========================
class Utils {
  static showFeedback(elementId, message, type = 'info') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = message;
    element.className = `muted ${type}`;
    element.style.display = 'block';
    
    if (type === 'success') {
      setTimeout(() => {
        element.style.display = 'none';
      }, 3000);
    }
  }

  static hideFeedback(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
    }
  }

  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  static getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validateRequired(fields) {
    for (const field of fields) {
      if (!field.value.trim()) {
        field.focus();
        return false;
      }
    }
    return true;
  }
}

// =========================
// INICIALIZAÇÃO DE PÁGINAS
// =========================
class DonationManager {
  static showDonationForm(itemId, itemName) {
    document.getElementById('donation-item-id').value = itemId;
    document.getElementById('modal-item-name').textContent = `Doar: ${itemName}`;
    
    // Limpar formulário
    document.getElementById('donation-form').reset();
    document.getElementById('donation-item-id').value = itemId;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('donationModal'));
    modal.show();
  }
  
  static async submitDonation() {
    const form = document.getElementById('donation-form');
    const formData = new FormData(form);
    
    // Validação básica
    if (!formData.get('nome_usuario') || !formData.get('contato')) {
      alert('Por favor, preencha seu nome e contato.');
      return;
    }
    
    const donationData = {
      item_id: parseInt(formData.get('item_id')),
      nome_usuario: formData.get('nome_usuario').trim(),
      contato: formData.get('contato').trim(),
      quantidade: parseInt(formData.get('quantidade')) || 1,
      mensagem: formData.get('mensagem') || '',
      status: 'pendente',
      data_criacao: new Date().toISOString()
    };
    
    try {
      const response = await fetch(`${BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('donationModal'));
        modal.hide();
        
        // Mostrar mensagem de sucesso
        this.showSuccessMessage();
        
      } else {
        alert(result.message || 'Erro ao registrar doação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar doação:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  }
  
  static showSuccessMessage() {
    // Criar alert de sucesso
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
      <i class="bi bi-check-circle-fill me-2"></i>
      <strong>Obrigado pela sua doação!</strong><br>
      <small>Entraremos em contato em breve para combinar a entrega.</small>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
}

class PageInitializer {
  static async initHomePage() {
    try {
      // Carregar animais do backend
      const animals = await AnimalsManager.getAll();
      
      // Configurar filtros
      this.setupAnimalFilters(animals);
      
      // Renderizar grid inicial
      this.renderAnimalsGrid(animals);
      
      // Atualizar UI de autenticação
      updateUIBasedOnUser();
      
      // SINCRONIZAÇÃO: Verificar atualizações do admin
      this.setupAdminSync();
      
    } catch (error) {
      console.error('Erro ao inicializar página inicial:', error);
    }
  }
  
  static setupAdminSync() {
    // Verificar se houve atualização no admin
    const lastUpdate = localStorage.getItem('animals_updated');
    if (lastUpdate) {
      // Limpar flag de atualização
      localStorage.removeItem('animals_updated');
      
      // Recarregar dados do backend
      this.refreshAnimalsFromBackend();
    }
    
    // Escutar atualizações em outras abas (localStorage)
    window.addEventListener('storage', (e) => {
      if (e.key === 'animals_updated') {
        this.refreshAnimalsFromBackend();
      }
    });
    
    // Escutar eventos customizados de atualização
    window.addEventListener('animalsUpdated', (e) => {
      console.log('Evento de atualização recebido:', e.detail);
      this.refreshAnimalsFromBackend();
    });
  }
  
  static async refreshAnimalsFromBackend() {
    try {
      // Forçar recarga direta do backend (sem cache)
      const response = await fetch(`${BASE_URL}/animals?t=${Date.now()}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const animals = data.data;
        this.renderAnimalsGrid(animals);
        this.setupAnimalFilters(animals);
        
        // Limpar qualquer cache local
        localStorage.removeItem('cached_animals');
        
        console.log('Animais sincronizados com backend:', animals.length);
      }
    } catch (error) {
      console.error('Erro ao sincronizar animais:', error);
    }
  }
  
  static async forceRefreshAllTabs() {
    // Forçar atualização de todas as abas que dependem do backend
    const tabs = [
      { name: 'animals', manager: AnimalsManager },
      { name: 'lostpets', manager: LostPetsManager },
      { name: 'donations', manager: DonationsManager }
    ];
    
    for (const tab of tabs) {
      try {
        if (tab.manager && tab.manager.getAll) {
          const data = await tab.manager.getAll();
          console.log(`Tab ${tab.name} atualizada:`, data.length, 'itens');
        }
      } catch (error) {
        console.error(`Erro ao atualizar tab ${tab.name}:`, error);
      }
    }
  }

  static setupAnimalFilters(animals) {
    const buscaNome = document.getElementById('busca-nome');
    const filtroEspecie = document.getElementById('filtro-especie');
    const filtroPorte = document.getElementById('filtro-porte');
    const filtroIdade = document.getElementById('filtro-idade');
    const filtroGenero = document.getElementById('filtro-genero');

    const applyFilters = () => {
      const filters = {
        nome: buscaNome?.value || '',
        especie: filtroEspecie?.value || '',
        porte: filtroPorte?.value || '',
        idade: filtroIdade?.value || '',
        genero: filtroGenero?.value || ''
      };
      
      const filteredAnimals = AnimalsManager.filter(animals, filters);
      this.renderAnimalsGrid(filteredAnimals);
    };

    // Adicionar event listeners
    if (buscaNome) buscaNome.addEventListener('input', applyFilters);
    if (filtroEspecie) filtroEspecie.addEventListener('change', applyFilters);
    if (filtroPorte) filtroPorte.addEventListener('change', applyFilters);
    if (filtroIdade) filtroIdade.addEventListener('change', applyFilters);
    if (filtroGenero) filtroGenero.addEventListener('change', applyFilters);
  }

  static renderAnimalsGrid(animals) {
    const grid = document.querySelector('.animals-grid .grid');
    if (!grid) return;
    
    // Limpar conteúdo de forma segura sem quebrar estrutura
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    
    if (animals.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <h3>Nenhum animal encontrado</h3>
        <p>Tente ajustar os filtros ou volte mais tarde.</p>
      `;
      grid.appendChild(emptyState);
      return;
    }
    
    // Adicionar cards de forma segura
    animals.forEach(animal => {
      const cardHtml = AnimalsManager.renderAnimalCard(animal);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardHtml;
      grid.appendChild(tempDiv.firstElementChild);
    });
  }

  static async initLoginPage() {
    const form = document.getElementById('login-form');
    const feedback = document.getElementById('login-feedback');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const button = form.querySelector('button[type="submit"]');
      button.classList.add('loading');
      button.disabled = true;
      
      try {
        const formData = new FormData(form);
        const loginData = {
          email: formData.get('email'),
          senha: formData.get('senha')
        };
        
        const result = await AuthManager.login(loginData.email, loginData.senha);
        if (result.success) {
          Utils.showFeedback('login-feedback', 'Login realizado com sucesso!', 'success');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        } else {
          Utils.showFeedback('login-feedback', result.message || 'Erro ao fazer login', 'danger');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        Utils.showFeedback('login-feedback', 'Erro de conexão', 'danger');
      } finally {
        button.classList.remove('loading');
        button.disabled = false;
      }
    });
  }

  static async initDonationPage() {
    await this.loadDonationConfig();
    await this.loadDonationItems();
    
    // Escutar eventos de atualização do admin
    window.addEventListener('donationItemsUpdated', (e) => {
      console.log('Evento de atualização de itens recebido:', e.detail);
      this.loadDonationItems();
    });
    
    // Verificar se houve atualização no admin
    const lastUpdate = localStorage.getItem('donation_items_updated');
    if (lastUpdate) {
      // Limpar flag de atualização
      localStorage.removeItem('donation_items_updated');
      // Recarregar itens
      this.loadDonationItems();
    }
  }

  static async loadDonationConfig() {
    const container = document.getElementById('donation-money');
    if (!container) return;

    try {
      const response = await fetch(`${BASE_URL}/donation-config`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const config = data.data;
        container.innerHTML = `
          <div class="donation-qr">
            <h3 class="h4 mb-4">Doe via PIX</h3>
            ${config.qr_code ? `<img src="${config.qr_code}" alt="QR Code PIX" class="img-fluid mb-3" style="max-width: 200px;">` : ''}
            <div class="pix-info">
              <p class="mb-2"><strong>Chave PIX:</strong></p>
              <div class="input-group mb-3">
                <input type="text" class="form-control" value="${config.pix_key || ''}" readonly>
                <button class="btn btn-outline-primary" onclick="navigator.clipboard.writeText('${config.pix_key || ''}')">
                  <i class="bi bi-clipboard"></i>
                </button>
              </div>
              <p class="text-muted small">Clique para copiar a chave PIX</p>
            </div>
            ${config.instructions ? `<div class="instructions mt-4"><p class="text-muted">${config.instructions}</p></div>` : ''}
          </div>
        `;
      } else {
        container.innerHTML = '<p class="text-muted">Informações de doação não disponíveis no momento.</p>';
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de doação:', error);
      container.innerHTML = '<p class="text-danger">Erro ao carregar informações de doação.</p>';
    }
  }

  static async loadDonationItems() {
    const container = document.getElementById('donation-items');
    if (!container) return;

    try {
      const response = await fetch(`${BASE_URL}/donation-items`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Filtrar apenas itens ativos
        const activeItems = data.data.filter(item => item.ativo !== false);
        
        if (activeItems.length === 0) {
          container.innerHTML = `
            <div class="text-center py-5">
              <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
              <p class="text-muted">Nenhum item disponível para doação no momento.</p>
            </div>
          `;
          return;
        }

        container.innerHTML = `
          <div class="row justify-content-center g-4">
            ${activeItems.map(item => `
              <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm donation-item-card" style="cursor: pointer;" onclick="DonationManager.showDonationForm(${item.id}, '${item.nome.replace(/'/g, "\\'")}')">
                  <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-3">
                      <div class="item-icon me-3">
                        <i class="bi bi-box-seam text-primary fs-4"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="card-title mb-1">${item.nome}</h5>
                        <span class="badge ${this.getUrgencyBadgeClass(item.urgencia)}">
                          ${this.getUrgencyLabel(item.urgencia)}
                        </span>
                      </div>
                    </div>
                    <p class="card-text text-muted mb-3">${item.descricao || 'Item necessário para o abrigo'}</p>
                    <div class="item-meta mb-3">
                      <small class="text-muted">
                        <i class="bi bi-hash me-1"></i> Quantidade: ${item.quantidade || 1}
                        ${item.categoria ? `<br><i class="bi bi-tag me-1"></i> ${item.categoria}` : ''}
                      </small>
                    </div>
                    <div class="text-center">
                      <button class="btn btn-primary" onclick="event.stopPropagation(); DonationManager.showDonationForm(${item.id}, '${item.nome.replace(/'/g, "\\'")}')">
                        <i class="bi bi-heart me-2"></i>Doar este item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="text-center py-5">
            <i class="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
            <p class="text-muted">Nenhum item necessário no momento.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Erro ao carregar itens de doação:', error);
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-exclamation-circle fs-1 text-danger d-block mb-3"></i>
          <p class="text-danger">Erro ao carregar itens necessários.</p>
        </div>
      `;
    }
  }

  static getUrgencyBadgeClass(urgency) {
    switch (urgency) {
      case 'alta': return 'bg-danger';
      case 'média': return 'bg-warning';
      case 'baixa': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  static getUrgencyLabel(urgency) {
    switch (urgency) {
      case 'alta': return 'Urgente';
      case 'média': return 'Média';
      case 'baixa': return 'Baixa';
      default: return 'Normal';
    }
  }

  static async initLostPetsPage() {
    await this.loadLostPets();
    this.setupLostPetsFilters();
  }

  static async loadLostPets() {
    const container = document.querySelector('.lost-pets-grid');
    const countElement = document.getElementById('results-count');
    const updateElement = document.getElementById('last-update');
    
    if (!container) return;

    try {
      const response = await fetch(`${BASE_URL}/lost-pets`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        const lostPets = data.data;
        
        // Atualizar contador
        if (countElement) countElement.textContent = lostPets.length;
        
        // Atualizar data
        if (updateElement) updateElement.textContent = new Date().toLocaleString('pt-BR');
        
        if (lostPets.length === 0) {
          container.innerHTML = `
            <div class="text-center py-5">
              <i class="bi bi-search text-muted fs-1 mb-3"></i>
              <h4>Nenhum registro encontrado</h4>
              <p class="text-muted">Não há animais perdidos ou encontrados no momento.</p>
            </div>
          `;
          return;
        }

        container.innerHTML = '<div class="row g-4">' + 
          lostPets.map(pet => `
            <div class="col-md-6 col-lg-4">
              <div class="card h-100 border-0 shadow-sm lost-pet-card">
                <div class="position-relative">
                  <img src="${pet.imagem || 'https://source.unsplash.com/400x300/?' + pet.especie.toLowerCase() + ',lost'}" 
                       alt="${pet.nome}" class="card-img-top">
                  <span class="position-absolute top-0 end-0 m-2 badge ${pet.tipo === 'Perdido' ? 'bg-warning' : 'bg-success'}">
                    ${pet.tipo}
                  </span>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${pet.nome}</h5>
                  <div class="pet-info mb-2">
                    <small class="text-muted">
                      <i class="bi bi-tag"></i> ${pet.especie} 
                      ${pet.raca ? `· ${pet.raca}` : ''}
                      ${pet.porte ? `· ${pet.porte}` : ''}
                    </small>
                  </div>
                  <p class="card-text small">${pet.descricao || 'Sem descrição disponível'}</p>
                  <div class="pet-meta">
                    <small class="text-muted">
                      <i class="bi bi-calendar"></i> ${pet.data_desaparecimento || 'Data não informada'}
                      ${pet.local ? `<br><i class="bi bi-geo-alt"></i> ${pet.local}` : ''}
                    </small>
                  </div>
                  ${pet.contato ? `
                    <div class="contact-info mt-3">
                      <button class="btn btn-sm btn-outline-primary" onclick="navigator.clipboard.writeText('${pet.contato}')">
                        <i class="bi bi-telephone"></i> Copiar Contato
                      </button>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('') + '</div>';
      } else {
        container.innerHTML = '<p class="text-danger text-center">Erro ao carregar registros.</p>';
      }
    } catch (error) {
      console.error('Erro ao carregar animais perdidos:', error);
      container.innerHTML = '<p class="text-danger text-center">Erro ao carregar registros.</p>';
    }
  }

  static setupLostPetsFilters() {
    const searchInput = document.getElementById('lost-search');
    const especieFilter = document.getElementById('lost-especie');
    const tipoFilter = document.getElementById('lost-tipo');
    const dataFilter = document.getElementById('lost-data');
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');

    const applyFilters = async () => {
      const filters = {
        search: searchInput?.value || '',
        especie: especieFilter?.value || '',
        tipo: tipoFilter?.value || '',
        data: dataFilter?.value || ''
      };

      try {
        const response = await fetch(`${BASE_URL}/lost-pets`);
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          let filteredPets = data.data;

          // Aplicar filtros
          if (filters.search) {
            filteredPets = filteredPets.filter(pet => 
              pet.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
              (pet.descricao && pet.descricao.toLowerCase().includes(filters.search.toLowerCase()))
            );
          }

          if (filters.especie) {
            filteredPets = filteredPets.filter(pet => pet.especie === filters.especie);
          }

          if (filters.tipo) {
            filteredPets = filteredPets.filter(pet => pet.tipo === filters.tipo);
          }

          if (filters.data) {
            const daysAgo = parseInt(filters.data);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
            
            filteredPets = filteredPets.filter(pet => {
              const petDate = new Date(pet.data_desaparecimento);
              return petDate >= cutoffDate;
            });
          }

          // Renderizar resultados filtrados
          this.renderFilteredLostPets(filteredPets);
        }
      } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
      }
    };

    const clearFilters = () => {
      if (searchInput) searchInput.value = '';
      if (especieFilter) especieFilter.value = '';
      if (tipoFilter) tipoFilter.value = '';
      if (dataFilter) dataFilter.value = '';
      
      this.loadLostPets();
    };

    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    
    // Aplicar filtros ao digitar na busca
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchInput.timeout);
        searchInput.timeout = setTimeout(applyFilters, 500);
      });
    }
  }

  static renderFilteredLostPets(lostPets) {
    const container = document.querySelector('.lost-pets-grid');
    const countElement = document.getElementById('results-count');
    
    if (!container) return;

    // Atualizar contador
    if (countElement) countElement.textContent = lostPets.length;

    if (lostPets.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-search text-muted fs-1 mb-3"></i>
          <h4>Nenhum resultado encontrado</h4>
          <p class="text-muted">Tente ajustar os filtros para encontrar o que procura.</p>
        </div>
      `;
      return;
    }

    // Reutilizar a mesma lógica de renderização do loadLostPets
    this.loadLostPets();
  }

  static async initRegisterPage() {
    const form = document.getElementById('register-form');
    const feedback = document.getElementById('register-feedback');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('senha').value;
      const confirmSenha = document.getElementById('confirm-senha').value;
      
      // Validações
      if (!Utils.validateRequired([nome, email, senha, confirmSenha])) {
        Utils.showFeedback('register-feedback', 'Preencha todos os campos', 'error');
        return;
      }
      
      if (!Utils.validateEmail(email)) {
        Utils.showFeedback('register-feedback', 'Email inválido', 'error');
        return;
      }
      
      if (senha !== confirmSenha) {
        Utils.showFeedback('register-feedback', 'As senhas não coincidem', 'error');
        return;
      }
      
      if (senha.length < 6) {
        Utils.showFeedback('register-feedback', 'A senha deve ter pelo menos 6 caracteres', 'error');
        return;
      }
      
      Utils.showFeedback('register-feedback', 'Cadastrando...', 'info');
      
      try {
        const result = await AuthManager.register({ nome, email, senha });
        
        if (result.success) {
          Utils.showFeedback('register-feedback', 'Cadastro realizado! Redirecionando para o login...', 'success');
          
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
        } else {
          Utils.showFeedback('register-feedback', result.message || 'Erro no cadastro', 'error');
        }
      } catch (error) {
        console.error('Erro no cadastro:', error);
        Utils.showFeedback('register-feedback', 'Erro de conexão. Tente novamente.', 'error');
      }
    });
  }

  static async initAnimalPage() {
    const animalId = Utils.getQueryParam('id');
    if (!animalId) {
      window.location.href = 'index.html';
      return;
    }
    
    try {
      const animal = await AnimalsManager.getById(animalId);
      if (!animal) {
        window.location.href = 'index.html';
        return;
      }
      
      this.renderAnimalDetails(animal);
    } catch (error) {
      console.error('Erro ao carregar animal:', error);
      window.location.href = 'index.html';
    }
  }

  static renderAnimalDetails(animal) {
    const container = document.querySelector('.animal-content');
    if (!container) return;
    
    container.innerHTML = `
      <div class="animal-header">
        <img src="${animal.imagem || 'https://source.unsplash.com/600x400/?pet'}" alt="${animal.nome}">
        <div class="animal-info">
          <h1 class="animal-nome">${animal.nome}</h1>
          <div class="animal-meta">
            <span>${animal.especie}</span> · 
            <span>${animal.porte}</span> · 
            <span>${animal.idade}</span> · 
            <span>${animal.genero}</span>
          </div>
          <div class="animal-status">${animal.status}</div>
        </div>
      </div>
      
      <div class="animal-description">
        <h2>Sobre ${animal.nome}</h2>
        <p>${animal.descricao}</p>
      </div>
      
      <div class="animal-actions">
        <a href="formulario.html?animal=${animal.id}" class="btn btn-primary btn-lg">Quero adotar!</a>
        <a href="index.html#animais" class="btn btn-secondary">Voltar para lista</a>
      </div>
    `;
  }

  static async initDoarPage() {
    try {
      // Carregar configuração de doação
      const config = await DonationsManager.getConfig();
      this.renderDonationConfig(config);
      
      // Carregar itens de doação
      const items = await DonationsManager.getItems();
      this.renderDonationItems(items);
      
      // Configurar abas
      this.setupDonationTabs();
      
    } catch (error) {
      console.error('Erro ao inicializar página de doações:', error);
    }
  }

  static renderDonationConfig(config) {
    const container = document.getElementById('donation-money');
    if (!container || !config) return;
    
    container.innerHTML = `
      <div class="donation-qr">
        <h2>Doe via PIX</h2>
        ${config.qr_code ? `<img src="${config.qr_code}" alt="QR Code PIX">` : ''}
        <p><strong>Chave PIX:</strong> ${config.pix_key}</p>
        <p>${config.message}</p>
      </div>
    `;
  }

  static renderDonationItems(items) {
    const container = document.getElementById('donation-items');
    if (!container) return;
    
    if (items.length === 0) {
      container.innerHTML = '<p class="muted">Nenhum item necessário no momento.</p>';
      return;
    }
    
    container.innerHTML = `
      <div class="donation-items">
        ${items.map(item => DonationsManager.renderDonationItem(item)).join('')}
      </div>
    `;
  }

  static setupDonationTabs() {
    const tabs = document.querySelectorAll('.donation-tab');
    const contents = document.querySelectorAll('.donation-content');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remover classes ativas
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        // Adicionar classes ativas
        tab.classList.add('active');
        if (contents[index]) {
          contents[index].classList.add('active');
        }
      });
    });
  }

  static async initLostPetsPage() {
    try {
      const lostPets = await LostPetsManager.getAll();
      this.renderLostPetsGrid(lostPets);
      this.setupLostPetsFilters(lostPets);
    } catch (error) {
      console.error('Erro ao inicializar página de animais perdidos:', error);
    }
  }

  static setupLostPetsFilters(lostPets) {
    const searchInput = document.getElementById('lost-search');
    const especieFilter = document.getElementById('lost-especie');
    const tipoFilter = document.getElementById('lost-tipo');
    
    const applyFilters = () => {
      const searchTerm = searchInput?.value.toLowerCase() || '';
      const especie = especieFilter?.value || '';
      const tipo = tipoFilter?.value || '';
      
      const filtered = lostPets.filter(pet => {
        const nameMatch = !searchTerm || 
          (pet.nome && pet.nome.toLowerCase().includes(searchTerm)) ||
          (pet.descricao && pet.descricao.toLowerCase().includes(searchTerm));
        
        const especieMatch = !especie || pet.especie === especie;
        const tipoMatch = !tipo || pet.tipo === tipo;
        
        return nameMatch && especieMatch && tipoMatch;
      });
      
      this.renderLostPetsGrid(filtered);
    };
    
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (especieFilter) especieFilter.addEventListener('change', applyFilters);
    if (tipoFilter) tipoFilter.addEventListener('change', applyFilters);
  }

  static renderLostPetsGrid(lostPets) {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    
    // Limpar conteúdo de forma segura
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    
    if (lostPets.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <h3>Nenhum registro encontrado</h3>
        <p>Não há animais perdidos ou encontrados no momento.</p>
      `;
      grid.appendChild(emptyState);
      return;
    }
    
    // Adicionar cards de forma segura
    lostPets.forEach(pet => {
      const cardHtml = LostPetsManager.renderLostPetCard(pet);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cardHtml;
      grid.appendChild(tempDiv.firstElementChild);
    });
  }

  static async initAdminPage() {
    // Verificar se usuário é admin
    if (!AuthManager.isAdmin()) {
      window.location.href = 'index.html';
      return;
    }
    
    this.setupAdminTabs();
    this.loadAdminData();
  }

  static setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-nav button');
    const sections = document.querySelectorAll('.admin-section');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Remover classes ativas
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Adicionar classes ativas
        tab.classList.add('active');
        if (sections[index]) {
          sections[index].classList.add('active');
        }
      });
    });
  }

  static async loadAdminData() {
    // Carregar dados para cada seção admin
    await this.loadAdminAnimals();
    await this.loadAdminLostPets();
    await this.loadAdminDonations();
  }

  static async loadAdminAnimals() {
    try {
      const animals = await AnimalsManager.getAll();
      this.renderAdminAnimalsTable(animals);
      this.setupAdminAnimalForm();
    } catch (error) {
      console.error('Erro ao carregar animais admin:', error);
    }
  }

  static renderAdminAnimalsTable(animals) {
    const tableBody = document.querySelector('#admin-animals-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = animals.map(animal => `
      <tr>
        <td>${animal.id}</td>
        <td>${animal.nome}</td>
        <td>${animal.especie}</td>
        <td>${animal.porte}</td>
        <td>${animal.idade}</td>
        <td>${animal.status}</td>
        <td>
          <div class="admin-actions">
            <button class="btn btn-sm btn-secondary" onclick="AdminUI.editAnimal(${animal.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="AdminUI.deleteAnimal(${animal.id})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  static setupAdminAnimalForm() {
    const form = document.getElementById('admin-animal-form');
    if (!form) return;
    
    // Remover listeners existentes para evitar duplicação
    // Usar método mais seguro para não que estrutura das abas
    const newForm = form.cloneNode(true);
    const parent = form.parentNode;
    if (parent) {
      parent.replaceChild(newForm, form);
    } else {
      console.warn('Parent do formulário não encontrado');
      return;
    }
    
    newForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const button = newForm.querySelector('button[type="submit"]');
      button.classList.add('loading');
      button.disabled = true;
      
      try {
        const formData = new FormData(newForm);
        const animalData = Object.fromEntries(formData.entries());
        
        let result;
        const editId = newForm.dataset.editId;
        
        if (editId) {
          // Modo edição
          result = await AnimalsManager.update(parseInt(editId), animalData);
          if (result) {
            Utils.showFeedback('admin-feedback', 'Animal atualizado com sucesso!', 'success');
            delete newForm.dataset.editId;
            
            // Restaurar botão para modo criação
            button.innerHTML = '<span class="btn-text"><i class="bi bi-plus-circle me-2"></i>Adicionar Animal</span><span class="loading-spinner spinner-border spinner-border-sm" role="status"></span>';
          } else {
            Utils.showFeedback('admin-feedback', 'Erro ao atualizar animal', 'danger');
          }
        } else {
          // Modo criação
          result = await AnimalsManager.create(animalData);
          if (result) {
            Utils.showFeedback('admin-feedback', 'Animal adicionado com sucesso!', 'success');
            newForm.reset();
          } else {
            Utils.showFeedback('admin-feedback', 'Erro ao adicionar animal', 'danger');
          }
        }
        
        if (result) {
          // Atualizar dados do admin
          await this.loadAdminData();
          
          // SINCRONIZAÇÃO: Atualizar frontend público
          this.syncAnimalsToPublic();
        }
        
      } catch (error) {
        console.error('Erro ao salvar animal:', error);
        Utils.showFeedback('admin-feedback', 'Erro de conexão', 'danger');
      } finally {
        button.classList.remove('loading');
        button.disabled = false;
      }
    });
  }
  
  static syncAnimalsToPublic() {
    // Notificar outras páginas que os dados foram atualizados
    const timestamp = Date.now().toString();
    localStorage.setItem('animals_updated', timestamp);
    
    // Forçar atualização imediata se estiver na home
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      setTimeout(() => {
        if (typeof PageInitializer !== 'undefined' && PageInitializer.initHomePage) {
          PageInitializer.initHomePage();
        }
      }, 100);
    }
    
    // Disparar evento customizado para outras abas escutarem
    window.dispatchEvent(new CustomEvent('animalsUpdated', {
      detail: { timestamp: parseInt(timestamp) }
    }));
    
    console.log('Sincronização disparada - Admin para Frontend Público');
  }
  
  static async editAnimal(id) {
    try {
      const animal = await AnimalsManager.getById(id);
      if (!animal) {
        Utils.showFeedback('admin-feedback', 'Animal não encontrado', 'danger');
        return;
      }
      
      // Preencher formulário com dados do animal
      const form = document.getElementById('admin-animal-form');
      if (!form) return;
      
      form.nome.value = animal.nome || '';
      form.especie.value = animal.especie || 'Cachorro';
      form.porte.value = animal.porte || 'Médio';
      form.idade.value = animal.idade || 'Adulto';
      form.genero.value = animal.genero || 'Macho';
      form.status.value = animal.status || 'Disponível';
      form.descricao.value = animal.descricao || '';
      form.imagem.value = animal.imagem || '';
      
      // Adicionar ID ao formulário para edição
      form.dataset.editId = id;
      
      // Mudar texto do botão
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<span class="btn-text"><i class="bi bi-save me-2"></i>Atualizar Animal</span><span class="loading-spinner spinner-border spinner-border-sm" role="status"></span>';
      
      // Rolar para o formulário
      form.scrollIntoView({ behavior: 'smooth' });
      
    } catch (error) {
      console.error('Erro ao editar animal:', error);
      Utils.showFeedback('admin-feedback', 'Erro ao carregar animal', 'danger');
    }
  }
  
  static async deleteAnimal(id) {
    if (!confirm('Tem certeza que deseja excluir este animal? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const result = await AnimalsManager.delete(id);
      if (result) {
        Utils.showFeedback('admin-feedback', 'Animal excluído com sucesso!', 'success');
        await this.loadAdminData();
        this.syncAnimalsToPublic();
      } else {
        Utils.showFeedback('admin-feedback', 'Erro ao excluir animal', 'danger');
      }
    } catch (error) {
      console.error('Erro ao excluir animal:', error);
      Utils.showFeedback('admin-feedback', 'Erro de conexão', 'danger');
    }
  }

  static async loadAdminLostPets() {
    // Implementar similar ao loadAdminAnimals
  }

  static async loadAdminDonations() {
    // Implementar similar ao loadAdminAnimals
  }
}

// =========================
// UI ADMINISTRATIVA
// =========================
class AdminUI {
  static async editAnimal(id) {
    const animal = await AnimalsManager.getById(id);
    if (!animal) return;
    
    // Preencher formulário com dados do animal
    const form = document.getElementById('admin-animal-form');
    if (form) {
      form.querySelector('[name="nome"]').value = animal.nome;
      form.querySelector('[name="especie"]').value = animal.especie;
      form.querySelector('[name="porte"]').value = animal.porte;
      form.querySelector('[name="idade"]').value = animal.idade;
      form.querySelector('[name="genero"]').value = animal.genero;
      form.querySelector('[name="descricao"]').value = animal.descricao;
      form.querySelector('[name="status"]').value = animal.status;
      form.querySelector('[name="imagem"]').value = animal.imagem || '';
      
      // Mudar para modo de edição
      form.dataset.editId = id;
      form.querySelector('button[type="submit"]').textContent = 'Atualizar Animal';
    }
  }

  static async deleteAnimal(id) {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return;
    
    try {
      const success = await AnimalsManager.delete(id);
      if (success) {
        Utils.showFeedback('admin-feedback', 'Animal excluído com sucesso!', 'success');
        await PageInitializer.loadAdminAnimals(); // Recarregar tabela
      } else {
        Utils.showFeedback('admin-feedback', 'Erro ao excluir animal', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir animal:', error);
      Utils.showFeedback('admin-feedback', 'Erro de conexão', 'error');
    }
  }
}

// =========================
// MENU MOBILE
// =========================
class MobileMenu {
  static init() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (!toggle || !nav) return;
    
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('aberto');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('aberto');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// =========================
// INICIALIZAÇÃO GLOBAL
// =========================
document.addEventListener('DOMContentLoaded', function() {
  // Atualizar interface baseada no usuário
  updateUIBasedOnUser();
  
  // Inicializar menu mobile
  MobileMenu.init();
  
  // Detectar página atual e inicializar
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
  
  switch (currentPage) {
    case 'index':
      PageInitializer.initHomePage();
      break;
    case 'login':
      PageInitializer.initLoginPage();
      break;
    case 'register':
      PageInitializer.initRegisterPage();
      break;
    case 'animal':
      PageInitializer.initAnimalPage();
      break;
    case 'doar':
      PageInitializer.initDoarPage();
      break;
    case 'lost-pets':
      PageInitializer.initLostPetsPage();
      break;
    case 'admin':
      PageInitializer.initAdminPage();
      break;
  }
});

// =========================
// EXPORT PARA ESCOPO GLOBAL
// =========================
window.AuthManager = AuthManager;
window.AnimalsManager = AnimalsManager;
window.LostPetsManager = LostPetsManager;
window.DonationsManager = DonationsManager;
window.Utils = Utils;
window.PageInitializer = PageInitializer;
window.AdminUI = AdminUI;
window.MobileMenu = MobileMenu;
window.updateUIBasedOnUser = updateUIBasedOnUser;
