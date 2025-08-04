from app import app, db
from flask import request, jsonify
from models import Friend, User
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_bcrypt import generate_password_hash, check_password_hash

@app.route("/api/v1/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    new_user = User(username=username)
    new_user.password = password

    new_user.name = data.get("name", "")
    new_user.role = data.get("role", "")
    new_user.description = data.get("description", "")
    new_user.gender = data.get("gender", "")
    new_user.img_url = data.get("img_url", "")

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/v1/login', methods=["POST"])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'message': 'Login Success', 'access_token': access_token})
    else:
        return jsonify({'message': 'Login Failed'}), 401

@app.route('/api/v1/user', methods=['GET'])
@jwt_required()
def userInfo():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    if user:
        return jsonify({'message': 'User found', 'name': user.name})
    else:
        return jsonify({'message': 'User not found'}), 404


#Get all friends
@app.route("/api/v1/friends", methods=["GET"])
@jwt_required()
def all_friends():
    user_id = get_jwt_identity()
    sent = Friend.query.filter_by(user_id1=user_id).all()
    received = Friend.query.filter_by(user_id2=user_id).all()

    friend_ids = {f.user_id2 for f in sent} | {f.user_id1 for f in received}
    friend_users = User.query.filter(User.id.in_(friend_ids)).all()

    return jsonify([user.to_json() for user in friend_users]), 200

#Add a friend
@app.route("/api/v1/friends", methods=["POST"])
@jwt_required()
def create_friend():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        friend_id = data.get("friend_id")

        if not friend_id:
            return jsonify({"error": "Missing 'friend_id'"}), 400

        if friend_id == user_id:
            return jsonify({"error": "You cannot add yourself as a friend"}), 400

        # Check if already friends (in either direction)
        exists = Friend.query.filter(
            ((Friend.user_id1 == user_id) & (Friend.user_id2 == friend_id)) |
            ((Friend.user_id1 == friend_id) & (Friend.user_id2 == user_id))
        ).first()

        if exists:
            return jsonify({"error": "Already friends"}), 400

        new_friend = Friend(user_id1=user_id, user_id2=friend_id)
        db.session.add(new_friend)
        db.session.commit()
        return jsonify({"message": "Friend added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#Delete a friend
@app.route("/api/v1/friends/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_friend(id):
    try:
        user_id = get_jwt_identity()
        friend = Friend.query.filter(
            ((Friend.user_id1 == user_id) & (Friend.user_id2 == id)) |
            ((Friend.user_id1 == id) & (Friend.user_id2 == user_id))
        ).first()

        if not friend:
            return jsonify({"error": "Friend does not exist"}), 404

        db.session.delete(friend)
        db.session.commit()
        return jsonify({"message": "Friend removed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

