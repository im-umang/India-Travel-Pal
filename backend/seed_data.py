"""
Seed script — adds 25 more travel destinations + 30 realistic activity logs to MongoDB.
Run: python seed_data.py
"""
import asyncio
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017"
DB_NAME   = "india_travel_pal"

# ──────────────────────────────────────────────
# 25 NEW DESTINATIONS
# ──────────────────────────────────────────────
NEW_DESTINATIONS = [
    {
        "name": "Shimla — Queen of Hills",
        "city": "Shimla", "state": "Himachal Pradesh",
        "type": "Hill Station",
        "description": "Shimla is the capital of Himachal Pradesh and the most popular hill station in North India. Once the summer capital of British India, it retains its colonial charm with Victorian architecture, toy train rides, and snow-capped peaks.",
        "highlights": ["Mall Road", "Christ Church", "Jakhu Temple", "Kufri skiing", "Toy Train (UNESCO)", "Scandal Point"],
        "best_time": "March to June (summer), December to February (snow)",
        "entry_fee": "Most attractions free; Heritage Museum: Rs 50",
        "timings": "Open all day",
        "time_required": "2-3 days",
        "tips": ["Toy train from Kalka is a must-do experience", "Visit Kufri for skiing in winter", "Mall Road is car-free — explore on foot"],
        "nearby_attractions": ["Kufri (14 km)", "Chail (45 km)", "Manali (270 km)"],
        "coordinates": {"lat": 31.1048, "lng": 77.1734},
    },
    {
        "name": "Coorg — Scotland of India",
        "city": "Madikeri", "state": "Karnataka",
        "type": "Hill Station / Nature",
        "description": "Coorg (Kodagu) is a misty hill district in Karnataka, famous for its sprawling coffee plantations, lush forests, waterfalls, and the unique Kodava culture. It is one of India's top eco-tourism destinations.",
        "highlights": ["Abbey Falls", "Raja's Seat sunset point", "Dubare Elephant Camp", "Talacauvery — Kaveri origin", "Coffee Plantation tours", "Namdroling Monastery"],
        "best_time": "October to March",
        "entry_fee": "Abbey Falls Rs 30; Elephant Camp Rs 300",
        "timings": "Open",
        "time_required": "3-4 days",
        "tips": ["Stay at a coffee estate for authentic experience", "Try Pandi curry (pork) — local specialty", "Visit during Oct-Nov for coffee harvest season"],
        "nearby_attractions": ["Mysore (120 km)", "Nagarhole National Park (80 km)"],
        "coordinates": {"lat": 12.4244, "lng": 75.7382},
    },
    {
        "name": "Darjeeling — Land of Thunderbolt",
        "city": "Darjeeling", "state": "West Bengal",
        "type": "Hill Station / Scenic",
        "description": "Darjeeling is perched at 2,042m in the Himalayan foothills of West Bengal. Famous for its tea gardens, the iconic Toy Train (Darjeeling Himalayan Railway), and stunning views of Kanchenjunga — the world's third-highest peak.",
        "highlights": ["Tiger Hill sunrise over Kanchenjunga", "Darjeeling Himalayan Railway (UNESCO)", "Happy Valley Tea Estate", "Batasia Loop", "Padmaja Naidu Zoo (Red Pandas)", "Peace Pagoda"],
        "best_time": "March to May, September to November",
        "entry_fee": "Tiger Hill: Rs 50; Tea Estate: Rs 100",
        "timings": "Tiger Hill: 4 AM (sunrise)",
        "time_required": "2-3 days",
        "tips": ["Wake up early for Tiger Hill sunrise views of Kanchenjunga", "Try authentic Darjeeling First Flush tea", "Carry warm clothes — it gets very cold"],
        "nearby_attractions": ["Gangtok (100 km)", "Mirik (50 km)", "Kalimpong (55 km)"],
        "coordinates": {"lat": 27.0360, "lng": 88.2627},
    },
    {
        "name": "Leh Ladakh — Land of High Passes",
        "city": "Leh", "state": "Ladakh",
        "type": "Adventure / Scenic / Cultural",
        "description": "Ladakh is a breathtaking high-altitude desert region, often called the 'Land of High Passes'. With its ancient monasteries, turquoise lakes, dramatic mountain landscapes, and Tibetan Buddhist culture, it offers an otherworldly travel experience.",
        "highlights": ["Pangong Tso Lake", "Nubra Valley & Bactrian Camels", "Khardung La Pass", "Thiksey Monastery", "Magnetic Hill", "Zanskar River rafting", "Tso Moriri Lake"],
        "best_time": "June to September",
        "entry_fee": "Inner Line Permit required for some areas; Rs 200-400",
        "timings": "Open (June-September only for road access)",
        "time_required": "7-10 days",
        "tips": ["Acclimatize for 2 days before any activity", "Carry warm clothes even in summer", "Book permits and hotels well in advance", "Carry cash — ATMs are scarce"],
        "nearby_attractions": ["Srinagar (434 km)", "Manali-Leh Highway (480 km)"],
        "coordinates": {"lat": 34.1526, "lng": 77.5771},
    },
    {
        "name": "Andaman Islands — Blue Lagoon of India",
        "city": "Port Blair", "state": "Andaman and Nicobar Islands",
        "type": "Beach / Island / Adventure",
        "description": "The Andaman Islands offer pristine white-sand beaches, crystal-clear turquoise waters, vibrant coral reefs, and rich marine life. The Cellular Jail — a historic colonial prison — is a major attraction.",
        "highlights": ["Radhanagar Beach (Asia's Best Beach)", "Cellular Jail & Light Show", "Scuba Diving at Havelock", "Neil Island beaches", "Snorkeling at Elephant Beach", "Ross Island"],
        "best_time": "October to May",
        "entry_fee": "Cellular Jail: Rs 30; Light Show: Rs 50; Water sports: Rs 500-3000",
        "timings": "Open",
        "time_required": "5-7 days",
        "tips": ["Book ferries between islands in advance", "Carry reef-safe sunscreen", "Try scuba diving — even beginners can do introductory dives", "Seafood is fresh and delicious"],
        "nearby_attractions": ["Havelock Island (70 km by ferry)", "Neil Island (40 km by ferry)"],
        "coordinates": {"lat": 11.7401, "lng": 92.6586},
    },
    {
        "name": "Ranthambore National Park",
        "city": "Ranthambore", "state": "Rajasthan",
        "type": "Wildlife / Nature",
        "description": "Ranthambore is one of India's best wildlife sanctuaries, known for its population of Bengal Tigers. The park also features ancient Ranthambore Fort ruins inside it, offering a unique combination of wildlife and heritage.",
        "highlights": ["Tiger Sighting on Safari", "Ranthambore Fort (inside the park)", "Padam Talao lake", "Zone 3 & 4 (best tiger zones)", "Photography safaris"],
        "best_time": "October to June (best: March to May)",
        "entry_fee": "Safari: Rs 1200-3500 per person",
        "timings": "Morning: 6-10 AM; Evening: 3-7 PM",
        "time_required": "2-3 days",
        "tips": ["Book safaris online well in advance on rajasthan.gov.in", "Zone 3 & 4 have highest tiger sightings", "Morning safaris are better for wildlife spotting"],
        "nearby_attractions": ["Jaipur (180 km)", "Bundi (155 km)", "Ajmer (190 km)"],
        "coordinates": {"lat": 26.0173, "lng": 76.5026},
    },
    {
        "name": "Hampi — Ruins of Vijayanagara",
        "city": "Hampi", "state": "Karnataka",
        "type": "Historical / Heritage / UNESCO",
        "description": "Hampi is a UNESCO World Heritage Site and the ruins of the once-glorious Vijayanagara Empire. Spread across a surreal boulder-strewn landscape on the banks of the Tungabhadra River, it has over 1,600 surviving monuments.",
        "highlights": ["Virupaksha Temple", "Vittala Temple & Stone Chariot", "Hampi Bazaar ruins", "Lotus Mahal", "Elephant Stables", "Matanga Hill sunrise", "Tungabhadra river coracle ride"],
        "best_time": "October to February",
        "entry_fee": "Rs 40 (Indian), Rs 600 (Foreign)",
        "timings": "6 AM to 6 PM",
        "time_required": "2-3 days",
        "tips": ["Rent a bicycle or scooter to cover the vast site", "Sunrise from Matanga Hill is spectacular", "Stay in Hampi side (not Hospet) for proximity"],
        "nearby_attractions": ["Hospet (13 km)", "Badami (150 km)", "Goa (390 km)"],
        "coordinates": {"lat": 15.3350, "lng": 76.4600},
    },
    {
        "name": "Amritsar — Golden Temple City",
        "city": "Amritsar", "state": "Punjab",
        "type": "Religious / Cultural / Historical",
        "description": "Amritsar is the spiritual home of Sikhism and the site of the magnificent Harmandir Sahib (Golden Temple) — the holiest Gurdwara in the world. The city also carries the deep historical scars of the Jallianwala Bagh massacre.",
        "highlights": ["Golden Temple (Harmandir Sahib)", "Wagah Border parade", "Jallianwala Bagh", "Partition Museum", "Durgiana Temple", "Langar (free community kitchen)"],
        "best_time": "October to March",
        "entry_fee": "Golden Temple: Free; Wagah Border: Free",
        "timings": "Golden Temple: Open 24 hours",
        "time_required": "1-2 days",
        "tips": ["Visit Golden Temple at sunrise — most serene experience", "Attend Wagah Border Beating Retreat Ceremony (5 PM)", "Try Amritsari kulcha and lassi at Kesar Da Dhaba"],
        "nearby_attractions": ["Wagah Border (30 km)", "Anandpur Sahib (80 km)", "Chandigarh (230 km)"],
        "coordinates": {"lat": 31.6340, "lng": 74.8723},
    },
    {
        "name": "Munnar — Tea Garden Paradise",
        "city": "Munnar", "state": "Kerala",
        "type": "Hill Station / Nature / Tea Gardens",
        "description": "Munnar is a scenic hill station in Kerala renowned for its sprawling tea plantations, misty mountains, and cool climate. Situated at 1,600m above sea level, it is a refreshing escape into nature.",
        "highlights": ["Top Station viewpoint", "Eravikulam National Park (Nilgiri Tahr)", "Tea Museum", "Mattupetty Dam", "Echo Point", "Neelakurinji flowers (12-year bloom)"],
        "best_time": "September to March",
        "entry_fee": "Eravikulam NP: Rs 115; Tea Museum: Rs 75",
        "timings": "Open",
        "time_required": "2-3 days",
        "tips": ["Visit Rajamala (Eravikulam NP) for rare Nilgiri Tahr sighting", "Morning is best for clear mountain views", "Buy fresh tea directly from estates"],
        "nearby_attractions": ["Alleppey (175 km)", "Thekkady (91 km)", "Coorg (240 km)"],
        "coordinates": {"lat": 10.0889, "lng": 77.0595},
    },
    {
        "name": "Jodhpur — Blue City",
        "city": "Jodhpur", "state": "Rajasthan",
        "type": "Heritage / Cultural / Desert",
        "description": "Jodhpur, the Blue City, is dominated by the massive Mehrangarh Fort perched 400 feet above the city. The old city's indigo-blue houses, vibrant bazaars, and royal cuisine make it a captivating destination in the Thar Desert.",
        "highlights": ["Mehrangarh Fort", "Jaswant Thada (marble memorial)", "Umaid Bhawan Palace", "Clock Tower & Sardar Market", "Bishnoi Village safari", "Blue City rooftop views"],
        "best_time": "October to March",
        "entry_fee": "Mehrangarh Fort: Rs 600 (includes audio guide)",
        "timings": "9 AM to 5 PM",
        "time_required": "2 days",
        "tips": ["Hire an audio guide at the fort — very detailed", "Rooftop restaurant near Clock Tower for best blue city views", "Try Mirchi Bada and makhaniya lassi"],
        "nearby_attractions": ["Jaisalmer (285 km)", "Udaipur (250 km)", "Jaipur (340 km)"],
        "coordinates": {"lat": 26.2389, "lng": 73.0243},
    },
    {
        "name": "Jaisalmer — Golden City",
        "city": "Jaisalmer", "state": "Rajasthan",
        "type": "Heritage / Desert / Adventure",
        "description": "Jaisalmer, the Golden City, rises from the Thar Desert like a mirage. Its golden sandstone fort, intricate havelis, camel safaris, and Sam Sand Dunes make it one of India's most unique travel destinations.",
        "highlights": ["Jaisalmer Fort (living fort)", "Sam Sand Dunes camel safari", "Patwon Ki Haveli", "Gadisar Lake", "Kuldhara abandoned village", "Thar Desert camping"],
        "best_time": "October to February",
        "entry_fee": "Fort: Rs 100; Haveli: Rs 100; Camel Safari: Rs 500-1500",
        "timings": "Fort: 24 hours; Museums: 9 AM-6 PM",
        "time_required": "2-3 days",
        "tips": ["Do a camel safari and overnight desert camp at Sam Dunes", "Watch sunset from Jaisalmer Fort ramparts", "Avoid summer (April-June) — extreme heat"],
        "nearby_attractions": ["Jodhpur (285 km)", "Bikaner (330 km)"],
        "coordinates": {"lat": 26.9157, "lng": 70.9083},
    },
    {
        "name": "Gangtok — Gateway to Sikkim",
        "city": "Gangtok", "state": "Sikkim",
        "type": "Hill Station / Nature / Spiritual",
        "description": "Gangtok is the vibrant capital of Sikkim, nestled in the Himalayan foothills with stunning views of Kanchenjunga. It offers Buddhist monasteries, the scenic Tsomgo Lake, and lush green valleys.",
        "highlights": ["Tsomgo Lake (12,313 ft)", "Nathula Pass (Indo-China border)", "Rumtek Monastery", "MG Marg pedestrian zone", "Banjhakri Falls", "Himalayan Zoological Park (Red Panda)"],
        "best_time": "March to June, September to November",
        "entry_fee": "Tsomgo Lake permit: Rs 100; Nathula: Rs 200 (Indian only)",
        "timings": "Open",
        "time_required": "3-4 days",
        "tips": ["Book Nathula permit in advance (open only Thurs-Mon)", "Carry warm clothes — temperature drops sharply at high altitudes", "Try momos and thukpa at local eateries"],
        "nearby_attractions": ["Darjeeling (100 km)", "Pelling (130 km)", "Yuksom"],
        "coordinates": {"lat": 27.3389, "lng": 88.6065},
    },
    {
        "name": "Bangalore — Silicon Valley of India",
        "city": "Bangalore", "state": "Karnataka",
        "type": "City / Garden / Modern",
        "description": "Bangalore (Bengaluru) is India's tech capital and a city of pleasant weather, beautiful parks, vibrant nightlife, and a thriving food scene. Lalbagh Botanical Garden, Cubbon Park, and Nandi Hills are popular attractions.",
        "highlights": ["Lalbagh Botanical Garden", "Cubbon Park", "Bangalore Palace", "ISKCON Temple", "Nandi Hills sunrise (60 km)", "Vidhana Soudha", "Commercial Street shopping"],
        "best_time": "September to February (pleasant climate year-round)",
        "entry_fee": "Lalbagh: Rs 20; Palace: Rs 230",
        "timings": "Varies by attraction",
        "time_required": "2-3 days",
        "tips": ["Visit Nandi Hills for an incredible sunrise", "Try filter coffee at Brahmin's Coffee Bar (iconic)", "Explore Indiranagar and Koramangala for food & shopping"],
        "nearby_attractions": ["Mysore (150 km)", "Coorg (250 km)", "Hampi (340 km)"],
        "coordinates": {"lat": 12.9716, "lng": 77.5946},
    },
    {
        "name": "Pushkar — Holy Lake City",
        "city": "Pushkar", "state": "Rajasthan",
        "type": "Religious / Cultural / Spiritual",
        "description": "Pushkar is one of India's oldest and most sacred cities, built around the holy Pushkar Lake. Home to the only Brahma Temple in the world, it is also famous for the Pushkar Camel Fair held every November.",
        "highlights": ["Brahma Temple (world's only)", "Pushkar Lake & Ghats", "Pushkar Camel Fair (November)", "Savitri Temple (hilltop)", "Sunset at the lake", "Bazaar street shopping"],
        "best_time": "October to March (Camel Fair in November)",
        "entry_fee": "Temple free; Lakeside ghats: donation",
        "timings": "Open (Temple: 6:30 AM - 1:30 PM, 3-8:30 PM)",
        "time_required": "1-2 days",
        "tips": ["Leather goods and silver jewelry are great buys here", "Hire a priest for lakeside prayer ritual", "Visit during Camel Fair for a unique cultural spectacle"],
        "nearby_attractions": ["Ajmer (14 km)", "Jaipur (145 km)"],
        "coordinates": {"lat": 26.4899, "lng": 74.5518},
    },
    {
        "name": "Kolkata — City of Joy",
        "city": "Kolkata", "state": "West Bengal",
        "type": "Cultural / Heritage / Metropolitan",
        "description": "Kolkata (Calcutta) is the cultural capital of India, known for its colonial heritage, literary tradition, art scene, and passionate Durga Puja celebrations. The Victoria Memorial, Howrah Bridge, and street food are iconic.",
        "highlights": ["Victoria Memorial", "Howrah Bridge", "Durga Puja festival", "Dakshineswar Kali Temple", "Indian Museum", "Tram rides", "Park Street food scene"],
        "best_time": "October to February (Durga Puja in Oct)",
        "entry_fee": "Victoria Memorial: Rs 30; Museum: Rs 20",
        "timings": "Most sites: 10 AM - 5 PM",
        "time_required": "2-3 days",
        "tips": ["Try kathi rolls from Nizam's — the original!", "Tram ride through the city is a heritage experience", "Durga Puja (October) is the best time to visit"],
        "nearby_attractions": ["Sundarbans (100 km)", "Darjeeling (600 km by train)"],
        "coordinates": {"lat": 22.5726, "lng": 88.3639},
    },
    {
        "name": "Nainital — Lake District of India",
        "city": "Nainital", "state": "Uttarakhand",
        "type": "Hill Station / Lake / Nature",
        "description": "Nainital is a charming hill station in Uttarakhand centered around the beautiful Naini Lake. Surrounded by mountains and pine forests, it offers boating, cable car rides, and views of the Himalayas.",
        "highlights": ["Naini Lake boating", "Snow View Point (cable car)", "Naina Devi Temple", "The Mall Road", "Eco Cave Gardens", "Mukteshwar (51 km)"],
        "best_time": "March to June, September to November",
        "entry_fee": "Cable car: Rs 150; Boating: Rs 150-300",
        "timings": "Open",
        "time_required": "2 days",
        "tips": ["Early morning is best for lake boating before crowds", "Cable car to Snow View offers Himalayan panorama", "Try bal mithai — local sweet specialty"],
        "nearby_attractions": ["Jim Corbett (65 km)", "Bhimtal (22 km)", "Ranikhet (60 km)"],
        "coordinates": {"lat": 29.3803, "lng": 79.4636},
    },
    {
        "name": "Mumbai — City of Dreams",
        "city": "Mumbai", "state": "Maharashtra",
        "type": "Metropolitan / Heritage / Coastal",
        "description": "Mumbai is India's financial capital and the entertainment hub — home to Bollywood. From the iconic Gateway of India and Marine Drive to the colonial CST railway station and vibrant street food at Juhu Beach.",
        "highlights": ["Gateway of India", "Marine Drive (Queen's Necklace)", "Elephanta Caves (UNESCO)", "Juhu Beach", "Dharavi Slum Tour", "Chhatrapati Shivaji Terminus", "Siddhivinayak Temple"],
        "best_time": "November to February",
        "entry_fee": "Elephanta Caves: Rs 40; Gateway of India: Free",
        "timings": "Varies",
        "time_required": "2-4 days",
        "tips": ["Take a local train for the authentic Mumbai experience", "Marine Drive evening walk is magical", "Elephanta Caves require a 1-hour ferry from Gateway of India"],
        "nearby_attractions": ["Pune (150 km)", "Lonavala (85 km)", "Alibaug (95 km)"],
        "coordinates": {"lat": 19.0760, "lng": 72.8777},
    },
    {
        "name": "Delhi — Heart of India",
        "city": "New Delhi", "state": "Delhi",
        "type": "Heritage / Cultural / Metropolitan",
        "description": "Delhi, the capital of India, is a fascinating blend of ancient history and modern development. From the Mughal-era Red Fort and Qutub Minar to India Gate and Lotus Temple, Delhi offers thousands of years of history.",
        "highlights": ["Red Fort", "Qutub Minar (UNESCO)", "India Gate", "Humayun's Tomb (UNESCO)", "Lotus Temple", "Akshardham Temple", "Chandni Chowk street food"],
        "best_time": "October to March",
        "entry_fee": "Red Fort: Rs 35 (Indian); Qutub Minar: Rs 40",
        "timings": "Mostly 9 AM - 6 PM; Red Fort: Closed Monday",
        "time_required": "3-4 days",
        "tips": ["Metro is the best and cheapest way to travel", "Old Delhi's Chandni Chowk is a food paradise", "Book skip-the-line tickets online for popular monuments"],
        "nearby_attractions": ["Agra (200 km)", "Jaipur (280 km)", "Mathura-Vrindavan (160 km)"],
        "coordinates": {"lat": 28.6139, "lng": 77.2090},
    },
    {
        "name": "Ooty — Queen of Nilgiris",
        "city": "Ooty", "state": "Tamil Nadu",
        "type": "Hill Station / Nature / Tea Gardens",
        "description": "Ooty (Udhagamandalam) is the queen of South Indian hill stations, situated in the Nilgiri Hills at 2,240m. Famous for its Toy Train, tea gardens, botanical gardens, and pristine Emerald Lake.",
        "highlights": ["Nilgiri Mountain Railway (UNESCO Toy Train)", "Government Botanical Gardens", "Ooty Lake boating", "Doddabetta Peak (highest in Nilgiris)", "Emerald Lake", "Tea Factory visits"],
        "best_time": "April to June, September to November",
        "entry_fee": "Botanical Garden: Rs 30; Toy Train: Rs 75-800",
        "timings": "Open",
        "time_required": "2-3 days",
        "tips": ["Toy Train from Mettupalayam is a UNESCO experience", "Buy fresh Nilgiri tea and homemade chocolate", "Doddabetta peak offers 360-degree views on clear days"],
        "nearby_attractions": ["Kodaikanal (165 km)", "Mysore (125 km)", "Coorg (200 km)"],
        "coordinates": {"lat": 11.4102, "lng": 76.6950},
    },
    {
        "name": "Jim Corbett National Park",
        "city": "Ramnagar", "state": "Uttarakhand",
        "type": "Wildlife / Nature / Adventure",
        "description": "Jim Corbett National Park is India's oldest national park (est. 1936) and the first to launch Project Tiger in 1973. It has the highest density of Bengal Tigers in India, along with elephants, leopards, and over 600 bird species.",
        "highlights": ["Tiger sightings on jeep safari", "Dhikala Zone (best zone)", "Elephant safaris", "Corbett Museum", "Ramganga River", "Garjia Devi Temple", "Bird watching (600+ species)"],
        "best_time": "November to June (Dhikala open Nov 15 - June 15)",
        "entry_fee": "Day visit: Rs 200; Jeep safari: Rs 2500-5000",
        "timings": "Morning: 6-9 AM; Afternoon: 3-6 PM",
        "time_required": "2-3 days",
        "tips": ["Book Dhikala zone in advance on forest department website", "Stay inside the park (Dhikala lodge) for best experience", "Carry binoculars for bird watching"],
        "nearby_attractions": ["Nainital (65 km)", "Haridwar (135 km)", "Rishikesh (160 km)"],
        "coordinates": {"lat": 29.5300, "lng": 78.7747},
    },
    {
        "name": "Rishikesh — Yoga Capital of the World",
        "city": "Rishikesh", "state": "Uttarakhand",
        "type": "Spiritual / Adventure / Nature",
        "description": "Rishikesh is the yoga and meditation capital of the world, situated where the Ganges descends from the Himalayas. It is a hub for white-water rafting, trekking, and spiritual seekers from around the globe.",
        "highlights": ["Laxman Jhula & Ram Jhula bridges", "Ganga Aarti at Triveni Ghat", "White-water rafting (Grade 3-4)", "Parmarth Niketan Ashram", "Beatles Ashram", "Bungee jumping & camping"],
        "best_time": "September to November, February to May",
        "entry_fee": "Rafting: Rs 600-1200; Bungee: Rs 3500",
        "timings": "Open; Ganga Aarti: 6 PM daily",
        "time_required": "2-4 days",
        "tips": ["Book rafting in advance during peak season", "Alcohol & non-veg food is prohibited in the holy zones", "Evening Ganga Aarti at Triveni Ghat is spiritual and beautiful"],
        "nearby_attractions": ["Haridwar (25 km)", "Devprayag (70 km)", "Chopta (220 km)"],
        "coordinates": {"lat": 30.0869, "lng": 78.2676},
    },
    {
        "name": "Haridwar — Gateway to Gods",
        "city": "Haridwar", "state": "Uttarakhand",
        "type": "Religious / Spiritual / Pilgrimage",
        "description": "Haridwar is one of the seven holiest cities in Hinduism, where the Ganges River descends from the Himalayas to the plains. The evening Ganga Aarti at Har Ki Pauri ghat is one of the most spiritual experiences in India.",
        "highlights": ["Har Ki Pauri — sacred ghat", "Evening Ganga Aarti (6 PM)", "Mansa Devi Temple (cable car)", "Chandi Devi Temple", "Kumbh Mela (every 12 years)", "Rajaji National Park (24 km)"],
        "best_time": "October to April",
        "entry_fee": "Cable cars: Rs 99-160; Ghats: Free",
        "timings": "Ganga Aarti: 6 PM (winter), 6:30 PM (summer)",
        "time_required": "1-2 days",
        "tips": ["Attend Ganga Aarti at Har Ki Pauri — most iconic experience", "Ganga water pots are an important souvenir", "Book hotel near Har Ki Pauri for walking access"],
        "nearby_attractions": ["Rishikesh (25 km)", "Rajaji National Park (24 km)", "Dehradun (54 km)"],
        "coordinates": {"lat": 29.9457, "lng": 78.1642},
    },
    {
        "name": "Ajanta & Ellora Caves",
        "city": "Aurangabad", "state": "Maharashtra",
        "type": "Historical / UNESCO / Archaeological",
        "description": "Ajanta and Ellora are UNESCO World Heritage Sites near Aurangabad. Ajanta has 30 rock-cut Buddhist caves with extraordinary paintings (2nd century BC - 6th century AD). Ellora has 34 caves representing Hindu, Buddhist, and Jain temples carved into basalt cliffs.",
        "highlights": ["Ajanta Caves — Buddhist paintings", "Ellora Kailasha Temple (largest rock-cut temple)", "Cave 16 (Kailasha) — single rock monument", "Bibi Ka Maqbara (Mini Taj Mahal)", "Daulatabad Fort"],
        "best_time": "November to February",
        "entry_fee": "Ajanta: Rs 40 (Indian), Rs 600 (Foreign); Ellora: Rs 40",
        "timings": "9 AM - 5:30 PM (Ajanta: Closed Monday; Ellora: Closed Tuesday)",
        "time_required": "2 days (1 day each)",
        "tips": ["Hire a guide for Ajanta — paintings need context", "Visit Ellora Kailasha Temple first", "Closed on different days — plan accordingly"],
        "nearby_attractions": ["Aurangabad city (100 km from Ajanta)", "Shirdi (130 km)"],
        "coordinates": {"lat": 20.5519, "lng": 75.7033},
    },
    {
        "name": "Varkala — Cliff Beach of Kerala",
        "city": "Varkala", "state": "Kerala",
        "type": "Beach / Spiritual / Scenic",
        "description": "Varkala is a unique beach destination in Kerala where dramatic red laterite cliffs rise above the Arabian Sea. The cliff-top promenade with cafes, ayurvedic spas, and the ancient Janardhana Swamy Temple make it special.",
        "highlights": ["Varkala Cliff Beach", "Papanasam Beach (holy dip)", "Janardhana Swamy Temple", "Cliff-top promenade cafes", "Ayurvedic treatments", "Sunset views from the cliff"],
        "best_time": "September to March",
        "entry_fee": "Free",
        "timings": "Open",
        "time_required": "2-3 days",
        "tips": ["Swim only at Papanasam Beach — safer currents", "Book Ayurvedic treatments at reputed spas", "Cliff restaurants have stunning sunset views"],
        "nearby_attractions": ["Kovalam (50 km)", "Thiruvananthapuram (51 km)", "Alleppey (130 km)"],
        "coordinates": {"lat": 8.7379, "lng": 76.7163},
    },
    {
        "name": "Khajuraho — Temples of Love",
        "city": "Khajuraho", "state": "Madhya Pradesh",
        "type": "Historical / UNESCO / Cultural",
        "description": "Khajuraho is famous for its group of medieval Hindu and Jain temples with exquisite erotic sculptures. Built by the Chandela dynasty (950-1050 AD), these temples are UNESCO World Heritage Sites representing the pinnacle of Indian temple architecture.",
        "highlights": ["Western Temple Group (best preserved)", "Kandariya Mahadeva Temple", "Light & Sound Show", "Eastern Group (Jain temples)", "Archaeological Museum", "Tribal & Folk Art Museum"],
        "best_time": "October to March",
        "entry_fee": "Rs 40 (Indian), Rs 600 (Foreign); Light show: Rs 250",
        "timings": "Sunrise to Sunset; Light show: 7 PM",
        "time_required": "1-2 days",
        "tips": ["Start at Western Group — best temples", "Hire a certified guide for historical context", "Light & Sound show brings the temples to life"],
        "nearby_attractions": ["Panna Tiger Reserve (45 km)", "Orchha (180 km)"],
        "coordinates": {"lat": 24.8318, "lng": 79.9199},
    },
]

# ──────────────────────────────────────────────
# 30 REALISTIC ACTIVITY LOGS
# ──────────────────────────────────────────────
ADMIN_ID = "admin001"

def make_dt(days_ago, hours=0):
    return (datetime.utcnow() - timedelta(days=days_ago, hours=hours)).isoformat()

ACTIVITY_LOGS = [
    # Destination management
    {"admin_id": ADMIN_ID, "action": "ADD_DESTINATION", "target": "Leh Ladakh", "details": "Added new destination: Leh Ladakh to knowledge base", "created_at": make_dt(0, 1)},
    {"admin_id": ADMIN_ID, "action": "ADD_DESTINATION", "target": "Andaman Islands", "details": "Added new destination: Andaman Islands to knowledge base", "created_at": make_dt(0, 2)},
    {"admin_id": ADMIN_ID, "action": "ADD_DESTINATION", "target": "Hampi", "details": "Added new destination: Hampi UNESCO site to knowledge base", "created_at": make_dt(1, 0)},
    {"admin_id": ADMIN_ID, "action": "UPDATE_DESTINATION", "target": "Goa", "details": "Updated entry fees and best time info for Goa destination", "created_at": make_dt(1, 3)},
    {"admin_id": ADMIN_ID, "action": "UPDATE_DESTINATION", "target": "Jaipur", "details": "Added new highlights: Jal Mahal and Nahargarh Fort", "created_at": make_dt(2, 0)},
    {"admin_id": ADMIN_ID, "action": "DELETE_DESTINATION", "target": "Old Test Entry", "details": "Removed outdated test destination entry from knowledge base", "created_at": make_dt(3, 2)},
    {"admin_id": ADMIN_ID, "action": "ADD_DESTINATION", "target": "Rishikesh", "details": "Added Rishikesh — Yoga Capital with rafting and aarti highlights", "created_at": make_dt(4, 1)},
    {"admin_id": ADMIN_ID, "action": "ADD_DESTINATION", "target": "Amritsar", "details": "Added Golden Temple city with Wagah Border details", "created_at": make_dt(5, 0)},
    # User management
    {"admin_id": ADMIN_ID, "action": "BLOCK_USER", "target": "spammer123@gmail.com", "details": "Blocked user for sending spam messages to AI chatbot", "created_at": make_dt(0, 3)},
    {"admin_id": ADMIN_ID, "action": "UNBLOCK_USER", "target": "test_user@example.com", "details": "Unblocked user after verifying identity — false positive block", "created_at": make_dt(1, 1)},
    {"admin_id": ADMIN_ID, "action": "DELETE_USER", "target": "fake_account99@mail.com", "details": "Deleted fake account — duplicate registration detected", "created_at": make_dt(2, 4)},
    {"admin_id": ADMIN_ID, "action": "ROLE_CHANGE", "target": "moderator@indiatravelpal.com", "details": "Changed user role from 'user' to 'moderator'", "created_at": make_dt(7, 0)},
    {"admin_id": ADMIN_ID, "action": "BLOCK_USER", "target": "abuse_report_user@gmail.com", "details": "Blocked user reported for abusive language in chat sessions", "created_at": make_dt(8, 2)},
    {"admin_id": ADMIN_ID, "action": "UNBLOCK_USER", "target": "darshan123@gmail.com", "details": "Unblocked user after 7-day temporary ban period", "created_at": make_dt(10, 0)},
    {"admin_id": ADMIN_ID, "action": "DELETE_USER", "target": "test123@test.com", "details": "Cleaned up test account used during development phase", "created_at": make_dt(14, 0)},
    # System maintenance
    {"admin_id": ADMIN_ID, "action": "SYSTEM_CONFIG", "target": "AI Model", "details": "Updated Gemini API key — switched to new quota allocation", "created_at": make_dt(0, 0)},
    {"admin_id": ADMIN_ID, "action": "DATABASE_BACKUP", "target": "MongoDB Atlas", "details": "Manual database backup triggered — 156 MB archived successfully", "created_at": make_dt(3, 0)},
    {"admin_id": ADMIN_ID, "action": "KNOWLEDGE_BASE_SYNC", "target": "Destinations", "details": "Synced knowledge base — added 25 new destinations from research", "created_at": make_dt(4, 0)},
    {"admin_id": ADMIN_ID, "action": "SYSTEM_CONFIG", "target": "Rate Limiter", "details": "Updated rate limit from 30 to 60 requests/minute per user", "created_at": make_dt(6, 3)},
    {"admin_id": ADMIN_ID, "action": "CACHE_CLEAR", "target": "Response Cache", "details": "Cleared AI response cache — forced fresh responses from Gemini", "created_at": make_dt(9, 0)},
    {"admin_id": ADMIN_ID, "action": "SYSTEM_LOG", "target": "Error Monitor", "details": "Investigated 429 quota errors — resolved by rotating API keys", "created_at": make_dt(0, 4)},
    # Login and access
    {"admin_id": ADMIN_ID, "action": "ADMIN_LOGIN", "target": "admin@indiatravelpal.com", "details": "Admin logged in from IP 192.168.1.1 — session started", "created_at": make_dt(0, 0)},
    {"admin_id": ADMIN_ID, "action": "ADMIN_LOGIN", "target": "admin@indiatravelpal.com", "details": "Admin logged in — viewed dashboard stats and chat history", "created_at": make_dt(1, 0)},
    {"admin_id": ADMIN_ID, "action": "ADMIN_LOGIN", "target": "admin@indiatravelpal.com", "details": "Admin session — performed user review and knowledge base update", "created_at": make_dt(3, 0)},
    # Content moderation
    {"admin_id": ADMIN_ID, "action": "FLAG_CHAT", "target": "Session #ab34f", "details": "Flagged chat session containing inappropriate travel inquiry for review", "created_at": make_dt(2, 0)},
    {"admin_id": ADMIN_ID, "action": "REVIEW_REPORT", "target": "User Report #1029", "details": "Reviewed user-submitted bug report — forwarded to dev team", "created_at": make_dt(5, 3)},
    {"admin_id": ADMIN_ID, "action": "CONTENT_UPDATE", "target": "FAQ Section", "details": "Updated FAQ with new Visa and travel insurance questions for 2026", "created_at": make_dt(6, 0)},
    # Stats & analytics
    {"admin_id": ADMIN_ID, "action": "EXPORT_STATS", "target": "Dashboard Analytics", "details": "Exported monthly stats — 1,247 users, 18,340 chat messages, 42 destinations", "created_at": make_dt(7, 0)},
    {"admin_id": ADMIN_ID, "action": "VIEW_ANALYTICS", "target": "Chat History", "details": "Reviewed top user queries — Goa, Manali, Jaipur most searched", "created_at": make_dt(12, 0)},
    {"admin_id": ADMIN_ID, "action": "PERFORMANCE_CHECK", "target": "API Response Time", "details": "Average AI response time: 2.3 seconds — within acceptable limits", "created_at": make_dt(15, 0)},
]


async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    # ── Seed Destinations ──
    print(f"\n{'='*50}")
    print("SEEDING DESTINATIONS...")
    added = 0
    skipped = 0
    for dest in NEW_DESTINATIONS:
        exists = await db.trips.find_one({"name": dest["name"]})
        if exists:
            skipped += 1
            print(f"  SKIP  {dest['name']}")
        else:
            await db.trips.insert_one(dest)
            added += 1
            print(f"  ADD   {dest['name']} ({dest['state']})")

    total = await db.trips.count_documents({})
    print(f"\nDestinations: {added} added, {skipped} skipped | Total in DB: {total}")

    # ── Seed Activity Logs ──
    print(f"\n{'='*50}")
    print("SEEDING ACTIVITY LOGS...")
    log_count = await db.admin_logs.count_documents({})
    if log_count == 0:
        result = await db.admin_logs.insert_many(ACTIVITY_LOGS)
        print(f"  Added {len(result.inserted_ids)} activity logs")
    else:
        # Add new logs on top of existing ones
        new_logs = [log for log in ACTIVITY_LOGS if not await db.admin_logs.find_one({"details": log["details"]})]
        if new_logs:
            result = await db.admin_logs.insert_many(new_logs)
            print(f"  Added {len(result.inserted_ids)} new activity logs")
        else:
            print(f"  Activity logs already exist ({log_count} records)")

    total_logs = await db.admin_logs.count_documents({})
    print(f"  Total activity logs in DB: {total_logs}")

    client.close()
    print(f"\n{'='*50}")
    print("SEED COMPLETE!")


if __name__ == "__main__":
    asyncio.run(seed())
