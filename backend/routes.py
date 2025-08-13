from datetime import datetime
from app import app, db
from flask import request, jsonify
from models import Event, EventInvite, Friend, User
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
        access_token = create_access_token(identity=str(user.id))
        
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
    try:
        user_id = int(get_jwt_identity())
        sent = Friend.query.filter_by(user_id1=user_id, status="accepted").all()
        received = Friend.query.filter_by(user_id2=user_id, status="accepted").all()

        friend_ids = {f.user_id2 for f in sent} | {f.user_id1 for f in received}
        friend_users = User.query.filter(User.id.in_(friend_ids)).all()

        return jsonify([user.to_json() for user in friend_users]), 200
    except Exception as e:
         print(e)
         return jsonify({"error": str(e)}), 500
    
"""
NO LONGER IN USE
#Add a friend
@app.route("/api/v1/friends", methods=["POST"])
@jwt_required()
def create_friend():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        friend_id = data.get("friend_id")

        if not friend_id:
            return jsonify({"error": "Missing 'friend_id'"}), 400

        if friend_id == user_id:
            return jsonify({"error": "You cannot add yourself as a friend"}), 400

        friend_exists = User.query.filter_by(id=friend_id).first()
        if not friend_exists:
            return jsonify({"error": "User does not exist"}), 404
        
        # Check if already friends (in either direction)
        already_friends = Friend.query.filter(
            ((Friend.user_id1 == user_id) & (Friend.user_id2 == friend_id)) |
            ((Friend.user_id1 == friend_id) & (Friend.user_id2 == user_id))
        ).first()

        if already_friends:
            return jsonify({"error": "Already friends"}), 400

        new_friend = Friend(user_id1=user_id, user_id2=friend_id)
        db.session.add(new_friend)
        db.session.commit()
        return jsonify({"message": "Friend added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
"""   

#Delete a friend
@app.route("/api/v1/friends/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_friend(id):
    try:
        user_id = int(get_jwt_identity())
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

@app.route("/api/v1/friend-request/<int:receiver_id>", methods=["POST"])
@jwt_required()
def send_friend_request(receiver_id):
    try:
        sender_id = int(get_jwt_identity())

        if sender_id == receiver_id:
            return jsonify({"error": "You can't send a request to yourself"}), 400

        friend_exists = User.query.filter_by(id=receiver_id).first()
        if not friend_exists:
            return jsonify({"error": "User does not exist"}), 404
            
        existing_request = Friend.query.filter(
            ((Friend.user_id1 == sender_id) & (Friend.user_id2 == receiver_id)) |
            ((Friend.user_id1 == receiver_id) & (Friend.user_id2 == sender_id))
        ).first()

        if existing_request:
            return jsonify({"error": "Friend request or friendship already exists"}), 400

        friend_request = Friend(user_id1=sender_id, user_id2=receiver_id, status="pending")
        db.session.add(friend_request)
        db.session.commit()
        return jsonify({"message": "Friend request sent"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
@app.route("/api/v1/friend-request/<int:request_id>/accept", methods=["PUT"])
@jwt_required()
def accept_friend_request(request_id):
    user_id = int(get_jwt_identity())
    friend_request = Friend.query.filter_by(id=request_id, user_id2=user_id, status="pending").first()

    if not friend_request:
        return jsonify({"error": "Friend request not found"}), 404

    friend_request.status = "accepted"
    db.session.commit()
    return jsonify({"message": "Friend request accepted"}), 200

@app.route("/api/v1/friend-requests/pending", methods=["GET"])
@jwt_required()
def get_pending_requests():
    user_id = int(get_jwt_identity())
    pending = Friend.query.filter_by(user_id2=user_id, status="pending").all()

    requesters = User.query.filter(User.id.in_([f.user_id1 for f in pending])).all()

    return jsonify([
        {
            "requestId": f.id,
            "from": u.to_json()
        } for f, u in zip(pending, requesters)
    ])

@app.route("/api/v1/friend-request/<int:request_id>", methods=["DELETE"])
@jwt_required()
def reject_or_cancel_friend_request(request_id):
    user_id = int(get_jwt_identity())
    friend_request = Friend.query.filter_by(id=request_id).first()

    if not friend_request:
        return jsonify({"error": "Friend request not found"}), 404

    if user_id not in [friend_request.user_id1, friend_request.user_id2]:
        return jsonify({"error": "Not sender or receiver"}), 403

    db.session.delete(friend_request)
    db.session.commit()
    return jsonify({"message": "Friend request deleted"}), 200

@app.route("/api/v1/events", methods=["POST"])
@jwt_required()
def create_event():
    try:
        data = request.json
        user_id = get_jwt_identity()

        event = Event(
            title=data["title"],
            description=data.get("description"),
            creator_id=user_id,
            date=datetime.strptime(data["date"], "%Y-%m-%d %H:%M")
        )
        db.session.add(event)
        db.session.commit()

        return jsonify({"message": "Event created", "event_id": event.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/v1/events/<int:event_id>/invite", methods=["POST"])
@jwt_required()
def invite_to_event(event_id):
    try:
        data = request.json
        invitee_ids = data.get("invitees", [])

        for invitee_id in invitee_ids:
            invite = EventInvite(event_id=event_id, invitee_id=invitee_id)
            db.session.add(invite)

        db.session.commit()
        return jsonify({"message": "Invites sent"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/api/v1/events/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_events(event_id):
    try:
        user_id = int(get_jwt_identity())
        event = Event.query.filter_by(id=event_id, creator_id=user_id).first()

        if not event:
            return jsonify({"error": "Event not found or not authorized"}), 404

        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/events/<int:event_id>", methods=["PUT"])
@jwt_required()
def edit_event(event_id):
    try:
        user_id = int(get_jwt_identity())
        data = request.json

        event = Event.query.filter_by(id=event_id, creator_id=user_id).first()

        if not event:
            return jsonify({"error": "Event not found or not authorized"}), 404

        if "title" in data:
            event.title = data["title"]
        if "description" in data:
            event.description = data["description"]
        if "date" in data:
            try:
                event.date = datetime.strptime(data["date"], "%Y-%m-%d %H:%M")
            except ValueError:
                return jsonify({"error": "Invalid date format, use YYYY-MM-DD HH:MM"}), 400

        db.session.commit()
        return jsonify({"message": "Event updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/events", methods=["GET"])
@jwt_required()
def get_events():
    user_id = get_jwt_identity()

    created_events = Event.query.filter_by(creator_id=user_id).all()
    invited_events = (
        db.session.query(Event)
        .join(EventInvite)
        .filter(EventInvite.invitee_id == user_id)
        .all()
    )

    events = [
        {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "date": e.date.strftime("%Y-%m-%d %H:%M"),
            "type": "created"
        } for e in created_events
    ] + [
        {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "date": e.date.strftime("%Y-%m-%d %H:%M"),
            "type": "invited"
        } for e in invited_events
    ]

    return jsonify(events)
