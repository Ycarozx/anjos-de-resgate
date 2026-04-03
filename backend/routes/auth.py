from flask import Blueprint, request, jsonify
from models import db, User
from utils.auth_utils import bcrypt

auth_bp = Blueprint('auth', __name__)

# CADASTRO
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email já existe"})

    senha_hash = bcrypt.generate_password_hash(senha).decode('utf-8')

    user = User(nome=nome, email=email, senha=senha_hash, is_admin=True)
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True})


# LOGIN
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    senha = data.get('senha')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.senha, senha):
        return jsonify({
            "success": True,
            "user": {
                "id": user.id,
                "nome": user.nome,
                "email": user.email,
                "is_admin": user.is_admin
            }
        })

    return jsonify({"success": False, "message": "Credenciais inválidas"})