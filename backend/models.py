from app import db
from flask_bcrypt import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(200), nullable=True)

    # Friends where the user is the sender
    friends_sent = db.relationship(
        'Friend',
        foreign_keys='Friend.user_id1',
        backref='requester',
        lazy=True
    )
    # Friends where the user is the receiver
    friends_received = db.relationship(
        'Friend',
        foreign_keys='Friend.user_id2',
        backref='receiver',
        lazy=True
    )

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "role": self.role,
            "description": self.description,
            "gender": self.gender,
            "imgUrl": self.img_url,
        }

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute.")

    @password.setter
    def password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password).decode("utf-8")

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Friend(db.Model):
    __tablename__ = "friend"

    id = db.Column(db.Integer, primary_key=True)
    user_id1 = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_id2 = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "userId1": self.user_id1,
            "userId2": self.user_id2,
        }
