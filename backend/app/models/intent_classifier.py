"""
ML-based Intent Classifier
Uses scikit-learn TF-IDF + SVM pipeline for classifying user messages
into travel-related intents (plan_trip, ask_route, ask_hotel, etc.)
"""

import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score

from app.data.training_data import TRAINING_DATA, INTENT_LABELS


MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "trained_models")
MODEL_PATH = os.path.join(MODEL_DIR, "intent_classifier.pkl")


class IntentClassifier:
    """
    Classifies travel chatbot messages into intents using a trained SVM model.
    """

    def __init__(self):
        self.pipeline = None
        self.is_trained = False
        self._load_or_train()

    def _load_or_train(self):
        """Load existing model or train a new one."""
        if os.path.exists(MODEL_PATH):
            try:
                self.pipeline = joblib.load(MODEL_PATH)
                self.is_trained = True
                print(f"✅ Intent classifier loaded from {MODEL_PATH}")
            except Exception as e:
                print(f"⚠️  Failed to load model: {e}. Training new model...")
                self.train()
        else:
            print("🔧 No trained model found. Training new intent classifier...")
            self.train()

    def train(self):
        """
        Train the intent classification model using TF-IDF + LinearSVC.
        """
        texts = [sample[0] for sample in TRAINING_DATA]
        labels = [sample[1] for sample in TRAINING_DATA]

        # Build pipeline: TF-IDF vectorizer → SVM classifier
        self.pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                lowercase=True,
                analyzer="word",
                ngram_range=(1, 2),       # unigrams + bigrams
                max_features=5000,
                stop_words=None,           # keep all words (important for short texts)
                sublinear_tf=True,
            )),
            ("classifier", LinearSVC(
                C=1.0,
                max_iter=10000,
                class_weight="balanced",   # handle class imbalance
            ))
        ])

        # Train
        self.pipeline.fit(texts, labels)
        self.is_trained = True

        # Cross-validation score
        scores = cross_val_score(self.pipeline, texts, labels, cv=min(5, len(set(labels))), scoring="accuracy")
        print(f"✅ Model trained — Cross-validation accuracy: {scores.mean():.2%} (±{scores.std():.2%})")

        # Save model
        os.makedirs(MODEL_DIR, exist_ok=True)
        joblib.dump(self.pipeline, MODEL_PATH)
        print(f"💾 Model saved to {MODEL_PATH}")

        return {"accuracy": float(scores.mean()), "std": float(scores.std())}

    def predict(self, text: str) -> dict:
        """
        Predict the intent of a user message.
        Returns: {"intent": str, "confidence": float, "label": str}
        """
        if not self.is_trained or self.pipeline is None:
            return {"intent": "unknown", "confidence": 0.0, "label": "Unknown"}

        # Clean input
        cleaned = text.strip().lower()
        if not cleaned:
            return {"intent": "unknown", "confidence": 0.0, "label": "Unknown"}

        # Predict
        intent = self.pipeline.predict([cleaned])[0]

        # Get confidence using decision function distance
        try:
            decision = self.pipeline.decision_function([cleaned])
            if decision.ndim == 1:
                confidence = float(1 / (1 + np.exp(-np.max(np.abs(decision)))))
            else:
                confidence = float(1 / (1 + np.exp(-np.max(decision))))
        except Exception:
            confidence = 0.8  # default if decision function fails

        # Minimum confidence threshold
        if confidence < 0.35:
            intent = "unknown"

        label = INTENT_LABELS.get(intent, "Unknown")

        return {
            "intent": intent,
            "confidence": round(confidence, 3),
            "label": label,
        }

    def get_model_info(self) -> dict:
        """Return model metadata."""
        return {
            "is_trained": self.is_trained,
            "training_samples": len(TRAINING_DATA),
            "num_intents": len(INTENT_LABELS),
            "intents": list(INTENT_LABELS.keys()),
            "model_path": MODEL_PATH,
        }
