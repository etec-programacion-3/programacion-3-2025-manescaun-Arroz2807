from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db, Product
from schemas import ProductSchema

app = Flask(__name__)
app.config.from_object(Config)

# Habilitar CORS para todos los endpoints
CORS(app, resources={r"/api/*": {"origins": "*"}})

db.init_app(app)
migrate = Migrate(app, db)

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify(products_schema.dump(products))

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product_schema.dump(product))

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    errors = product_schema.validate(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    product = Product(
        name=data['name'],
        price=data['price'],
        description=data.get('description')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product_schema.dump(product)), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    errors = product_schema.validate(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    product.name = data['name']
    product.price = data['price']
    product.description = data.get('description')
    db.session.commit()
    return jsonify(product_schema.dump(product))

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(port=3000, debug=True) 