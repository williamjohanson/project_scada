from flask import Flask, jsonify
from flask_cors import CORS
from utils import JsonHelper
import os

app = Flask(__name__)
CORS(app)

# Initialize the JsonHelper with the path to the configuration file
SITE_CONFIG_FILE_PATH = os.path.join(os.path.dirname(__file__), 'config', 'site_config.json')
site_config = JsonHelper(SITE_CONFIG_FILE_PATH)

@app.route('/api/config', methods=['GET'])
def get_config():
    config = site_config.load()
    if config is None:
        return jsonify({"error": "Configuration could not be loaded"}), 500
    return jsonify(config)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
