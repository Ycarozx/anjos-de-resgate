from flask import Blueprint, request, jsonify
from models import db, DonationItem

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/donations', methods=['GET'])
def get_items():
    items = DonationItem.query.all()
    return jsonify([{"id": i.id, "nome": i.nome, "descricao": i.descricao} for i in items])

@donations_bp.route('/donations', methods=['POST'])
def add_item():
    data = request.json

    item = DonationItem(**data)
    db.session.add(item)
    db.session.commit()

    return jsonify({"message": "Item adicionado"})