from flask import Flask, render_template
from blueprints.landing import landing_bp

app = Flask(__name__, static_folder='static')

app.register_blueprint(landing_bp)

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
