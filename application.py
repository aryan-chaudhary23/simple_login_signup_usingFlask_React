from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

# Flask app configuration
app = Flask(
    __name__,
    static_folder="frontend/build",  # Serve React's static files
    template_folder="frontend/build"  # Serve React's index.html
)

# Enable Cross-Origin Resource Sharing (CORS)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# MongoDB connection
mongo_uri = "mongodb+srv://aryanchaudhary290:<password>@cluster0.mwynu.mongodb.net/"
client = MongoClient(mongo_uri)

# Create database and collection
db_name = "UserAuthDatabase"  # Name of the database
collection_name = "users"  # Name of the collection
db = client[db_name]
users_collection = db[collection_name]


# Login endpoint
@app.route("/api/login", methods=["POST"])
def get_login_data():
    data = request.get_json()
    user = users_collection.find_one({"email": data['email']})
    if user and user["password"] == data['password']:
        return jsonify({"message": "Login successful", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid username or password", "status": "fail"}), 401


# Signup endpoint
@app.route("/api/signup", methods=["POST"])
def get_signup_data():
    data = request.get_json()
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"message": "Username already exists", "status": "fail"}), 409
    users_collection.insert_one(data)
    return jsonify({"message": "Signup successful", "status": "success"}), 201


# Serve React app
@app.route("/")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)


if __name__ == "__main__":
    # Check if database exists (creates it dynamically on first write)
    if collection_name not in db.list_collection_names():
        users_collection.insert_one({"username": "test_user", "password": "test_pass"})  # Example data
        users_collection.delete_one({"username": "test_user"})  # Remove the example data

    app.run(debug=True,threaded=False)
