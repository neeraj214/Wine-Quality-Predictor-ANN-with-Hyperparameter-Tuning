import numpy as np
import os
import json
from tensorflow.keras.wrappers.scikit_learn import KerasClassifier  # type: ignore
from sklearn.model_selection import GridSearchCV
from model import build_model  # type: ignore
import tensorflow as tf

def perform_grid_search():
    # Load preprocessed data
    if not os.path.exists('data/processed/X_train.npy'):
        print("Error: Preprocessed data not found. Please run src/preprocess.py first.")
        return

    X_train = np.load('data/processed/X_train.npy')
    y_train = np.load('data/processed/y_train.npy')
    
    # Get constants for the model
    input_dim = X_train.shape[1]
    n_classes = y_train.shape[1]
    
    print(f"Initializing Grid Search with {X_train.shape[0]} samples...")
    print(f"Input dimension: {input_dim}, Classes: {n_classes}")

    # Define a local function that fixes constants but allows hyperparameter variation
    def model_factory(neurons=128, layers=2, learning_rate=0.001, dropout=0.3):
        model = build_model(
            neurons=neurons, 
            layers=layers, 
            learning_rate=learning_rate, 
            dropout=dropout, 
            input_shape=input_dim, 
            num_classes=n_classes
        )
        # Re-compile with sparse loss to work with integer labels in GridSearchCV
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        return model

    # Wrap the model
    model = KerasClassifier(build_fn=model_factory, verbose=0)

    # Define parameter grid
    param_grid = {
        'neurons': [64, 128],
        'layers': [1, 2],
        'learning_rate': [0.001, 0.01],
        'batch_size': [32, 64],
        'epochs': [50]
    }

    print("Starting GridSearchCV (cv=3, n_jobs=-1)... This may take a few minutes.")
    grid = GridSearchCV(
        estimator=model, 
        param_grid=param_grid, 
        cv=3, 
        scoring='accuracy', 
        n_jobs=-1
    )
    
    # Convert y_train to integers for scikit-learn compatibility
    y_train_indices = np.argmax(y_train, axis=1)
    grid_result = grid.fit(X_train, y_train_indices)

    # Summarize results
    print("\n" + "="*40)
    print("      GRID SEARCH RESULTS")
    print("="*40)
    print(f"Best Score: {grid_result.best_score_:.4f}")
    print(f"Best Params: {grid_result.best_params_}")

    # Save best parameters to JSON
    os.makedirs('outputs', exist_ok=True)
    with open('outputs/grid_search_best_params.json', 'w') as f:
        # Convert types if necessary for JSON serialization
        json.dump(grid_result.best_params_, f, indent=4)
    print("\nBest parameters saved to outputs/grid_search_best_params.json")

    # Save the best model
    os.makedirs('models', exist_ok=True)
    best_model = grid_result.best_estimator_.model
    best_model.save('models/grid_search_best_model.h5')
    print("Best model saved to models/grid_search_best_model.h5")

if __name__ == "__main__":
    # Ensure src is in path if needed, though usually handled by running from root
    perform_grid_search()
