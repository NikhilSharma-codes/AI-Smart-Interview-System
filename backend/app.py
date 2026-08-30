import json
import os

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host="localhost", port=3306, user="root", password="nikhil",
        database="interview_ai", use_pure=True,
    )


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is missing. Add it to backend/.env.")
    return OpenAI(api_key=api_key)


@app.route("/")
def home():
    return "Interview AI Backend is running!"


@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json() or {}
        full_name = data.get("full_name")
        email = data.get("email")
        password = data.get("password")

        if not full_name or not email or not password:
            return jsonify({"success": False, "message": "All fields are required"}), 400

        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({"success": False, "message": "Email already registered"}), 409

        cursor.execute(
            "INSERT INTO users (full_name, email, password) VALUES (%s, %s, %s)",
            (full_name, email, password),
        )
        db.commit()
        cursor.close()
        db.close()
        return jsonify({"success": True, "message": "Registration successful"})
    except Exception as error:
        print("Registration Error:", error)
        return jsonify({"success": False, "message": "Registration failed"}), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json() or {}
        email = data.get("email")
        password = data.get("password")

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT user_id, full_name, email
            FROM users
            WHERE email = %s AND password = %s
            """,
            (email, password),
        )
        user = cursor.fetchone()
        cursor.close()
        db.close()

        if user:
            return jsonify({"success": True, "message": "Login successful", "user": user})
        return jsonify({"success": False, "message": "Invalid email or password"}), 401
    except Exception as error:
        print("Login Error:", error)
        return jsonify({"success": False, "message": "Login failed"}), 500


@app.route("/evaluate", methods=["POST"])
def evaluate_answer():
    data = request.get_json() or {}
    question = str(data.get("question", "")).strip()
    answer = str(data.get("answer", "")).strip()
    role = str(data.get("role", "")).strip()
    question_number = data.get("questionNumber")

    if not question or not answer or not role or not question_number:
        return jsonify({"success": False, "message": "Question, answer, role, and question number are required."}), 400

    evaluation_schema = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "score": {"type": "number", "minimum": 0, "maximum": 10},
            "feedback": {"type": "string"},
            "strengths": {"type": "array", "items": {"type": "string"}},
            "weaknesses": {"type": "array", "items": {"type": "string"}},
            "suggestion": {"type": "string"},
        },
        "required": ["score", "feedback", "strengths", "weaknesses", "suggestion"],
    }
    instructions = (
        "You are a supportive technical interviewer for a college interview-practice application. "
        "Evaluate the candidate answer only against the supplied question and role. Consider correctness, "
        "relevance, technical understanding, completeness, and clarity. Give a fair score from 0 to 10. "
        "Use concise, practical language. Give 1 to 3 strengths, 1 to 3 weaknesses, and one actionable suggestion."
    )
    input_text = (
        f"Interview role: {role}\nQuestion number: {question_number}\n"
        f"Question: {question}\nCandidate answer: {answer}"
    )

    try:
        client = get_openai_client()
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-5.4-mini"),
            instructions=instructions,
            input=input_text,
            max_output_tokens=500,
            text={"format": {
                "type": "json_schema",
                "name": "interview_evaluation",
                "strict": True,
                "schema": evaluation_schema,
            }},
        )
        return jsonify({"success": True, "evaluation": json.loads(response.output_text)})
    except ValueError as error:
        return jsonify({"success": False, "message": str(error)}), 500
    except Exception as error:
        print("Evaluation Error:", error)
        return jsonify({"success": False, "message": "AI evaluation failed. Please try again."}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False, use_reloader=False)
