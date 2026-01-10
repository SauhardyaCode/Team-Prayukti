from extensions import *

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

class PoliceStations(db.Model):
    __tablename__ = "police_stations"
    id = db.Column(db.Integer, primary_key=True)
    station_code = db.Column(db.String(20), unique=True, nullable=False)
    station_name = db.Column(db.String(150), nullable=False)
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    pincode = db.Column(db.String(10))
    latitude = db.Column(db.Numeric(9, 6), nullable=False)
    longitude = db.Column(db.Numeric(9, 6), nullable=False)
    contact_number = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(120))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now())
    officer_in_charge = db.Column(db.String(100), nullable=False)