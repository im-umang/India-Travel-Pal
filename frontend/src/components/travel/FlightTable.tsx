import React from 'react';
import { Plane, Clock, ExternalLink, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface FlightData {
    airline?: string;
    airline_name?: string;
    airline_details?: string;
    flight_no?: string;
    flight_number?: string;
    code?: string;
    departure?: string;
    arrival?: string;
    origin?: string;
    destination?: string;
    departure_airport?: string;
    arrival_airport?: string;
    departure_time?: string;
    arrival_time?: string;
    from?: string;
    to?: string;
    duration?: string;
    travel_time?: string;
    time_taken?: string;
    price_range?: string;
    ticket_price?: string;
    ticket_price_range?: string;
    fare?: string;
    price?: string;
    cost?: string;
    rate?: string;
    baggage_allowance?: string;
    best_time_to_book?: string;
    airport_distance_from_city_km?: string;
    type?: string;
    note?: string;
    book_at?: string;
    data_status?: string;
}

// ── Airline color badge ───────────────────────────────────────────────────────
const AirlineBadge: React.FC<{ name: string }> = ({ name }) => {
    const colors: Record<string, string> = {
        'IndiGo':       'bg-indigo-50 text-indigo-700 border-indigo-100',
        'Air India':    'bg-red-50 text-red-700 border-red-100',
        'Vistara':      'bg-purple-50 text-purple-700 border-purple-100',
        'SpiceJet':     'bg-orange-50 text-orange-700 border-orange-100',
        'Akasa Air':    'bg-yellow-50 text-yellow-700 border-yellow-100',
        'Alliance Air': 'bg-blue-50 text-blue-700 border-blue-100',
    };
    const cls = colors[name] || 'bg-slate-50 text-slate-600 border-slate-100';
    return <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${cls}`}>{name}</span>;
};

// ── Booking sites for flights ─────────────────────────────────────────────────
const FLIGHT_BOOKING_SITES = [
    { label: 'MakeMyTrip', url: 'https://www.makemytrip.com/flights/', color: 'bg-red-500 hover:bg-red-600' },
    { label: 'Skyscanner',  url: 'https://www.skyscanner.net/',         color: 'bg-cyan-500 hover:bg-cyan-600' },
    { label: 'EaseMyTrip', url: 'https://www.easemytrip.com/',          color: 'bg-emerald-500 hover:bg-emerald-600' },
    { label: 'Cleartrip',  url: 'https://www.cleartrip.com/flights/',   color: 'bg-blue-500 hover:bg-blue-600' },
];

const FlightTable: React.FC<{ flights: FlightData[] }> = ({ flights }) => {
    if (!flights || flights.length === 0) return null;

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 px-1 mb-1">
                <Plane className="h-5 w-5 text-sky-400" />
                <h3 className="font-bold text-slate-100 text-base">Flight Options</h3>
                <span className="ml-auto text-[10px] font-bold bg-sky-500/20 text-sky-200 px-2.5 py-1 rounded-full border border-sky-400/30 backdrop-blur-sm">
                    {flights.length} option{flights.length > 1 ? 's' : ''}
                </span>
            </div>

            {/* Flight cards grid - Widened to max 2 cols for clarity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flights.map((flight, idx) => {
                    const airline   = flight.airline || flight.airline_name || flight.airline_details || 'Airline';
                    const flightNum = flight.flight_no || flight.flight_number || flight.code || '';
                    
                    const clean = (val: any) => (val && val !== '—' && val !== 'null' && val !== 'undefined') ? val : null;
                    
                    const price     = clean(flight.ticket_price_range) || clean(flight.fare) || clean(flight.price_range) || clean(flight.ticket_price) || clean(flight.price) || 'Check availability';
                    const duration  = clean(flight.duration) || clean(flight.travel_time) || clean(flight.time_taken) || '—';
                    
                    // Priority: Specific Departure Time -> Airport Name -> Origin City Name -> 'Flight Departure'
                    const depPoint  = clean(flight.departure_time) || clean(flight.departure_airport) || clean(flight.departure) || clean(flight.from) || clean(flight.origin) || 'Sector Origin';
                    const arrPoint  = clean(flight.arrival_time) || clean(flight.arrival_airport) || clean(flight.arrival) || clean(flight.to) || clean(flight.destination) || 'Sector Arrival';
                    
                    const flightType = flight.type || 'Direct';

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all flex flex-col overflow-hidden group"
                        >
                            {/* Card Top: Airline & Type */}
                            <div className="p-5 border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
                                <div className="flex flex-col">
                                    <AirlineBadge name={airline} />
                                    {flightNum && <span className="text-[11px] text-slate-400 font-black mt-1 uppercase tracking-tighter">{flightNum}</span>}
                                </div>
                                <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black border border-emerald-100 uppercase tracking-widest">
                                    {flightType}
                                </span>
                            </div>

                            {/* Card Content: Journey Details */}
                            <div className="p-7 flex flex-col gap-7 flex-1">
                                <div className="flex items-center justify-between gap-4 px-1">
                                    <div className="flex-1">
                                        <div className="text-2xl font-black text-slate-800 tracking-tighter leading-none line-clamp-1">{depPoint}</div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase mt-3 tracking-widest">Departure</div>
                                    </div>

                                    <div className="flex flex-col items-center px-4 min-w-[100px]">
                                        <div className="w-full flex items-center gap-2 opacity-50">
                                            <div className="h-[2px] flex-1 bg-sky-200" />
                                            <Plane className="h-5 w-5 text-sky-500 rotate-90" />
                                            <div className="h-[2px] flex-1 bg-sky-200" />
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-3 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="text-[11px] text-slate-600 font-black tracking-tight whitespace-nowrap">{duration}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 text-right">
                                        <div className="text-2xl font-black text-slate-800 tracking-tighter leading-none line-clamp-1">{arrPoint}</div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase mt-3 tracking-widest">Arrival</div>
                                    </div>
                                </div>

                                {/* Price Indicator */}
                                <div className="flex items-center justify-between bg-sky-50/40 rounded-3xl px-6 py-4 border border-sky-100/50">
                                    <span className="text-[11px] text-sky-600 font-black uppercase tracking-widest leading-none">Price Tracking</span>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-slate-900 tracking-tight leading-none">{price}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Average Fare</div>
                                    </div>
                                </div>

                                {flight.note && (
                                    <div className="flex items-start gap-1.5 p-2 bg-amber-50 rounded-lg text-[10px] text-amber-800 border border-amber-100">
                                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                                        <span>{flight.note}</span>
                                    </div>
                                )}
                            </div>

                            {/* Card Action: Book */}
                            <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-2">
                                {FLIGHT_BOOKING_SITES.map(site => (
                                    <a
                                        key={site.label}
                                        href={site.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-white px-2 py-2 rounded-xl transition-all ${site.color} shadow-sm active:scale-95`}
                                    >
                                        <ExternalLink className="h-2.5 w-2.5" />
                                        {site.label}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer tip */}
            <div className="px-5 py-3 bg-slate-800 rounded-2xl text-[10px] text-slate-300 font-medium leading-relaxed shadow-lg">
                <span className="text-sky-400 font-bold mr-1">💡 Pro Tip:</span>
                Prices may vary. Direct booking on airline websites often gives better cancellation policies and extra loyalty points.
            </div>
        </div>
    );
};

export default FlightTable;
