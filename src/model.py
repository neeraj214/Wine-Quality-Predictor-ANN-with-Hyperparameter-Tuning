import numpy as np
import os
import json
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.metrics import classification_report, accuracy_score
import pickle

def build_model(neurons=128, layers=2, learning_rate=0.001, dropout=0.3, input_shape=11, num_classes=7):
    """
    Defines and compiles the ANN architecture based on user requirements.
    """
    model = Sequential()
    for i in range(layers):
        if i == 0:
            model.add(Dense(neurons, activation='relu', input_shape=(input_shape,)))
        else:
            model.add(Dense(neurons, activation='relu'))
        model.add(Dropout(dropout))
    
    model.add(Dense(num_classes, activation='softmax'))
    
    model.compile(
        optimizer=Adam(learning_rate=learning_rate),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def train_model():
    # Load preprocessed arrays
    X_train = np.load('data/processed/X_train.npy')
    X_test = np.load('data/processed/X_test.npy')
    y_train = np.load('data/processed/y_train.npy')
    y_test = np.load('data/processed/y_test.npy')
    
    input_shape = X_train.shape[1]
    num_classes = y_train.shape[1]
    
    print(f"Building model with input_shape={input_shape} and num_classes={num_classes}...")
    model = build_model(
        neurons=128, 
        layers=2, 
        learning_rate=0.001, 
        dropout=0.3, 
        input_shape=input_shape, 
        num_classes=num_classes
    )
    
    # Define EarlyStopping
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=10, 
        restore_best_weights=True
    )
    
    # Train model
    print("Starting training...")
    history = model.fit(
        X_train, y_train,
        epochs=100,
        batch_size=32,
        validation_split=0.1,
        callbacks=[early_stopping],
        verbose=1
    )
    
    # Create directories if they don't exist
    os.makedirs('models', exist_ok=True)
    os.makedirs('outputs', exist_ok=True)
    
    # Save model
    model.save('models/baseline_ann.h5')
    print("\nModel saved as models/baseline_ann.h5")
    
    # Save training history
    with open('outputs/baseline_history.json', 'w') as f:
        json.dump(history.history, f)
    print("Training history saved as outputs/baseline_history.json")
        
    # Evaluate on test set
    y_pred = model.predict(X_test)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_test_classes = np.argmax(y_test, axis=1)
    
    # Load label encoder to get original class names for report
    with open('models/label_encoder.pkl', 'rb') as f:
        le = pickle.load(f)
    target_names = [str(c) for c in le.classes_]
    
    # Final output
    print("\n" + "="*40)
    print("      FINAL TEST EVALUATION")
    print("="*40)
    print(f"Test Accuracy: {accuracy_score(y_test_classes, y_pred_classes):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test_classes, y_pred_classes, target_names=target_names))

if __name__ == "__main__":
    train_model()
