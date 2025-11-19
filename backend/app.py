from flask import Flask, render_template, request, redirect, make_response

app = Flask(__name__)
app.secret_key = "secret_key"

@app.route('/get-login', methods=['GET', 'POST'])
def login():
    return "hi"

if __name__=="__main__":
    app.run(debug=True,host="localhost",port=5173);