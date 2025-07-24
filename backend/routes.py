from app import app, db
from flask import request, jsonify
from models import Friend

#Get all friends
@app.route("/api/v1/friends", methods=["GET"])
def all_friends():
    friends = Friend.query.all()
    data = []
    for friend in friends:
        res = friend.to_json()
        data.append(res)
    return jsonify(data)

#Add a friend
@app.route("/api/v1/friends", methods=["POST"])
def create_friend():
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
        
        new_friend = Friend(name=name, role=role, description=description, gender= gender, img_url=img_url)
        db.session.add(new_friend) 
        db.session.commit()

        return jsonify({"message":"Friend added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#Delete a friend
@app.route("/api/v1/friends/<int:id>", methods=["DELETE"])
def delete_friend(id):
    try:
        friend = Friend.query.get(id)
        if friend is None:
            return jsonify({"error": "User does not exist"}), 404
        
        db.session.delete(friend)
        db.session.commit()

        return jsonify({"message": "Friend removed successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500