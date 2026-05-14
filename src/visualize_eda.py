import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

def visualize_eda():
    # Load dataset
    input_path = os.path.join('data', 'wine_quality.csv')
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Please run src/data_exploration.py first.")
        return

    df = pd.read_csv(input_path)

    # Create outputs directory if it doesn't exist
    os.makedirs('outputs', exist_ok=True)

    # Set aesthetic style for plots
    sns.set_theme(style="whitegrid")

    # 1. Plot histogram for each feature
    print("Generating histograms...")
    # Exclude 'type' as it is categorical
    numerical_cols = df.select_dtypes(include=['float64', 'int64']).columns
    df[numerical_cols].hist(bins=20, figsize=(15, 12), color='skyblue', edgecolor='black')
    plt.suptitle("Feature Distributions", fontsize=16)
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.savefig('outputs/histograms.png')
    plt.close()

    # 2. Plot correlation heatmap
    print("Generating correlation heatmap...")
    plt.figure(figsize=(12, 10))
    # Select only numeric columns for correlation
    corr_matrix = df[numerical_cols].corr()
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
    plt.title("Feature Correlation Heatmap", fontsize=16)
    plt.savefig('outputs/heatmap.png')
    plt.close()

    # 3. Plot class distribution (quality counts)
    print("Generating class distribution plot...")
    plt.figure(figsize=(10, 6))
    sns.countplot(data=df, x='quality', palette='viridis')
    plt.title("Distribution of Wine Quality Classes", fontsize=16)
    plt.xlabel("Quality Score")
    plt.ylabel("Count")
    plt.savefig('outputs/class_dist.png')
    plt.close()

    print("\nVisualizations saved successfully in the 'outputs/' folder:")
    print("- outputs/histograms.png")
    print("- outputs/heatmap.png")
    print("- outputs/class_dist.png")

if __name__ == "__main__":
    visualize_eda()
