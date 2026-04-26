"""
NLP Processor — Entity Extraction
Extracts travel-related entities from user messages:
  - destinations / cities
  - number of days
  - budget
  - origin city
  - travel preferences
"""

import re
from typing import Optional
from app.data.destinations import CITY_ALIASES, DESTINATIONS


class NLPProcessor:
    """Extracts entities from natural language travel queries."""

    def __init__(self):
        # Sort aliases by length (longest first) for greedy matching
        self.sorted_aliases = sorted(CITY_ALIASES.keys(), key=len, reverse=True)

        # Budget keywords
        self.budget_keywords = {
            "budget": "budget",
            "cheap": "budget",
            "low cost": "budget",
            "sasta": "budget",
            "backpacker": "budget",
            "mid range": "mid-range",
            "moderate": "mid-range",
            "mid-range": "mid-range",
            "normal": "mid-range",
            "luxury": "luxury",
            "premium": "luxury",
            "5 star": "luxury",
            "five star": "luxury",
            "expensive": "luxury",
            "best hotel": "luxury",
        }

        # Travel type preferences
        self.travel_types = {
            "adventure": "adventure",
            "trekking": "adventure",
            "hiking": "adventure",
            "spiritual": "spiritual",
            "religious": "spiritual",
            "temple": "spiritual",
            "mandir": "spiritual",
            "pilgrimage": "spiritual",
            "beach": "beach",
            "sea": "beach",
            "coast": "beach",
            "nature": "nature",
            "wildlife": "nature",
            "safari": "nature",
            "jungle": "nature",
            "heritage": "heritage",
            "historical": "heritage",
            "fort": "heritage",
            "palace": "heritage",
            "romantic": "romantic",
            "honeymoon": "romantic",
            "family": "family",
            "kids": "family",
            "children": "family",
        }

    def extract_entities(self, text: str) -> dict:
        """
        Extract all travel-related entities from user text.
        Returns dict with: destinations, origin, days, budget_type, budget_amount,
                          preferences, raw_text
        """
        lower = text.lower().strip()

        return {
            "destinations": self._extract_destinations(lower),
            "origin": self._extract_origin(lower),
            "days": self._extract_days(lower),
            "budget_type": self._extract_budget_type(lower),
            "budget_amount": self._extract_budget_amount(lower),
            "preferences": self._extract_preferences(lower),
            "raw_text": text,
        }

    def _extract_destinations(self, text: str) -> list:
        """Extract destination cities/places from text."""
        found = []
        remaining = text

        # Remove origin context to avoid false matches
        origin_patterns = [
            r"from\s+\w+",
            r"se\s+\w+",  # Hinglish: "delhi se"
        ]
        for pattern in origin_patterns:
            match = re.search(pattern, remaining)
            if match:
                # Don't remove, just note the origin part
                pass

        # Check for destination keywords
        dest_patterns = [
            r"(?:to|visit|in|at|for|about|explore|see|go\s+to|plan\s+(?:for|a\s+trip\s+to)?|trip\s+to|travel\s+to|jaana|dekhna)\s+(.+)",
        ]

        target_text = remaining
        for pattern in dest_patterns:
            match = re.search(pattern, target_text, re.IGNORECASE)
            if match:
                target_text = match.group(1)
                break

        # Match city aliases (greedy, longest first)
        for alias in self.sorted_aliases:
            if alias in text:
                dest_key = CITY_ALIASES[alias]
                if dest_key not in found:
                    found.append(dest_key)

        return found

    def _extract_origin(self, text: str) -> Optional[str]:
        """Extract origin/starting city."""
        patterns = [
            r"from\s+(\w+(?:\s+\w+)?)",
            r"(\w+)\s+se\b",            # Hinglish: "delhi se"
            r"starting\s+from\s+(\w+)",
            r"(\w+)\s+to\s+\w+",        # "delhi to agra" → origin = delhi
        ]

        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                candidate = match.group(1).strip().lower()
                # Verify it's a known city
                if candidate in CITY_ALIASES:
                    return CITY_ALIASES[candidate]

        return None

    def _extract_days(self, text: str) -> Optional[int]:
        """Extract number of days from text."""
        patterns = [
            r"(\d+)\s*(?:days?|din|raat|nights?)",
            r"(?:for|of)\s*(\d+)\s*(?:days?|din)",
            r"(\d+)\s*day\s*(?:trip|tour|plan|itinerary)",
            r"(?:a|one)\s*week",
            r"(?:a|one)\s*weekend",
        ]

        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                if "week" in pattern:
                    return 7
                if "weekend" in pattern:
                    return 2
                try:
                    days = int(match.group(1))
                    return min(max(days, 1), 30)  # clamp 1-30
                except (ValueError, IndexError):
                    pass

        return None

    def _extract_budget_type(self, text: str) -> Optional[str]:
        """Extract budget type (budget/mid-range/luxury)."""
        for keyword, budget_type in self.budget_keywords.items():
            if keyword in text:
                return budget_type
        return None

    def _extract_budget_amount(self, text: str) -> Optional[int]:
        """Extract specific budget amount in rupees."""
        patterns = [
            r"(?:budget|spend|rs\.?|₹|inr)\s*(\d{1,6}(?:,\d{3})*(?:k)?)",
            r"(\d{1,6}(?:,\d{3})*(?:k)?)\s*(?:rupees|rs|₹|budget|per\s*day)",
        ]

        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                amount_str = match.group(1).replace(",", "")
                if amount_str.endswith("k"):
                    return int(float(amount_str[:-1]) * 1000)
                try:
                    return int(amount_str)
                except ValueError:
                    pass

        return None

    def _extract_preferences(self, text: str) -> list:
        """Extract travel preferences/interests."""
        found = []
        for keyword, pref in self.travel_types.items():
            if keyword in text and pref not in found:
                found.append(pref)
        return found
