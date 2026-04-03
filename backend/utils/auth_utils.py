from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def hash_senha(senha):
    return bcrypt.generate_password_hash(senha).decode('utf-8')

def check_senha(hash, senha):
    return bcrypt.check_password_hash(hash, senha)