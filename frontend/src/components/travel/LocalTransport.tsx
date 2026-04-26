import React from 'react';
import { Car } from 'lucide-react';

interface LocalTransportProps {
    uber: any;
    auto: any;
    metro: any;
}

const LocalTransport: React.FC<LocalTransportProps> = ({ uber, auto, metro }) => {
    if (!uber && !auto && !metro) return null;

    // Skip sections that have errors
    const uberAvailable = uber && !uber?.error && !uber?.status?.includes('Unavailable');
    const autoAvailable = auto && auto?.fare;
    const metroAvailable = metro && !metro?.status?.includes('Not available') && !metro?.status?.includes('not available');

    if (!uberAvailable && !autoAvailable && !metroAvailable) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Car className="h-4 w-4 text-slate-400" /> Local Commute
                </h3>
            </div>
            <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Uber / Cab */}
                {uberAvailable && (
                    <div className="bg-slate-900 text-white rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.04] rounded-full -mr-8 -mt-8 blur-xl"></div>
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                                <div className="font-bold text-base tracking-tight">Uber</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest">{uber?.service || 'Ride'}</div>
                            </div>
                            {uber?.surge_multiplier > 1.0 && (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                    {uber.surge_multiplier}x
                                </span>
                            )}
                        </div>
                        <div className="text-xl font-bold tracking-tight relative z-10">
                            {uber?.fare_estimate || 'Check App'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 relative z-10">{uber?.duration || '~15 min'} wait</div>
                    </div>
                )}

                {/* Auto Rickshaw */}
                {autoAvailable && (
                    <div className="bg-amber-50 text-amber-900 rounded-xl p-4 border border-amber-100/60">
                        <div className="font-bold text-base mb-1">Auto Rickshaw</div>
                        <div className="text-xl font-bold tracking-tight">
                            {auto?.fare || '₹15/km'}
                        </div>
                        <div className="text-[10px] font-medium text-amber-600 mt-1">
                            Availability: {auto?.availability || 'High'}
                        </div>
                    </div>
                )}

                {/* Metro */}
                {metroAvailable && (
                    <div className="bg-emerald-50 text-emerald-900 rounded-xl p-4 border border-emerald-100/60">
                        <div className="font-bold text-base mb-1">Metro</div>
                        <div className="text-sm font-medium text-emerald-700 leading-snug">
                            {metro?.status}
                        </div>
                        {metro?.fare_range && (
                            <div className="mt-2 text-xl font-bold">{metro.fare_range}</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocalTransport;
