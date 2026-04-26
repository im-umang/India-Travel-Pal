"""
Hotel & Accommodation Data for Indian Tourist Destinations
Includes budget, mid-range, and luxury options with price estimates
"""

HOTELS = {
    "somnath": [
        {"name": "Hotel Somnath Sagar", "type": "Budget", "price_range": "₹800 - ₹1,500/night", "rating": 3.5, "area": "Near Temple"},
        {"name": "Lords Inn Somnath", "type": "Mid-Range", "price_range": "₹2,000 - ₹4,000/night", "rating": 4.0, "area": "Main Road"},
        {"name": "The Fern Residency", "type": "Premium", "price_range": "₹4,500 - ₹7,000/night", "rating": 4.3, "area": "Somnath Beach Road"},
    ],
    "dwarka": [
        {"name": "Hotel Dwarka", "type": "Budget", "price_range": "₹600 - ₹1,200/night", "rating": 3.2, "area": "Temple Road"},
        {"name": "Hotel Gomti Dwarka", "type": "Mid-Range", "price_range": "₹1,800 - ₹3,500/night", "rating": 3.8, "area": "Near Dwarkadhish Temple"},
        {"name": "The Fern Dwarka", "type": "Premium", "price_range": "₹4,000 - ₹6,500/night", "rating": 4.2, "area": "Highway"},
    ],
    "gir": [
        {"name": "Gir Birding Lodge", "type": "Budget", "price_range": "₹1,500 - ₹3,000/night", "rating": 3.8, "area": "Near Park Gate"},
        {"name": "Gir Jungle Lodge", "type": "Mid-Range", "price_range": "₹3,500 - ₹5,500/night", "rating": 4.0, "area": "Sasan Village"},
        {"name": "The Fern Gir Forest Resort", "type": "Luxury", "price_range": "₹6,000 - ₹12,000/night", "rating": 4.5, "area": "Forest Area"},
    ],
    "statue_of_unity": [
        {"name": "Tent City Narmada", "type": "Premium", "price_range": "₹6,000 - ₹15,000/night", "rating": 4.3, "area": "Near SoU"},
        {"name": "Hotel Narmada SoU", "type": "Mid-Range", "price_range": "₹2,500 - ₹4,500/night", "rating": 3.9, "area": "Kevadia Colony"},
        {"name": "Budget Stay Kevadia", "type": "Budget", "price_range": "₹1,000 - ₹2,000/night", "rating": 3.3, "area": "Kevadia Village"},
    ],
    "ahmedabad": [
        {"name": "Hotel Metropole", "type": "Budget", "price_range": "₹800 - ₹1,800/night", "rating": 3.5, "area": "Lal Darwaja"},
        {"name": "Lemon Tree Hotel", "type": "Mid-Range", "price_range": "₹3,000 - ₹5,000/night", "rating": 4.0, "area": "S.G. Highway"},
        {"name": "Hyatt Regency", "type": "Luxury", "price_range": "₹7,000 - ₹15,000/night", "rating": 4.6, "area": "Ashram Road"},
        {"name": "ITC Narmada", "type": "Luxury", "price_range": "₹9,000 - ₹20,000/night", "rating": 4.7, "area": "Vastrapur"},
    ],
    "rann_of_kutch": [
        {"name": "Rann Utsav Tent City", "type": "Premium", "price_range": "₹5,000 - ₹15,000/night", "rating": 4.4, "area": "White Rann"},
        {"name": "Regenta Resort Bhuj", "type": "Mid-Range", "price_range": "₹3,000 - ₹5,500/night", "rating": 4.0, "area": "Bhuj City"},
        {"name": "Hotel Ilark", "type": "Budget", "price_range": "₹1,000 - ₹2,000/night", "rating": 3.4, "area": "Bhuj"},
    ],
    "agra": [
        {"name": "Hotel Sidhartha", "type": "Budget", "price_range": "₹1,000 - ₹2,500/night", "rating": 3.5, "area": "Near Taj Mahal"},
        {"name": "Crystal Sarovar Premiere", "type": "Mid-Range", "price_range": "₹3,500 - ₹6,000/night", "rating": 4.1, "area": "Fatehabad Road"},
        {"name": "The Oberoi Amarvilas", "type": "Luxury", "price_range": "₹25,000 - ₹50,000/night", "rating": 4.9, "area": "Taj View"},
    ],
    "goa": [
        {"name": "Zostel Goa", "type": "Budget", "price_range": "₹500 - ₹1,500/night", "rating": 4.0, "area": "Calangute"},
        {"name": "Resort Lagoa Azul", "type": "Mid-Range", "price_range": "₹3,000 - ₹6,000/night", "rating": 4.1, "area": "Baga Beach"},
        {"name": "Taj Exotica", "type": "Luxury", "price_range": "₹12,000 - ₹30,000/night", "rating": 4.7, "area": "South Goa"},
    ],
    "jaipur": [
        {"name": "Zostel Jaipur", "type": "Budget", "price_range": "₹600 - ₹1,500/night", "rating": 4.0, "area": "Old City"},
        {"name": "Umaid Bhawan Heritage", "type": "Mid-Range", "price_range": "₹3,500 - ₹7,000/night", "rating": 4.3, "area": "Bani Park"},
        {"name": "Rambagh Palace", "type": "Luxury", "price_range": "₹20,000 - ₹50,000/night", "rating": 4.8, "area": "Bhawani Singh Road"},
    ],
    "kerala": [
        {"name": "Kerala Homestay", "type": "Budget", "price_range": "₹800 - ₹2,000/night", "rating": 3.8, "area": "Various"},
        {"name": "Spice Village Thekkady", "type": "Mid-Range", "price_range": "₹4,000 - ₹8,000/night", "rating": 4.3, "area": "Thekkady"},
        {"name": "Kumarakom Lake Resort", "type": "Luxury", "price_range": "₹12,000 - ₹25,000/night", "rating": 4.7, "area": "Kumarakom"},
    ],
    "manali": [
        {"name": "Hosteller Manali", "type": "Budget", "price_range": "₹500 - ₹1,500/night", "rating": 4.0, "area": "Old Manali"},
        {"name": "Johnson Hotel", "type": "Mid-Range", "price_range": "₹3,000 - ₹6,000/night", "rating": 4.2, "area": "Mall Road"},
        {"name": "The Himalayan Spa Resort", "type": "Luxury", "price_range": "₹8,000 - ₹18,000/night", "rating": 4.5, "area": "Log Huts"},
    ],
    "varanasi": [
        {"name": "Moustache Varanasi", "type": "Budget", "price_range": "₹500 - ₹1,200/night", "rating": 4.0, "area": "Near Ghats"},
        {"name": "BrijRama Palace", "type": "Heritage", "price_range": "₹6,000 - ₹12,000/night", "rating": 4.5, "area": "Darbhanga Ghat"},
        {"name": "Taj Ganges", "type": "Luxury", "price_range": "₹8,000 - ₹15,000/night", "rating": 4.4, "area": "Nadesar"},
    ],
    "udaipur": [
        {"name": "Zostel Udaipur", "type": "Budget", "price_range": "₹600 - ₹1,500/night", "rating": 4.1, "area": "Old City"},
        {"name": "Hotel Lakend", "type": "Mid-Range", "price_range": "₹4,000 - ₹7,000/night", "rating": 4.2, "area": "Fateh Sagar"},
        {"name": "Taj Lake Palace", "type": "Luxury", "price_range": "₹30,000 - ₹80,000/night", "rating": 4.9, "area": "Lake Pichola"},
    ],
}


# ── Transport & Route Data ──
ROUTES = {
    ("ahmedabad", "somnath"): {"distance_km": 415, "train_time": "7h", "train_cost": "₹250-600", "bus_time": "8h", "bus_cost": "₹350-700", "flight_time": None, "cab_cost": "₹5,000-7,000"},
    ("ahmedabad", "dwarka"): {"distance_km": 470, "train_time": "8h", "train_cost": "₹280-650", "bus_time": "9h", "bus_cost": "₹400-800", "flight_time": None, "cab_cost": "₹6,000-8,000"},
    ("ahmedabad", "gir"): {"distance_km": 360, "train_time": "5.5h (to Junagadh)", "train_cost": "₹220-500", "bus_time": "7h", "bus_cost": "₹300-600", "flight_time": None, "cab_cost": "₹4,500-6,000"},
    ("ahmedabad", "statue_of_unity"): {"distance_km": 200, "train_time": "3h (to Vadodara + taxi)", "train_cost": "₹150-350", "bus_time": "4h", "bus_cost": "₹200-400", "flight_time": None, "cab_cost": "₹2,500-3,500"},
    ("ahmedabad", "rann_of_kutch"): {"distance_km": 400, "train_time": "7h (to Bhuj)", "train_cost": "₹300-700", "bus_time": "8h", "bus_cost": "₹400-900", "flight_time": "1h (to Bhuj)", "flight_cost": "₹3,000-6,000", "cab_cost": "₹5,500-7,500"},
    ("somnath", "dwarka"): {"distance_km": 230, "train_time": "5h", "train_cost": "₹150-350", "bus_time": "5h", "bus_cost": "₹250-500", "flight_time": None, "cab_cost": "₹3,000-4,000"},
    ("somnath", "gir"): {"distance_km": 45, "train_time": None, "train_cost": None, "bus_time": "1h", "bus_cost": "₹50-100", "flight_time": None, "cab_cost": "₹800-1,200"},
    ("delhi", "agra"): {"distance_km": 233, "train_time": "2h (Gatimaan Express)", "train_cost": "₹750-1500", "bus_time": "4h", "bus_cost": "₹300-600", "flight_time": None, "cab_cost": "₹3,000-4,500"},
    ("delhi", "jaipur"): {"distance_km": 280, "train_time": "4.5h", "train_cost": "₹300-800", "bus_time": "5h", "bus_cost": "₹400-900", "flight_time": "1h", "flight_cost": "₹2,500-5,000", "cab_cost": "₹3,500-5,000"},
    ("mumbai", "goa"): {"distance_km": 590, "train_time": "8-12h", "train_cost": "₹400-1200", "bus_time": "10h", "bus_cost": "₹600-1500", "flight_time": "1h", "flight_cost": "₹2,000-5,000", "cab_cost": "₹7,000-10,000"},
    ("delhi", "manali"): {"distance_km": 540, "train_time": "10h (to Chandigarh + bus)", "train_cost": "₹400-1000", "bus_time": "12-14h", "bus_cost": "₹800-1500", "flight_time": "1.5h (to Kullu)", "flight_cost": "₹4,000-8,000", "cab_cost": "₹7,000-10,000"},
    ("delhi", "varanasi"): {"distance_km": 820, "train_time": "8-12h", "train_cost": "₹400-1500", "bus_time": "14h", "bus_cost": "₹600-1200", "flight_time": "1.5h", "flight_cost": "₹3,000-6,000", "cab_cost": "₹10,000-14,000"},
    ("bangalore", "mysore"): {"distance_km": 150, "train_time": "2.5h", "train_cost": "₹100-300", "bus_time": "3h", "bus_cost": "₹200-500", "flight_time": None, "cab_cost": "₹2,000-3,000"},
    ("bangalore", "goa"): {"distance_km": 560, "train_time": "10-12h", "train_cost": "₹400-1000", "bus_time": "10h", "bus_cost": "₹600-1200", "flight_time": "1h", "flight_cost": "₹2,500-5,000", "cab_cost": "₹7,000-10,000"},
    ("mumbai", "ahmedabad"): {"distance_km": 525, "train_time": "6-7h", "train_cost": "₹350-1000", "bus_time": "8h", "bus_cost": "₹500-1000", "flight_time": "1h", "flight_cost": "₹2,500-5,000", "cab_cost": "₹6,500-9,000"},
    ("jaipur", "udaipur"): {"distance_km": 395, "train_time": "6h", "train_cost": "₹250-700", "bus_time": "7h", "bus_cost": "₹400-800", "flight_time": None, "cab_cost": "₹5,000-7,000"},
}

# ── Food recommendations by city ──
FOOD_RECOMMENDATIONS = {
    "ahmedabad": ["Khaman Dhokla", "Fafda-Jalebi", "Undhiyu", "Handvo", "Thepla", "Dabeli", "Pav Bhaji at Manek Chowk"],
    "somnath": ["Kathiyawadi Thali", "Bajra Rotla", "Khandvi", "Sev Usal"],
    "dwarka": ["Gujarati Thali", "Mohanthal", "Gathiya", "Sea food at beach shacks"],
    "gir": ["Kathiyawadi Food", "Millet-based dishes", "Kesar Mango (seasonal)"],
    "rann_of_kutch": ["Kutchi Dabeli", "Kutchi Thali", "Bajra Rotla with Butter", "Bhujia"],
    "agra": ["Petha", "Bedai-Jalebi", "Mughlai cuisine", "Paratha"],
    "goa": ["Fish Curry Rice", "Bebinca", "Vindaloo", "Xacuti", "Feni"],
    "jaipur": ["Dal Baati Churma", "Laal Maas", "Ghevar", "Pyaaz Kachori"],
    "kerala": ["Kerala Sadya", "Appam with Stew", "Fish Moilee", "Puttu-Kadala"],
    "manali": ["Trout Fish", "Siddu", "Dham (traditional feast)", "Tibetan Momos"],
    "varanasi": ["Banarasi Paan", "Malaiyyo", "Tamatar Chaat", "Lassi at Blue Lassi Shop"],
    "udaipur": ["Dal Baati Churma", "Gatte ki Sabzi", "Mawa Kachori"],
    "mysore": ["Mysore Pak", "Mysore Masala Dosa", "Bisibelebath"],
    "pondicherry": ["French pastries", "Crepes", "Seafood", "Filter Coffee"],
}
