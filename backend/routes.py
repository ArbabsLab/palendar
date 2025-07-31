from app import app, db
from flask import request, jsonify
from models import Friend
import jwt
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            token = bearer.split()[1] if ' ' in bearer else bearer
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user_id, *args, **kwargs)
    return decorated

#Get all friends
@app.route("/api/v1/friends", methods=["GET"])
@token_required
def all_friends(current_user_id):
    friends = Friend.query.filter_by(user_id=current_user_id).all()
    data = [friend.to_json() for friend in friends]
    return jsonify(data)

#Add a friend
@app.route("/api/v1/friends", methods=["POST"])
@token_required
def create_friend(current_user_id):
    try:
        data = request.json
        required_fields = ["name","role","description","gender"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error":f'Missing required field: {field}'}), 400
        name = data.get("name")
        role = data.get("role")
        description = data.get("description")
        gender = data.get("gender")
        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy"
        elif gender == "female":
            img_url = f"https://avatar.iran.liara.run/public/girl"
        else:
            img_url = None
        new_friend = Friend(name=name, role=role, description=description, gender=gender, img_url=img_url, user_id=current_user_id)
        db.session.add(new_friend)
        db.session.commit()
        return jsonify({"message":"Friend added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#Delete a friend
@app.route("/api/v1/friends/<int:id>", methods=["DELETE"])
@token_required
def delete_friend(current_user_id, id):
    try:
        friend = Friend.query.filter_by(id=id, user_id=current_user_id).first()
        if friend is None:
            return jsonify({"error": "Friend does not exist"}), 404
        db.session.delete(friend)
        db.session.commit()
        return jsonify({"message": "Friend removed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#Update friend info
@app.route("/api/v1/friends/<int:id>", methods=["PATCH"])
@token_required
def update_friend(current_user_id, id):
    try:
        friend = Friend.query.filter_by(id=id, user_id=current_user_id).first()
        if friend is None:
            return jsonify({"error": "User does not exist"}), 404
        
        updated_data = request.json
        friend.name = updated_data.get("name", friend.name)
        friend.role = updated_data.get("role", friend.role)
        friend.description = updated_data.get("description", friend.description)
        friend.gender = updated_data.get("gender", friend.gender)
        db.session.commit()

        return jsonify(friend.to_json()), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500