"""
Recommendation Engine (ML)
Handles user preference learning, search logging, and smart ranking of travel options.
Uses heuristic scoring initially, designed to plugin TensorFlow/PyTorch models later.
"""

from app.database import get_db
from datetime import datetime
from typing import List, Dict, Any

class RecommendationEngine:
    """
    AI-driven Recommendation System.
    """

    async def log_search(self, user_id: str, search_type: str, query: Dict[str, Any]):
        """
        Log user search intent for future ML training.
        """
        db = get_db()
        if db is None: return

        collection_map = {
            "train": "train_search_logs",
            "flight": "flight_search_logs",
            "bus": "bus_search_logs",
            "hotel": "hotel_search_logs",
            "food": "food_search_logs"
        }
        
        col_name = collection_map.get(search_type)
        if col_name:
            try:
                await db[col_name].insert_one({
                    "user_id": user_id,
                    "timestamp": datetime.utcnow(),
                    "search_query": query,
                    "meta": {"version": "v1.0", "engine": "heuristic"}
                })
            except Exception as e:
                print(f"Log Error: {e}")

    async def rank_options(self, user_id: str, options: List[Dict], type: str) -> List[Dict]:
        """
        Re-rank options based on user history and preferences.
        Currently implements a weighted scoring algorithm.
        """
        # 1. Fetch user profile (simulated for now)
        # db = get_db()
        # user_pref = await db.users.find_one({"_id": user_id}, {"preferences": 1})
        
        start_time = datetime.now()
        
        # 2. Score Options
        scored_options = []
        for opt in options:
            score = 0
            
            # Duration weight (Time is money)
            if 'duration_mins' in opt:
                score -= opt['duration_mins'] * 0.1
            
            # Price weight (Budget sensitivity)
            # This would be dynamic based on User Profile "Budget" vs "Luxury"
            if 'price' in opt and isinstance(opt['price'], (int, float)):
                 score -= opt['price'] * 0.05

            # Rating weight
            if 'rating' in opt:
                score += opt['rating'] * 20

            opt['_ml_score'] = score
            scored_options.append(opt)

        # 3. Sort by Score
        ranked = sorted(scored_options, key=lambda x: x['_ml_score'], reverse=True)
        
        # Remove internal score before returning
        for r in ranked:
            del r['_ml_score']
            
        return ranked

recommendation_engine = RecommendationEngine()
