import React, { useState } from 'react';
import {
  Utensils, Route, Wallet, ChevronDown, ChevronUp,
  MapPin, Star, Calendar, Hotel, Lightbulb,
  Train, Plane, Bus, Car, Clock, IndianRupee, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import FlightTable from './FlightTable';
import TrainTable from './TrainTable';
import BusTable from './BusTable';
import HotelList from './HotelList';

interface StructuredData {
  reply?: string;
  lang?: string;
  route_summary?: {
    from?: string;
    to?: string;
    origin?: string;
    destination?: string;
    distance_km?: string;
    recommended_travel_mode?: string;
    best_time_to_travel?: string;
    traffic_advice?: string;
    summary?: string;
    best_mode?: string;
  } | null;
  train_options?: any[];
  flight_options?: any[];
  bus_options?: any[];
  nearby_hotels?: any[];
  local_transport?: {
    auto_rickshaw?: { average_base_fare: string; per_km_rate: string; best_for: string; };
    uber?: { average_fare_range: string; availability_level: string; best_time_to_book: string; };
    metro?: { available: string; nearest_station: string; fare_range: string; };
  } | null;
  nearby_food?: {
    restaurant_name: string;
    distance_from_center_km?: string;
    approx_cost_for_two?: string;
    google_rating?: string;
    speciality?: string;
    opening_hours?: string;
  }[];
  famous_food_items?: {
    dish_name: string;
    veg_or_nonveg?: string;
    average_price?: string;
    best_area?: string;
  }[];
  budget_summary?: {
    budget_trip_estimate?: string;
    mid_range_estimate?: string;
    luxury_estimate?: string;
    total_estimated?: string;
    breakdown?: Record<string, string>;
    category?: string;
    savings_tip?: string;
  } | null;
  itinerary?: {
    day: number;
    title: string;
    activities: string[];
    tip?: string;
  }[];
}

const TransportIcon = ({ mode }: { mode?: string }) => {
  const m = (mode || '').toLowerCase();
  if (m.includes('flight') || m.includes('air')) return <Plane className="h-3.5 w-3.5" />;
  if (m.includes('train') || m.includes('rail')) return <Train className="h-3.5 w-3.5" />;
  if (m.includes('bus')) return <Bus className="h-3.5 w-3.5" />;
  return <Car className="h-3.5 w-3.5" />;
};

const StructuredResponse: React.FC<{
  data: StructuredData;
  activeHighlightIndex?: number | null;
  sentences?: string[];
}> = ({ data, activeHighlightIndex, sentences }) => {
  const currentSentence = (activeHighlightIndex !== null && activeHighlightIndex !== undefined && sentences)
    ? sentences[activeHighlightIndex]
    : null;

  return (
    <div className="flex flex-col gap-8 w-full mt-4">
      {/* 🟢 Live Data Badge */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Dynamic Intelligence</span>
        </div>
      </div>

      {/* ── 1. Route Summary ── */}
      {data.route_summary && (data.route_summary.origin || data.route_summary.destination || data.route_summary.from || data.route_summary.to) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border border-teal-100 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #f0fdf9 0%, #e0f2fe 100%)' }}
        >
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-1.5 text-[10px] text-teal-600 uppercase tracking-widest font-bold mb-2">
              <Route className="h-3 w-3" />
              {data.route_summary.summary || 'Trip Route Intelligence'}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="text-center">
                  <div className="font-bold text-lg text-slate-800 leading-none">
                    {data.route_summary.from || data.route_summary.origin}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide">Origin</div>
                </div>
                <div className="flex-1 flex flex-col items-center px-2">
                  <div className="flex items-center gap-1 w-full relative">
                    <div className="h-px flex-1 bg-teal-200" />
                    {(data.route_summary.best_mode || data.route_summary.recommended_travel_mode) && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full border border-teal-200 text-teal-700 text-[10px] font-semibold shadow-sm z-10">
                        <TransportIcon mode={data.route_summary.best_mode || data.route_summary.recommended_travel_mode} />
                        {data.route_summary.recommended_travel_mode || data.route_summary.best_mode}
                      </div>
                    )}
                    <div className="h-px flex-1 bg-teal-200" />
                  </div>
                  <div className="text-[10px] text-teal-600 font-bold mt-1.5">
                    {(data.route_summary.distance_km) ? `${data.route_summary.distance_km} km` : ''}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-slate-800 leading-none">
                    {data.route_summary.to || data.route_summary.destination}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide">Destination</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 2. Budget Summary ── */}
      {data.budget_summary && (data.budget_summary.budget_trip_estimate || data.budget_summary.total_estimated) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wallet className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <IndianRupee className="h-4 w-4" />
              <span className="text-xs uppercase font-black tracking-widest">Travel Budget Intelligence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Budget Traveller</span>
                <div className="text-xl font-black text-emerald-400 truncate tracking-tight">
                  {data.budget_summary.budget_trip_estimate || data.budget_summary.total_estimated}
                </div>
                <span className="text-[9px] text-slate-500 leading-tight">Hostels, local food, sleeper trains</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col gap-2">
                <span className="text-[10px] text-indigo-300 font-bold uppercase">Mid-Range Strategy</span>
                <div className="text-xl font-black text-white truncate tracking-tight">
                  {data.budget_summary.mid_range_estimate || '₹ 15,000 - 25,000'}
                </div>
                <span className="text-[9px] text-indigo-200/60 leading-tight">3-star hotels, AC trains, mix of cafes</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2">
                <span className="text-[10px] text-amber-300 font-bold uppercase">Luxury Experience</span>
                <div className="text-xl font-black text-amber-400 truncate tracking-tight">
                  {data.budget_summary.luxury_estimate || '₹ 50,000+'}
                </div>
                <span className="text-[9px] text-amber-200/60 leading-tight">5-star stay, private car, luxury dining</span>
              </div>
            </div>

            {data.budget_summary.savings_tip && (
              <div className="mt-2 flex items-start gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed">
                  <span className="text-indigo-300 font-bold not-italic">Pro Tip: </span>
                  {data.budget_summary.savings_tip}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── 3. Local Transport ── */}
      {data.local_transport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.local_transport.auto_rickshaw && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-2">
                <IndianRupee className="h-3.5 w-3.5" /> Auto Rickshaw
              </div>
              <div className="space-y-1.5">
                <div className="text-sm font-black text-slate-800">{data.local_transport.auto_rickshaw.average_base_fare} Base</div>
                <div className="text-[10px] text-amber-600 font-bold">{data.local_transport.auto_rickshaw.per_km_rate} /km</div>
                <div className="text-[10px] text-slate-500 italic mt-1 font-medium leading-tight">{data.local_transport.auto_rickshaw.best_for}</div>
              </div>
            </div>
          )}
          {data.local_transport.uber && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Car className="h-3.5 w-3.5" /> Uber / Ola
              </div>
              <div className="space-y-1.5">
                <div className="text-sm font-black text-slate-800">{data.local_transport.uber.average_fare_range}</div>
                <div className="text-[10px] text-slate-600 font-bold">Availability: {data.local_transport.uber.availability_level}</div>
                <div className="text-[10px] text-slate-500 italic mt-1 font-medium leading-tight">Book: {data.local_transport.uber.best_time_to_book}</div>
              </div>
            </div>
          )}
          {data.local_transport.metro && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Train className="h-3.5 w-3.5" /> Metro
              </div>
              {data.local_transport.metro.available === 'Yes' ? (
                <div className="space-y-1.5">
                  <div className="text-sm font-black text-slate-800">{data.local_transport.metro.fare_range}</div>
                  <div className="text-[10px] text-blue-600 font-bold truncate">Station: {data.local_transport.metro.nearest_station}</div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-medium">Not Available</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 4. Transport Options ── */}
      {data.flight_options && data.flight_options.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <FlightTable flights={data.flight_options} />
        </motion.div>
      )}
      {data.train_options && data.train_options.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <TrainTable trains={data.train_options} />
        </motion.div>
      )}
      {data.bus_options && data.bus_options.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <BusTable buses={data.bus_options} />
        </motion.div>
      )}

      {/* ── 5. Accommodation (Stay) ── */}
      {data.nearby_hotels && data.nearby_hotels.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <HotelList hotels={data.nearby_hotels} />
        </motion.div>
      )}

      {data.nearby_food && data.nearby_food.length > 0 && data.nearby_food.some((f: any) => f.restaurant_name || f.name || f.title || f.place || f.location) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-orange-100 shadow-sm bg-white overflow-hidden"
        >
          <div className="px-4 pt-4 pb-2 flex items-center gap-2 border-b border-orange-50">
            <Utensils className="h-4 w-4 text-orange-500" />
            <span className="font-bold text-sm text-slate-700">Recommended Restaurants</span>
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.nearby_food
              .filter((rest: any) => rest.restaurant_name || rest.name || rest.title || rest.place || rest.location)
              .map((rest: any, idx) => {
                const name = rest.restaurant_name || rest.name || rest.title || rest.place || rest.location || 'Local Restaurant';
                const rating = rest.google_rating || rest.rating || '4.5';
                const speciality = rest.speciality || rest.cuisine || rest.famous_for || rest.dish || 'Chef Speciality';
                const cost = rest.approx_cost_for_two || rest.cost_for_two || rest.price || '₹ 800 - 1,200';

                return (
                  <div key={idx} className="p-3 border border-slate-100 rounded-xl hover:border-orange-200 transition-all bg-orange-50/10">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-sm text-slate-800 leading-tight truncate pr-2">{name}</div>
                      <div className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-black border border-green-100">
                        ★ {rating}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mb-2">{speciality}</div>
                    <div className={cn(
                      "flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 mt-1",
                      "text-slate-400 font-bold uppercase tracking-tighter"
                    )}>
                      <span>Cost for 2: {cost}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {data.famous_food_items && data.famous_food_items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span className="font-bold text-sm text-slate-700">Must-Try Local Items</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {data.famous_food_items.map((food: any, idx) => {
              const name = typeof food === 'string' ? food : (food.dish_name || 'Famous Item');
              const area = typeof food === 'object' ? (food.best_area || 'Market Area') : 'Local Speciality';
              const isVeg = typeof food === 'object' ? food.veg_or_nonveg === 'Veg' : true;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className="bg-white p-3 rounded-xl border border-blue-50 shadow-sm flex flex-col items-center text-center gap-1.5"
                >
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-lg">
                    {isVeg ? '🥗' : '🍗'}
                  </div>
                  <div className="font-bold text-[11px] text-slate-800 leading-tight">{name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{area}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}


      {data.itinerary && data.itinerary.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span className="font-bold text-sm text-slate-700 uppercase tracking-widest">Day-wise Schedule</span>
          </div>
          <div className="space-y-2">
            {data.itinerary.map((day, idx) => {
              // We need to find if the day title, or any activity/tip matches the current sentence
              // For simplicity, we check if the current sentence matches the text content exactly or partially.

              const dayLabel = data.lang === 'hi' ? `दिन ${day.day}` : `Day ${day.day}`;
              const titleText = `${dayLabel}: ${day.title}`;

              // Helper to find index in sentences
              const getIdx = (text: string) => sentences?.findIndex(s => s.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(s.toLowerCase())) ?? -1;

              const titleIdx = getIdx(titleText);
              const isTitleHighlighted = activeHighlightIndex === titleIdx && titleIdx !== -1;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  className={cn(
                    "rounded-2xl border transition-all duration-300 overflow-hidden bg-white shadow-sm border-slate-100",
                  )}
                >
                  {/* Day Title Row */}
                  <div
                    id={titleIdx !== -1 ? `line-${(data as any).messageId}-${titleIdx}` : undefined}
                    className={cn(
                      "px-4 py-3 flex items-center gap-3 border-b transition-all duration-500",
                      isTitleHighlighted ? "bg-indigo-700 text-white border-indigo-800 shadow-inner" : "bg-white border-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                      isTitleHighlighted ? "bg-white text-indigo-700" : "bg-indigo-600 text-white"
                    )}>
                      {day.day}
                    </div>
                    <div className={cn(
                      "font-bold text-sm transition-colors",
                      isTitleHighlighted ? "text-white" : "text-slate-800"
                    )}>{day.title}</div>

                    {isTitleHighlighted && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-auto"
                      >
                        <Sparkles className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Activities List */}
                  <div className="px-5 py-4 space-y-3">
                    <ul className="space-y-2.5">
                      {day.activities.map((act, i) => {
                        const actIdx = getIdx(act);
                        const isActHighlighted = activeHighlightIndex === actIdx && actIdx !== -1;

                        return (
                          <li
                            key={i}
                            id={actIdx !== -1 ? `line-${(data as any).messageId}-${actIdx}` : undefined}
                            className={cn(
                              "flex gap-3 text-xs leading-relaxed transition-all duration-500 p-1.5 rounded-lg",
                              isActHighlighted
                                ? "bg-amber-100/80 text-amber-900 font-bold shadow-sm translate-x-1"
                                : "text-slate-600 font-normal"
                            )}
                          >
                            <div className={cn(
                              "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                              isActHighlighted ? "bg-amber-600 animate-pulse" : "bg-indigo-300"
                            )} />
                            {act}
                          </li>
                        );
                      })}
                    </ul>

                    {/* Tip Section */}
                    {day.tip && (() => {
                      const tipLabel = data.lang === 'hi' ? `टिप` : `Tip`;
                      const tipFull = `${tipLabel}: ${day.tip}`;
                      const tipIdx = getIdx(tipFull);
                      const isTipHighlighted = activeHighlightIndex === tipIdx && tipIdx !== -1;

                      return (
                        <div
                          id={tipIdx !== -1 ? `line-${(data as any).messageId}-${tipIdx}` : undefined}
                          className={cn(
                            "mt-3 p-3 rounded-xl text-[10px] font-medium transition-all duration-500 border",
                            isTipHighlighted
                              ? "bg-indigo-600 text-white border-indigo-700 shadow-md scale-[1.02]"
                              : "bg-amber-50/50 text-amber-700 border-amber-100"
                          )}
                        >
                          <span className={cn("font-bold uppercase tracking-wider mr-1", isTipHighlighted ? "text-indigo-200" : "text-amber-600")}>
                            {tipLabel}:
                          </span>
                          {day.tip}
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default StructuredResponse;
