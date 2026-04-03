from flask import Blueprint, request, jsonify
from models import db, LostPet

lost_bp = Blueprint('lost', __name__)

@lost_bp.route('/lost', methods=['GET'])
def get_lost():
    pets = LostPet.query.filter_by(aprovado=True).all()
    return jsonify([{
        "id": p.id,
        "nome": p.nome,
        "descricao": p.descricao,
        "contato": p.contato
    } for p in pets])

@lost_bp.route('/lost', methods=['POST'])
def add_lost():
    data = request.json

    pet = LostPet(**data)
    db.session.add(pet)
    db.session.commit()

    return jsonify({"message": "Enviado para aprovação"})