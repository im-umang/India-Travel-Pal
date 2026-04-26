"""
India Transport Intelligence Knowledge Base
Realistic train, flight, and bus data for major Indian routes.
All data uses real Indian railway names, airline names, and state transport operators.
"""

# ══════════════════════════════════════════════
#  AIRPORTS — IATA codes for major Indian cities
# ══════════════════════════════════════════════

AIRPORTS = {
    "delhi": "DEL", "mumbai": "BOM", "ahmedabad": "AMD",
    "bangalore": "BLR", "bengaluru": "BLR", "hyderabad": "HYD",
    "chennai": "MAA", "kolkata": "CCU", "goa": "GOI",
    "jaipur": "JAI", "lucknow": "LKO", "varanasi": "VNS",
    "udaipur": "UDR", "guwahati": "GAU", "pune": "PNQ",
    "chandigarh": "IXC", "amritsar": "ATQ", "srinagar": "SXR",
    "kochi": "COK", "thiruvananthapuram": "TRV", "bhopal": "BHO",
    "indore": "IDR", "patna": "PAT", "ranchi": "IXR",
    "coimbatore": "CJB", "mangalore": "IXE", "mysore": "MYQ",
    "bhuj": "BHJ", "rajkot": "RAJ", "vadodara": "BDQ",
    "surat": "STV", "nagpur": "NAG", "vishakhapatnam": "VTZ",
    "agra": "AGR", "manali": "KUU",  # Kullu-Manali (Bhuntar)
    "kerala": "COK",  # mapped to Kochi
}

# ══════════════════════════════════════════════
#  AIRLINES
# ══════════════════════════════════════════════

AIRLINES = ["IndiGo", "Air India", "Vistara", "Akasa Air", "SpiceJet", "Alliance Air"]

# ══════════════════════════════════════════════
#  REALISTIC FLIGHT DATA — Route-specific
# ══════════════════════════════════════════════

FLIGHT_DATA = {
    ("delhi", "mumbai"): [
        {"airline": "IndiGo", "flight_no": "6E-2154", "departure": "06:15", "arrival": "08:25", "duration": "2h 10m", "price_range": "Rs 3,500 - Rs 7,000", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-865", "departure": "09:30", "arrival": "11:45", "duration": "2h 15m", "price_range": "Rs 4,000 - Rs 8,500", "type": "Direct"},
        {"airline": "Vistara", "flight_no": "UK-955", "departure": "14:00", "arrival": "16:10", "duration": "2h 10m", "price_range": "Rs 4,500 - Rs 9,000", "type": "Direct"},
    ],
    ("delhi", "goa"): [
        {"airline": "IndiGo", "flight_no": "6E-6087", "departure": "06:50", "arrival": "09:20", "duration": "2h 30m", "price_range": "Rs 3,000 - Rs 6,500", "type": "Direct"},
        {"airline": "SpiceJet", "flight_no": "SG-8169", "departure": "11:15", "arrival": "13:40", "duration": "2h 25m", "price_range": "Rs 2,800 - Rs 6,000", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-883", "departure": "16:30", "arrival": "19:00", "duration": "2h 30m", "price_range": "Rs 4,200 - Rs 8,000", "type": "Direct"},
    ],
    ("delhi", "jaipur"): [
        {"airline": "IndiGo", "flight_no": "6E-2073", "departure": "07:00", "arrival": "08:05", "duration": "1h 05m", "price_range": "Rs 2,500 - Rs 5,000", "type": "Direct"},
        {"airline": "Vistara", "flight_no": "UK-725", "departure": "15:20", "arrival": "16:25", "duration": "1h 05m", "price_range": "Rs 3,200 - Rs 6,500", "type": "Direct"},
        {"airline": "SpiceJet", "flight_no": "SG-411", "departure": "11:30", "arrival": "12:35", "duration": "1h 05m", "price_range": "Rs 2,200 - Rs 4,500", "type": "Direct"},
    ],
    ("delhi", "varanasi"): [
        {"airline": "IndiGo", "flight_no": "6E-2036", "departure": "06:00", "arrival": "07:30", "duration": "1h 30m", "price_range": "Rs 3,000 - Rs 6,000", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-433", "departure": "10:45", "arrival": "12:15", "duration": "1h 30m", "price_range": "Rs 3,500 - Rs 7,500", "type": "Direct"},
        {"airline": "Akasa Air", "flight_no": "QP-1372", "departure": "17:00", "arrival": "18:30", "duration": "1h 30m", "price_range": "Rs 2,800 - Rs 5,500", "type": "Direct"},
    ],
    ("delhi", "ahmedabad"): [
        {"airline": "IndiGo", "flight_no": "6E-2391", "departure": "06:30", "arrival": "08:05", "duration": "1h 35m", "price_range": "Rs 3,000 - Rs 6,000", "type": "Direct"},
        {"airline": "Vistara", "flight_no": "UK-963", "departure": "12:00", "arrival": "13:35", "duration": "1h 35m", "price_range": "Rs 3,800 - Rs 7,500", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-801", "departure": "19:00", "arrival": "20:40", "duration": "1h 40m", "price_range": "Rs 3,500 - Rs 7,000", "type": "Direct"},
    ],
    ("delhi", "manali"): [
        {"airline": "Alliance Air", "flight_no": "9I-531", "departure": "09:00", "arrival": "10:20", "duration": "1h 20m", "price_range": "Rs 4,500 - Rs 9,000", "type": "Direct to Kullu (Bhuntar)", "note": "Then 1h taxi to Manali"},
        {"airline": "IndiGo", "flight_no": "6E-2251", "departure": "12:30", "arrival": "13:55", "duration": "1h 25m", "price_range": "Rs 4,000 - Rs 8,500", "type": "Direct to Kullu (Bhuntar)", "note": "Then 1h taxi to Manali"},
    ],
    ("mumbai", "goa"): [
        {"airline": "IndiGo", "flight_no": "6E-5307", "departure": "07:10", "arrival": "08:15", "duration": "1h 05m", "price_range": "Rs 2,200 - Rs 5,000", "type": "Direct"},
        {"airline": "Vistara", "flight_no": "UK-849", "departure": "11:30", "arrival": "12:40", "duration": "1h 10m", "price_range": "Rs 3,000 - Rs 6,500", "type": "Direct"},
        {"airline": "SpiceJet", "flight_no": "SG-3015", "departure": "18:00", "arrival": "19:10", "duration": "1h 10m", "price_range": "Rs 2,500 - Rs 5,500", "type": "Direct"},
    ],
    ("mumbai", "ahmedabad"): [
        {"airline": "IndiGo", "flight_no": "6E-5102", "departure": "06:45chat ", "arrival": "07:55", "duration": "1h 10m", "price_range": "Rs 2,500 - Rs 5,000", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-659", "departure": "14:00", "arrival": "15:15", "duration": "1h 15m", "price_range": "Rs 3,000 - Rs 6,500", "type": "Direct"},
        {"airline": "SpiceJet", "flight_no": "SG-3209", "departure": "19:30", "arrival": "20:40", "duration": "1h 10m", "price_range": "Rs 2,200 - Rs 4,800", "type": "Direct"},
    ],
    ("bangalore", "goa"): [
        {"airline": "IndiGo", "flight_no": "6E-7175", "departure": "08:00", "arrival": "09:10", "duration": "1h 10m", "price_range": "Rs 2,500 - Rs 5,500", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-571", "departure": "16:15", "arrival": "17:25", "duration": "1h 10m", "price_range": "Rs 3,200 - Rs 6,000", "type": "Direct"},
        {"airline": "SpiceJet", "flight_no": "SG-4412", "departure": "12:00", "arrival": "13:15", "duration": "1h 15m", "price_range": "Rs 2,300 - Rs 4,800", "type": "Direct"},
    ],
    ("ahmedabad", "goa"): [
        {"airline": "IndiGo", "flight_no": "6E-6349", "departure": "10:30", "arrival": "12:00", "duration": "1h 30m", "price_range": "Rs 3,000 - Rs 6,500", "type": "Direct"},
        {"airline": "SpiceJet", "flight_no": "SG-2945", "departure": "17:45", "arrival": "19:15", "duration": "1h 30m", "price_range": "Rs 2,800 - Rs 5,500", "type": "Direct"},
    ],
    ("ahmedabad", "delhi"): [
        {"airline": "IndiGo", "flight_no": "6E-2392", "departure": "07:00", "arrival": "08:40", "duration": "1h 40m", "price_range": "Rs 3,000 - Rs 6,000", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-802", "departure": "16:00", "arrival": "17:40", "duration": "1h 40m", "price_range": "Rs 3,500 - Rs 7,000", "type": "Direct"},
    ],
    ("ahmedabad", "mumbai"): [
        {"airline": "IndiGo", "flight_no": "6E-5103", "departure": "09:00", "arrival": "10:10", "duration": "1h 10m", "price_range": "Rs 2,500 - Rs 5,000", "type": "Direct"},
        {"airline": "Vistara", "flight_no": "UK-672", "departure": "15:30", "arrival": "16:45", "duration": "1h 15m", "price_range": "Rs 3,200 - Rs 6,500", "type": "Direct"},
    ],
    ("ahmedabad", "jaipur"): [
        {"airline": "IndiGo", "flight_no": "6E-2487", "departure": "08:30", "arrival": "09:40", "duration": "1h 10m", "price_range": "Rs 3,000 - Rs 6,000", "type": "Direct"},
        {"airline": "SpiceJet", "flight_no": "SG-2211", "departure": "14:15", "arrival": "15:25", "duration": "1h 10m", "price_range": "Rs 2,700 - Rs 5,500", "type": "Direct"},
    ],
    ("kolkata", "delhi"): [
        {"airline": "IndiGo", "flight_no": "6E-278", "departure": "06:00", "arrival": "08:30", "duration": "2h 30m", "price_range": "Rs 3,500 - Rs 7,000", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-020", "departure": "13:00", "arrival": "15:25", "duration": "2h 25m", "price_range": "Rs 4,000 - Rs 8,000", "type": "Direct"},
    ],
    ("chennai", "delhi"): [
        {"airline": "IndiGo", "flight_no": "6E-6013", "departure": "06:30", "arrival": "09:20", "duration": "2h 50m", "price_range": "Rs 4,000 - Rs 8,000", "type": "Direct"},
        {"airline": "Air India", "flight_no": "AI-142", "departure": "14:00", "arrival": "16:55", "duration": "2h 55m", "price_range": "Rs 4,500 - Rs 9,000", "type": "Direct"},
    ],
    ("hyderabad", "delhi"): [
        {"airline": "IndiGo", "flight_no": "6E-6522", "departure": "05:55", "arrival": "08:10", "duration": "2h 15m", "price_range": "Rs 3,500 - Rs 7,000", "type": "Direct"},
        {"airline": "Vistara", "flight_no": "UK-826", "departure": "12:30", "arrival": "14:45", "duration": "2h 15m", "price_range": "Rs 4,200 - Rs 8,500", "type": "Direct"},
    ],
}


# ══════════════════════════════════════════════
#  REALISTIC TRAIN DATA — Route-specific
# ══════════════════════════════════════════════

TRAIN_DATA = {
    ("delhi", "jaipur"): [
        {"train_name": "Ajmer Shatabdi Express", "train_number": "12015", "departure": "06:05", "arrival": "10:30", "duration": "4h 25m", "classes": "CC, EC", "fare": "SL: NA | CC: Rs 770 | EC: Rs 1,450", "frequency": "Daily", "type": "Shatabdi"},
        {"train_name": "Delhi-Jaipur Vande Bharat", "train_number": "22981", "departure": "06:20", "arrival": "10:15", "duration": "3h 55m", "classes": "CC, EC", "fare": "CC: Rs 900 | EC: Rs 1,700", "frequency": "Daily (except Thu)", "type": "Vande Bharat"},
        {"train_name": "Ashram Express", "train_number": "12916", "departure": "15:35", "arrival": "20:50", "duration": "5h 15m", "classes": "SL, 3AC, 2AC, 1AC", "fare": "SL: Rs 255 | 3AC: Rs 695 | 2AC: Rs 975", "frequency": "Daily", "type": "Superfast"},
    ],
    ("delhi", "agra"): [
        {"train_name": "Gatimaan Express", "train_number": "12050", "departure": "08:10", "arrival": "09:50", "duration": "1h 40m", "classes": "CC, EC", "fare": "CC: Rs 750 | EC: Rs 1,500", "frequency": "Daily (except Fri)", "type": "Semi High-Speed"},
        {"train_name": "Bhopal Shatabdi Express", "train_number": "12002", "departure": "06:00", "arrival": "07:57", "duration": "1h 57m", "classes": "CC, EC", "fare": "CC: Rs 600 | EC: Rs 1,200", "frequency": "Daily", "type": "Shatabdi"},
        {"train_name": "Taj Express", "train_number": "12280", "departure": "07:00", "arrival": "10:05", "duration": "3h 05m", "classes": "CC, 2S, SL", "fare": "2S: Rs 120 | CC: Rs 450 | SL: Rs 195", "frequency": "Daily", "type": "Superfast"},
    ],
    ("delhi", "varanasi"): [
        {"train_name": "Vande Bharat Express", "train_number": "22436", "departure": "06:00", "arrival": "14:00", "duration": "8h 00m", "classes": "CC, EC", "fare": "CC: Rs 1,700 | EC: Rs 3,200", "frequency": "Daily (except Wed)", "type": "Vande Bharat"},
        {"train_name": "Shiv Ganga Express", "train_number": "12560", "departure": "19:00", "arrival": "06:40+1", "duration": "11h 40m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 420 | 3AC: Rs 1,115 | 2AC: Rs 1,585", "frequency": "Daily", "type": "Superfast"},
        {"train_name": "Mahamana Express", "train_number": "22418", "departure": "16:00", "arrival": "05:15+1", "duration": "13h 15m", "classes": "SL, 3AC, 2AC, 1AC", "fare": "SL: Rs 380 | 3AC: Rs 1,020 | 2AC: Rs 1,430", "frequency": "Tue, Thu, Sat", "type": "Superfast"},
    ],
    ("delhi", "mumbai"): [
        {"train_name": "Rajdhani Express", "train_number": "12952", "departure": "16:55", "arrival": "08:35+1", "duration": "15h 40m", "classes": "3AC, 2AC, 1AC", "fare": "3AC: Rs 2,100 | 2AC: Rs 3,000 | 1AC: Rs 5,100", "frequency": "Daily", "type": "Rajdhani"},
        {"train_name": "Mumbai Duronto Express", "train_number": "12264", "departure": "23:00", "arrival": "16:10+1", "duration": "17h 10m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 680 | 3AC: Rs 1,850 | 2AC: Rs 2,600", "frequency": "Mon, Wed, Sat", "type": "Duronto"},
        {"train_name": "August Kranti Rajdhani", "train_number": "12954", "departure": "17:40", "arrival": "10:55+1", "duration": "17h 15m", "classes": "3AC, 2AC, 1AC", "fare": "3AC: Rs 2,000 | 2AC: Rs 2,900 | 1AC: Rs 4,800", "frequency": "Daily", "type": "Rajdhani"},
    ],
    ("delhi", "manali"): [
        {"train_name": "Himalayan Queen (to Chandigarh)", "train_number": "12011", "departure": "05:50", "arrival": "10:25", "duration": "4h 35m", "classes": "CC, 2S", "fare": "2S: Rs 180 | CC: Rs 540", "frequency": "Daily", "type": "Shatabdi", "note": "Then 7h bus Chandigarh-Manali"},
        {"train_name": "Chandigarh Shatabdi (to CHG)", "train_number": "12046", "departure": "07:40", "arrival": "10:55", "duration": "3h 15m", "classes": "CC, EC", "fare": "CC: Rs 625 | EC: Rs 1,185", "frequency": "Daily", "type": "Shatabdi", "note": "Then 7h bus Chandigarh-Manali"},
    ],
    ("mumbai", "goa"): [
        {"train_name": "Mandovi Express", "train_number": "10104", "departure": "07:10", "arrival": "19:05", "duration": "11h 55m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 370 | 3AC: Rs 985 | 2AC: Rs 1,400", "frequency": "Daily", "type": "Express"},
        {"train_name": "Konkan Kanya Express", "train_number": "10112", "departure": "23:00", "arrival": "11:00+1", "duration": "12h 00m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 370 | 3AC: Rs 985 | 2AC: Rs 1,400", "frequency": "Daily", "type": "Express"},
        {"train_name": "Tejas Express", "train_number": "22120", "departure": "09:35", "arrival": "17:40", "duration": "8h 05m", "classes": "CC, EC", "fare": "CC: Rs 1,295 | EC: Rs 2,520", "frequency": "Daily (except Mon)", "type": "Tejas"},
    ],
    ("mumbai", "ahmedabad"): [
        {"train_name": "Karnavati Express", "train_number": "12934", "departure": "06:25", "arrival": "13:05", "duration": "6h 40m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 300 | 3AC: Rs 795 | 2AC: Rs 1,120", "frequency": "Daily", "type": "Superfast"},
        {"train_name": "Shatabdi Express", "train_number": "12010", "departure": "06:17", "arrival": "13:00", "duration": "6h 43m", "classes": "CC, EC", "fare": "CC: Rs 850 | EC: Rs 1,600", "frequency": "Daily (except Sun)", "type": "Shatabdi"},
    ],
    ("ahmedabad", "somnath"): [
        {"train_name": "Somnath Express", "train_number": "11464", "departure": "20:50", "arrival": "06:10+1", "duration": "9h 20m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 240 | 3AC: Rs 650 | 2AC: Rs 920", "frequency": "Daily", "type": "Express"},
        {"train_name": "Girnar Express", "train_number": "11504", "departure": "21:15", "arrival": "06:20+1", "duration": "9h 05m", "classes": "SL, 3AC", "fare": "SL: Rs 240 | 3AC: Rs 650", "frequency": "Daily", "type": "Express"},
    ],
    ("ahmedabad", "dwarka"): [
        {"train_name": "Saurashtra Express", "train_number": "19016", "departure": "17:40", "arrival": "05:00+1", "duration": "11h 20m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 270 | 3AC: Rs 720 | 2AC: Rs 1,010", "frequency": "Daily", "type": "Express"},
        {"train_name": "Okha Express", "train_number": "19572", "departure": "09:30", "arrival": "19:15", "duration": "9h 45m", "classes": "SL, 3AC", "fare": "SL: Rs 260 | 3AC: Rs 700", "frequency": "Daily", "type": "Express"},
    ],
    ("ahmedabad", "delhi"): [
        {"train_name": "Ashram Express", "train_number": "12916", "departure": "09:15", "arrival": "23:25", "duration": "14h 10m", "classes": "SL, 3AC, 2AC, 1AC", "fare": "SL: Rs 440 | 3AC: Rs 1,175 | 2AC: Rs 1,650", "frequency": "Daily", "type": "Superfast"},
        {"train_name": "Rajdhani Express", "train_number": "12958", "departure": "19:25", "arrival": "07:55+1", "duration": "12h 30m", "classes": "3AC, 2AC, 1AC", "fare": "3AC: Rs 1,850 | 2AC: Rs 2,650 | 1AC: Rs 4,500", "frequency": "Tue, Fri, Sun", "type": "Rajdhani"},
    ],
    ("ahmedabad", "jaipur"): [
        {"train_name": "Aravali Express", "train_number": "19708", "departure": "00:15", "arrival": "10:55", "duration": "10h 40m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 310 | 3AC: Rs 830 | 2AC: Rs 1,170", "frequency": "Daily", "type": "Express"},
        {"train_name": "Ashram Express", "train_number": "12915", "departure": "14:10", "arrival": "23:50", "duration": "9h 40m", "classes": "SL, 3AC, 2AC, 1AC", "fare": "SL: Rs 295 | 3AC: Rs 795 | 2AC: Rs 1,120", "frequency": "Daily", "type": "Superfast"},
    ],
    ("ahmedabad", "mumbai"): [
        {"train_name": "Karnavati Express", "train_number": "12933", "departure": "14:40", "arrival": "21:15", "duration": "6h 35m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 300 | 3AC: Rs 795 | 2AC: Rs 1,120", "frequency": "Daily", "type": "Superfast"},
        {"train_name": "Shatabdi Express", "train_number": "12009", "departure": "14:27", "arrival": "21:10", "duration": "6h 43m", "classes": "CC, EC", "fare": "CC: Rs 850 | EC: Rs 1,600", "frequency": "Daily (except Sun)", "type": "Shatabdi"},
    ],
    ("bangalore", "mysore"): [
        {"train_name": "Shatabdi Express", "train_number": "12008", "departure": "11:00", "arrival": "13:00", "duration": "2h 00m", "classes": "CC, EC", "fare": "CC: Rs 330 | EC: Rs 640", "frequency": "Daily", "type": "Shatabdi"},
        {"train_name": "Tippu Express", "train_number": "12614", "departure": "14:15", "arrival": "17:00", "duration": "2h 45m", "classes": "CC, 2S", "fare": "2S: Rs 65 | CC: Rs 240", "frequency": "Daily", "type": "Intercity"},
    ],
    ("bangalore", "goa"): [
        {"train_name": "Vasco Express", "train_number": "17309", "departure": "20:00", "arrival": "08:30+1", "duration": "12h 30m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 370 | 3AC: Rs 985 | 2AC: Rs 1,405", "frequency": "Daily", "type": "Express"},
        {"train_name": "Goa Express", "train_number": "12779", "departure": "15:05", "arrival": "04:15+1", "duration": "13h 10m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 350 | 3AC: Rs 935 | 2AC: Rs 1,325", "frequency": "Tue, Thu, Sat, Sun", "type": "Superfast"},
    ],
    ("jaipur", "udaipur"): [
        {"train_name": "Chetak Express", "train_number": "12982", "departure": "22:15", "arrival": "05:30+1", "duration": "7h 15m", "classes": "SL, 3AC, 2AC", "fare": "SL: Rs 250 | 3AC: Rs 670 | 2AC: Rs 945", "frequency": "Daily", "type": "Superfast"},
        {"train_name": "Mewar Express", "train_number": "12964", "departure": "19:50", "arrival": "05:15+1", "duration": "9h 25m", "classes": "SL, 3AC", "fare": "SL: Rs 250 | 3AC: Rs 670", "frequency": "Daily", "type": "Superfast"},
    ],
}


# ══════════════════════════════════════════════
#  REALISTIC BUS DATA — Route-specific
# ══════════════════════════════════════════════

BUS_DATA = {
    ("ahmedabad", "somnath"): [
        {"operator": "GSRTC", "bus_type": "Volvo AC Sleeper", "duration": "7h 30m", "night_available": "Yes", "fare": "Rs 450 - Rs 750", "frequency": "Every 2 hours"},
        {"operator": "GSRTC", "bus_type": "Non-AC Seater", "duration": "8h 30m", "night_available": "Yes", "fare": "Rs 250 - Rs 350", "frequency": "Hourly"},
        {"operator": "Private (Patel Tours)", "bus_type": "AC Sleeper", "duration": "7h", "night_available": "Yes", "fare": "Rs 500 - Rs 900", "frequency": "3 departures daily"},
    ],
    ("ahmedabad", "dwarka"): [
        {"operator": "GSRTC", "bus_type": "Volvo AC Semi-Sleeper", "duration": "8h 30m", "night_available": "Yes", "fare": "Rs 500 - Rs 850", "frequency": "4 departures daily"},
        {"operator": "GSRTC", "bus_type": "Non-AC Seater", "duration": "10h", "night_available": "Yes", "fare": "Rs 300 - Rs 450", "frequency": "6 departures daily"},
    ],
    ("ahmedabad", "gir"): [
        {"operator": "GSRTC", "bus_type": "Non-AC Semi-Sleeper", "duration": "6h 30m", "night_available": "No", "fare": "Rs 300 - Rs 500", "frequency": "Every 3 hours"},
        {"operator": "GSRTC (via Junagadh)", "bus_type": "AC Seater", "duration": "5h (to Junagadh) + 1h local", "night_available": "No", "fare": "Rs 350 - Rs 600", "frequency": "Hourly to Junagadh"},
    ],
    ("ahmedabad", "rann_of_kutch"): [
        {"operator": "GSRTC", "bus_type": "Volvo AC Sleeper", "duration": "7h (to Bhuj)", "night_available": "Yes", "fare": "Rs 500 - Rs 900", "frequency": "4 departures daily"},
        {"operator": "Private (Eagle Travels)", "bus_type": "AC Multi-Axle Sleeper", "duration": "7h (to Bhuj)", "night_available": "Yes", "fare": "Rs 600 - Rs 1,100", "frequency": "Night departures"},
    ],
    ("delhi", "jaipur"): [
        {"operator": "RSRTC", "bus_type": "Volvo AC Semi-Sleeper", "duration": "5h 30m", "night_available": "Yes", "fare": "Rs 500 - Rs 900", "frequency": "Every hour"},
        {"operator": "Private (Vijayanand Travels)", "bus_type": "AC Multi-Axle Sleeper", "duration": "5h", "night_available": "Yes", "fare": "Rs 600 - Rs 1,200", "frequency": "10+ daily"},
    ],
    ("delhi", "agra"): [
        {"operator": "UPSRTC", "bus_type": "AC Seater", "duration": "4h", "night_available": "No", "fare": "Rs 300 - Rs 600", "frequency": "Every 30 mins"},
        {"operator": "Private", "bus_type": "Volvo AC", "duration": "3h 30m", "night_available": "No", "fare": "Rs 400 - Rs 800", "frequency": "Hourly"},
    ],
    ("delhi", "manali"): [
        {"operator": "HRTC", "bus_type": "Volvo AC Semi-Sleeper", "duration": "12h", "night_available": "Yes (recommended)", "fare": "Rs 1,000 - Rs 1,500", "frequency": "4 departures (evening)"},
        {"operator": "Private (Himachal Volvo)", "bus_type": "AC Multi-Axle Sleeper", "duration": "12h", "night_available": "Yes", "fare": "Rs 1,200 - Rs 1,800", "frequency": "6 departures daily"},
    ],
    ("delhi", "varanasi"): [
        {"operator": "UPSRTC", "bus_type": "AC Sleeper", "duration": "13h", "night_available": "Yes", "fare": "Rs 800 - Rs 1,200", "frequency": "3 departures daily"},
        {"operator": "Private", "bus_type": "Multi-Axle Volvo", "duration": "12h", "night_available": "Yes", "fare": "Rs 1,000 - Rs 1,500", "frequency": "Evening departures"},
    ],
    ("mumbai", "goa"): [
        {"operator": "MSRTC (Shivneri)", "bus_type": "Volvo AC Sleeper", "duration": "10h", "night_available": "Yes", "fare": "Rs 800 - Rs 1,500", "frequency": "8 departures daily"},
        {"operator": "Private (Paulo / Neeta)", "bus_type": "AC Multi-Axle Sleeper", "duration": "9h 30m", "night_available": "Yes", "fare": "Rs 900 - Rs 2,000", "frequency": "15+ daily"},
        {"operator": "KSRTC (Airavat)", "bus_type": "AC Sleeper", "duration": "11h", "night_available": "Yes", "fare": "Rs 700 - Rs 1,200", "frequency": "5 departures daily"},
    ],
    ("mumbai", "ahmedabad"): [
        {"operator": "GSRTC / MSRTC", "bus_type": "Volvo AC Semi-Sleeper", "duration": "7h 30m", "night_available": "Yes", "fare": "Rs 600 - Rs 1,000", "frequency": "Every 2 hours"},
        {"operator": "Private (Eagle / Neeta)", "bus_type": "AC Multi-Axle Sleeper", "duration": "7h", "night_available": "Yes", "fare": "Rs 700 - Rs 1,400", "frequency": "20+ daily"},
    ],
    ("bangalore", "goa"): [
        {"operator": "KSRTC (Airavat Club)", "bus_type": "Volvo AC Multi-Axle Sleeper", "duration": "9h 30m", "night_available": "Yes", "fare": "Rs 800 - Rs 1,500", "frequency": "8 departures daily"},
        {"operator": "Private (VRL / Orange)", "bus_type": "AC Sleeper", "duration": "9h", "night_available": "Yes", "fare": "Rs 900 - Rs 1,800", "frequency": "20+ daily"},
    ],
    ("bangalore", "mysore"): [
        {"operator": "KSRTC (Rajahamsa)", "bus_type": "Volvo AC", "duration": "3h", "night_available": "No", "fare": "Rs 300 - Rs 500", "frequency": "Every 15 mins"},
        {"operator": "KSRTC", "bus_type": "Non-AC Seater", "duration": "3h 30m", "night_available": "No", "fare": "Rs 120 - Rs 200", "frequency": "Every 10 mins"},
    ],
    ("jaipur", "udaipur"): [
        {"operator": "RSRTC", "bus_type": "AC Sleeper", "duration": "6h 30m", "night_available": "Yes", "fare": "Rs 500 - Rs 900", "frequency": "6 departures daily"},
        {"operator": "Private", "bus_type": "Volvo Multi-Axle", "duration": "6h", "night_available": "Yes", "fare": "Rs 600 - Rs 1,100", "frequency": "10+ daily"},
    ],
}


# ══════════════════════════════════════════════
#  LOCAL COMMUTE DATA — City-wise
# ══════════════════════════════════════════════

LOCAL_COMMUTE = {
    "delhi": {
        "uber": {"available": True, "base_fare": "Rs 50", "per_km": "Rs 10-14/km", "surge": "1.2x-2.5x peak hours"},
        "auto": {"available": True, "fare": "Rs 25 base + Rs 11/km (metered)", "tip": "Insist on meter. Pre-paid auto at stations."},
        "metro": {"available": True, "network": "Delhi Metro (Yellow, Blue, Violet, Red, Magenta, Green lines)", "fare": "Rs 10-60 based on distance", "hours": "6:00 AM - 11:00 PM"},
        "local_taxi": {"fare": "Rs 15-20/km", "tip": "Use Ola/Uber for fair pricing"},
    },
    "mumbai": {
        "uber": {"available": True, "base_fare": "Rs 50", "per_km": "Rs 9-13/km", "surge": "1.5x-3x peak hours"},
        "auto": {"available": True, "fare": "Rs 23 base + Rs 15.34/km (metered)", "tip": "Autos available only in suburbs. Use taxis in South Mumbai."},
        "metro": {"available": True, "network": "Mumbai Metro Line 1, 2A, 7 + Local Trains", "fare": "Rs 10-50 Metro | Rs 5-15 Local Train", "hours": "5:00 AM - 12:00 AM"},
        "local_taxi": {"fare": "Rs 25 base + Rs 16/km (Kaali-Peeli)", "tip": "Mumbai local trains are the fastest way to commute"},
    },
    "ahmedabad": {
        "uber": {"available": True, "base_fare": "Rs 45", "per_km": "Rs 9-12/km", "surge": "1.2x-2x"},
        "auto": {"available": True, "fare": "Rs 15 base + Rs 10/km", "tip": "Shared autos available on major routes. Negotiate before boarding."},
        "metro": {"available": True, "network": "Ahmedabad Metro (East-West & North-South corridor)", "fare": "Rs 10-35", "hours": "6:00 AM - 10:00 PM"},
        "local_taxi": {"fare": "Rs 12-15/km", "tip": "BRTS (Bus Rapid Transit) is cheap and efficient"},
    },
    "jaipur": {
        "uber": {"available": True, "base_fare": "Rs 50", "per_km": "Rs 10-13/km", "surge": "1.2x-2x"},
        "auto": {"available": True, "fare": "Rs 30 minimum + Rs 12/km", "tip": "Negotiate fare before boarding. Use Rapido for bike taxis."},
        "metro": {"available": True, "network": "Jaipur Metro (Line 1 - Chandpole to Badi Chaupar)", "fare": "Rs 7-17", "hours": "6:00 AM - 10:00 PM"},
        "local_taxi": {"fare": "Rs 12-15/km", "tip": "Full-day taxi: Rs 2,000-3,000 for sightseeing"},
    },
    "goa": {
        "uber": {"available": False, "note": "Uber/Ola limited in Goa due to taxi union opposition"},
        "auto": {"available": False, "note": "No auto-rickshaws in Goa"},
        "metro": {"available": False, "note": "No metro. Kadamba Transport (bus) available."},
        "local_taxi": {"fare": "Rs 25-30/km (tourist rates)", "tip": "Rent a scooter (Rs 300-500/day) or bike (Rs 500-800/day) for best experience. Pilot taxis charge fixed rates."},
    },
    "varanasi": {
        "uber": {"available": True, "base_fare": "Rs 40", "per_km": "Rs 8-11/km", "surge": "1.2x-1.8x"},
        "auto": {"available": True, "fare": "Rs 20 base + Rs 10/km", "tip": "E-rickshaws are very common near ghats. Negotiate firmly."},
        "metro": {"available": False, "note": "Metro under construction. Expected 2025-26."},
        "local_taxi": {"fare": "Rs 10-12/km", "tip": "Walk along the ghats. Boat rides: Rs 100-300/hour."},
    },
    "manali": {
        "uber": {"available": False, "note": "No Uber/Ola. Use local taxis."},
        "auto": {"available": False, "note": "No autos. Terrain not suitable."},
        "metro": {"available": False, "note": "No metro. HRTC local buses available."},
        "local_taxi": {"fare": "Rs 20-25/km", "tip": "Union taxis have fixed rates. Rent a bike (Rs 500-1000/day) for Rohtang/Solang."},
    },
    "udaipur": {
        "uber": {"available": True, "base_fare": "Rs 45", "per_km": "Rs 9-12/km", "surge": "1.2x-1.8x"},
        "auto": {"available": True, "fare": "Rs 25 minimum + Rs 10/km", "tip": "Negotiate before boarding."},
        "metro": {"available": False, "note": "No metro service."},
        "local_taxi": {"fare": "Rs 12-15/km", "tip": "Full-day taxi for sightseeing: Rs 1,500-2,500"},
    },
    "agra": {
        "uber": {"available": True, "base_fare": "Rs 40", "per_km": "Rs 8-11/km", "surge": "1.2x-1.5x"},
        "auto": {"available": True, "fare": "Rs 30 minimum + Rs 10/km", "tip": "Pre-paid autos at railway station. Avoid touts near Taj Mahal."},
        "metro": {"available": False, "note": "Metro under construction."},
        "local_taxi": {"fare": "Rs 10-12/km", "tip": "E-rickshaws: Rs 10-20 per ride for short distances."},
    },
    "kerala": {
        "uber": {"available": True, "base_fare": "Rs 45", "per_km": "Rs 9-12/km", "surge": "1.2x-1.5x", "note": "Available in Kochi, Trivandrum"},
        "auto": {"available": True, "fare": "Rs 30 base + Rs 15/km", "tip": "Auto-rickshaws available in cities. Use meter."},
        "metro": {"available": True, "network": "Kochi Metro (Aluva to Pettah)", "fare": "Rs 10-40", "hours": "6:00 AM - 10:00 PM"},
        "local_taxi": {"fare": "Rs 14-18/km", "tip": "Houseboat in Alleppey: Rs 5,000-15,000/day. KSRTC buses good for intercity."},
    },
    "somnath": {
        "uber": {"available": False, "note": "Limited cab services. Book via hotel."},
        "auto": {"available": True, "fare": "Rs 20-30 per ride locally", "tip": "Auto is the main local transport. Negotiate fare in advance."},
        "metro": {"available": False, "note": "No metro service."},
        "local_taxi": {"fare": "Rs 10-12/km", "tip": "Hire a taxi for Somnath-Gir-Diu circuit (Rs 3,000-4,000/day)"},
    },
    "dwarka": {
        "uber": {"available": False, "note": "No Uber/Ola. Use local taxis."},
        "auto": {"available": True, "fare": "Rs 15-25 per ride locally", "tip": "Limited autos. Most temples are walkable."},
        "metro": {"available": False, "note": "No metro service."},
        "local_taxi": {"fare": "Rs 10-12/km", "tip": "Hire taxi for Bet Dwarka visit (ferry from Okha)."},
    },
    "gir": {
        "uber": {"available": False, "note": "No Uber/Ola."},
        "auto": {"available": False, "note": "No autos in forest area."},
        "metro": {"available": False, "note": "No metro."},
        "local_taxi": {"fare": "Rs 12-15/km", "tip": "Safari jeep mandatory for park entry (Rs 800-3,000 per person). Book on girlion.in"},
    },
    "rann_of_kutch": {
        "uber": {"available": False, "note": "No Uber/Ola in Kutch. Available in Bhuj only."},
        "auto": {"available": True, "fare": "Rs 20-30 per ride (Bhuj city)", "tip": "Limited transport to White Rann. Hire private vehicle."},
        "metro": {"available": False, "note": "No metro."},
        "local_taxi": {"fare": "Rs 12-15/km from Bhuj", "tip": "Rann Utsav provides shuttle service during festival season (Nov-Feb)."},
    },
}


# ══════════════════════════════════════════════
#  STATE TRANSPORT OPERATORS
# ══════════════════════════════════════════════

STATE_TRANSPORT = {
    "Gujarat": "GSRTC (Gujarat State Road Transport Corporation)",
    "Maharashtra": "MSRTC (Maharashtra State Road Transport Corporation)",
    "Karnataka": "KSRTC (Karnataka State Road Transport Corporation)",
    "Uttar Pradesh": "UPSRTC (Uttar Pradesh State Road Transport Corporation)",
    "Rajasthan": "RSRTC (Rajasthan State Road Transport Corporation)",
    "Himachal Pradesh": "HRTC (Himachal Road Transport Corporation)",
    "Kerala": "KSRTC (Kerala State Road Transport Corporation)",
    "Tamil Nadu": "TNSTC / SETC",
    "Goa": "Kadamba Transport Corporation",
    "West Bengal": "SBSTC / NBSTC",
    "Andhra Pradesh": "APSRTC",
    "Telangana": "TSRTC",
}
