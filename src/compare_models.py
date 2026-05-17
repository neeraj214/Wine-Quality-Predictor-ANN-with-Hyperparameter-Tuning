import numpy as np
import pandas as pd
import json
import os
from tensorflow.keras.models import load_model
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def compare_models():
    """
    Loads all three trained ANN models, evaluates them on the test set,
    saves the comparison metrics to a JSON file, and prints a summary table.
    """
    # Load test data
    print("Loading test data...")
    X_test_path = os.path.join('data', 'processed', 'X_test.npy')
    y_test_path = os.path.join('data', 'processed', 'y_test.npy')
    
    if not os.path.exists(X_test_path) or not os.path.exists(y_test_path):
        print("Error: Processed test data not found. Please run src/preprocess.py first.")
        return

    X_test = np.load(X_test_path)
    y_test = np.load(y_test_path)
    
    # Convert one-hot encoded y_test to class labels for metric calculations
    y_true = np.argmax(y_test, axis=1)
    
    models_to_evaluate = {
        "baseline": "baseline_ann.h5",
        "grid_search": "grid_search_best_model.h5",
        "random_search": "random_search_best_model.h5"
    }
    
    results = {}
    
    print("\nEvaluating models...")
    for name, filename in models_to_evaluate.items():
        model_path = os.path.join('models', filename)
        if not os.path.exists(model_path):
            print(f"Warning: {model_path} not found. Skipping {name}.")
            continue
            
        print(f"  Evaluating {name} model...")
        try:
            model = load_model(model_path)
            y_pred_prob = model.predict(X_test, verbose=0)
            y_pred = np.argmax(y_pred_prob, axis=1)
            
            metrics = {
                "accuracy": float(accuracy_score(y_true, y_pred)),
                "precision": float(precision_score(y_true, y_pred, average='weighted', zero_division=0.0)), # type: ignore
                "recall": float(recall_score(y_true, y_pred, average='weighted', zero_division=0.0)), # type: ignore
                "f1-score": float(f1_score(y_true, y_pred, average='weighted', zero_division=0.0)) # type: ignore
            }
            results[name] = metrics
            
            # Print individual metrics as requested
            print(f"    - Accuracy:  {metrics['accuracy']:.4f}")
            print(f"    - Precision: {metrics['precision']:.4f}")
            print(f"    - Recall:    {metrics['recall']:.4f}")
            print(f"    - F1-Score:  {metrics['f1-score']:.4f}")
            
        except Exception as e:
            print(f"Error evaluating {name}: {e}")

    # Save results to outputs/model_comparison.json
    os.makedirs('outputs', exist_ok=True)
    output_path = os.path.join('outputs', 'model_comparison.json')
    print(f"\nSaving comparison results to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=4)
        
    # Print formatted comparison table in terminal
    if results:
        print("\n" + "="*50)
        print("         MODEL COMPARISON SUMMARY")
        print("="*50)
        df_results = pd.DataFrame(results).T
        # Round values for cleaner display
        print(df_results.round(4))
        print("="*50)
    else:
        print("\nNo models were evaluated successfully.")

if __name__ == "__main__":
    compare_models()
