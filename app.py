from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('main.html')

@app.route("/gamemode")
def gamemode():
    return render_template('gamemode.html')

if __name__ == '__main__':
    app.run(debug=True)