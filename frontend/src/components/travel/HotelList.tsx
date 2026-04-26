import React from 'react';
import { Star, MapPin, Hotel } from 'lucide-react';

interface HotelData {
    // API format
    hotel_name?: string;
    star_category?: string;
    price_per_night?: string;
    distance_from_center?: string;
    rating?: number;
    amenities?: string[];
    contact_info?: string;
    booking_tip?: string;
    // Knowledge base format
    name?: string;
    type?: string;
    price_range?: string;
    area?: string;
    // Google Places format
    address?: string;
    place_id?: string;
    data_status?: string;
}

const HotelList: React.FC<{ hotels: HotelData[] }> = ({ hotels }) => {
    if (!hotels || hotels.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Hotel className="h-4 w-4 text-slate-400" /> Recommended Hotels
                </h3>
            </div>
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotels.map((hotel, idx) => {
                    // Normalize fields from multiple formats
                    const displayName = hotel.hotel_name || hotel.name || 'Hotel';
                    const ratingVal = hotel.rating || 0;
                    const priceDisplay = hotel.price_per_night || hotel.price_range || '';
                    const locationDisplay = hotel.distance_from_center || hotel.area || hotel.address || '';
                    const hotelType = hotel.star_category || hotel.type || '';
                    const amenities = hotel.amenities || [];

                    // Determine type badge color
                    const typeColorMap: Record<string, string> = {
                        'budget': 'bg-green-50 text-green-700 border-green-100',
                        'mid-range': 'bg-blue-50 text-blue-700 border-blue-100',
                        'premium': 'bg-purple-50 text-purple-700 border-purple-100',
                        'luxury': 'bg-amber-50 text-amber-700 border-amber-100',
                        'heritage': 'bg-rose-50 text-rose-700 border-rose-100',
                    };
                    const typeColor = typeColorMap[hotelType.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-100';

                    return (
                        <div key={idx} className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                            <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 pr-2">
                                    <h4 className="font-semibold text-slate-800 text-sm truncate" title={displayName}>
                                        {displayName}
                                    </h4>
                                    <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < Math.floor(ratingVal) ? "fill-current" : "text-slate-200"}`}
                                            />
                                        ))}
                                        <span className="text-slate-400 ml-1 text-[11px] font-medium">{ratingVal}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    {priceDisplay && (
                                        <>
                                            <div className="text-sm font-bold text-[#1E3A8A]">{priceDisplay}</div>
                                            {hotel.price_per_night && <div className="text-[10px] text-slate-400">per night</div>}
                                        </>
                                    )}
                                </div>
                            </div>

                            {locationDisplay && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                    <span className="truncate">{locationDisplay}</span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-1.5">
                                {hotelType && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${typeColor}`}>
                                        {hotelType}
                                    </span>
                                )}
                                {amenities.slice(0, 3).map((am, i) => (
                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 font-medium border border-slate-100">
                                        {am}
                                    </span>
                                ))}
                                {amenities.length > 3 && (
                                    <span className="text-[10px] text-slate-400 self-center">+{amenities.length - 3}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HotelList;
