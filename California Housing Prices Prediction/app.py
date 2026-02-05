import streamlit as st
import pandas as pd
import joblib
import os

st.set_page_config(page_title="California Housing Prices Prediction", layout="centered")
st.title("California Housing Prices Prediction")
st.write("This application predicts housing prices in California based on various features.")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIPELINE_PATH = os.path.join(BASE_DIR, "california_housing_pipeline.pkl")

# load pipeline
@st.cache_resource
def load_pipeline():
    return joblib.load(PIPELINE_PATH)

pipeline = load_pipeline()

# User inputs
longitude = st.number_input("Longitude", value=-122.23)
latitude = st.number_input("Latitude", value=37.88)
housing_median_age = st.number_input("Housing Median Age", value=41)
total_rooms = st.number_input("Total Rooms", value=880)
total_bedrooms = st.number_input("Total Bedrooms", value=129)   
population = st.number_input("Population", value=322)
households = st.number_input("Households", value=126)
median_income = st.number_input("Median Income (in tens of thousands)", value=8.3252)
ocean_proximity = st.selectbox("Ocean Proximity", options=['NEAR BAY', '<1H OCEAN', 'INLAND', 'NEAR OCEAN', 'ISLAND'])
rooms_per_household = total_rooms / households
bedrooms_per_room = total_bedrooms / total_rooms
population_per_household = population / households


# Prepare input data for prediction
if st.button("Predict House Price"):
    input_data = pd.DataFrame({
        'longitude': [longitude], 
        'latitude': [latitude],
        'housing_median_age': [housing_median_age], 
        'total_rooms': [total_rooms],
        'total_bedrooms': [total_bedrooms],
        'population': [population],   
        'households': [households],
        'median_income': [median_income],
        'ocean_proximity': [ocean_proximity],
        'rooms_per_household': [rooms_per_household],
        'bedrooms_per_room': [bedrooms_per_room],
        'population_per_household': [population_per_household]
    })



    prediction = pipeline.predict(input_data)

    st.success(f"The predicted median house value is ${prediction[0]:,.2f}") 