import streamlit as st
import pandas as pd
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIPELINE_PATH = os.path.join(BASE_DIR, "credit_card_default_pipeline.pkl")


def predict_default(input_data):
    input_df = pd.DataFrame(input_data)

    prob = pipeline.predict_proba(input_df)[0, 1]
    pred_custom = int(prob >= 0.3)

    st.write(f"Probability of Default: {prob:.4f}")
    st.write("Prediction:", pred_custom)


    return pred_custom

st.set_page_config(page_title="Credit Card Default Prediction", layout="centered")
st.title("Credit Card Default Prediction")
st.write("This application predicts whether a credit card holder will default on their payment next month based on various features.")

# Load the trained pipeline
@st.cache_resource
def load_pipeline():
    return joblib.load("credit_card_default_pipeline.pkl")

pipeline = load_pipeline()

limit_bal = st.number_input("Credit Limit (in NT dollars)", value=120000)
sex = st.selectbox("Sex", options=['Male', 'Female']).format_map({"Male": 1, "Female": 2})
sex_map = {"Male": 1, "Female": 2}
sex = sex_map[sex]
education = st.selectbox("Education Level", options=['Graduate School', 'University', 'High School', 'Others']).format_map({"Graduate School": 1, "University": 2, "High School": 3, "Others": 4})
education_map = {"Graduate School": 1, "University": 2, "High School": 3, "Others": 4}
education = education_map[education]    
marriage = st.selectbox("Marital Status", options=['Married', 'Single', 'Others']).format_map({"Married": 1, "Single": 2, "Others": 3})
marriage_map = {"Married": 1, "Single": 2, "Others": 3}
marriage = marriage_map[marriage]
age = st.number_input("Age", value=26)
pay_1 = st.number_input("Repayment Status in September", value=-1)
pay_2 = st.number_input("Repayment Status in August", value=2)
pay_3 = st.number_input("Repayment Status in July", value=0)
pay_4 = st.number_input("Repayment Status in June", value=0)
pay_5 = st.number_input("Repayment Status in May", value=0)
pay_6 = st.number_input("Repayment Status in April", value=2)
bill_amt1 = st.number_input("Bill Amount in September", value=1725.0)
bill_amt2 = st.number_input("Bill Amount in August", value=50000)
bill_amt3 = st.number_input("Bill Amount in July", value=2682.0)
bill_amt4 = st.number_input("Bill Amount in June", value=3272.0)
bill_amt5 = st.number_input("Bill Amount in May", value=3455.0)
bill_amt6 = st.number_input("Bill Amount in April", value=3261.0)
pay_amt1 = st.number_input("Payment Amount in September", value=0)
pay_amt2 = st.number_input("Payment Amount in August", value=1000)
pay_amt3 = st.number_input("Payment Amount in July", value=1000)
pay_amt4 = st.number_input("Payment Amount in June", value=1000)
pay_amt5 = st.number_input("Payment Amount in May", value=0)
pay_amt6 = st.number_input("Payment Amount in April", value=20000)
sum_bill_amt = bill_amt1 + bill_amt2 + bill_amt3 + bill_amt4 + bill_amt5 + bill_amt6
sum_pay_amt = pay_amt1 + pay_amt2 + pay_amt3 + pay_amt4 + pay_amt5 + pay_amt6

if st.button("Predict Default"):
    input_data = {
        'credit_limit': [limit_bal],
        'sex': [sex],
        'education_level': [education],
        'martial_status': [marriage],
        'age': [age],
        'repay_status_sept': [pay_1],
        'repay_status_aug': [pay_2],
        'repay_status_july': [pay_3],
        'repay_status_june': [pay_4],
        'repay_status_may': [pay_5],
        'repay_status_april': [pay_6],
        'bill_amt_sep': [bill_amt1],
        'bill_amt_aug': [bill_amt2],
        'bill_amt_july': [bill_amt3],
        'bill_amt_june': [bill_amt4],
        'bill_amt_may': [bill_amt5],
        'bill_amt_april': [bill_amt6],
        'pay_amt_sep': [pay_amt1],
        'pay_amt_aug': [pay_amt2],
        'pay_amt_july': [pay_amt3],
        'pay_amt_june': [pay_amt4],
        'pay_amt_may': [pay_amt5],
        'pay_amt_april': [pay_amt6],
        'sum_bill_amt': [sum_bill_amt],
        'sum_pay_amt': [sum_pay_amt]}
    
    prediction = predict_default(input_data)

    if prediction == 1:
        st.success("Prediction: The client is likely to default next month.")
    else:
        st.info("Prediction: The client is not likely to default next month.")