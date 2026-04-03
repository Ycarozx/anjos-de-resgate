from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# =========================
# ARQUIVOS DE DADOS
# =========================
USERS_FILE = "users.json"
ANIMALS_FILE = "animals.json"

# =========================
# FUNÇÕES AUXILIARES
# =========================
def load_data(file):
    if not os.path.exists(file):
        return []
    with open(file, "r") as f:
        return json.load(f)

def save_data(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=4)

# =========================
# INICIALIZAÇÃO
# =========================
users = load_data(USERS_FILE)
animals = load_data(ANIMALS_FILE)

# cria admin automaticamente
def create_admin():
    global users
    admin_exists = any(u["email"] == "admin@admin.com" for u in users)

    if not admin_exists:
        admin = {
            "nome": "Administrador",
            "email": "admin@admin.com",
            "senha": "123456",
            "isAdmin": True
        }
        users.append(admin)
        save_data(USERS_FILE, users)
        print("Admin criado!")

create_admin()

# =========================
# ROTAS
# =========================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "Backend funcionando"
    })

# =========================
# ANIMAIS
# =========================

@app.route("/animals", methods=["GET"])
def get_animals():
    return jsonify({
        "success": True,
        "data": animals
    })

@app.route("/animals", methods=["POST"])
def add_animal():
    data = request.get_json()

    new_animal = {
        "id": len(animals) + 1,
        "nome": data.get("nome"),
        "especie": data.get("especie"),
        "idade": data.get("idade")
    }

    animals.append(new_animal)
    save_data(ANIMALS_FILE, animals)

    return jsonify({
        "success": True,
        "message": "Animal adicionado"
    })

@app.route("/animals/<int:id>", methods=["DELETE"])
def delete_animal(id):
    global animals
    animals = [a for a in animals if a["id"] != id]
    save_data(ANIMALS_FILE, animals)

    return jsonify({
        "success": True,
        "message": "Animal removido"
    })

# =========================
# LOGIN
# =========================

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    senha = data.get("senha")

    for user in users:
        if user["email"] == email and user["senha"] == senha:
            return jsonify({
                "success": True,
                "user": user
            })

    return jsonify({
        "success": False,
        "message": "Login invalido"
    })

# =========================
# CADASTRO
# =========================

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    new_user = {
        "nome": data.get("nome"),
        "email": data.get("email"),
        "senha": data.get("senha"),
        "isAdmin": False
    }

    users.append(new_user)
    save_data(USERS_FILE, users)

    return jsonify({
        "success": True,
        "message": "Usuario criado"
    })

# =========================

if __name__ == "__main__":
    app.run(debug=True)