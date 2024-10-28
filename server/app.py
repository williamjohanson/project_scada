from flask import Flask, jsonify, request
from flask_cors import CORS
from utils import JsonHelper
import os
import json

app = Flask(__name__)
CORS(app)

# Initialize the JsonHelper with the path to the configuration file
SITE_CONFIG_FILE_PATH = os.path.join(os.path.dirname(__file__), 'config', 'site_config.json')
# Path to the operators.json file
OPERATORS_FILE = os.path.join(os.path.dirname(__file__), 'config', 'operators.json')

site_config = JsonHelper(SITE_CONFIG_FILE_PATH)
operators_helper = JsonHelper(OPERATORS_FILE)

# Endpoint to get operators data
@app.route('/api/operators', methods=['GET'])
def get_operators():
    operators_data = operators_helper.load()
    if operators_data is None:
        return jsonify({"error": "Could not load operators data"}), 500
    return jsonify(operators=operators_data.get("operators", [])), 200

# Endpoint to save updated operators data
@app.route('/api/operators', methods=['POST'])
def save_operators():
    # try:
    operators = request.json.get("operators", [])
    print("we Have ", operators)
    if operators_helper.write({"operators": operators}):
        return jsonify({"message": "Operators updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to save operators data"}), 500
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

@app.route('/api/config', methods=['GET'])
def get_config():
    config = site_config.load()
    if config is None:
        return jsonify({"error": "Configuration could not be loaded"}), 500
    return jsonify(config)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
