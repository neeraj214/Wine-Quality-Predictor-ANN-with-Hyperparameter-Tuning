import json
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
import pickle
from tensorflow.keras.models import load_model
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score

def plot_training_history(history_path, output_dir):
    """
    Plots accuracy and loss curves from training history.
    """
    with open(history_path, 'r') as f:
        history = json.load(f)
    
    epochs = range(1, len(history['accuracy']) + 1)
    
    # 1. Accuracy Curve
    plt.figure(figsize=(10, 6))
    plt.plot(epochs, history['accuracy'], 'b-', label='Training Accuracy')
    plt.plot(epochs, history['val_accuracy'], 'r-', label='Validation Accuracy')
    plt.title('Training and Validation Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True)
    plt.savefig(os.path.join(output_dir, 'accuracy_curve.png'))
    plt.close()
    print(f"Accuracy curve saved to {output_dir}/accuracy_curve.png")
    
    # 2. Loss Curve
    plt.figure(figsize=(10, 6))
    plt.plot(epochs, history['loss'], 'b-', label='Training Loss')
    plt.plot(epochs, history['val_loss'], 'r-', label='Validation Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)
    plt.savefig(os.path.join(output_dir, 'loss_curve.png'))
    plt.close()
    print(f"Loss curve saved to {output_dir}/loss_curve.png")

def plot_confusion_matrix(model_path, data_dir, output_dir):
    """
    Generates a confusion matrix plot using the test set.
    """
    # Load model and test data
    model = load_model(model_path)
    X_test = np.load(os.path.join(data_dir, 'X_test.npy'))
    y_test = np.load(os.path.join(data_dir, 'y_test.npy'))
    
    # Predictions
    y_pred = model.predict(X_test)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_test_classes = np.argmax(y_test, axis=1)
    
    # Load label encoder for target names
    with open('models/label_encoder.pkl', 'rb') as f:
        le = pickle.load(f)
    target_names = [str(c) for c in le.classes_]
    
    # Generate Confusion Matrix
    cm = confusion_matrix(y_test_classes, y_pred_classes)
    
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=target_names, yticklabels=target_names)
    plt.title('Confusion Matrix - Baseline ANN')
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.savefig(os.path.join(output_dir, 'confusion_matrix.png'))
    plt.close()
    print(f"Confusion matrix saved to {output_dir}/confusion_matrix.png")
    
    # Print Classification Report
    print("\n" + "="*40)
    print("      FINAL PERFORMANCE REPORT")
    print("="*40)
    print(f"Accuracy Score: {accuracy_score(y_test_classes, y_pred_classes):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test_classes, y_pred_classes, target_names=target_names))

if __name__ == "__main__":
    history_file = 'outputs/baseline_history.json'
    model_file = 'models/baseline_ann.h5'
    data_folder = 'data/processed'
    output_folder = 'outputs'
    
    if not os.path.exists(history_file):
        print(f"Error: {history_file} not found. Please run src/model.py first.")
    elif not os.path.exists(model_file):
        print(f"Error: {model_file} not found. Please run src/model.py first.")
    else:
        plot_training_history(history_file, output_folder)
        plot_confusion_matrix(model_file, data_folder, output_folder)
