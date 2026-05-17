import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
import tensorflow as tf

def preprocess_data():
    # Load dataset
    input_path = os.path.join('data', 'wine_quality.csv')
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Please run src/data_exploration.py first.")
        return

    df = pd.read_csv(input_path)

    # 1. Drop 'type' column
    print("Dropping 'type' column...")
    df = df.drop(columns=['type'])

    # 2. Separate features (X) and label (y)
    X = df.drop(columns=['quality'])
    y = df['quality']

    # 3. Apply MinMaxScaler to all features
    print("Applying MinMaxScaler to features...")
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)

    # 4. Convert quality scores to 0-indexed categorical labels
    print("Encoding labels with LabelEncoder...")
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # 5. Apply to_categorical() for one-hot encoding
    print("Applying one-hot encoding...")
    y_categorical = tf.keras.utils.to_categorical(y_encoded)

    # 6. Split 80-20 train/test
    print("Splitting data into train and test sets (80-20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_categorical, test_size=0.20, random_state=42
    )

    # Create directories for saving
    os.makedirs(os.path.join('data', 'processed'), exist_ok=True)
    os.makedirs('models', exist_ok=True)

    # 7. Save: X_train, X_test, y_train, y_test as numpy arrays
    print("Saving processed arrays to data/processed/...")
    np.save('data/processed/X_train.npy', X_train)
    np.save('data/processed/X_test.npy', X_test)
    np.save('data/processed/y_train.npy', y_train)
    np.save('data/processed/y_test.npy', y_test)

    # 8. Save scaler and label encoder
    print("Saving scaler and label encoder to models/...")
    with open('models/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    with open('models/label_encoder.pkl', 'wb') as f:
        pickle.dump(le, f)

    print("\nPreprocessing complete!")
    print(f"Train set shape: {X_train.shape}")  # type: ignore
    print(f"Test set shape: {X_test.shape}")  # type: ignore
    print("Artifacts saved in data/processed/ and models/")

if __name__ == "__main__":
    preprocess_data()
