"""
Comprehensive Travel Knowledge Base — Destinations
Gujarat (primary) + Major Indian Destinations
Includes: descriptions, best time, entry fees, timings, nearby attractions, tips
"""

DESTINATIONS = {
    # ═══════════════════════════════════════════
    # GUJARAT — PRIMARY DATASET
    # ═══════════════════════════════════════════

    "somnath": {
        "name": "Somnath Temple",
        "city": "Somnath",
        "state": "Gujarat",
        "type": "Religious / Historical",
        "description": (
            "Somnath Temple is one of the 12 Jyotirlingas of Lord Shiva, located on the western coast "
            "of Gujarat in Prabhas Patan, Veraval. It is believed to be the first among the twelve "
            "Jyotirlinga shrines. The temple has been destroyed and rebuilt several times throughout "
            "history, showcasing India's resilience and devotion. The current temple was reconstructed "
            "in the Chalukya style of Hindu temple architecture."
        ),
        "highlights": [
            "One of 12 Jyotirlingas",
            "Light and Sound Show in the evening",
            "Sea-view from temple premises",
            "Bhalka Tirth nearby",
            "Triveni Sangam — confluence of three rivers",
        ],
        "best_time": "October to March (pleasant weather)",
        "entry_fee": "Free (Light show: ₹25-50)",
        "timings": "6:00 AM to 9:30 PM",
        "time_required": "2-3 hours",
        "coordinates": {"lat": 20.8880, "lng": 70.4012},
        "tips": [
            "Attend the evening Aarti (7:00 PM) for a spiritual experience",
            "Visit the Light and Sound show at night",
            "Photography is not allowed inside the main temple",
            "Dress modestly — covering shoulders and knees",
        ],
        "nearby_attractions": [
            "Bhalka Tirth (5 km)",
            "Triveni Sangam (3 km)",
            "Panch Pandav Gufa (1 km)",
            "Somnath Beach (0.5 km)",
            "Junagadh (85 km)",
        ],
    },

    "dwarka": {
        "name": "Dwarkadhish Temple",
        "city": "Dwarka",
        "state": "Gujarat",
        "type": "Religious / Historical",
        "description": (
            "Dwarka is one of the four sacred Char Dham pilgrimage sites and one of the seven most "
            "ancient cities (Sapta Puri) in India. The Dwarkadhish Temple, also known as Jagat Mandir, "
            "is dedicated to Lord Krishna who is believed to have established his kingdom here. The "
            "temple is a five-story structure built over 2,500 years ago with 72 pillars."
        ),
        "highlights": [
            "Char Dham pilgrimage site",
            "Dwarkadhish Temple — 5-story ancient structure",
            "Bet Dwarka island trip",
            "Nageshwar Jyotirlinga nearby",
            "Rukmini Devi Temple",
        ],
        "best_time": "October to March",
        "entry_fee": "Free",
        "timings": "6:30 AM to 1:00 PM, 5:00 PM to 9:30 PM",
        "time_required": "4-5 hours (full day with Bet Dwarka)",
        "coordinates": {"lat": 22.2394, "lng": 68.9678},
        "tips": [
            "Visit Bet Dwarka island by boat (30 mins)",
            "Nageshwar Jyotirlinga is 17 km away — must visit",
            "Sunset at Dwarka beach is mesmerizing",
            "Book a local guide for historical context",
        ],
        "nearby_attractions": [
            "Bet Dwarka Island (30 km)",
            "Nageshwar Jyotirlinga (17 km)",
            "Rukmini Devi Temple (2 km)",
            "Gopi Talav (20 km)",
            "Porbandar — Gandhi birthplace (100 km)",
        ],
    },

    "gir": {
        "name": "Gir National Park",
        "city": "Sasan Gir",
        "state": "Gujarat",
        "type": "Wildlife / Nature",
        "description": (
            "Gir National Park and Wildlife Sanctuary is the only home of the Asiatic Lion in the world. "
            "Spread over 1,412 sq km, it is one of the most important protected areas in Asia. The park "
            "also houses leopards, deer (sambar, chital, nilgai), crocodiles, and over 300 species of "
            "birds. Safari rides offer a chance to spot lions in their natural habitat."
        ),
        "highlights": [
            "Only home of Asiatic Lions",
            "Jeep Safari (3-hour experience)",
            "Kamleshwar Dam — crocodile breeding center",
            "Diverse bird species",
            "Devalia Safari Park (interpretation zone)",
        ],
        "best_time": "December to March (park closed mid-June to mid-October)",
        "entry_fee": "Indian: ₹75, Foreign: ₹1500 (Safari: ₹800-4500)",
        "timings": "6:30 AM to 9:30 AM, 3:00 PM to 5:30 PM (Safari slots)",
        "time_required": "1 full day",
        "coordinates": {"lat": 21.1243, "lng": 70.8242},
        "tips": [
            "Book safari permits online in advance on girlion.in",
            "Morning safaris have higher chances of spotting lions",
            "Carry binoculars and a good camera with zoom lens",
            "Wear earthy/neutral colored clothes — avoid bright colors",
            "The park is closed during monsoon (June 16 to October 15)",
        ],
        "nearby_attractions": [
            "Somnath Temple (45 km)",
            "Junagadh — Girnar Hills (60 km)",
            "Diu Island (90 km)",
            "Tulsi Shyam Hot Springs (40 km)",
        ],
    },

    "statue_of_unity": {
        "name": "Statue of Unity",
        "city": "Kevadia",
        "state": "Gujarat",
        "type": "Monument / Modern",
        "description": (
            "The Statue of Unity is the world's tallest statue at 182 meters (597 feet), dedicated to "
            "Sardar Vallabhbhai Patel, the Iron Man of India. Located on Sadhu Bet island on the "
            "Narmada River near Kevadia, it was inaugurated on October 31, 2018. The statue features "
            "a viewing gallery at 153 meters offering panoramic views of the Narmada Dam and Satpura "
            "& Vindhya mountain ranges."
        ),
        "highlights": [
            "World's tallest statue (182m)",
            "Observation deck at 153m height",
            "Valley of Flowers",
            "Sardar Sarovar Dam view",
            "Laser Light & Sound show",
            "Jungle Safari & Cactus Garden",
            "Unity Glow Garden",
        ],
        "best_time": "October to March",
        "entry_fee": "₹150 (Observation deck: ₹350, Combined: ₹1000+)",
        "timings": "8:00 AM to 6:00 PM (Closed on Mondays)",
        "time_required": "1 full day",
        "coordinates": {"lat": 21.8380, "lng": 73.7191},
        "tips": [
            "Book tickets online in advance — souvenirshop.in",
            "Closed every Monday for maintenance",
            "The observation deck gets crowded — go early",
            "Night light show is spectacular — plan to stay till evening",
            "Wear comfortable walking shoes",
        ],
        "nearby_attractions": [
            "Sardar Sarovar Dam (3 km)",
            "Valley of Flowers (1 km)",
            "Jungle Safari & Cactus Garden (5 km)",
            "Zarwani Waterfall (30 km)",
            "Vadodara city (90 km)",
        ],
    },

    "ahmedabad": {
        "name": "Ahmedabad",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "type": "Heritage / Cultural / City",
        "description": (
            "Ahmedabad is India's first UNESCO World Heritage City, known for its rich cultural heritage, "
            "vibrant street food, textiles, and architectural marvels. It is the largest city in Gujarat "
            "and was the epicenter of India's independence movement. The walled city (old Ahmedabad) "
            "features pols (residential clusters), havelis, and stepwells showcasing centuries of culture."
        ),
        "highlights": [
            "UNESCO World Heritage City",
            "Sabarmati Ashram — Gandhi's home",
            "Adalaj Stepwell — architectural marvel",
            "Kankaria Lake — family entertainment",
            "Law Garden Night Market",
            "Manek Chowk — street food paradise",
            "Sidi Saiyyed Mosque — tree of life jali",
            "Science City — interactive museum",
        ],
        "best_time": "October to February",
        "entry_fee": "Most attractions free or ₹20-100",
        "timings": "Varies by attraction",
        "time_required": "2-3 days for full exploration",
        "coordinates": {"lat": 23.0225, "lng": 72.5714},
        "tips": [
            "Take a Heritage Walk in the old walled city (starts 8 AM)",
            "Evening at Sabarmati Riverfront is beautiful",
            "Try the famous street food — khaman, fafda, dhokla, jalebi",
            "Visit Manek Chowk for night street food (after 10 PM)",
            "Auto-rickshaws are the best way to move in the old city",
        ],
        "nearby_attractions": [
            "Gandhinagar — state capital (23 km)",
            "Adalaj Stepwell (18 km)",
            "Modhera Sun Temple (100 km)",
            "Lothal — Indus Valley site (80 km)",
            "Nal Sarovar Bird Sanctuary (60 km)",
        ],
    },

    "rann_of_kutch": {
        "name": "Rann of Kutch",
        "city": "Kutch",
        "state": "Gujarat",
        "type": "Natural Wonder / Desert",
        "description": (
            "The Great Rann of Kutch is one of the largest salt marshes in the world, covering about "
            "7,505 sq km. During monsoon, the area is submerged under water, but in winter, the water "
            "recedes revealing a vast white salt desert that glows under moonlight. The Rann Utsav "
            "(festival) from November to February is a major attraction featuring cultural performances, "
            "handicraft exhibitions, and luxury tent stays."
        ),
        "highlights": [
            "White Rann — salt desert glowing under moonlight",
            "Rann Utsav festival (Nov-Feb)",
            "Kutch Museum — oldest museum in Gujarat",
            "Bhuj — gateway to Kutch",
            "Handicraft villages — Bhujodi, Ajrakhpur",
            "Mandvi Beach & Palace",
            "Kala Dungar — highest point of Kutch",
        ],
        "best_time": "November to February (Rann Utsav season)",
        "entry_fee": "₹100 (Rann Utsav packages: ₹1500-15000)",
        "timings": "Rann viewpoint: Open 24 hours during festival",
        "time_required": "2-3 days",
        "coordinates": {"lat": 23.7337, "lng": 69.8597},
        "tips": [
            "Full moon nights are the best time to see the White Rann",
            "Book Rann Utsav tents well in advance",
            "Carry warm clothes — desert gets very cold at night",
            "Visit local artisan villages for authentic handicrafts",
            "Hire a local guide for the best experience",
        ],
        "nearby_attractions": [
            "Bhuj city (80 km)",
            "Mandvi Beach (60 km from Bhuj)",
            "Kala Dungar (97 km from Bhuj)",
            "Dholavira — Indus Valley site (250 km)",
            "Wild Ass Sanctuary, Little Rann (200 km)",
        ],
    },

    # ═══════════════════════════════════════════
    # OTHER MAJOR INDIAN DESTINATIONS
    # ═══════════════════════════════════════════

    "agra": {
        "name": "Agra (Taj Mahal)",
        "city": "Agra",
        "state": "Uttar Pradesh",
        "type": "Historical / Wonder of the World",
        "description": (
            "Agra is home to the Taj Mahal, one of the Seven Wonders of the World. Built by Mughal "
            "Emperor Shah Jahan in memory of his wife Mumtaz Mahal, this white marble masterpiece "
            "is a UNESCO World Heritage Site and India's most iconic monument."
        ),
        "highlights": ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh", "Itimad-ud-Daulah"],
        "best_time": "October to March",
        "entry_fee": "Taj Mahal: Indian ₹50, Foreign ₹1300",
        "timings": "Sunrise to Sunset (Closed on Friday)",
        "time_required": "1-2 days",
        "coordinates": {"lat": 27.1751, "lng": 78.0421},
        "tips": [
            "Visit Taj Mahal at sunrise for the best photos",
            "Friday is closed for public — only for prayers",
            "View sunset from Mehtab Bagh across the river",
        ],
        "nearby_attractions": ["Fatehpur Sikri (37 km)", "Mathura-Vrindavan (58 km)"],
    },

    "goa": {
        "name": "Goa",
        "city": "Goa",
        "state": "Goa",
        "type": "Beach / Nightlife / Heritage",
        "description": (
            "Goa is India's smallest state and a tropical paradise known for its stunning beaches, "
            "Portuguese heritage, vibrant nightlife, water sports, and delicious seafood cuisine."
        ),
        "highlights": ["Baga & Calangute Beach", "Old Goa Churches", "Dudhsagar Falls", "Fort Aguada", "Spice Plantations"],
        "best_time": "November to February",
        "entry_fee": "Mostly free (churches/forts: ₹25-50)",
        "timings": "Open — beaches accessible 24/7",
        "time_required": "3-5 days",
        "coordinates": {"lat": 15.2993, "lng": 74.1240},
        "tips": [
            "North Goa for nightlife, South Goa for peace",
            "Rent a scooter — best way to explore",
            "Try local Goan fish curry and bebinca dessert",
        ],
        "nearby_attractions": ["Dudhsagar Falls (60 km)", "Hampi (340 km)"],
    },

    "jaipur": {
        "name": "Jaipur — Pink City",
        "city": "Jaipur",
        "state": "Rajasthan",
        "type": "Heritage / Cultural / Royal",
        "description": (
            "Jaipur, the Pink City, is the capital of Rajasthan. Known for its royal palaces, "
            "magnificent forts, and vibrant bazaars, it forms the famous Golden Triangle tourist "
            "circuit with Delhi and Agra."
        ),
        "highlights": ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Nahargarh Fort", "Jal Mahal"],
        "best_time": "October to March",
        "entry_fee": "Amber Fort: ₹200, Hawa Mahal: ₹50",
        "timings": "9:00 AM to 5:00 PM (most forts)",
        "time_required": "2-3 days",
        "coordinates": {"lat": 26.9124, "lng": 75.7873},
        "tips": [
            "Take elephant ride at Amber Fort (morning)",
            "Visit Nahargarh Fort at sunset for city views",
            "Shop at Johari Bazaar for jewelry and textiles",
        ],
        "nearby_attractions": ["Ajmer/Pushkar (130 km)", "Ranthambore (180 km)"],
    },

    "kerala": {
        "name": "Kerala — God's Own Country",
        "city": "Kerala",
        "state": "Kerala",
        "type": "Nature / Backwaters / Beaches",
        "description": (
            "Kerala is India's tropical paradise, famous for its serene backwaters, lush tea plantations "
            "of Munnar, ayurvedic treatments, and beautiful beaches of Kovalam and Varkala."
        ),
        "highlights": ["Alleppey Backwaters", "Munnar Tea Gardens", "Kovalam Beach", "Thekkady Wildlife", "Fort Kochi"],
        "best_time": "September to March",
        "entry_fee": "Houseboat: ₹6000-15000/day",
        "timings": "Open",
        "time_required": "5-7 days",
        "coordinates": {"lat": 10.8505, "lng": 76.2711},
        "tips": [
            "Book a houseboat in Alleppey — unforgettable experience",
            "Visit Munnar for tea plantation walks",
            "Try Kerala Sadya — traditional vegetarian feast on banana leaf",
        ],
        "nearby_attractions": ["Ooty (160 km from Munnar)", "Coorg (200 km from Wayanad)"],
    },

    "manali": {
        "name": "Manali",
        "city": "Manali",
        "state": "Himachal Pradesh",
        "type": "Hill Station / Adventure",
        "description": (
            "Manali is a stunning hill station in Himachal Pradesh, nestled in the Himalayas at 2,050m. "
            "Known for adventure sports, snow-capped peaks, and the famous Rohtang Pass."
        ),
        "highlights": ["Rohtang Pass", "Solang Valley", "Hadimba Temple", "Old Manali", "Jogini Waterfalls"],
        "best_time": "March to June (summer), December-February (snow)",
        "entry_fee": "Rohtang Pass permit: ₹550",
        "timings": "Open",
        "time_required": "3-4 days",
        "coordinates": {"lat": 32.2396, "lng": 77.1887},
        "tips": [
            "Book Rohtang Pass permit at least 1 day in advance online",
            "Carry warm clothes even in summer",
            "Try the local trout fish at Old Manali cafes",
        ],
        "nearby_attractions": ["Kullu (40 km)", "Kasol (80 km)", "Spiti Valley (200 km)"],
    },

    "varanasi": {
        "name": "Varanasi — Spiritual Capital",
        "city": "Varanasi",
        "state": "Uttar Pradesh",
        "type": "Religious / Spiritual / Cultural",
        "description": (
            "Varanasi (Benares/Kashi) is one of the oldest living cities in the world and the spiritual "
            "capital of India. The Ganges ghats, evening Ganga Aarti at Dashashwamedh Ghat, and the "
            "narrow ancient lanes make it a unique spiritual experience."
        ),
        "highlights": ["Ganga Aarti", "Dashashwamedh Ghat", "Kashi Vishwanath Temple", "Sarnath (Buddhist site)", "Boat ride at sunrise"],
        "best_time": "October to March",
        "entry_fee": "Free (Boat ride: ₹100-500)",
        "timings": "Ganga Aarti: 6:30 PM daily",
        "time_required": "2-3 days",
        "coordinates": {"lat": 25.3176, "lng": 83.0168},
        "tips": [
            "Attend evening Ganga Aarti — arrive 30 mins early",
            "Take a sunrise boat ride on the Ganges",
            "Try famous Banarasi paan and lassi",
        ],
        "nearby_attractions": ["Sarnath (10 km)", "Allahabad/Prayagraj (120 km)"],
    },

    "udaipur": {
        "name": "Udaipur — City of Lakes",
        "city": "Udaipur",
        "state": "Rajasthan",
        "type": "Heritage / Romantic / Royal",
        "description": (
            "Udaipur is the romantic City of Lakes, known for its stunning palaces, serene lakes, "
            "and royal Rajput heritage. The City Palace, Lake Pichola, and Jag Mandir make it "
            "one of the most beautiful cities in India."
        ),
        "highlights": ["City Palace", "Lake Pichola", "Jag Mandir", "Sajjangarh Palace", "Fateh Sagar Lake"],
        "best_time": "September to March",
        "entry_fee": "City Palace: ₹300",
        "timings": "9:30 AM to 5:30 PM",
        "time_required": "2-3 days",
        "coordinates": {"lat": 24.5854, "lng": 73.7125},
        "tips": [
            "Book a lake-facing hotel for the best experience",
            "Evening boat ride on Lake Pichola is a must",
            "Visit Sajjangarh (Monsoon Palace) at sunset",
        ],
        "nearby_attractions": ["Chittorgarh Fort (112 km)", "Kumbhalgarh Fort (84 km)", "Mount Abu (163 km)"],
    },

    "mysore": {
        "name": "Mysore — City of Palaces",
        "city": "Mysore",
        "state": "Karnataka",
        "type": "Heritage / Cultural / Royal",
        "description": (
            "Mysore (Mysuru) is known as the City of Palaces. The magnificent Mysore Palace, "
            "Chamundi Hills, and traditional silk sarees make this a cultural gem of South India."
        ),
        "highlights": ["Mysore Palace", "Chamundi Hills", "Brindavan Gardens", "Mysore Zoo", "St. Philomena's Church"],
        "best_time": "October to February (Dasara in October)",
        "entry_fee": "Palace: ₹70",
        "timings": "10:00 AM to 5:30 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 12.2958, "lng": 76.6394},
        "tips": [
            "Visit during Dasara festival for grand celebrations",
            "Palace illumination on Sundays and festivals (7-8 PM)",
            "Buy authentic Mysore silk from government emporiums",
        ],
        "nearby_attractions": ["Bangalore (150 km)", "Coorg (120 km)", "Ooty (125 km)"],
    },

    "pondicherry": {
        "name": "Pondicherry — French Riviera of India",
        "city": "Pondicherry",
        "state": "Puducherry",
        "type": "Beach / Heritage / Spiritual",
        "description": (
            "Pondicherry (Puducherry) is a former French colony with charming colonial architecture, "
            "beautiful promenades, spiritual Auroville, and serene beaches. The French Quarter "
            "with its yellow buildings and bougainvillea streets is picturesque."
        ),
        "highlights": ["French Quarter", "Promenade Beach", "Auroville", "Paradise Beach", "Sri Aurobindo Ashram"],
        "best_time": "October to March",
        "entry_fee": "Free (Auroville: Free, maintenance donation optional)",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 11.9416, "lng": 79.8083},
        "tips": [
            "Rent a bicycle to explore the French Quarter",
            "Try French cafes and bakeries",
            "Visit Auroville Matrimandir — book in advance",
        ],
        "nearby_attractions": ["Mahabalipuram (100 km)", "Chennai (150 km)"],
    },

    # ═══════════════════════════════════════════
    # METRO CITIES
    # ═══════════════════════════════════════════

    "delhi": {
        "name": "Delhi — Capital of India",
        "city": "New Delhi",
        "state": "Delhi",
        "type": "Heritage / Cultural / Historical",
        "description": "Delhi, India's capital, is a blend of ancient Mughal history and modern cosmopolitan life. From the Red Fort to Qutub Minar, it houses multiple UNESCO World Heritage Sites.",
        "highlights": ["Red Fort", "Qutub Minar", "India Gate", "Humayun's Tomb", "Lotus Temple", "Chandni Chowk", "Akshardham Temple"],
        "best_time": "October to March",
        "entry_fee": "Red Fort: ₹35 (Indian), Qutub Minar: ₹40",
        "timings": "Most sites: 7 AM to 6 PM (Closed Mondays)",
        "time_required": "3-4 days",
        "coordinates": {"lat": 28.6139, "lng": 77.2090},
        "tips": ["Use Delhi Metro — cheapest and fastest", "Visit Chandni Chowk early morning for street food", "Friday is Jama Masjid prayer day — plan accordingly"],
        "nearby_attractions": ["Agra (200 km)", "Jaipur (280 km)", "Mathura (150 km)"],
    },

    "mumbai": {
        "name": "Mumbai — City of Dreams",
        "city": "Mumbai",
        "state": "Maharashtra",
        "type": "Coastal / Heritage / Bollywood / Business",
        "description": "Mumbai is India's financial capital and entertainment hub. From the iconic Gateway of India to Marine Drive, the city never sleeps.",
        "highlights": ["Gateway of India", "Marine Drive", "Elephanta Caves", "Juhu Beach", "Dharavi", "Siddhivinayak Temple", "Chhatrapati Shivaji Terminus"],
        "best_time": "November to February",
        "entry_fee": "Gateway of India: Free, Elephanta Caves: ₹40",
        "timings": "Open (Marine Drive 24hrs)",
        "time_required": "2-3 days",
        "coordinates": {"lat": 19.0760, "lng": 72.8777},
        "tips": ["Take a ferry to Elephanta Caves from Gateway", "Try vada pav and pav bhaji at street stalls", "Crawford Market for spices and dry fruits"],
        "nearby_attractions": ["Lonavala (83 km)", "Pune (150 km)", "Aurangabad (350 km)"],
    },

    "kolkata": {
        "name": "Kolkata — City of Joy",
        "city": "Kolkata",
        "state": "West Bengal",
        "type": "Cultural / Heritage / Art",
        "description": "Kolkata, the cultural capital of India, is home to Nobel laureate Rabindranath Tagore, the Victoria Memorial, and the warmest street food culture in India.",
        "highlights": ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Temple", "Indian Museum", "Park Street", "Sundarbans nearby"],
        "best_time": "October to March (Durga Puja in Oct is unmissable)",
        "entry_fee": "Victoria Memorial: ₹30 (Indian)",
        "timings": "10 AM to 5 PM (most sites)",
        "time_required": "2-3 days",
        "coordinates": {"lat": 22.5726, "lng": 88.3639},
        "tips": ["Durga Puja in October is world-famous — book early", "Try kathi rolls and mishti doi", "Tram rides through old Kolkata are a unique experience"],
        "nearby_attractions": ["Sundarbans (100 km)", "Darjeeling (650 km)", "Digha Beach (180 km)"],
    },

    "hyderabad": {
        "name": "Hyderabad — City of Nizams",
        "city": "Hyderabad",
        "state": "Telangana",
        "type": "Heritage / Cultural / Tech Hub",
        "description": "Hyderabad, the City of Nizams, is famous for its Charminar, Golconda Fort, world-famous Biryani, and now as a major IT hub.",
        "highlights": ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake", "Salar Jung Museum", "Laad Bazaar"],
        "best_time": "October to February",
        "entry_fee": "Golconda Fort: ₹25, Salar Jung Museum: ₹20",
        "timings": "9 AM to 5:30 PM",
        "time_required": "2-3 days",
        "coordinates": {"lat": 17.3850, "lng": 78.4867},
        "tips": ["Try authentic Hyderabadi Biryani at Paradise or Bawarchi", "Golconda Fort sound & light show is spectacular", "Laad Bazaar for bangles and pearls"],
        "nearby_attractions": ["Warangal (145 km)", "Nagarjuna Sagar (165 km)"],
    },

    "bangalore": {
        "name": "Bangalore — Garden City of India",
        "city": "Bangalore",
        "state": "Karnataka",
        "type": "Garden / Tech Hub / Pub Culture",
        "description": "Bangalore (Bengaluru) is India's Silicon Valley, known for its pleasant climate, lush gardens, vibrant pub culture, and as the startup capital of India.",
        "highlights": ["Lalbagh Botanical Garden", "Cubbon Park", "ISKCON Temple", "Vidhana Soudha", "UB City Mall", "Nandi Hills nearby"],
        "best_time": "October to February (pleasant year-round)",
        "entry_fee": "Lalbagh: ₹10, Most parks free",
        "timings": "6 AM to 8 PM (parks)",
        "time_required": "2 days",
        "coordinates": {"lat": 12.9716, "lng": 77.5946},
        "tips": ["Bangalore traffic is heavy — use Metro or Ola/Uber", "Try filter coffee and idli at MTR or Vidyarthi Bhavan", "Nandi Hills sunrise is stunning (60 km away)"],
        "nearby_attractions": ["Mysore (150 km)", "Coorg (250 km)", "Nandi Hills (60 km)"],
    },

    "chennai": {
        "name": "Chennai — Gateway to South India",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "type": "Cultural / Coastal / Temple City",
        "description": "Chennai, formerly Madras, is the cultural capital of South India, famous for Carnatic music, Bharatanatyam dance, Marina Beach, and ancient Dravidian temples.",
        "highlights": ["Marina Beach (2nd longest in world)", "Kapaleeshwarar Temple", "Fort St. George", "Mahabalipuram (day trip)", "DakshinaChitra", "Elliot's Beach"],
        "best_time": "November to February",
        "entry_fee": "Most beaches free, Fort: ₹15",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 13.0827, "lng": 80.2707},
        "tips": ["Start day with South Indian breakfast — idli, dosa, sambar", "Marina Beach evening walk is iconic", "Auto-rickshaws bargain hard — use app-based cabs"],
        "nearby_attractions": ["Mahabalipuram (55 km)", "Pondicherry (150 km)", "Tirupati (135 km)"],
    },

    # ═══════════════════════════════════════════
    # RAJASTHAN — COMPLETE
    # ═══════════════════════════════════════════

    "jodhpur": {
        "name": "Jodhpur — Blue City",
        "city": "Jodhpur",
        "state": "Rajasthan",
        "type": "Heritage / Royal / Desert",
        "description": "Jodhpur, the Blue City, is dominated by the magnificent Mehrangarh Fort and thousands of blue-painted houses. It is the gateway to the Thar Desert.",
        "highlights": ["Mehrangarh Fort", "Umaid Bhawan Palace", "Jaswant Thada", "Clock Tower Market", "Rao Jodha Desert Rock Park"],
        "best_time": "October to March",
        "entry_fee": "Mehrangarh Fort: ₹100 (Indian)",
        "timings": "9 AM to 5 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 26.2389, "lng": 73.0243},
        "tips": ["Climb to Mehrangarh at sunrise for best photos", "Try mirchi vada and mawa kachori", "Blue City view from fort ramparts is stunning"],
        "nearby_attractions": ["Jaisalmer (300 km)", "Bikaner (250 km)", "Ranakpur (160 km)"],
    },

    "jaisalmer": {
        "name": "Jaisalmer — Golden City",
        "city": "Jaisalmer",
        "state": "Rajasthan",
        "type": "Desert / Heritage / Fort City",
        "description": "Jaisalmer, the Golden City, is a living fort city rising from the Thar Desert. Its golden sandstone architecture, camel safaris, and desert camps make it magical.",
        "highlights": ["Jaisalmer Fort (living fort)", "Sam Sand Dunes", "Patwon Ki Haveli", "Gadisar Lake", "Camel Safari", "Desert Camp"],
        "best_time": "November to March",
        "entry_fee": "Fort entry: Free, Havelis: ₹100",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 26.9157, "lng": 70.9083},
        "tips": ["Book desert camp at Sam Dunes in advance", "Sunset camel ride at Sam Dunes is unmissable", "Stay inside the fort for a royal experience"],
        "nearby_attractions": ["Jodhpur (300 km)", "Bikaner (330 km)", "Barmer (150 km)"],
    },

    "pushkar": {
        "name": "Pushkar — Holy Lake City",
        "city": "Pushkar",
        "state": "Rajasthan",
        "type": "Religious / Spiritual / Cultural",
        "description": "Pushkar is one of the holiest Hindu pilgrimages, famous for the only Brahma Temple in the world and the annual Pushkar Camel Fair.",
        "highlights": ["Brahma Temple", "Pushkar Lake (Ghats)", "Savitri Temple", "Pushkar Camel Fair (Nov)", "Rose Garden"],
        "best_time": "October to March (Camel Fair: Nov)",
        "entry_fee": "Temple: Free (donation)",
        "timings": "Open",
        "time_required": "1-2 days",
        "coordinates": {"lat": 26.4899, "lng": 74.5511},
        "tips": ["Vegetarian city — no meat or alcohol allowed", "Evening aarti at ghats is divine", "Camel Fair in November — book months in advance"],
        "nearby_attractions": ["Ajmer (14 km)", "Jaipur (145 km)"],
    },

    "mount_abu": {
        "name": "Mount Abu — Hill Station of Rajasthan",
        "city": "Mount Abu",
        "state": "Rajasthan",
        "type": "Hill Station / Religious",
        "description": "Mount Abu is Rajasthan's only hill station, known for the stunning Dilwara Jain Temples, Nakki Lake, and cool climate amidst the Aravalli mountains.",
        "highlights": ["Dilwara Jain Temples", "Nakki Lake", "Guru Shikhar (highest peak)", "Achalgarh Fort", "Wildlife Sanctuary"],
        "best_time": "November to February",
        "entry_fee": "Dilwara Temples: Free",
        "timings": "12 PM to 6 PM (Dilwara Temples)",
        "time_required": "1-2 days",
        "coordinates": {"lat": 24.5926, "lng": 72.7156},
        "tips": ["Dilwara Temple marble carvings are world-class — no photography inside", "Sunset from Sunset Point is beautiful", "Cameras not allowed inside Dilwara"],
        "nearby_attractions": ["Udaipur (163 km)", "Ahmedabad (225 km)"],
    },

    # ═══════════════════════════════════════════
    # HIMACHAL PRADESH
    # ═══════════════════════════════════════════

    "shimla": {
        "name": "Shimla — Queen of Hills",
        "city": "Shimla",
        "state": "Himachal Pradesh",
        "type": "Hill Station / Colonial Heritage",
        "description": "Shimla, the former summer capital of British India, is a charming hill station with colonial architecture, snow-capped peaks, and the famous Toy Train ride.",
        "highlights": ["The Ridge & Mall Road", "Jakhu Temple (Hanuman)", "Toy Train (UNESCO Heritage)", "Kufri nearby", "Christ Church", "Rashtrapati Niwas"],
        "best_time": "March to June (summer), Dec-Jan (snow)",
        "entry_fee": "Most attractions free",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 31.1048, "lng": 77.1734},
        "tips": ["Take Kalka-Shimla Toy Train — book in advance on IRCTC", "Mall Road is car-free — walk to explore", "Carry warm clothes even in summer"],
        "nearby_attractions": ["Kufri (16 km)", "Chail (45 km)", "Manali (270 km)"],
    },

    "dharamsala": {
        "name": "Dharamsala — Little Lhasa",
        "city": "Dharamsala",
        "state": "Himachal Pradesh",
        "type": "Spiritual / Buddhist / Mountain",
        "description": "Dharamsala and McLeod Ganj are home to the Dalai Lama and the Tibetan government-in-exile. The Himalayan scenery and Buddhist culture make it unique.",
        "highlights": ["Dalai Lama Temple Complex", "Namgyal Monastery", "Bhagsu Waterfall", "Triund Trek", "Tibetan Museum", "Dal Lake"],
        "best_time": "March to June, September to November",
        "entry_fee": "Temple: Free",
        "timings": "6 AM to 8 PM (temple)",
        "time_required": "2-3 days",
        "coordinates": {"lat": 32.2190, "lng": 76.3234},
        "tips": ["Triund Trek is a must — hire a guide for safety", "Attend morning prayers at Dalai Lama Temple", "Try Tibetan momos and thukpa"],
        "nearby_attractions": ["Dalhousie (120 km)", "Kullu (225 km)"],
    },

    "spiti": {
        "name": "Spiti Valley — Cold Desert",
        "city": "Kaza",
        "state": "Himachal Pradesh",
        "type": "Adventure / Buddhist / High Altitude",
        "description": "Spiti is a cold desert mountain valley with ancient Buddhist monasteries, dramatic landscapes, and some of the world's highest inhabited villages.",
        "highlights": ["Key Monastery", "Tabo Monastery (oldest)", "Chandratal Lake", "Langza Village", "Kibber Village", "Pin Valley NP"],
        "best_time": "June to September (road open)",
        "entry_fee": "Monastery: ₹50-100 donation",
        "timings": "Open",
        "time_required": "5-7 days",
        "coordinates": {"lat": 32.2313, "lng": 78.0338},
        "tips": ["Altitude sickness risk — acclimatize properly", "Carry cash — no ATMs in remote areas", "Inner Line Permit required for some areas"],
        "nearby_attractions": ["Manali (200 km via Rohtang)", "Shimla (410 km)"],
    },

    # ═══════════════════════════════════════════
    # UTTARAKHAND
    # ═══════════════════════════════════════════

    "rishikesh": {
        "name": "Rishikesh — Yoga Capital of the World",
        "city": "Rishikesh",
        "state": "Uttarakhand",
        "type": "Spiritual / Adventure / Yoga",
        "description": "Rishikesh, on the banks of the Ganges, is the world capital of yoga and adventure sports. From white-water rafting to meditation retreats, it offers everything.",
        "highlights": ["Laxman Jhula & Ram Jhula", "Triveni Ghat Aarti", "White Water Rafting", "Neer Garh Waterfall", "Beatles Ashram", "Bungee Jumping"],
        "best_time": "September to June (avoid monsoon for rafting)",
        "entry_fee": "Ashrams: Free/donations, Rafting: ₹600-2000",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 30.0869, "lng": 78.2676},
        "tips": ["Rafting season: Feb to May & Sep to Nov", "Evening Ganga Aarti at Triveni Ghat is magical", "Try 16 km rafting stretch — most popular"],
        "nearby_attractions": ["Haridwar (25 km)", "Kedarnath (220 km)", "Auli (250 km)"],
    },

    "haridwar": {
        "name": "Haridwar — Gateway to Gods",
        "city": "Haridwar",
        "state": "Uttarakhand",
        "type": "Religious / Spiritual / Pilgrimage",
        "description": "Haridwar is one of the seven holiest Hindu cities, where the Ganges descends from the Himalayas. Har Ki Pauri Ganga Aarti is among India's most spectacular rituals.",
        "highlights": ["Har Ki Pauri Ghat", "Ganga Aarti (evening)", "Mansa Devi Temple", "Chandi Devi Temple", "Kumbh Mela venue"],
        "best_time": "October to April",
        "entry_fee": "Free",
        "timings": "Aarti: 6 PM daily",
        "time_required": "1 day",
        "coordinates": {"lat": 29.9457, "lng": 78.1642},
        "tips": ["Evening Ganga Aarti at 6 PM is unmissable — go early for front row", "Kumbh Mela every 12 years — massive gathering", "Try haridwar ke pede (sweet)"],
        "nearby_attractions": ["Rishikesh (25 km)", "Dehradun (55 km)"],
    },

    "nainital": {
        "name": "Nainital — Lake District of India",
        "city": "Nainital",
        "state": "Uttarakhand",
        "type": "Hill Station / Lake / Nature",
        "description": "Nainital is a beautiful lake hill station surrounded by mountains. The pear-shaped Naini Lake is its centrepiece, with boating and scenic Mall Road.",
        "highlights": ["Naini Lake (boating)", "Snow View Point", "Naina Devi Temple", "Mall Road", "Eco Cave Gardens", "Zoo"],
        "best_time": "March to June, September to November",
        "entry_fee": "Boating: ₹80-200",
        "timings": "Open",
        "time_required": "1-2 days",
        "coordinates": {"lat": 29.3919, "lng": 79.4542},
        "tips": ["Ropeway to Snow View Point for Himalayan panorama", "Mall Road evening walk and shopping", "Corbett Park is 65 km away"],
        "nearby_attractions": ["Jim Corbett (65 km)", "Mukteshwar (50 km)", "Almora (65 km)"],
    },

    "jim_corbett": {
        "name": "Jim Corbett National Park",
        "city": "Ramnagar",
        "state": "Uttarakhand",
        "type": "Wildlife / Nature / Tiger Reserve",
        "description": "Jim Corbett is India's oldest national park and a premier tiger reserve. Home to Bengal tigers, elephants, leopards, and over 650 bird species.",
        "highlights": ["Bengal Tiger sighting", "Elephant Safari", "Dhikala Zone (best zone)", "Corbett Museum", "Ramganga River"],
        "best_time": "November to June (Forest opens Nov 15)",
        "entry_fee": "₹200 + Safari: ₹2500-5000",
        "timings": "6 AM to 9 AM, 3 PM to 6 PM (safari zones)",
        "time_required": "2-3 days",
        "coordinates": {"lat": 29.5300, "lng": 78.7747},
        "tips": ["Book Dhikala zone permits months in advance online", "Jeep safari better than elephant for tiger sighting", "October to April — dry season, best visibility"],
        "nearby_attractions": ["Nainital (65 km)", "Rishikesh (180 km)"],
    },

    # ═══════════════════════════════════════════
    # JAMMU & KASHMIR / LADAKH
    # ═══════════════════════════════════════════

    "srinagar": {
        "name": "Srinagar — Paradise on Earth",
        "city": "Srinagar",
        "state": "Jammu & Kashmir",
        "type": "Nature / Houseboat / Garden / Lake",
        "description": "Srinagar, on the banks of Dal Lake, is called 'Paradise on Earth'. Famous for its Mughal gardens, shikaras on Dal Lake, and traditional houseboats.",
        "highlights": ["Dal Lake (Shikara ride)", "Houseboat stay", "Mughal Gardens (Shalimar, Nishat)", "Shankaracharya Temple", "Hazratbal Mosque", "Floating Market"],
        "best_time": "April to October",
        "entry_fee": "Gardens: ₹24, Shikara: ₹400/hour",
        "timings": "Dawn to Dusk",
        "time_required": "3-4 days",
        "coordinates": {"lat": 34.0747, "lng": 74.7976},
        "tips": ["Stay in a houseboat on Dal Lake — unique experience", "Shikara ride at sunrise is magical", "Try Kashmiri Wazwan cuisine (Rogan Josh, Yakhni)"],
        "nearby_attractions": ["Gulmarg (56 km)", "Pahalgam (95 km)", "Sonamarg (80 km)"],
    },

    "leh_ladakh": {
        "name": "Leh-Ladakh — Land of High Passes",
        "city": "Leh",
        "state": "Ladakh",
        "type": "Adventure / Buddhist / High Altitude / Desert",
        "description": "Ladakh is a high-altitude cold desert with dramatic landscapes, ancient Buddhist monasteries, and the world's highest motorable roads. Pangong Lake is iconic.",
        "highlights": ["Pangong Tso Lake", "Nubra Valley", "Khardung La Pass", "Thiksey Monastery", "Hemis Monastery", "Magnetic Hill", "Zanskar River"],
        "best_time": "June to September",
        "entry_fee": "Protected Area Permit required (₹200)",
        "timings": "Open during summer only",
        "time_required": "7-10 days",
        "coordinates": {"lat": 34.1526, "lng": 77.5771},
        "tips": ["Acclimatize in Leh for 2 days before exploring", "Inner Line Permit mandatory for Nubra/Pangong", "Carry cash — limited ATMs", "Best on Royal Enfield road trip"],
        "nearby_attractions": ["Srinagar (430 km)", "Manali (490 km via Leh-Manali Highway)"],
    },

    "gulmarg": {
        "name": "Gulmarg — Meadow of Flowers",
        "city": "Gulmarg",
        "state": "Jammu & Kashmir",
        "type": "Ski Resort / Adventure / Nature",
        "description": "Gulmarg is Asia's premier ski resort in winter and a beautiful flower meadow in summer. The Gondola cable car offers stunning Himalayan views.",
        "highlights": ["Gondola (highest cable car in Asia)", "Skiing (Dec-Mar)", "Golf Course (highest in world)", "Baba Reshi Shrine", "Khilenmarg meadow"],
        "best_time": "Dec-Feb (skiing), Apr-Jun (flowers)",
        "entry_fee": "Gondola Phase 1: ₹740, Phase 2: ₹990",
        "timings": "10 AM to 5 PM (Gondola)",
        "time_required": "1-2 days",
        "coordinates": {"lat": 34.0484, "lng": 74.3805},
        "tips": ["Book Gondola tickets early — queues very long", "Ski equipment rental available on-site", "Phase 2 Gondola for Apharwat Peak views"],
        "nearby_attractions": ["Srinagar (56 km)", "Pahalgam (150 km)"],
    },

    # ═══════════════════════════════════════════
    # PUNJAB
    # ═══════════════════════════════════════════

    "amritsar": {
        "name": "Amritsar — Holy City of Sikhs",
        "city": "Amritsar",
        "state": "Punjab",
        "type": "Religious / Spiritual / Patriotic",
        "description": "Amritsar is the spiritual home of Sikhism, holding the Golden Temple (Harmandir Sahib), the holiest Gurdwara. The Wagah Border ceremony is equally iconic.",
        "highlights": ["Golden Temple (Harmandir Sahib)", "Jallianwala Bagh", "Wagah Border Ceremony", "Durgiana Temple", "Partition Museum", "Ram Bagh Garden"],
        "best_time": "October to March",
        "entry_fee": "Golden Temple: Free (langar free for all)",
        "timings": "Golden Temple: Open 24 hours",
        "time_required": "1-2 days",
        "coordinates": {"lat": 31.6340, "lng": 74.8723},
        "tips": ["Cover head at Golden Temple — cloth provided free", "Wagah Border ceremony at sunset — arrive 1 hr early", "Langar (free community meal) served 24/7 to all", "Try Amritsari kulcha and lassi"],
        "nearby_attractions": ["Wagah Border (30 km)", "Anandpur Sahib (100 km)", "Pathankot (110 km)"],
    },

    # ═══════════════════════════════════════════
    # WEST BENGAL / NORTHEAST
    # ═══════════════════════════════════════════

    "darjeeling": {
        "name": "Darjeeling — Queen of Hills",
        "city": "Darjeeling",
        "state": "West Bengal",
        "type": "Hill Station / Tea Garden / Mountain",
        "description": "Darjeeling is famous for its world-renowned tea, stunning views of Kangchenjunga, and the UNESCO-listed Darjeeling Himalayan Railway (Toy Train).",
        "highlights": ["Tiger Hill (Kanchenjunga sunrise)", "Toy Train (UNESCO)", "Tea Garden tours", "Happy Valley Tea Estate", "Peace Pagoda", "Batasia Loop"],
        "best_time": "March to May, September to November",
        "entry_fee": "Toy Train: ₹1400+ (joy ride)",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 27.0360, "lng": 88.2627},
        "tips": ["Tiger Hill sunrise (4 AM start) — Kanchenjunga views are incredible", "Book Toy Train months in advance on IRCTC", "Try first flush Darjeeling tea at estates"],
        "nearby_attractions": ["Gangtok (110 km)", "Kalimpong (50 km)", "Siliguri (80 km)"],
    },

    "gangtok": {
        "name": "Gangtok — Jewel of the Himalayas",
        "city": "Gangtok",
        "state": "Sikkim",
        "type": "Buddhist / Nature / Mountain",
        "description": "Gangtok, the capital of Sikkim, offers stunning Himalayan scenery, Buddhist monasteries, and cable car rides over the mist-covered valley.",
        "highlights": ["Rumtek Monastery", "MG Road (shopping)", "Ropeway (cable car)", "Tsomgo Lake (3780m)", "Banjhakri Falls", "Nathu La Pass (permit)"],
        "best_time": "March to May, October to December",
        "entry_fee": "Tsomgo Lake: Protected Area Permit needed",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 27.3314, "lng": 88.6138},
        "tips": ["Inner Line Permit required for Nathu La and North Sikkim", "Ropeway for aerial views of city", "Try Thukpa and Sikkimese Gundruk"],
        "nearby_attractions": ["Darjeeling (110 km)", "Pelling (130 km)", "Namchi (78 km)"],
    },

    "kaziranga": {
        "name": "Kaziranga National Park",
        "city": "Kaziranga",
        "state": "Assam",
        "type": "Wildlife / UNESCO / Rhino Reserve",
        "description": "Kaziranga is a UNESCO World Heritage Site and home to two-thirds of the world's one-horned rhinoceroses. Also home to tigers, elephants, and wild buffalo.",
        "highlights": ["One-horned Rhinoceros", "Elephant Safari", "Jeep Safari", "Bengal Tiger", "Wild Water Buffalo", "Eastern Swamp Deer"],
        "best_time": "November to April (closed June-October)",
        "entry_fee": "₹250 + Jeep Safari: ₹2700",
        "timings": "6:30 AM to 9:30 AM, 2 PM to 4:30 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 26.5775, "lng": 93.1706},
        "tips": ["Elephant safari for close rhino encounter", "Central range (Kohora) has highest density of rhinos", "Manas NP is 3 hrs away for combined trip"],
        "nearby_attractions": ["Majuli Island (100 km)", "Guwahati (200 km)"],
    },

    "shillong": {
        "name": "Shillong — Scotland of the East",
        "city": "Shillong",
        "state": "Meghalaya",
        "type": "Hill Station / Waterfall / Living Roots",
        "description": "Shillong is the capital of Meghalaya, known as the Scotland of the East for its rolling hills, waterfalls, and the fascinating living root bridges.",
        "highlights": ["Elephant Falls", "Shillong Peak", "Ward's Lake", "Don Bosco Museum", "Cherrapunji (day trip)", "Living Root Bridges (Mawlynnong)"],
        "best_time": "March to June, September to November",
        "entry_fee": "Falls: ₹10-20",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 25.5788, "lng": 91.8933},
        "tips": ["Cherrapunji is 54 km away — world's wettest place", "Try Jadoh (rice and pork) local dish", "Living Root Bridges hike takes 2-3 hours"],
        "nearby_attractions": ["Cherrapunji (54 km)", "Mawlynnong (90 km)", "Guwahati (100 km)"],
    },

    # ═══════════════════════════════════════════
    # ODISHA
    # ═══════════════════════════════════════════

    "puri": {
        "name": "Puri — Abode of Lord Jagannath",
        "city": "Puri",
        "state": "Odisha",
        "type": "Religious / Beach / Pilgrimage",
        "description": "Puri is one of India's four Char Dhams, famous for the Jagannath Temple, the annual Rath Yatra chariot festival, and a long sacred beach.",
        "highlights": ["Jagannath Temple", "Puri Beach", "Rath Yatra (July)", "Konark (day trip)", "Chilika Lake (largest coastal lagoon)"],
        "best_time": "October to February",
        "entry_fee": "Temple: Free (Non-Hindus cannot enter sanctum)",
        "timings": "5 AM to 11 PM (Temple)",
        "time_required": "1-2 days",
        "coordinates": {"lat": 19.8135, "lng": 85.8312},
        "tips": ["Only Hindus allowed inside Jagannath Temple sanctum", "Rath Yatra in July — millions of devotees", "Chilika Lake dolphin boat trip"],
        "nearby_attractions": ["Konark (35 km)", "Bhubaneswar (65 km)", "Chilika Lake (50 km)"],
    },

    "konark": {
        "name": "Konark Sun Temple — UNESCO Heritage",
        "city": "Konark",
        "state": "Odisha",
        "type": "UNESCO Heritage / Historical / Architecture",
        "description": "The Konark Sun Temple is a 13th-century UNESCO World Heritage Site built in the form of a giant chariot of the Sun God, adorned with intricate erotic sculptures.",
        "highlights": ["Sun Temple (UNESCO)", "Chariot wheel sculptures", "Dance Festival (December)", "Chandrabhaga Beach (3 km)", "Archaeological Museum"],
        "best_time": "October to February",
        "entry_fee": "₹40 (Indian), ₹600 (Foreign)",
        "timings": "6 AM to 8 PM",
        "time_required": "Half day",
        "coordinates": {"lat": 19.8876, "lng": 86.0945},
        "tips": ["Combine with Puri visit (35 km away)", "Dance Festival in December is spectacular", "Hire guide to understand the temple's astronomical significance"],
        "nearby_attractions": ["Puri (35 km)", "Bhubaneswar (65 km)"],
    },

    # ═══════════════════════════════════════════
    # SOUTH INDIA — TAMIL NADU / ANDHRA
    # ═══════════════════════════════════════════

    "ooty": {
        "name": "Ooty — Queen of Hill Stations",
        "city": "Ooty",
        "state": "Tamil Nadu",
        "type": "Hill Station / Tea Garden / Nature",
        "description": "Ooty (Udhagamandalam) in the Nilgiri Hills is a beautiful hill station with fragrant tea gardens, a botanical garden, and the famous Nilgiri Mountain Railway.",
        "highlights": ["Nilgiri Mountain Railway (UNESCO)", "Ooty Lake", "Botanical Garden", "Doddabetta Peak", "Tea Museum", "Rose Garden"],
        "best_time": "April to June, September to November",
        "entry_fee": "Botanical Garden: ₹30",
        "timings": "Open",
        "time_required": "2 days",
        "coordinates": {"lat": 11.4102, "lng": 76.6950},
        "tips": ["Toy Train from Mettupalayam — book in advance", "Doddabetta for sunrise — arrive early", "Try home-made Ooty chocolate and tea"],
        "nearby_attractions": ["Kodaikanal (240 km)", "Mysore (125 km)", "Coorg (165 km)"],
    },

    "madurai": {
        "name": "Madurai — Temple City",
        "city": "Madurai",
        "state": "Tamil Nadu",
        "type": "Religious / Cultural / Temple",
        "description": "Madurai is one of the oldest continually inhabited cities in the world. The Meenakshi Amman Temple with its 14 magnificent gopurams (towers) is a masterpiece of Dravidian architecture.",
        "highlights": ["Meenakshi Amman Temple", "Thirumalai Nayakkar Palace", "Gandhi Museum", "Alagar Kovil", "Vaigai River"],
        "best_time": "October to March",
        "entry_fee": "Temple: Free (camera ₹50)",
        "timings": "5 AM to 12:30 PM, 4 PM to 9:30 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 9.9252, "lng": 78.1198},
        "tips": ["Night temple visit (6-8 PM) when gopurams are lit up", "Floating Lotus Pond inside temple is stunning", "Try Jigarthanda (famous cold drink) and Madurai Kari Dosa"],
        "nearby_attractions": ["Rameswaram (180 km)", "Kodaikanal (120 km)", "Trichy (130 km)"],
    },

    "rameswaram": {
        "name": "Rameswaram — Island Pilgrimage",
        "city": "Rameswaram",
        "state": "Tamil Nadu",
        "type": "Religious / Coastal / Pilgrimage",
        "description": "Rameswaram, on an island connected to mainland India by Pamban Bridge, is one of Hinduism's holiest sites. The Ramanathaswamy Temple has 22 sacred wells.",
        "highlights": ["Ramanathaswamy Temple", "Pamban Bridge", "Dhanushkodi ruins", "Agni Theertham beach (sunrise)", "Adam's Bridge view"],
        "best_time": "October to April",
        "entry_fee": "Temple: Free",
        "timings": "5 AM to 1 PM, 3 PM to 9 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 9.2885, "lng": 79.3129},
        "tips": ["Take holy bath in temple wells (₹10 each)", "Dhanushkodi ghost town sunrise is eerie and beautiful", "Pamban Railway Bridge is an engineering marvel"],
        "nearby_attractions": ["Madurai (180 km)", "Kanyakumari (320 km)"],
    },

    "tirupati": {
        "name": "Tirupati — Richest Temple in World",
        "city": "Tirupati",
        "state": "Andhra Pradesh",
        "type": "Religious / Pilgrimage / Temple",
        "description": "The Tirupati Balaji Temple (Venkateswara Temple) on Tirumala Hills is the richest and most visited religious site in the world, receiving over 75,000 pilgrims daily.",
        "highlights": ["Tirumala Venkateswara Temple", "Govindharaja Temple", "Chandragiri Fort", "Kapila Theertham Waterfall", "Sri Padmavathi Temple"],
        "best_time": "September to February",
        "entry_fee": "Temple: Special Darshan ₹300, Free darshan (long queue)",
        "timings": "24 hours (temple), Darshan: check TTD website",
        "time_required": "1-2 days",
        "coordinates": {"lat": 13.6288, "lng": 79.4192},
        "tips": ["Book Special Entry Darshan on TTD website in advance", "Free hair cutting (tonsure) service at temple", "Tirupati laddoo prasad is famous — buy from TTD counters"],
        "nearby_attractions": ["Chennai (135 km)", "Kanchipuram (100 km)"],
    },

    "mahabalipuram": {
        "name": "Mahabalipuram — Shore Temple UNESCO",
        "city": "Mahabalipuram",
        "state": "Tamil Nadu",
        "type": "UNESCO Heritage / Coastal / Historical",
        "description": "Mahabalipuram (Mamallapuram) is a UNESCO World Heritage Site with magnificent rock-cut temples, rathas (chariot temples), and the Shore Temple overlooking the Bay of Bengal.",
        "highlights": ["Shore Temple", "Pancha Rathas", "Arjuna's Penance (rock carving)", "Tiger Cave", "Mahabalipuram Beach", "Five Rathas"],
        "best_time": "October to February",
        "entry_fee": "₹40 (Indian), ₹600 (Foreign)",
        "timings": "6 AM to 6 PM",
        "time_required": "Half day to 1 day",
        "coordinates": {"lat": 12.6172, "lng": 80.1927},
        "tips": ["Start early — monuments get hot by noon", "Combine with Chennai or Pondicherry trip", "Sunset at Shore Temple is gorgeous"],
        "nearby_attractions": ["Chennai (55 km)", "Pondicherry (100 km)"],
    },

    # ═══════════════════════════════════════════
    # KARNATAKA
    # ═══════════════════════════════════════════

    "hampi": {
        "name": "Hampi — UNESCO Ruined Capital",
        "city": "Hampi",
        "state": "Karnataka",
        "type": "UNESCO Heritage / Historical / Ruins",
        "description": "Hampi is a UNESCO World Heritage Site — the ruined capital of the Vijayanagara Empire, spread over 26 sq km with over 1600 monuments amid giant boulders.",
        "highlights": ["Virupaksha Temple", "Vittala Temple (Stone Chariot)", "Hampi Bazaar", "Elephant Stables", "Lotus Mahal", "Tungabhadra River (coracle ride)"],
        "best_time": "October to February",
        "entry_fee": "₹40 (Indian), ₹600 (Foreign)",
        "timings": "6 AM to 6 PM",
        "time_required": "2-3 days",
        "coordinates": {"lat": 15.3350, "lng": 76.4600},
        "tips": ["Rent a bicycle or scooter to cover all monuments", "Sunrise from Matanga Hill is breathtaking", "Coracle boat ride across Tungabhadra is unique"],
        "nearby_attractions": ["Hospet (13 km)", "Badami (140 km)", "Bangalore (350 km)"],
    },

    "coorg": {
        "name": "Coorg — Scotland of India",
        "city": "Madikeri",
        "state": "Karnataka",
        "type": "Hill Station / Coffee / Nature / Trekking",
        "description": "Coorg (Kodagu) is India's coffee country, known for misty hills, aromatic coffee and spice plantations, and the brave Kodava warrior culture.",
        "highlights": ["Abbey Falls", "Raja's Seat viewpoint", "Namdroling Monastery (Golden Temple)", "Dubare Elephant Camp", "Coffee plantation tours", "Iruppu Falls"],
        "best_time": "October to March",
        "entry_fee": "Abbey Falls: ₹20",
        "timings": "Open",
        "time_required": "2-3 days",
        "coordinates": {"lat": 12.4244, "lng": 75.7382},
        "tips": ["Buy fresh Coorg coffee directly from estates", "Raja's Seat at sunset — stunning valley views", "Namdroling Monastery (Golden Temple) is magnificent"],
        "nearby_attractions": ["Mysore (120 km)", "Bangalore (250 km)", "Wayanad (Kerala, 100 km)"],
    },

    # ═══════════════════════════════════════════
    # MAHARASHTRA
    # ═══════════════════════════════════════════

    "aurangabad": {
        "name": "Aurangabad — Gateway to Ajanta Ellora",
        "city": "Aurangabad",
        "state": "Maharashtra",
        "type": "UNESCO Heritage / Historical / Cave Temples",
        "description": "Aurangabad is the base for visiting Ajanta and Ellora Caves — UNESCO World Heritage Sites with stunning rock-cut Buddhist, Hindu, and Jain temples.",
        "highlights": ["Ajanta Caves (UNESCO) — 29 rock-cut Buddhist caves", "Ellora Caves (UNESCO) — 34 caves", "Bibi ka Maqbara (mini Taj)", "Daulatabad Fort", "Panchakki"],
        "best_time": "November to March",
        "entry_fee": "Ajanta: ₹40, Ellora: ₹40",
        "timings": "9 AM to 5:30 PM (closed Tuesdays at Ajanta)",
        "time_required": "2-3 days",
        "coordinates": {"lat": 19.8762, "lng": 75.3433},
        "tips": ["Ajanta Caves are 100 km away — start early", "Ellora's Kailash Temple is world's largest monolithic structure", "Bibi ka Maqbara free on Fridays"],
        "nearby_attractions": ["Mukhedpur (Ajanta, 100 km)", "Shirdi (130 km)", "Nashik (190 km)"],
    },

    "lonavala": {
        "name": "Lonavala — Weekend Getaway",
        "city": "Lonavala",
        "state": "Maharashtra",
        "type": "Hill Station / Waterfalls / Nature",
        "description": "Lonavala and Khandala are twin hill stations in the Western Ghats, popular monsoon getaways from Mumbai and Pune with waterfalls and viewpoints.",
        "highlights": ["Bhushi Dam", "Tiger's Leap", "Rajmachi Fort Trek", "Karla Caves", "Bhaja Caves", "Lohagad Fort", "Shooting Point (Khandala)"],
        "best_time": "June to September (monsoon), October to February",
        "entry_fee": "Caves: ₹25",
        "timings": "Open",
        "time_required": "1-2 days",
        "coordinates": {"lat": 18.7480, "lng": 73.4071},
        "tips": ["Best during monsoon for waterfalls (Jul-Aug)", "Try famous Lonavala chikki (sweet)", "Bhushi Dam very crowded in monsoon — visit early morning"],
        "nearby_attractions": ["Pune (65 km)", "Mumbai (83 km)", "Mahabaleshwar (120 km)"],
    },

    "pune": {
        "name": "Pune — Oxford of the East",
        "city": "Pune",
        "state": "Maharashtra",
        "type": "Cultural / Historical / Education Hub",
        "description": "Pune is a vibrant city known for its Maratha history, Osho Ashram, Aga Khan Palace, and great food and nightlife. It is also India's education capital.",
        "highlights": ["Shaniwar Wada", "Aga Khan Palace", "Osho International Meditation Resort", "Sinhagad Fort", "Pataleshwar Cave Temple", "Dagdusheth Halwai Ganpati"],
        "best_time": "October to February",
        "entry_fee": "Shaniwar Wada: ₹25",
        "timings": "8 AM to 6:30 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 18.5204, "lng": 73.8567},
        "tips": ["Sinhagad Fort trek in morning (20 km from city)", "Pune has excellent food culture — FC Road and JM Road", "Dagdusheth Ganpati for auspicious darshan"],
        "nearby_attractions": ["Lonavala (65 km)", "Mumbai (150 km)", "Mahabaleshwar (120 km)"],
    },

    # ═══════════════════════════════════════════
    # MADHYA PRADESH
    # ═══════════════════════════════════════════

    "khajuraho": {
        "name": "Khajuraho — Temples of Love",
        "city": "Khajuraho",
        "state": "Madhya Pradesh",
        "type": "UNESCO Heritage / Historical / Temple",
        "description": "Khajuraho's medieval temples, a UNESCO World Heritage Site, are famous for their exquisite erotic sculptures. Built by Chandela dynasty between 950-1050 CE.",
        "highlights": ["Western Temple Group (UNESCO)", "Kandariya Mahadeva Temple", "Light & Sound Show", "Eastern Temple Group", "Archaeological Museum"],
        "best_time": "October to March",
        "entry_fee": "₹40 (Indian), ₹600 (Foreign)",
        "timings": "Sunrise to Sunset",
        "time_required": "1-2 days",
        "coordinates": {"lat": 24.8318, "lng": 79.9199},
        "tips": ["Evening Light & Sound Show is excellent", "Hire guide to understand temple iconography", "Western group is most impressive — start there"],
        "nearby_attractions": ["Panna Tiger Reserve (45 km)", "Orchha (175 km)", "Varanasi (400 km)"],
    },

    "kanha": {
        "name": "Kanha National Park — Tiger Reserve",
        "city": "Kanha",
        "state": "Madhya Pradesh",
        "type": "Wildlife / Tiger Reserve / Nature",
        "description": "Kanha is one of India's finest tiger reserves and the inspiration for Rudyard Kipling's 'The Jungle Book'. Best known for Bengal tigers and barasingha deer.",
        "highlights": ["Bengal Tiger Safari", "Swamp Deer (Barasingha)", "Leopard sighting", "Wild Dog (Dhole)", "Kanha Museum", "Jeep Safari"],
        "best_time": "October to June (closed July-September)",
        "entry_fee": "₹200 + Jeep Safari ₹2000-4000",
        "timings": "6 AM to 11 AM, 3 PM to 6 PM",
        "time_required": "2-3 days",
        "coordinates": {"lat": 22.3333, "lng": 80.6167},
        "tips": ["Book safari zones online in advance on MP Forest website", "Pre-dawn starts give best tiger sightings", "Kanha zone and Mukki zone both excellent"],
        "nearby_attractions": ["Bandhavgarh (250 km)", "Pench (165 km)"],
    },

    # ═══════════════════════════════════════════
    # BIHAR / UP HERITAGE
    # ═══════════════════════════════════════════

    "bodh_gaya": {
        "name": "Bodh Gaya — Where Buddha Attained Enlightenment",
        "city": "Bodh Gaya",
        "state": "Bihar",
        "type": "Buddhist / UNESCO / Pilgrimage",
        "description": "Bodh Gaya is the most sacred Buddhist pilgrimage site — where Siddhartha Gautama attained enlightenment under the Bodhi Tree. A UNESCO World Heritage Site.",
        "highlights": ["Mahabodhi Temple (UNESCO)", "Bodhi Tree", "Great Buddha Statue (25m)", "Thai Temple", "Japanese Temple", "Tibetan Monastery"],
        "best_time": "October to March",
        "entry_fee": "Temple: Free",
        "timings": "5 AM to 9 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 24.6961, "lng": 84.9915},
        "tips": ["Meditate under the Bodhi Tree — peaceful experience", "Visit at dawn for quiet prayer time", "Many nationalities have built their own temples here"],
        "nearby_attractions": ["Rajgir (78 km)", "Nalanda (95 km)", "Varanasi (280 km)"],
    },

    "mathura_vrindavan": {
        "name": "Mathura-Vrindavan — Birthplace of Krishna",
        "city": "Mathura",
        "state": "Uttar Pradesh",
        "type": "Religious / Spiritual / Hindu Pilgrimage",
        "description": "Mathura is the birthplace of Lord Krishna, and Vrindavan is where he grew up. Together they form the most sacred pilgrimage circuit for Vaishnavas.",
        "highlights": ["Krishna Janmabhoomi Temple", "Dwarkadheesh Temple", "ISKCON Vrindavan", "Prem Mandir (illuminated at night)", "Banke Bihari Temple", "Holi celebrations (March)"],
        "best_time": "October to March (Holi in March — world-famous)",
        "entry_fee": "Temples: Free",
        "timings": "5 AM to 12 PM, 4 PM to 9 PM",
        "time_required": "1-2 days",
        "coordinates": {"lat": 27.4924, "lng": 77.6737},
        "tips": ["Holi in Mathura/Vrindavan is the most vibrant in India — book months ahead", "Prem Mandir illumination after 7 PM is stunning", "ISKCON Vrindavan for beautiful temple complex"],
        "nearby_attractions": ["Agra (58 km)", "Delhi (150 km)"],
    },
}


# ── City aliases for NLP matching ──
CITY_ALIASES = {
    # Gujarat
    "somnath": "somnath", "somanath": "somnath", "prabhas patan": "somnath",
    "dwarka": "dwarka", "dwaraka": "dwarka", "dwarkadhish": "dwarka",
    "gir": "gir", "gir national park": "gir", "sasan gir": "gir", "gir forest": "gir",
    "statue of unity": "statue_of_unity", "kevadia": "statue_of_unity", "kevadiya": "statue_of_unity",
    "sardar patel statue": "statue_of_unity", "sou": "statue_of_unity",
    "ahmedabad": "ahmedabad", "amdavad": "ahmedabad", "ahemdabad": "ahmedabad",
    "rann of kutch": "rann_of_kutch", "kutch": "rann_of_kutch", "kachchh": "rann_of_kutch",
    "rann utsav": "rann_of_kutch", "white rann": "rann_of_kutch", "bhuj": "rann_of_kutch",
    # Rajasthan
    "agra": "agra", "taj mahal": "agra", "tajmahal": "agra",
    "jaipur": "jaipur", "pink city": "jaipur",
    "jodhpur": "jodhpur", "blue city": "jodhpur", "mehrangarh": "jodhpur",
    "jaisalmer": "jaisalmer", "golden city": "jaisalmer", "sam dunes": "jaisalmer",
    "udaipur": "udaipur", "city of lakes": "udaipur",
    "pushkar": "pushkar", "brahma temple": "pushkar",
    "mount abu": "mount_abu", "dilwara": "mount_abu", "nakki lake": "mount_abu",
    # HP
    "manali": "manali", "rohtang": "manali",
    "shimla": "shimla", "simla": "shimla", "queen of hills": "shimla",
    "dharamsala": "dharamsala", "mcleod ganj": "dharamsala", "mcleodganj": "dharamsala", "little lhasa": "dharamsala",
    "spiti": "spiti", "spiti valley": "spiti", "kaza": "spiti", "key monastery": "spiti",
    # Uttarakhand
    "rishikesh": "rishikesh", "yoga capital": "rishikesh",
    "haridwar": "haridwar", "hardwar": "haridwar", "har ki pauri": "haridwar",
    "nainital": "nainital", "naini lake": "nainital",
    "jim corbett": "jim_corbett", "corbett": "jim_corbett", "ramnagar": "jim_corbett",
    # J&K / Ladakh
    "srinagar": "srinagar", "dal lake": "srinagar", "paradise on earth": "srinagar",
    "leh": "leh_ladakh", "ladakh": "leh_ladakh", "pangong": "leh_ladakh", "nubra": "leh_ladakh",
    "gulmarg": "gulmarg", "meadow of flowers": "gulmarg",
    "pahalgam": "pahalgam",
    # Punjab
    "amritsar": "amritsar", "golden temple": "amritsar", "harmandir sahib": "amritsar", "wagah": "amritsar",
    # West Bengal / NE
    "darjeeling": "darjeeling", "toy train darjeeling": "darjeeling",
    "gangtok": "gangtok", "sikkim": "gangtok",
    "kaziranga": "kaziranga", "one horned rhino": "kaziranga",
    "shillong": "shillong", "scotland of east": "shillong", "meghalaya": "shillong",
    # Odisha
    "puri": "puri", "jagannath": "puri", "rath yatra": "puri",
    "konark": "konark", "sun temple": "konark",
    # Tamil Nadu
    "ooty": "ooty", "udhagamandalam": "ooty", "nilgiri": "ooty",
    "madurai": "madurai", "meenakshi": "madurai",
    "rameswaram": "rameswaram", "rameshwaram": "rameswaram",
    "tirupati": "tirupati", "tirumala": "tirupati", "balaji": "tirupati", "venkateswara": "tirupati",
    "mahabalipuram": "mahabalipuram", "mammallapuram": "mahabalipuram", "shore temple": "mahabalipuram",
    # Karnataka
    "hampi": "hampi", "vijayanagara": "hampi",
    "coorg": "coorg", "kodagu": "coorg", "madikeri": "coorg",
    "mysore": "mysore", "mysuru": "mysore",
    # Maharashtra
    "aurangabad": "aurangabad", "ajanta": "aurangabad", "ellora": "aurangabad",
    "lonavala": "lonavala", "khandala": "lonavala",
    "pune": "pune", "poona": "pune",
    "mumbai": "mumbai", "bombay": "mumbai",
    # MP
    "khajuraho": "khajuraho",
    "kanha": "kanha", "kanha national park": "kanha", "jungle book": "kanha",
    # Bihar / UP
    "bodh gaya": "bodh_gaya", "bodhgaya": "bodh_gaya", "bodhi tree": "bodh_gaya",
    "mathura": "mathura_vrindavan", "vrindavan": "mathura_vrindavan", "vrindaban": "mathura_vrindavan",
    "varanasi": "varanasi", "banaras": "varanasi", "kashi": "varanasi", "benares": "varanasi",
    # South
    "kerala": "kerala", "munnar": "kerala", "alleppey": "kerala", "kochi": "kerala",
    "goa": "goa", "baga": "goa", "calangute": "goa",
    "hyderabad": "hyderabad", "charminar": "hyderabad", "golconda": "hyderabad",
    "bangalore": "bangalore", "bengaluru": "bangalore",
    "chennai": "chennai", "madras": "chennai",
    "pondicherry": "pondicherry", "puducherry": "pondicherry", "pondy": "pondicherry",
    # General
    "kolkata": "kolkata", "calcutta": "kolkata",
    "delhi": "delhi", "new delhi": "delhi",
    "amritsar": "amritsar",
}

# ── Major cities coordinates (for distance calculation) ──
CITY_COORDINATES = {
    "delhi": {"lat": 28.6139, "lng": 77.2090},
    "mumbai": {"lat": 19.0760, "lng": 72.8777},
    "ahmedabad": {"lat": 23.0225, "lng": 72.5714},
    "bangalore": {"lat": 12.9716, "lng": 77.5946},
    "chennai": {"lat": 13.0827, "lng": 80.2707},
    "kolkata": {"lat": 22.5726, "lng": 88.3639},
    "hyderabad": {"lat": 17.3850, "lng": 78.4867},
    "jaipur": {"lat": 26.9124, "lng": 75.7873},
    "goa": {"lat": 15.2993, "lng": 74.1240},
    "agra": {"lat": 27.1751, "lng": 78.0421},
    "varanasi": {"lat": 25.3176, "lng": 83.0168},
    "udaipur": {"lat": 24.5854, "lng": 73.7125},
    "manali": {"lat": 32.2396, "lng": 77.1887},
    "somnath": {"lat": 20.8880, "lng": 70.4012},
    "dwarka": {"lat": 22.2394, "lng": 68.9678},
    "gir": {"lat": 21.1243, "lng": 70.8242},
    "kevadia": {"lat": 21.8380, "lng": 73.7191},
    "kutch": {"lat": 23.7337, "lng": 69.8597},
    "mysore": {"lat": 12.2958, "lng": 76.6394},
    "pondicherry": {"lat": 11.9416, "lng": 79.8083},
    "kerala": {"lat": 10.8505, "lng": 76.2711},
    "surat": {"lat": 21.1702, "lng": 72.8311},
    "vadodara": {"lat": 22.3072, "lng": 73.1812},
    "rajkot": {"lat": 22.3039, "lng": 70.8022},
    "pune": {"lat": 18.5204, "lng": 73.8567},
    "lucknow": {"lat": 26.8467, "lng": 80.9462},
    "indore": {"lat": 22.7196, "lng": 75.8577},
    "bhopal": {"lat": 23.2599, "lng": 77.4126},
}
