import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import threading
import password_hasher as ph
from dotenv import load_dotenv
import os, re
import jwt
from functools import wraps
import firebase_admin
from firebase_admin import credentials, db as firebase_db
from flask_jwt_extended import jwt_required, get_jwt_identity

cred = credentials.Certificate("firebase_service_account.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://prayukti-ee020-default-rtdb.firebaseio.com/"
})

load_dotenv()
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
REACT_BASE_URL = "http://localhost:5173"

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
CORS(
    app,
    origins=[REACT_BASE_URL],
    allow_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)
hasher = ph.PasswordHasher()
app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

def generate_jwt(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.now() + timedelta(weeks=50)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing token"}), 401

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated

# Database Table Models
class UserSignup(db.Model):
    __tablename__ = "user_signup"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100))
    phone = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    address = db.Column(db.String(1000), nullable=False)
    district = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(50), nullable=False)
    police_station = db.Column(db.String(100), nullable=True)
    pincode = db.Column(db.String(10), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    signup_date = db.Column(db.DateTime, default=datetime.now())

class UserProfile(db.Model):
    __tablename__ = "user_profile"
    user_id = db.Column(db.Integer, db.ForeignKey("user_signup.id", ondelete="CASCADE"), primary_key=True)
    bio = db.Column(db.String(500), nullable=True)
    dob = db.Column(db.Date, nullable=True)
    blood_group = db.Column(db.String(5), nullable=True)
    medical_notes = db.Column(db.String(500), nullable=True)
    photo_url = db.Column(db.String(200), nullable=True)
    preferred_language = db.Column(db.String(50), nullable=True)
    profile_completed = db.Column(db.Boolean, default=False)
    last_updated = db.Column(db.DateTime, default=datetime.now(), onupdate=datetime.now())

    # Relationship to parent
    user = db.relationship("UserSignup", backref=db.backref("profile", uselist=False, cascade="all, delete"))

class EmergencyContact(db.Model):
    __tablename__ = "emergency_contacts"
    phone_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user_signup.id", ondelete="CASCADE"), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

    # Relationship to parent
    user = db.relationship("UserSignup", backref=db.backref("emergency_contacts", cascade="all, delete-orphan"))


@app.route('/get/login', methods=['GET', 'POST'])
def login():
    if request.method=="OPTIONS":
        response = app.make_default_options_response()
        return response

    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON received"}), 400
    post_type = data.get("type")

    if (post_type=="L"):
        login_email = data.get("login_email")
        login_password = data.get("login_password")

        user = UserSignup.query.with_entities(
            UserSignup.id,
            UserSignup.password_hash
        ).filter_by(email=login_email).first()
        code = int(re.findall('\$(\d+)\$', user.password_hash)[0])

        if not user:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

        if user.password_hash != hasher.get_hash(login_password, code):
            return jsonify({"success": False, "message": "Invalid email or password"}), 401
        else:
            token = generate_jwt(user.id)
            return jsonify({"success": True, "type": "L", "token": token})

        #not done yet
    elif (post_type=="S"):
        phone = data.get("phone")
        email = data.get("email")
        password_1 = data.get("password_1")
        password_2 = data.get("password_2")

        # users = UserSignup.query.all()
        # unique_emails = [users[i].email for i in range(len(users))]

        # elif password_1!=password_2:
        #     message = "Password mismatch"
        #     error = 1
        if UserSignup.query.filter((UserSignup.email==email) | (UserSignup.phone==phone)).first():
            return jsonify({"success": False, "message": "Email or phone already exists"}), 400
        if password_1!=password_2:
            return jsonify({"success": False, "message": "Passwords do not match"}), 400

        new_user = UserSignup(
            first_name = data.get("first_name"),
            last_name = data.get("last_name"),
            phone = phone,
            email = email,
            address = data.get("address_line_1")+", "+data.get("address_line_2"),
            district = data.get("district"),
            state = data.get("state"),
            police_station = data.get("police_station"),
            pincode = data.get("pincode"),
            password_hash = hasher.get_hash(password_1)
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"success": True, "type":"S"})
    
    else:
        return jsonify({"error": "Invalid request"}), 400

@app.after_request
def after_request(response):
    # Print headers to debug
    print("Response Headers:", dict(response.headers))
    return response

@app.route("/dashboard", methods=["GET"])
@jwt_required
def dashboard():
    user = UserSignup.query.get(request.user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    profile = user.profile

    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "email": user.email,
        "address": user.address,
        "district": user.district,
        "state": user.state,
        "police_station": user.police_station,
        "pincode": user.pincode,
        "signup_date": user.signup_date,
        "photo_url": profile.photo_url if profile else "",
    })

@app.route("/profile", methods=["GET", "POST"])
@jwt_required
def profile():
    # user_id = get_jwt_identity()
    user = UserSignup.query.get(request.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if request.method=="GET":    
        profile = user.profile

        return jsonify({
            "id": user.id,
            "bio": profile.bio if profile else "",
            "dob": profile.dob if profile else "",
            "blood_group": profile.blood_group if profile else "",
            "medical_notes": profile.medical_notes if profile else "",
            "photo_url": profile.photo_url if profile else "",
            "preferred_language": profile.preferred_language if profile else "",
            "profile_completed": profile.profile_completed if profile else False,
            "last_updated": profile.last_updated if profile else "",
            "emergency_contacts": [contact for (contact,) in EmergencyContact.query.with_entities(EmergencyContact.phone).filter(EmergencyContact.user_id == user.id).all()]
        })
    else:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON received"}), 400
        profile = user.profile
        
        profile_completed = all([data.get("bio"), data.get("dob"), data.get("blood_group"), data.get("medical_notes"), data.get("preferred_language"), data.get("photo_url")])
        
        # -------- UPDATE EXISTING PROFILE --------
        if profile:
            profile.bio = data.get("bio", profile.bio)
            profile.dob = data.get("dob", profile.dob)
            profile.blood_group = data.get("blood_group", profile.blood_group)
            profile.medical_notes = data.get("medical_notes", profile.medical_notes)
            profile.preferred_language = data.get("preferred_language", profile.preferred_language)
            profile.photo_url = data.get("photo_url", profile.photo_url)
            profile.profile_completed = profile_completed
            profile.last_updated = datetime.now()
        else:
            profile = UserProfile(
                user_id = request.user_id,
                bio = data.get("bio"),
                dob = data.get("dob"),
                blood_group = data.get("blood_group"),
                medical_notes = data.get("medical_notes"),
                preferred_language = data.get("preferred_language"),
                photo_url = data.get("photo_url"),
                profile_completed = profile_completed
            )

        db.session.add(profile)

        # -------------------- UPDATE EMERGENCY CONTACTS --------------------
        if "emergency_contacts" in data:
            # Delete old contacts
            EmergencyContact.query.filter_by(user_id=user.id).delete()

            # Add new contacts
            for phone in data["emergency_contacts"]:
                db.session.add(
                    EmergencyContact(
                        user_id=user.id,
                        phone=phone
                    )
                )

        db.session.commit()
        return jsonify({
            "message": "Profile saved successfully",
            "profile_completed": profile.profile_completed
        }), 200

def get_live_status(user_id):
    ref = firebase_db.reference(f"/real-time-data/users/{user_id}/device/latest")
    return ref.get()

@app.route("/api/live-status", methods=["GET"])
@jwt_required
def live_status():
    user_id = str(request.user_id)
    data = get_live_status(user_id)

    if not data:
        return jsonify({"connected": False}), 404

    return jsonify(data)

@app.route("/auth/check", methods=["GET"])
@jwt_required
def auth_check():
    return jsonify({
        "logged_in": True,
        "user_id": request.user_id
    })

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000, debug=True);