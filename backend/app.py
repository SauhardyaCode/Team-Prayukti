import eventlet
eventlet.monkey_patch()

from flask import Flask, render_template, request, redirect, make_response, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import random, time
import threading


app = Flask(__name__)
CORS(app)
app.secret_key = "secret_key"

socketio = SocketIO(app, cors_allowed_origins="*")


@app.route('/get/login', methods=['GET', 'POST'])
def login():
    return "hi"

def send_status():
    while True:
        data = {
            "latitude": 21.333012,
            "longitude": 30.00008,
            "status": random.choice(["SAFE", "DANGER"]),
            "zone": "Moderately Safe Area",
            "movement": "Mild",
            "heartRate": random.randint(60, 200),
            "devicePaired": random.choice([True, False]),
            "connected": random.choice([True, False]),
            "battery": random.randint(0,100),
            "network": "Strong (SMS Ready)"
        }
        print("emitting...",data)
        socketio.emit("status_data", data)
        time.sleep(2)

@socketio.on("connect")
def handle_connect():
    print("Client Connected!")

@socketio.on("disconnect")
def handle_connect():
    print("Client Disconnected!")

if __name__=="__main__":
    threading.Thread(target=send_status, daemon=True).start()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True);