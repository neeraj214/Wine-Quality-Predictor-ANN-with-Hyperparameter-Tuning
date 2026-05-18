# Wine Quality Predictor 🍷

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-4.0+-646CFF.svg?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC.svg?logo=tailwind-css&logoColor=white)

A full-stack machine learning application that predicts wine quality based on physicochemical tests. This project demonstrates Artificial Neural Network (ANN) modeling, hyperparameter tuning techniques (Grid Search vs Random Search), and a modern React frontend to visualize and interact with the models.

**[🔴 Live Demo: Wine Quality Predictor](#)** *(Placeholder for demo link)*

## 🏗️ Architecture

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  React + Vite   │──────▶│   FastAPI App   │──────▶│  Trained ANNs   │
│   (Frontend)    │◀──────│    (Backend)    │◀──────│  (.keras files) │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                         │
         ▼                         ▼
   Vercel Hosting            Render Hosting
```

## 📊 Dataset

We use the [UCI Wine Quality Dataset](https://archive.ics.uci.edu/ml/datasets/wine+quality).
- **Features:** 11 physicochemical properties (Fixed Acidity, Volatile Acidity, Citric Acid, Residual Sugar, Chlorides, Free Sulfur Dioxide, Total Sulfur Dioxide, Density, pH, Sulphates, Alcohol).
- **Target:** Quality score (between 0 and 10).
- The red and white wine variants have been merged into a unified dataset for a more robust predictive model.

## 🤖 Models & Evaluation

The project trains an Artificial Neural Network (ANN) to predict the quality score. We compared three different strategies to find the best performing model:

| Model Variant | Strategy |
|---------------|----------|
| **Baseline** | Default ANN architecture with standard hyperparameters. |
| **Grid Search** | Exhaustive search over a specified parameter grid (learning rate, neurons, layers, etc.). |
| **Random Search**| Randomized search over hyperparameters, often finding optimal settings faster. |

*Detailed metrics (Accuracy, Precision, Recall, F1-Score) are dynamically loaded and visualized in the frontend's "Compare Models" dashboard.*

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/neeraj214/Wine-Quality-Predictor-ANN-with-Hyperparameter-Tuning.git
cd Wine-Quality-Predictor-ANN-with-Hyperparameter-Tuning
```

### 2. Backend Setup (FastAPI + Model Inference)
```bash
# Navigate to backend folder
cd backend

# Create virtual environment & activate
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```
*The backend will be running at `http://localhost:8000`*

### 3. Frontend Setup (React + Vite)
```bash
# Open a new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The frontend will be running at `http://localhost:5173`*

## ☁️ Deployment

- **Backend:** Configured for deployment on [Render](https://render.com).
- **Frontend:** Configured for deployment on [Vercel](https://vercel.com) (or Netlify).
- Make sure to set the `VITE_API_URL` environment variable in your frontend hosting settings to point to your live backend URL.

---
**Author:** [@neeraj214](https://github.com/neeraj214)