from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Employee Attrition Prediction API")

# Load the trained pipeline
pipeline = joblib.load("Employee_Attrition_Prediction\employee_attrition_pipeline.pkl")

THRESHOLD = 0.4

class EmployeeData(BaseModel):
    Age: int
    DailyRate: int
    HourlyRate: int
    MonthlyRate: int
    BusinessTravel: str
    Department: str
    DistanceFromHome: int
    Education: int
    EducationField: str
    EnvironmentSatisfaction: int
    Gender: str
    JobInvolvement: int
    JobLevel: int
    JobRole: str
    JobSatisfaction: int
    MaritalStatus: str
    MonthlyIncome: int
    NumCompaniesWorked: int
    OverTime: str
    PercentSalaryHike: int
    PerformanceRating: int
    RelationshipSatisfaction: int
    StockOptionLevel: int
    TotalWorkingYears: int
    TrainingTimesLastYear: int
    WorkLifeBalance: int
    YearsAtCompany: int
    YearsInCurrentRole: int
    YearsSinceLastPromotion: int
    YearsWithCurrManager: int

@app.get("/")
async def root():
    return {"message": "Welcome to the Employee Attrition Prediction API!"}

@app.post("/predict")
def predict_attrition(data: EmployeeData):
    # Convert the input data to a DataFrame
    input_data = pd.DataFrame([data.dict()])

    # Make predictions using the loaded pipeline
    prob = pipeline.predict_proba(input_data)[0, 1]

    # Determine the prediction based on the threshold
    pred = int(prob >= THRESHOLD)

    return {
        "attrition_probability": float(prob),
        "prediction": pred,
        "threshold_used": THRESHOLD
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)