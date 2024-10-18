import json
import os

class JsonHelper:
    def __init__(self, file_path):
        self.file_path = file_path

    def load(self):
        """Load JSON data from the file."""
        try:
            with open(self.file_path, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"Error: Config file not found at {self.file_path}")
            return None
        except json.JSONDecodeError:
            print(f"Error: Failed to decode JSON from {self.file_path}")
            return None

    def write(self, data):
        """Write JSON data to the file."""
        try:
            with open(self.file_path, 'w') as file:
                json.dump(data, file, indent=4)
            return True
        except Exception as e:
            print(f"Error: Failed to write JSON to {self.file_path}. Error: {e}")
            return False

    def update(self, key, value):
        """Update a specific key in the JSON file."""
        data = self.load()
        if data is None:
            return False
        data[key] = value
        return self.write(data)
