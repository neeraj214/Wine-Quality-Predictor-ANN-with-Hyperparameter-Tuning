import pandas as pd
import os

def explore_data():
    # URLs for the UCI Wine Quality dataset
    red_wine_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv"
    white_wine_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-white.csv"

    print("Downloading and loading datasets...")
    # Load datasets (UCI wine quality CSVs use ';' as separator)
    df_red = pd.read_csv(red_wine_url, sep=';')
    df_white = pd.read_csv(white_wine_url, sep=';')

    # Add 'type' column
    df_red['type'] = 'red'
    df_white['type'] = 'white'

    # Merge datasets
    df_wine = pd.concat([df_red, df_white], ignore_index=True)

    # 1. Print shape, dtypes, head(5)
    print("\n--- Dataset Shape ---")
    print(df_wine.shape)

    print("\n--- Column Data Types ---")
    print(df_wine.dtypes)

    print("\n--- First 5 Rows ---")
    print(df_wine.head(5))

    # 2. Print mean, median, std for each feature using describe()
    # describe() includes mean and std by default. Median is the 50% percentile.
    print("\n--- Descriptive Statistics (Mean, Median, Std) ---")
    stats = df_wine.describe().T[['mean', '50%', 'std']]
    stats.rename(columns={'50%': 'median'}, inplace=True)
    print(stats)

    # 3. Check and print missing values count per column
    print("\n--- Missing Values Count per Column ---")
    print(df_wine.isnull().sum())

    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)

    # 4. Save merged dataset
    output_path = os.path.join('data', 'wine_quality.csv')
    df_wine.to_csv(output_path, index=False)
    print(f"\nMerged dataset saved to: {output_path}")

if __name__ == "__main__":
    explore_data()
