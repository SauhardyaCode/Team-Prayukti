import eventlet
eventlet.monkey_patch()

from flask import Flask, request, jsonify, redirect
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
import json

cred = credentials.Certificate(json.loads(os.environ("FIREBASE_SERVICE_ACCOUNT")))
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