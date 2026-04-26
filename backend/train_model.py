"""
Train / Re-train the ML Intent Classifier
Run with: python train_model.py

This script trains the intent classification model using
TF-IDF + LinearSVC and saves it to trained_models/intent_classifier.pkl
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from app.models.intent_classifier import IntentClassifier


def main():
    print("=" * 50)
    print("🧠 India Travel Pal — ML Model Training")
    print("=" * 50)
    print()

    # Force re-training
    classifier = IntentClassifier()
    result = classifier.train()

    print()
    print(f"📊 Cross-validation Accuracy: {result['accuracy']:.2%}")
    print(f"📊 Standard Deviation: {result['std']:.2%}")
    print()

    # Test predictions
    test_queries = [
        "hello",
        "plan a trip to somnath",
        "tell me about dwarka",
        "how to reach gir from ahmedabad",
        "budget for goa trip",
        "where to stay in jaipur",
        "what to eat in ahmedabad",
        "best time to visit rann of kutch",
        "tips for manali trip",
        "places near statue of unity",
        "thanks a lot",
        "bye",
    ]

    print("🧪 Test Predictions:")
    print("-" * 50)
    for query in test_queries:
        result = classifier.predict(query)
        print(f"  \"{query}\"")
        print(f"    → Intent: {result['intent']} | Confidence: {result['confidence']:.1%}")
        print()

    print("✅ Training complete!")


if __name__ == "__main__":
    main()
