"""
=========================================================
India Travel Pal — Knowledge Service
=========================================================
Bridges local database ↔ local knowledge-base files.
Provides:
  1. DB Seeding   — populates empty Mongo collections
  2. Smart Lookup — detects destination/route in user query
                    and returns enriched context
  3. Context Injection — formats data for AI prompt
=========================================================
"""
import re
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# ── Local knowledge imports ────────────────────────────
from app.data.destinations import DESTINATIONS, CITY_ALIASES, CITY_COORDINATES
from app.data.hotels_routes import HOTELS, ROUTES, FOOD_RECOMMENDATIONS
from app.data.transport_kb import FLIGHT_DATA, TRAIN_DATA, BUS_DATA, LOCAL_COMMUTE, AIRPORTS


# ══════════════════════════════════════════════════════
# 1.  DB SEEDER
#     Call once at app startup to populate all collections
# ══════════════════════════════════════════════════════

async def seed_database(db) -> None:
    """
    Seeds MongoDB with all local knowledge if collections are empty.
    Idempotent — never duplicates data.
    """
    now = datetime.now(timezone.utc)

    # 1. hotel_search_logs (destination → hotels)
    if await db.hotel_search_logs.count_documents({}) == 0:
        hotel_docs = []
        for dest, hotels in HOTELS.items():
            for h in hotels:
                hotel_docs.append({
                    "destination": dest,
                    "hotel_name": h["name"],
                    "category": h["type"],
                    "price_range": h["price_range"],
                    "rating": h["rating"],
                    "area": h["area"],
                    "amenities": h.get("amenities", ["WiFi", "AC", "Parking"]),
                    "created_at": now,
                    "source": "knowledge_base"
                })
        if hotel_docs:
            await db.hotel_search_logs.insert_many(hotel_docs)
            logger.info(f"✅ Seeded {len(hotel_docs)} hotels into hotel_search_logs")

    # 2. food_search_logs (destination → food)
    if await db.food_search_logs.count_documents({}) == 0:
        food_docs = []
        for dest, foods in FOOD_RECOMMENDATIONS.items():
            food_docs.append({
                "destination": dest,
                "food_items": foods,
                "created_at": now,
                "source": "knowledge_base"
            })
        if food_docs:
            await db.food_search_logs.insert_many(food_docs)
            logger.info(f"✅ Seeded {len(food_docs)} food records into food_search_logs")

    # 3. flight_search_logs
    if await db.flight_search_logs.count_documents({}) == 0:
        flight_docs = []
        for (origin, dest), flights in FLIGHT_DATA.items():
            for f in flights:
                flight_docs.append({
                    "origin": origin,
                    "destination": dest,
                    **f,
                    "created_at": now,
                    "source": "knowledge_base"
                })
        if flight_docs:
            await db.flight_search_logs.insert_many(flight_docs)
            logger.info(f"✅ Seeded {len(flight_docs)} flights into flight_search_logs")

    # 4. train_search_logs
    if await db.train_search_logs.count_documents({}) == 0:
        train_docs = []
        for (origin, dest), trains in TRAIN_DATA.items():
            for t in trains:
                train_docs.append({
                    "origin": origin,
                    "destination": dest,
                    **t,
                    "created_at": now,
                    "source": "knowledge_base"
                })
        if train_docs:
            await db.train_search_logs.insert_many(train_docs)
            logger.info(f"✅ Seeded {len(train_docs)} trains into train_search_logs")

    # 5. bus_search_logs
    if await db.bus_search_logs.count_documents({}) == 0:
        bus_docs = []
        for (origin, dest), buses in BUS_DATA.items():
            for b in buses:
                bus_docs.append({
                    "origin": origin,
                    "destination": dest,
                    **b,
                    "created_at": now,
                    "source": "knowledge_base"
                })
        if bus_docs:
            await db.bus_search_logs.insert_many(bus_docs)
            logger.info(f"✅ Seeded {len(bus_docs)} bus routes into bus_search_logs")

    # 6. trips (destination summaries) — re-seed if new destinations added
    if await db.trips.count_documents({}) < len(DESTINATIONS):
        # Drop and re-seed to pick up new destinations
        await db.trips.drop()
        trip_docs = []
        for key, dest in DESTINATIONS.items():
            trip_docs.append({
                "destination_key": key,
                "name": dest["name"],
                "city": dest["city"],
                "state": dest["state"],
                "type": dest["type"],
                "best_time": dest["best_time"],
                "entry_fee": dest.get("entry_fee", "Free"),
                "timings": dest.get("timings", "Open"),
                "highlights": dest.get("highlights", []),
                "tips": dest.get("tips", []),
                "nearby_attractions": dest.get("nearby_attractions", []),
                "coordinates": dest.get("coordinates", {}),
                "created_at": now,
                "source": "knowledge_base"
            })
        if trip_docs:
            await db.trips.insert_many(trip_docs)
            logger.info(f"✅ Seeded {len(trip_docs)} destinations into trips")

    logger.info("🌟 Knowledge base seeding complete!")


# ══════════════════════════════════════════════════════
# 2.  NLP HELPERS — Extract city/route from user message
# ══════════════════════════════════════════════════════

# All known city names for matching
_ALL_CITIES = set(CITY_ALIASES.keys()) | set(CITY_COORDINATES.keys())

# Canonical city name → DB key mapping
def _canonical(city: str) -> Optional[str]:
    city_l = city.lower().strip()
    return CITY_ALIASES.get(city_l, city_l)


def extract_cities(text: str) -> List[str]:
    """Extract up to 2 city names from user text."""
    text_lower = text.lower()
    found = []
    # Sort by length desc so 'rann of kutch' beats 'kutch'
    for city in sorted(_ALL_CITIES, key=len, reverse=True):
        if city in text_lower and city not in found:
            canonical = _canonical(city)
            if canonical not in found:
                found.append(canonical)
        if len(found) >= 2:
            break
    return found


def extract_route(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Try to extract origin→destination from text."""
    cities = extract_cities(text)
    if len(cities) >= 2:
        return cities[0], cities[1]
    if len(cities) == 1:
        return None, cities[0]
    return None, None


# ══════════════════════════════════════════════════════
# 3.  DB LOOKUP FUNCTIONS
# ══════════════════════════════════════════════════════

async def get_hotels_from_db(db, destination: str) -> List[Dict]:
    """Fetch hotels for a destination from MongoDB."""
    dest_key = _canonical(destination)
    docs = await db.hotel_search_logs.find(
        {"destination": dest_key},
        {"_id": 0}
    ).limit(5).to_list(length=5)
    return docs


async def get_food_from_db(db, destination: str) -> List[str]:
    """Fetch famous food items for a destination."""
    dest_key = _canonical(destination)
    doc = await db.food_search_logs.find_one(
        {"destination": dest_key},
        {"_id": 0, "food_items": 1}
    )
    if doc:
        return doc.get("food_items", [])
    # fallback to local data
    return FOOD_RECOMMENDATIONS.get(dest_key, [])


async def get_flights_from_db(db, origin: str, destination: str) -> List[Dict]:
    """Fetch flights between two cities."""
    o = _canonical(origin)
    d = _canonical(destination)
    # Try both directions
    docs = await db.flight_search_logs.find(
        {"$or": [
            {"origin": o, "destination": d},
            {"origin": d, "destination": o}
        ]},
        {"_id": 0, "created_at": 0, "source": 0}
    ).limit(4).to_list(length=4)
    # Fallback to local
    if not docs:
        key1 = (o, d)
        key2 = (d, o)
        docs = FLIGHT_DATA.get(key1, FLIGHT_DATA.get(key2, []))
    return docs


async def get_trains_from_db(db, origin: str, destination: str) -> List[Dict]:
    """Fetch trains between two cities."""
    o = _canonical(origin)
    d = _canonical(destination)
    docs = await db.train_search_logs.find(
        {"$or": [
            {"origin": o, "destination": d},
            {"origin": d, "destination": o}
        ]},
        {"_id": 0, "created_at": 0, "source": 0}
    ).limit(4).to_list(length=4)
    # Fallback to local
    if not docs:
        key1 = (o, d)
        key2 = (d, o)
        docs = TRAIN_DATA.get(key1, TRAIN_DATA.get(key2, []))
    return docs


async def get_buses_from_db(db, origin: str, destination: str) -> List[Dict]:
    """Fetch bus routes between two cities."""
    o = _canonical(origin)
    d = _canonical(destination)
    docs = await db.bus_search_logs.find(
        {"$or": [
            {"origin": o, "destination": d},
            {"origin": d, "destination": o}
        ]},
        {"_id": 0, "created_at": 0, "source": 0}
    ).limit(3).to_list(length=3)
    if not docs:
        key1 = (o, d)
        key2 = (d, o)
        docs = BUS_DATA.get(key1, BUS_DATA.get(key2, []))
    return docs


async def get_destination_info(db, destination: str) -> Optional[Dict]:
    """Fetch destination details from trips collection."""
    dest_key = _canonical(destination)
    doc = await db.trips.find_one(
        {"destination_key": dest_key},
        {"_id": 0, "created_at": 0, "source": 0}
    )
    if not doc:
        # Fallback to local
        info = DESTINATIONS.get(dest_key)
        if info:
            return {**info, "destination_key": dest_key}
    return doc


# ══════════════════════════════════════════════════════
# 4.  CONTEXT BUILDER
#     Assembles a rich context block for the AI prompt
# ══════════════════════════════════════════════════════

async def build_travel_context(db, user_text: str) -> Dict[str, Any]:
    """
    Main entry point — given raw user text, returns enriched context dict
    with hotels, food, transport, destination info from DB.
    """
    origin, destination = extract_route(user_text)
    context = {
        "found_origin": origin,
        "found_destination": destination,
        "destination_info": None,
        "hotels": [],
        "food": [],
        "flights": [],
        "trains": [],
        "buses": [],
        "local_commute": None,
        "route_data": None,
    }

    if destination:
        dest_key = _canonical(destination)

        # Destination info
        context["destination_info"] = await get_destination_info(db, destination)

        # Hotels
        context["hotels"] = await get_hotels_from_db(db, destination)

        # Food
        context["food"] = await get_food_from_db(db, destination)

        # Local commute
        context["local_commute"] = LOCAL_COMMUTE.get(dest_key)

        # Route data
        if origin:
            o_key = _canonical(origin)
            route_key = (o_key, dest_key)
            route_key_rev = (dest_key, o_key)
            context["route_data"] = ROUTES.get(route_key, ROUTES.get(route_key_rev))

    if origin and destination:
        # Transport
        context["flights"] = await get_flights_from_db(db, origin, destination)
        context["trains"] = await get_trains_from_db(db, origin, destination)
        context["buses"] = await get_buses_from_db(db, origin, destination)

    return context


def format_context_for_prompt(ctx: Dict[str, Any]) -> str:
    """
    Convert context dict → readable text block for injection into AI prompt.
    """
    if not ctx.get("found_destination"):
        return ""

    lines = []
    lines.append("=== VERIFIED LOCAL KNOWLEDGE BASE DATA ===")
    lines.append(f"Destination detected: {ctx['found_destination'].upper()}")
    if ctx.get("found_origin"):
        lines.append(f"Origin detected: {ctx['found_origin'].upper()}")

    # Destination info
    if ctx.get("destination_info"):
        d = ctx["destination_info"]
        lines.append(f"\n📍 ABOUT {d.get('name', '').upper()}:")
        lines.append(f"  Type: {d.get('type', '')}")
        lines.append(f"  Best time to visit: {d.get('best_time', '')}")
        lines.append(f"  Entry fee: {d.get('entry_fee', 'Free')}")
        lines.append(f"  Timings: {d.get('timings', '')}")
        if d.get("highlights"):
            lines.append(f"  Highlights: {', '.join(d['highlights'][:4])}")
        if d.get("tips"):
            lines.append(f"  Local tips: {' | '.join(d['tips'][:3])}")

    # Hotels
    if ctx.get("hotels"):
        lines.append(f"\n🏨 HOTELS (use these EXACT names in nearby_hotels):")
        for h in ctx["hotels"][:4]:
            amenities = h.get("amenities", ["WiFi", "AC"])
            lines.append(f"  • {h['hotel_name']} | {h['category']} | {h['price_range']} | ⭐{h['rating']} | {h['area']} | Amenities: {', '.join(amenities)}")

    # Food
    if ctx.get("food"):
        lines.append(f"\n🍽️ LOCAL FOOD (use these in famous_food_items):")
        lines.append(f"  {', '.join(ctx['food'][:6])}")

    # Route/Transport
    if ctx.get("route_data"):
        r = ctx["route_data"]
        lines.append(f"\n🗺️ ROUTE DATA ({ctx.get('found_origin','?')} → {ctx.get('found_destination','?')}):")
        lines.append(f"  Distance: {r.get('distance_km', '?')} km")
        if r.get("train_time"):
            lines.append(f"  Train: {r['train_time']} | Fare: {r.get('train_cost', '?')}")
        if r.get("flight_time"):
            lines.append(f"  Flight: {r['flight_time']} | Fare: {r.get('flight_cost', '?')}")
        if r.get("bus_time"):
            lines.append(f"  Bus: {r['bus_time']} | Fare: {r.get('bus_cost', '?')}")
        if r.get("cab_cost"):
            lines.append(f"  Cab: {r['cab_cost']}")

    # Flights
    if ctx.get("flights"):
        lines.append(f"\n✈️ FLIGHTS:")
        for f in ctx["flights"][:3]:
            note = f" ({f['note']})" if f.get("note") else ""
            lines.append(f"  • {f['airline']} {f.get('flight_no','')} | {f.get('departure','')}-{f.get('arrival','')} | {f.get('duration','')} | {f.get('price_range','')}{note}")

    # Trains
    if ctx.get("trains"):
        lines.append(f"\n🚂 TRAINS:")
        for t in ctx["trains"][:3]:
            note = f" [{t['note']}]" if t.get("note") else ""
            lines.append(f"  • {t['train_name']} ({t.get('train_number','')}) | {t.get('departure','')}-{t.get('arrival','')} | {t.get('duration','')} | Fare: {t.get('fare','')}{note}")

    # Buses
    if ctx.get("buses"):
        lines.append(f"\n🚌 BUSES:")
        for b in ctx["buses"][:3]:
            lines.append(f"  • {b['operator']} | {b.get('bus_type','')} | {b.get('duration','')} | Fare: {b.get('fare','')} | Night: {b.get('night_available','?')}")

    # Local commute
    if ctx.get("local_commute"):
        lc = ctx["local_commute"]
        lines.append(f"\n🚗 LOCAL TRANSPORT in {ctx.get('found_destination','').upper()}:")
        if lc.get("uber", {}).get("available"):
            lines.append(f"  Uber/Ola: {lc['uber']['per_km']} (Base: {lc['uber']['base_fare']})")
        else:
            lines.append(f"  Uber/Ola: {lc.get('uber', {}).get('note', 'Not available')}")
        if lc.get("auto", {}).get("available"):
            lines.append(f"  Auto: {lc['auto']['fare']} — {lc['auto']['tip']}")
        if lc.get("metro", {}).get("available"):
            lines.append(f"  Metro: {lc['metro']['network']} | Fare: {lc['metro']['fare']}")
        if lc.get("local_taxi"):
            lines.append(f"  Taxi: {lc['local_taxi'].get('fare','')} — {lc['local_taxi'].get('tip','')}")

    lines.append("\nINSTRUCTION: Use the above VERIFIED data for hotels, food, transport in your JSON response. Do NOT modify these names or prices.")
    lines.append("=== END KNOWLEDGE DATA ===\n")

    return "\n".join(lines)
