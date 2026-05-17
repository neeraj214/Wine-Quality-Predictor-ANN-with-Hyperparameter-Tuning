FROM python:3.10-slim

# Set the working directory to the project root
WORKDIR /app

# Copy requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy required directories
COPY models/ ./models/
COPY outputs/ ./outputs/
# Proactively copying data/processed since main.py needs the scaler and label encoder to predict
COPY data/processed/ ./data/processed/

# Copy the FastAPI app
COPY backend/main.py ./backend/

# Switch working directory to the backend so the CMD works exactly as requested
WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
