from flask import Flask, render_template, request, jsonify, render_template
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Load the pre-trained pipeline
pipeline = joblib.load("Bike Sharing Demand Prediction/model/bike_sharing_prediction.pkl")

@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_data = pd.DataFrame([data])
    prediction = pipeline.predict(input_data)
    return jsonify({'predicted_demand': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)