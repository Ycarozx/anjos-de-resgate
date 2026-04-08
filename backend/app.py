"""
Backend Refatorado - Plataforma de Adoção de Animais
Compatível 100% com o frontend existente
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# =========================
# ARQUIVOS DE DADOS
# =========================
DATA_DIR = "data"
USERS_FILE = os.path.join(DATA_DIR, "users.json")
ANIMALS_FILE = os.path.join(DATA_DIR, "animals.json")
LOST_PETS_FILE = os.path.join(DATA_DIR, "lost_pets.json")
DONATION_CONFIG_FILE = os.path.join(DATA_DIR, "donation_config.json")
DONATION_ITEMS_FILE = os.path.join(DATA_DIR, "donation_items.json")
DONATIONS_FILE = os.path.join(DATA_DIR, "donations.json")

# =========================
# FUNÇÕES AUXILIARES
# =========================
def ensure_data_dir():
    """Garante que o diretório de dados existe"""
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)

def load_data(file_path, default_data=None):
    """Carrega dados do arquivo JSON com fallback para dados padrão"""
    ensure_data_dir()
    if not os.path.exists(file_path):
        if default_data is not None:
            save_data(file_path, default_data)
            return default_data
        return []
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        if default_data is not None:
            save_data(file_path, default_data)
            return default_data
        return []

def save_data(file_path, data):
    """Salva dados no arquivo JSON"""
    ensure_data_dir()
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def generate_id(items):
    """Gera próximo ID baseado nos itens existentes"""
    if not items:
        return 1
    return max(item.get("id", 0) for item in items) + 1

def create_admin_user():
    """Cria usuário administrador padrão se não existir"""
    users = load_data(USERS_FILE, [])
    admin_exists = any(user.get("email") == "admin@admin.com" for user in users)
    
    if not admin_exists:
        admin = {
            "nome": "Administrador",
            "email": "admin@admin.com",
            "senha": "123456",
            "isAdmin": True
        }
        users.append(admin)
        save_data(USERS_FILE, users)
        print("Usuário administrador criado: admin@admin.com / 123456")

# =========================
# DADOS INICIAIS (SEED)
# =========================
DEFAULT_ANIMALS = [
    {
        "id": 1,
        "nome": "Luna",
        "especie": "Cachorro",
        "porte": "Médio",
        "idade": "2 anos",
        "genero": "Fêmea",
        "descricao": "Luna é uma cachorrinha muito dócil e brincalhona, adora crianças e outros animais. Perfeita para famílias ativas.",
        "imagem": "https://images.unsplash.com/photo-1583337130417-ab78e3d0897b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "status": "Disponível"
    },
    {
        "id": 2,
        "nome": "Thor",
        "especie": "Cachorro",
        "porte": "Grande",
        "idade": "3 anos",
        "genero": "Macho",
        "descricao": "Thor é um gigante gentil. Adora passear e precisa de um quintal grande. Muito leal e protetor.",
        "imagem": "https://images.unsplash.com/photo-1588943211342-08678df11793?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "status": "Disponível"
    },
    {
        "id": 3,
        "nome": "Miau",
        "especie": "Gato",
        "porte": "Pequeno",
        "idade": "1 ano",
        "genero": "Fêmea",
        "descricao": "Miau é uma gatinha independente, mas adora um carinho. Ideal para quem busca uma companhia tranquila.",
        "imagem": "https://images.unsplash.com/photo-1574158622682-e407696c1ffc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "status": "Disponível"
    },
    {
        "id": 4,
        "nome": "Rex",
        "especie": "Cachorro",
        "porte": "Médio",
        "idade": "5 anos",
        "genero": "Macho",
        "descricao": "Rex é um cachorro experiente, calmo e muito obediente. Perfeito para pessoas mais velhas ou que buscam um companheiro tranquilo.",
        "imagem": "https://images.unsplash.com/photo-1596492784531-ed8f98266854?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "status": "Disponível"
    },
    {
        "id": 5,
        "nome": "Amora",
        "especie": "Gato",
        "porte": "Pequeno",
        "idade": "6 meses",
        "genero": "Fêmea",
        "descricao": "Amora é uma filhote de gato cheia de energia e curiosidade. Adora explorar e brincar com bolinhas de papel.",
        "imagem": "https://images.unsplash.com/photo-1514888686040-ab7a662b21c4?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "status": "Disponível"
    }
]

DEFAULT_DONATION_ITEMS = [
    {
        "id": 1,
        "nome": "Ração para cães 20kg",
        "categoria": "Ração e Alimentação",
        "urgencia": "alta",
        "descricao": "Ração para cães adultos de porte médio/grande. Preferência por marcas de boa qualidade.",
        "ativo": True
    },
    {
        "id": 2,
        "nome": "Cobertores e mantas",
        "categoria": "Outros",
        "urgencia": "média",
        "descricao": "Cobertores e mantas para aquecer os animais, especialmente no inverno.",
        "ativo": True
    },
    {
        "id": 3,
        "nome": "Medicamentos veterinários",
        "categoria": "Medicamentos",
        "urgencia": "alta",
        "descricao": "Vermífugos, antipulgas, antibióticos (com prescrição), analgésicos.",
        "ativo": True
    },
    {
        "id": 4,
        "nome": "Produtos de limpeza",
        "categoria": "Produtos de Limpeza",
        "urgencia": "média",
        "descricao": "Água sanitária, desinfetante, sabão em pó, luvas, sacos de lixo.",
        "ativo": True
    },
    {
        "id": 5,
        "nome": "Brinquedos interativos",
        "categoria": "Brinquedos",
        "urgencia": "baixa",
        "descricao": "Bolinhas, arranhadores, mordedores para enriquecimento ambiental.",
        "ativo": False
    }
]

DEFAULT_DONATION_CONFIG = {
    "pix_key": "admin@ong.org",
    "qr_code": "",
    "message": "Sua doação faz a diferença!"
}

DEFAULT_DONATIONS = []

DEFAULT_LOST_PETS = [
    {
        "id": 1,
        "nome": "Belinha",
        "especie": "Cachorro",
        "tipo": "perdido",
        "local": "Parque da Cidade, São Paulo",
        "data": "2023-10-20",
        "contato": "(11) 98765-4321",
        "descricao": "Cachorra de porte pequeno, com coleira rosa. Muito dócil, mas assustada. Atende por Belinha."
    },
    {
        "id": 2,
        "especie": "Gato",
        "tipo": "encontrado",
        "local": "Rua das Flores, Campinas",
        "data": "2023-11-01",
        "contato": "email@email.com",
        "descricao": "Gato preto, sem coleira, aparenta ser jovem. Muito manso. Encontrado próximo à praça."
    }
]

# =========================
# INICIALIZAÇÃO
# =========================
create_admin_user()

# =========================
# ROTAS PRINCIPAIS
# =========================

@app.route("/")
def home():
    """Rota de verificação do backend"""
    return jsonify({
        "success": True,
        "message": "Backend funcionando corretamente",
        "version": "2.0.0"
    })

# =========================
# AUTENTICAÇÃO
# =========================

@app.route("/login", methods=["POST"])
def login():
    """Login de usuário"""
    try:
        data = request.get_json()
        
        if not data or not data.get("email") or not data.get("senha"):
            return jsonify({
                "success": False,
                "message": "Email e senha são obrigatórios"
            }), 400
        
        email = data.get("email").strip().lower()
        senha = data.get("senha")
        
        users = load_data(USERS_FILE, [])
        
        # Buscar usuário
        user_found = None
        for user in users:
            if user.get("email", "").strip().lower() == email and user.get("senha") == senha:
                user_found = user
                break
        
        if user_found:
            return jsonify({
                "success": True,
                "message": "Login realizado com sucesso",
                "user": {
                    "nome": user_found.get("nome"),
                    "email": user_found.get("email"),
                    "senha": user_found.get("senha"),
                    "isAdmin": user_found.get("isAdmin", False)
                }
            })
        else:
            return jsonify({
                "success": False,
                "message": "Email ou senha incorretos"
            }), 401
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro interno no servidor"
        }), 500

@app.route("/register", methods=["POST"])
def register():
    """Cadastro de novo usuário"""
    try:
        data = request.get_json()
        
        if not data or not all([data.get("nome"), data.get("email"), data.get("senha")]):
            return jsonify({
                "success": False,
                "message": "Nome, email e senha são obrigatórios"
            }), 400
        
        users = load_data(USERS_FILE, [])
        
        # Verificar duplicidade de email
        email = data.get("email").strip().lower()
        if any(user.get("email", "").strip().lower() == email for user in users):
            return jsonify({
                "success": False,
                "message": "Email já cadastrado"
            }), 400
        
        new_user = {
            "nome": data.get("nome").strip(),
            "email": email,
            "senha": data.get("senha"),
            "isAdmin": False
        }
        
        users.append(new_user)
        save_data(USERS_FILE, users)
        
        return jsonify({
            "success": True,
            "message": "Usuário cadastrado com sucesso",
            "user": new_user
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao cadastrar usuário"
        }), 500

# =========================
# ANIMAIS
# =========================

@app.route("/animals", methods=["GET"])
def get_animals():
    """Lista todos os animais"""
    try:
        animals = load_data(ANIMALS_FILE, DEFAULT_ANIMALS)
        return jsonify({
            "success": True,
            "data": animals
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao carregar animais"
        }), 500

@app.route("/animals", methods=["POST"])
def add_animal():
    """Adiciona novo animal"""
    try:
        data = request.get_json()
        
        if not data or not data.get("nome"):
            return jsonify({
                "success": False,
                "message": "Nome do animal é obrigatório"
            }), 400
        
        animals = load_data(ANIMALS_FILE, DEFAULT_ANIMALS)
        
        new_animal = {
            "id": generate_id(animals),
            "nome": data.get("nome").strip(),
            "especie": data.get("especie", "Cachorro"),
            "porte": data.get("porte", "Médio"),
            "idade": data.get("idade", "Adulto"),
            "genero": data.get("genero", "Macho"),
            "descricao": data.get("descricao", ""),
            "imagem": data.get("imagem", "https://source.unsplash.com/600x400/?pet"),
            "status": data.get("status", "Disponível")
        }
        
        animals.append(new_animal)
        save_data(ANIMALS_FILE, animals)
        
        return jsonify({
            "success": True,
            "message": "Animal adicionado com sucesso",
            "data": new_animal
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao adicionar animal"
        }), 500

@app.route("/animals/<int:animal_id>", methods=["PUT"])
def update_animal(animal_id):
    """Atualiza animal existente"""
    try:
        data = request.get_json()
        animals = load_data(ANIMALS_FILE, DEFAULT_ANIMALS)
        
        # Encontrar animal
        animal_index = None
        for i, animal in enumerate(animals):
            if animal.get("id") == animal_id:
                animal_index = i
                break
        
        if animal_index is None:
            return jsonify({
                "success": False,
                "message": "Animal não encontrado"
            }), 404
        
        # Atualizar campos
        updated_animal = animals[animal_index].copy()
        if "nome" in data:
            updated_animal["nome"] = data["nome"].strip()
        if "especie" in data:
            updated_animal["especie"] = data["especie"]
        if "porte" in data:
            updated_animal["porte"] = data["porte"]
        if "idade" in data:
            updated_animal["idade"] = data["idade"]
        if "genero" in data:
            updated_animal["genero"] = data["genero"]
        if "descricao" in data:
            updated_animal["descricao"] = data["descricao"]
        if "imagem" in data:
            updated_animal["imagem"] = data["imagem"]
        if "status" in data:
            updated_animal["status"] = data["status"]
        
        animals[animal_index] = updated_animal
        save_data(ANIMALS_FILE, animals)
        
        return jsonify({
            "success": True,
            "message": "Animal atualizado com sucesso",
            "data": updated_animal
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao atualizar animal"
        }), 500

@app.route("/animals/<int:animal_id>", methods=["DELETE"])
def delete_animal(animal_id):
    """Remove animal"""
    try:
        animals = load_data(ANIMALS_FILE, DEFAULT_ANIMALS)
        
        # Remover animal
        original_length = len(animals)
        animals = [animal for animal in animals if animal.get("id") != animal_id]
        
        if len(animals) == original_length:
            return jsonify({
                "success": False,
                "message": "Animal não encontrado"
            }), 404
        
        save_data(ANIMALS_FILE, animals)
        
        return jsonify({
            "success": True,
            "message": "Animal removido com sucesso"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao remover animal"
        }), 500

# =========================
# ANIMAIS PERDIDOS
# =========================

@app.route("/lost-pets", methods=["GET"])
def get_lost_pets():
    """Lista todos os animais perdidos/encontrados"""
    try:
        lost_pets = load_data(LOST_PETS_FILE, DEFAULT_LOST_PETS)
        return jsonify({
            "success": True,
            "data": lost_pets
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao carregar animais perdidos"
        }), 500

@app.route("/lost-pets", methods=["POST"])
def add_lost_pet():
    """Adiciona novo registro de animal perdido/encontrado"""
    try:
        data = request.get_json()
        
        if not data or not data.get("especie"):
            return jsonify({
                "success": False,
                "message": "Espécie é obrigatória"
            }), 400
        
        lost_pets = load_data(LOST_PETS_FILE, DEFAULT_LOST_PETS)
        
        new_lost_pet = {
            "id": generate_id(lost_pets),
            "nome": data.get("nome", ""),
            "especie": data.get("especie"),
            "tipo": data.get("tipo", "perdido"),
            "local": data.get("local", ""),
            "data": data.get("data", datetime.now().strftime("%Y-%m-%d")),
            "contato": data.get("contato", ""),
            "descricao": data.get("descricao", "")
        }
        
        lost_pets.append(new_lost_pet)
        save_data(LOST_PETS_FILE, lost_pets)
        
        return jsonify({
            "success": True,
            "message": "Registro adicionado com sucesso",
            "data": new_lost_pet
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao adicionar registro"
        }), 500

@app.route("/lost-pets/<int:pet_id>", methods=["PUT"])
def update_lost_pet(pet_id):
    """Atualiza registro de animal perdido/encontrado"""
    try:
        data = request.get_json()
        lost_pets = load_data(LOST_PETS_FILE, DEFAULT_LOST_PETS)
        
        # Encontrar registro
        pet_index = None
        for i, pet in enumerate(lost_pets):
            if pet.get("id") == pet_id:
                pet_index = i
                break
        
        if pet_index is None:
            return jsonify({
                "success": False,
                "message": "Registro não encontrado"
            }), 404
        
        # Atualizar campos
        updated_pet = lost_pets[pet_index].copy()
        if "nome" in data:
            updated_pet["nome"] = data["nome"].strip()
        if "especie" in data:
            updated_pet["especie"] = data["especie"]
        if "tipo" in data:
            updated_pet["tipo"] = data["tipo"]
        if "local" in data:
            updated_pet["local"] = data["local"]
        if "data" in data:
            updated_pet["data"] = data["data"]
        if "contato" in data:
            updated_pet["contato"] = data["contato"]
        if "descricao" in data:
            updated_pet["descricao"] = data["descricao"]
        
        lost_pets[pet_index] = updated_pet
        save_data(LOST_PETS_FILE, lost_pets)
        
        return jsonify({
            "success": True,
            "message": "Registro atualizado com sucesso",
            "data": updated_pet
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao atualizar registro"
        }), 500

@app.route("/lost-pets/<int:pet_id>", methods=["DELETE"])
def delete_lost_pet(pet_id):
    """Remove registro de animal perdido/encontrado"""
    try:
        lost_pets = load_data(LOST_PETS_FILE, DEFAULT_LOST_PETS)
        
        # Remover registro
        original_length = len(lost_pets)
        lost_pets = [pet for pet in lost_pets if pet.get("id") != pet_id]
        
        if len(lost_pets) == original_length:
            return jsonify({
                "success": False,
                "message": "Registro não encontrado"
            }), 404
        
        save_data(LOST_PETS_FILE, lost_pets)
        
        return jsonify({
            "success": True,
            "message": "Registro removido com sucesso"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao remover registro"
        }), 500

# =========================
# DOAÇÃO EM DINHEIRO
# =========================

@app.route("/donation-config", methods=["GET"])
def get_donation_config():
    """Obtém configuração de doação em dinheiro"""
    try:
        config = load_data(DONATION_CONFIG_FILE, [DEFAULT_DONATION_CONFIG])
        
        # Retornar primeiro item (configuração única)
        if config and len(config) > 0:
            return jsonify({
                "success": True,
                "data": config[0]
            })
        else:
            return jsonify({
                "success": True,
                "data": DEFAULT_DONATION_CONFIG
            })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao carregar configuração de doação"
        }), 500

@app.route("/donation-config", methods=["POST"])
def update_donation_config():
    """Atualiza configuração de doação em dinheiro"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "Dados inválidos"
            }), 400
        
        config = {
            "pix_key": data.get("pix_key", DEFAULT_DONATION_CONFIG["pix_key"]),
            "qr_code": data.get("qr_code", ""),
            "message": data.get("message", DEFAULT_DONATION_CONFIG["message"])
        }
        
        save_data(DONATION_CONFIG_FILE, [config])
        
        return jsonify({
            "success": True,
            "message": "Configuração atualizada com sucesso",
            "data": config
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao atualizar configuração"
        }), 500

# =========================
# ITENS DE DOAÇÃO
# =========================

@app.route("/donation-items", methods=["GET"])
def get_donation_items():
    """Lista todos os itens de doação"""
    try:
        items = load_data(DONATION_ITEMS_FILE, DEFAULT_DONATION_ITEMS)
        return jsonify({
            "success": True,
            "data": items
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao carregar itens de doação"
        }), 500

@app.route("/donation-items", methods=["POST"])
def add_donation_item():
    """Adiciona novo item de doação"""
    try:
        data = request.get_json()
        
        if not data or not data.get("nome"):
            return jsonify({
                "success": False,
                "message": "Nome do item é obrigatório"
            }), 400
        
        items = load_data(DONATION_ITEMS_FILE, DEFAULT_DONATION_ITEMS)
        
        new_item = {
            "id": generate_id(items),
            "nome": data.get("nome").strip(),
            "categoria": data.get("categoria", "Outros"),
            "urgencia": data.get("urgencia", "média"),
            "descricao": data.get("descricao", ""),
            "quantidade": data.get("quantidade", 1),
            "ativo": data.get("ativo", True)
        }
        
        items.append(new_item)
        save_data(DONATION_ITEMS_FILE, items)
        
        return jsonify({
            "success": True,
            "message": "Item adicionado com sucesso",
            "data": new_item
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao adicionar item"
        }), 500

@app.route("/donation-items/<int:item_id>", methods=["PUT"])
def update_donation_item(item_id):
    """Atualiza item de doação existente"""
    try:
        data = request.get_json()
        items = load_data(DONATION_ITEMS_FILE, DEFAULT_DONATION_ITEMS)
        
        # Encontrar item
        item_index = None
        for i, item in enumerate(items):
            if item.get("id") == item_id:
                item_index = i
                break
        
        if item_index is None:
            return jsonify({
                "success": False,
                "message": "Item não encontrado"
            }), 404
        
        # Atualizar campos
        updated_item = items[item_index].copy()
        if "nome" in data:
            updated_item["nome"] = data["nome"].strip()
        if "categoria" in data:
            updated_item["categoria"] = data["categoria"]
        if "urgencia" in data:
            updated_item["urgencia"] = data["urgencia"]
        if "descricao" in data:
            updated_item["descricao"] = data["descricao"]
        if "quantidade" in data:
            updated_item["quantidade"] = data["quantidade"]
        if "ativo" in data:
            updated_item["ativo"] = data["ativo"]
        
        items[item_index] = updated_item
        save_data(DONATION_ITEMS_FILE, items)
        
        return jsonify({
            "success": True,
            "message": "Item atualizado com sucesso",
            "data": updated_item
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao atualizar item"
        }), 500

@app.route("/donation-items/<int:item_id>", methods=["DELETE"])
def delete_donation_item(item_id):
    """Remove item de doação"""
    try:
        items = load_data(DONATION_ITEMS_FILE, DEFAULT_DONATION_ITEMS)
        
        # Remover item
        original_length = len(items)
        items = [item for item in items if item.get("id") != item_id]
        
        if len(items) == original_length:
            return jsonify({
                "success": False,
                "message": "Item não encontrado"
            }), 404
        
        save_data(DONATION_ITEMS_FILE, items)
        
        return jsonify({
            "success": True,
            "message": "Item removido com sucesso"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao remover item"
        }), 500

# =========================
# INICIALIZAÇÃO DO SERVIDOR
# =========================

if __name__ == "__main__":
    print("=" * 50)
    print("BACKEND REFACTORADO - Plataforma de Adoção de Animais")
    print("=" * 50)
    print("Servidor iniciando em http://127.0.0.1:5000")
    print("Usuário admin: admin@admin.com / 123456")
    print("=" * 50)

# =========================
# DOAÇÕES DE USUÁRIOS
# =========================

@app.route("/donations", methods=["GET"])
def get_donations():
    """Lista todas as doações feitas por usuários"""
    try:
        donations = load_data(DONATIONS_FILE, DEFAULT_DONATIONS)
        return jsonify({
            "success": True,
            "data": donations
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao carregar doações"
        }), 500

@app.route("/donations", methods=["POST"])
def create_donation():
    """Registra nova doação de usuário"""
    try:
        data = request.get_json()
        
        # Validação
        if not data or not data.get("item_id") or not data.get("nome_usuario") or not data.get("contato"):
            return jsonify({
                "success": False,
                "message": "Dados obrigatórios faltando"
            }), 400
        
        donations = load_data(DONATIONS_FILE, DEFAULT_DONATIONS)
        
        new_donation = {
            "id": generate_id(donations),
            "item_id": int(data.get("item_id")),
            "nome_usuario": data.get("nome_usuario").strip(),
            "contato": data.get("contato").strip(),
            "quantidade": int(data.get("quantidade", 1)),
            "mensagem": data.get("mensagem", ""),
            "status": "pendente",
            "data_criacao": datetime.now().isoformat()
        }
        
        donations.append(new_donation)
        save_data(DONATIONS_FILE, donations)
        
        return jsonify({
            "success": True,
            "message": "Doação registrada com sucesso",
            "data": new_donation
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao registrar doação"
        }), 500

@app.route("/donations/<int:donation_id>", methods=["PUT"])
def update_donation_status(donation_id):
    """Atualiza status de uma doação"""
    try:
        data = request.get_json()
        new_status = data.get("status")
        
        if new_status not in ["pendente", "confirmado", "concluido", "cancelado"]:
            return jsonify({
                "success": False,
                "message": "Status inválido"
            }), 400
        
        donations = load_data(DONATIONS_FILE, DEFAULT_DONATIONS)
        
        # Encontrar doação
        donation_index = None
        for i, donation in enumerate(donations):
            if donation.get("id") == donation_id:
                donation_index = i
                break
        
        if donation_index is None:
            return jsonify({
                "success": False,
                "message": "Doação não encontrada"
            }), 404
        
        # Atualizar status
        donations[donation_index]["status"] = new_status
        donations[donation_index]["data_atualizacao"] = datetime.now().isoformat()
        
        save_data(DONATIONS_FILE, donations)
        
        return jsonify({
            "success": True,
            "message": "Status atualizado com sucesso",
            "data": donations[donation_index]
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Erro ao atualizar doação"
        }), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
