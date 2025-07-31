from app import db
from flask_bcrypt import generate_password_hash, check_password_hash

class User(db.model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  password_hash = db.Column(db.String(128), nullable=False)

  def set_password(self, password):
    self.password_hash = generate_password_hash(password).decode('utf-8')

  def check_password(self, password):
    return check_password_hash(self.password_hash, password)




class Friend(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(50), nullable=False)
  role = db.Column(db.String(20), nullable=False)
  description = db.Column(db.Text, nullable=False)
  gender = db.Column(db.String(10), nullable=False)
  img_url = db.Column(db.String(200), nullable=True)

  def to_json(self):
    return {
        "id":self.id,
        "name":self.name,
        "role":self.role,
        "description":self.description,
        "gender":self.gender,
        "imgUrl":self.img_url,
      }