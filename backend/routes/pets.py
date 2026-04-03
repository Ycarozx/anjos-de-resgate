from flask import Blueprint, request, jsonify
from models import db, Pet

pets_bp = Blueprint('pets', __name__)

@pets_bp.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify([{
        "id": p.id,
        "nome": p.nome,
        "especie": p.especie,
        "idade": p.idade,
        "descricao": p.descricao,
        "imagem": p.imagem
    } for p in pets])

@pets_bp.route('/pets', methods=['POST'])
def add_pet():
    data = request.json

    pet = Pet(**data)
    db.session.add(pet)
    db.session.commit()

    return jsonify({"message": "Pet adicionado"})