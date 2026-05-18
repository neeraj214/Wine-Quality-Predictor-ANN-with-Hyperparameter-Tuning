from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
import pickle
import numpy as np
import json
import os

app = FastAPI(title="Wine Quality Predictor API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Global variables for models and preprocessors
model = None
scaler = None
label_encoder = None

class WineFeatures(BaseModel):
    fixed_acidity: float
    volatile_acidity: float
    citric_acid: float
    residual_sugar: float
    chlorides: float
    free_sulfur_dioxide: float
    total_sulfur_dioxide: float
    density: float
    pH: float
    sulphates: float
    alcohol: float

@app.on_event("startup")
def load_resources():
    global model, scaler, label_encoder
    
    # Load model
    model_paths = [
        os.path.join(BASE_DIR, "models", "random_search_best_model.h5"), 
        os.path.join(BASE_DIR, "models", "baseline_ann.h5")
    ]
    for path in model_paths:
        if os.path.exists(path):
            try:
                model = tf.keras.models.load_model(path)
                print(f"Loaded model from {path}")
                break
            except Exception as e:
                print(f"Error loading model from {path}: {e}")
                
    if model is None:
        print("Warning: No model could be loaded.")

    # Load scaler
    scaler_path = os.path.join(BASE_DIR, "models", "scaler.pkl")
    if not os.path.exists(scaler_path):
        scaler_path = os.path.join(BASE_DIR, "data", "processed", "scaler.pkl")
    if os.path.exists(scaler_path):
        with open(scaler_path, "rb") as f:
            scaler = pickle.load(f)
            
    # Load label encoder
    le_path = os.path.join(BASE_DIR, "models", "label_encoder.pkl")
    if not os.path.exists(le_path):
        le_path = os.path.join(BASE_DIR, "data", "processed", "label_encoder.pkl")
    if os.path.exists(le_path):
        with open(le_path, "rb") as f:
            label_encoder = pickle.load(f)

@app.get("/health")
def health_check():
    return {
        "status": "ok", 
        "model": "loaded" if model is not None else "not loaded"
    }

@app.get("/comparison")
def get_comparison():
    comp_path = os.path.join(BASE_DIR, "outputs", "model_comparison.json")
    if not os.path.exists(comp_path):
        raise HTTPException(status_code=404, detail="Comparison file not found")
    
    with open(comp_path, "r") as f:
        data = json.load(f)
    return data

@app.post("/predict")
def predict(features: WineFeatures):
    if model is None or scaler is None or label_encoder is None:
        raise HTTPException(status_code=500, detail="Model or preprocessors not loaded properly")
        
    try:
        # Extract features
        feature_values = [
            features.fixed_acidity,
            features.volatile_acidity,
            features.citric_acid,
            features.residual_sugar,
            features.chlorides,
            features.free_sulfur_dioxide,
            features.total_sulfur_dioxide,
            features.density,
            features.pH,
            features.sulphates,
            features.alcohol
        ]
        
        # Convert to 2D numpy array
        input_data = np.array([feature_values])
        
        # Scale input
        scaled_input = scaler.transform(input_data)
        
        # Predict
        prediction = model.predict(scaled_input, verbose=0)
        
        probabilities = [float(p) for p in prediction[0]]
        predicted_class_idx = int(np.argmax(prediction[0]))
        confidence = float(prediction[0][predicted_class_idx])
        
        # Decode label
        predicted_quality = int(label_encoder.inverse_transform([predicted_class_idx])[0])
        
        return {
            "predicted_quality": predicted_quality,
            "confidence": confidence,
            "probabilities": probabilities
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
