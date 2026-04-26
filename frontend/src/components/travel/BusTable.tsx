import React from 'react';
import { Bus, Clock, Moon, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface BusData {
  operator?: string;
  operator_name?: string;
  travels_name?: string;
  bus_type?: string;
  types?: string;
  category?: string;
  duration?: string;
  travel_time?: string;
  journey_time?: string;
  fare?: string;
  ticket_price?: string;
  ticket_price_range?: string;
  fare_range?: string;
  price?: string;
  cost?: string;
  pickup_point?: string;
  drop_point?: string;
  best_option_reason?: string;
  night_available?: string;
  frequency?: string;
  overnight?: string;
  info?: string;
  book_at?: string;
}

const BUS_BOOKING_SITES = [
    { label: 'RedBus',    url: 'https://www.redbus.in/',            color: 'bg-red-500 hover:bg-red-600' },
    { label: 'AbhiBus',   url: 'https://www.abhibus.com/',          color: 'bg-emerald-600 hover:bg-emerald-700' },
    { label: 'MakeMyTrip',url: 'https://www.makemytrip.com/bus-tickets/', color: 'bg-rose-500 hover:bg-rose-600' },
    { label: 'IntrCity',  url: 'https://www.intracity.in/',         color: 'bg-violet-500 hover:bg-violet-600' },
];

const BusTable: React.FC<{ buses: BusData[] }> = ({ buses }) => {
    if (!buses || buses.length === 0) return null;

    return (
        <div className="w-full space-y-4">
            {/* Header section with summary badge */}
            <div className="flex items-center gap-2 px-1 mb-1">
                <Bus className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-base">Bus Options</h3>
                <span className="ml-auto text-[10px] font-bold bg-emerald-500/20 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-400/30 backdrop-blur-sm">
                    {buses.length} options
                </span>
            </div>

            {/* Bus cards grid - Widened to max 2 cols for clarity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {buses.map((bus, idx) => {
                    const operatorName = bus.operator_name || bus.operator || bus.travels_name || 'Bus Operator';
                    const busType      = bus.bus_type || bus.types || bus.category || '';
                    const duration     = bus.duration || bus.travel_time || bus.journey_time || '—';
                    const fare         = bus.ticket_price_range || bus.fare || bus.ticket_price || bus.fare_range || bus.price || bus.cost || '—';
                    const nightBus     = bus.night_available === 'Yes' || bus.overnight === 'Yes' ||
                        !!(bus.night_available && bus.night_available.includes('Yes'));
                    const frequency    = bus.frequency || '';

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col overflow-hidden group"
                        >
                            {/* Card Top: Operator & Badges */}
                            <div className="p-5 border-b border-slate-50 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
                                <div className="font-black text-slate-800 group-hover:text-emerald-600 transition-colors truncate text-base tracking-tight">
                                    {operatorName}
                                </div>
                                {nightBus && (
                                    <span className="flex items-center gap-1 text-[10px] px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 font-black uppercase tracking-widest shrink-0">
                                        <Moon className="h-2.5 w-2.5" /> Night
                                    </span>
                                )}
                            </div>

                            {/* Card Content: Journey Details */}
                            <div className="p-6 flex flex-col gap-6 flex-1">
                                {(() => {
                                    const clean = (val: any) => (val && val !== '—' && val !== 'null' && val !== 'undefined') ? val : null;
                                    const busDur = clean(duration) || 'Schedule Pending';
                                    const busFare = clean(fare) || '₹ TBA';

                                    return (
                                        <>
                                            <div className="flex items-center gap-4 px-1">
                                                <div className="w-14 h-14 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 shadow-inner relative overflow-hidden">
                                                    <motion.div 
                                                        animate={{ scale: [1, 1.2, 1] }} 
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute inset-0 bg-emerald-400/10" 
                                                    />
                                                    <Clock className="h-7 w-7 relative z-10" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{busDur}</div>
                                                    <div className="text-[10px] text-slate-400 font-black uppercase mt-1.5 tracking-[0.2em]">Estimated Journey</div>
                                                </div>
                                            </div>

                                            {/* Route Details */}
                                            {(clean(bus.pickup_point) || clean(bus.drop_point)) && (
                                                <div className="space-y-3 mb-1 px-1 bg-slate-50/50 p-3 rounded-2xl border border-dashed border-slate-200">
                                                    {clean(bus.pickup_point) && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-1 w-2 h-2 rounded-full border-2 border-emerald-400 shrink-0" />
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Boarding</span>
                                                                <span className="text-[12px] text-slate-900 font-black tracking-tight">{bus.pickup_point}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {clean(bus.drop_point) && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-1 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Dropping</span>
                                                                <span className="text-[12px] text-slate-900 font-black tracking-tight">{bus.drop_point}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Price Indicator */}
                                            <div className="flex items-center justify-between bg-emerald-600 rounded-3xl px-6 py-4 shadow-xl shadow-emerald-500/10 mt-auto">
                                                <span className="text-[11px] text-white/70 font-black uppercase tracking-widest leading-none">Best Price</span>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-white tracking-tighter leading-none">{busFare}</div>
                                                    <div className="text-[9px] text-white/50 font-bold uppercase tracking-tighter mt-1">Direct Booking Avail.</div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}

                                {bus.best_option_reason && (
                                    <div className="p-3 bg-indigo-50/30 rounded-2xl border border-indigo-50 flex items-start gap-2.5">
                                        <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{bus.best_option_reason}</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Action: Book */}
                            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-2">
                                {BUS_BOOKING_SITES.slice(0, 2).map(site => (
                                    <a
                                        key={site.label}
                                        href={site.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-black text-white px-3 py-3 rounded-2xl transition-all ${site.color} shadow-sm active:scale-95 uppercase tracking-widest`}
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        {site.label}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-slate-900 border border-slate-800 rounded-[1.5rem] text-[10px] text-slate-400 font-bold leading-relaxed shadow-lg">
                <span className="text-emerald-400 font-black mr-2 tracking-widest uppercase">💡 Travel Advisor:</span>
                Book seats early for Volvo/Sleeper buses—they fill up fast, especially on weekends and peak Indian yatra seasons. Check ratings for cleanliness and punctuality.
            </div>
        </div>
    );
};

export default BusTable;
