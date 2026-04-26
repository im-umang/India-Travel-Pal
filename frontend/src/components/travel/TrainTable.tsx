import React from 'react';
import { Train, Clock, Wallet, ExternalLink, Info, Calendar, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrainData {
    train_name?: string;
    train_number?: string;
    departure?: string;
    arrival?: string;
    departure_time?: string;
    arrival_time?: string;
    dep_time?: string;
    arr_time?: string;
    from?: string;
    to?: string;
    duration?: string;
    travel_time?: string;
    running_days?: string;
    distance_km?: string;
    fare?: string;
    ticket_price?: string | {
        sleeper?: string;
        "3A"?: string;
        "2A"?: string;
        "1A"?: string;
    };
    fare_range?: string;
    price?: string;
    classes?: string;
    railway_zone?: string;
    best_booking_time?: string;
    travel_tip?: string;
    frequency?: string;
    info?: string;
    type?: string;
    note?: string;
    booking?: string;
    book_at?: string;
}

// ── IRCTC deep‑link builder ───────────────────────────────────────────────────
// IRCTC's search page accepts origin+destination as query params
const buildIrctcUrl = (trainNumber?: string) =>
    trainNumber
        ? `https://www.irctc.co.in/nget/train-search`
        : 'https://www.irctc.co.in/nget/train-search';

const TRAIN_BOOKING_SITES = [
    { label: 'IRCTC',       getUrl: (t: TrainData) => buildIrctcUrl(t.train_number), color: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'ConfirmTkt',  getUrl: (_: TrainData) => 'https://www.confirmtkt.com/',  color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'RailYatri',   getUrl: (_: TrainData) => 'https://www.railyatri.in/',    color: 'bg-violet-500 hover:bg-violet-600' },
    { label: 'MakeMyTrip',  getUrl: (_: TrainData) => 'https://www.makemytrip.com/railways/', color: 'bg-red-500 hover:bg-red-600' },
];

const TrainTable: React.FC<{ trains: TrainData[] }> = ({ trains }) => {
    if (!trains || trains.length === 0) return null;

    const isTableData = trains.some(t => t.train_name || t.train_number);

    // ── General info cards (no specific trains) ──────────────────────────────
    if (!isTableData) {
        return (
            <div className="space-y-3 w-full">
                {trains.map((train, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                <Train className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-800 text-sm">{train.info || 'Train Options'}</div>
                                {train.duration && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                        <Clock className="h-3 w-3" /> {train.duration}
                                    </div>
                                )}
                            </div>
                        </div>

                        {(train.fare_range || train.fare) && (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                <Wallet className="h-3.5 w-3.5 text-slate-400" />
                                <span>Est. Cost: {train.fare_range || train.fare}</span>
                            </div>
                        )}

                        {train.classes && (
                            <div className="flex items-start gap-2 text-xs text-slate-600 px-1">
                                <span className="font-semibold shrink-0">Classes:</span>
                                <span>{train.classes}</span>
                            </div>
                        )}

                        {/* Booking buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {TRAIN_BOOKING_SITES.map(site => (
                                <a
                                    key={site.label}
                                    href={site.getUrl(train)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-1 text-[10px] font-bold text-white px-2.5 py-1 rounded-lg transition-all ${site.color} shadow-sm`}
                                >
                                    <ExternalLink className="h-2.5 w-2.5" />
                                    {site.label}
                                </a>
                            ))}
                        </div>

                        {train.booking && (
                            <div className="flex items-center gap-2 text-[10px] text-indigo-600 bg-indigo-50/50 px-3 py-1.5 rounded border border-indigo-100/50 w-fit">
                                <Info className="h-3 w-3" />
                                {train.booking}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    // ── Full card grid for specific trains ─────────────────────────────────────
    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2 px-1 mb-1">
                <Train className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-base">Train Options</h3>
                <span className="ml-auto text-[10px] font-bold bg-indigo-500/20 text-indigo-200 px-2.5 py-1 rounded-full border border-indigo-400/30 backdrop-blur-sm">
                    {trains.length} options
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trains.map((train, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col overflow-hidden group"
                    >
                        {/* Card Header: Train Info */}
                        <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                            <div className="flex justify-between items-start mb-1">
                                <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                    {train.train_name}
                                </div>
                                <div className="text-[11px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-100 shadow-sm">
                                    {train.train_number}
                                </div>
                            </div>
                            {train.frequency && (
                                <div className="text-[10px] text-indigo-500 font-semibold flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {train.frequency}
                                </div>
                            )}
                        </div>

                        {/* Card Body: Times & Journey */}
                        <div className="p-6 flex flex-col gap-6 flex-1">
                            {(() => {
                                // Smart Helper to clean data and handle '—' or empty strings
                                const clean = (val: any) => (val && val !== '—' && val !== 'null' && val !== 'undefined') ? val : null;
                                
                                // Logic to extract origin/destination from train_name if missing
                                // e.g. "Paschim Express (12925) - Ahmedabad to Chandigarh"
                                let originFallback = '';
                                let destFallback = '';
                                if (train.train_name && (train.train_name.includes(' to ') || train.train_name.includes(' - '))) {
                                    const parts = train.train_name.split(/ to | - /);
                                    if (parts.length >= 2) {
                                        originFallback = parts[parts.length - 2].trim();
                                        destFallback = parts[parts.length - 1].trim();
                                    }
                                }

                                const dep = clean(train.departure_time) || clean(train.from) || originFallback || 'Station';
                                const arr = clean(train.arrival_time) || clean(train.to) || destFallback || 'Station';
                                const dur = clean(train.duration) || clean(train.travel_time) || 'Express';

                                return (
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex-1 group">
                                            <div className="text-2xl font-black text-slate-800 group-hover:scale-110 transition-transform tracking-tighter line-clamp-1">
                                                {dep}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-widest">Departure</div>
                                        </div>

                                        <div className="flex-1 flex flex-col items-center px-4 relative">
                                            <div className="w-full h-[3px] bg-indigo-50 rounded-full relative overflow-hidden">
                                                <motion.div 
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-30"
                                                />
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 flex items-center justify-center">
                                                    <Train className="h-5 w-5 text-indigo-500" />
                                                </div>
                                            </div>
                                            <div className="text-[11px] text-indigo-600 font-black mt-3 tracking-widest uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 shadow-sm leading-none">
                                                {dur}
                                            </div>
                                        </div>

                                        <div className="flex-1 text-right group">
                                            <div className="text-2xl font-black text-slate-800 group-hover:scale-110 transition-transform tracking-tighter line-clamp-1">
                                                {arr}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-widest text-right">Arrival</div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Detailed Pricing (If object provided) */}
                            {typeof train.ticket_price === 'object' && Object.keys(train.ticket_price).length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-1">
                                    {Object.entries(train.ticket_price).map(([cls, fare]) => (
                                        <div key={cls} className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center group hover:bg-white hover:border-indigo-200 transition-all hover:shadow-sm">
                                            <div className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mb-0.5">{cls}</div>
                                            <div className="text-[12px] font-black text-slate-800 tracking-tight">{String(fare)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Simple Price Fallback */}
                            {typeof train.ticket_price !== 'object' && (
                                <div className="flex items-center justify-between bg-indigo-50/40 rounded-[1.5rem] px-5 py-3 border border-indigo-100/50">
                                    <span className="text-[11px] text-indigo-600 font-black uppercase tracking-widest leading-none">Market Fare</span>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-slate-900 tracking-tight leading-none">
                                            {train.ticket_price && train.ticket_price !== '—' ? train.ticket_price : 'Check Schedule'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Intelligence Info */}
                            {(train.running_days || train.distance_km || train.railway_zone) && (
                                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 px-1">
                                    {train.running_days && (
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3 text-emerald-500" />
                                            <span className="text-[10px] text-slate-500 font-bold">{train.running_days}</span>
                                        </div>
                                    )}
                                    {train.distance_km && (
                                        <div className="flex items-center gap-1.5">
                                           <MapPin className="h-3 w-3 text-blue-500" />
                                           <span className="text-[10px] text-slate-500 font-bold">{train.distance_km} km</span>
                                        </div>
                                    )}
                                    {train.railway_zone && (
                                        <div className="flex items-center gap-1.5">
                                           <Info className="h-3 w-3 text-indigo-400" />
                                           <span className="text-[10px] text-slate-500 font-bold">{train.railway_zone}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fare Details */}
                            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-indigo-100/50">
                                <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-2">Estimated Fare Guide</div>
                                {train.ticket_price || train.fare || train.fare_range || train.price ? (
                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                        {typeof (train.ticket_price || train.fare) === 'object' ? (
                                            Object.entries(train.ticket_price || train.fare).map(([cls, pr]) => (
                                                <div key={cls} className="flex items-baseline justify-between border-b border-indigo-50/50 pb-0.5">
                                                    <span className="text-[10px] text-slate-400 uppercase font-black">{cls}</span>
                                                    <span className="text-xs font-bold text-indigo-700">{pr as string}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-sm font-black text-indigo-800">
                                                {String(train.ticket_price || train.fare || train.fare_range || train.price || 'Market Rates Apply')}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-[11px] font-bold text-indigo-400 italic">Pricing varies by class</div>
                                )}
                            </div>

                            {train.travel_tip && (
                                <div className="mt-3 p-2.5 bg-amber-50 rounded-lg border border-amber-100 flex items-start gap-2">
                                    <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-amber-800 font-medium leading-relaxed">{train.travel_tip}</p>
                                </div>
                            )}
                        </div>

                        {/* Card Footer: Book Now */}
                        <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                            {TRAIN_BOOKING_SITES.slice(0, 2).map(site => (
                                <a
                                    key={site.label}
                                    href={site.getUrl(train)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-black text-white px-3 py-2 rounded-xl transition-all ${site.color} shadow-sm hover:shadow-md active:scale-95`}
                                >
                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                    {site.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* All booking sites footer */}
            <div className="px-4 py-3 bg-indigo-600 rounded-2xl flex flex-wrap gap-3 items-center shadow-lg shadow-indigo-200">
                <span className="text-[11px] text-indigo-100 font-bold uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" /> Quick Book:
                </span>
                <div className="flex flex-wrap gap-2">
                    {TRAIN_BOOKING_SITES.map(site => (
                        <a
                            key={site.label}
                            href={site.getUrl({})}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all border border-white/10"
                        >
                            {site.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainTable;
