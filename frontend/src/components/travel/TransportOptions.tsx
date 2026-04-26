import React from 'react';
import { Train, Plane, Bus, Car, Clock, Wallet, ThumbsUp } from 'lucide-react';

interface TransportOption {
    mode: string;
    duration: string;
    cost: string;
    recommendation?: string;
}

const modeIcons: Record<string, React.ReactNode> = {
    Train: <Train className="h-4 w-4" />,
    Flight: <Plane className="h-4 w-4" />,
    Bus: <Bus className="h-4 w-4" />,
    'Cab/Taxi': <Car className="h-4 w-4" />,
};

const modeColors: Record<string, string> = {
    Train: 'bg-blue-50 text-blue-600 border-blue-100',
    Flight: 'bg-violet-50 text-violet-600 border-violet-100',
    Bus: 'bg-green-50 text-green-600 border-green-100',
    'Cab/Taxi': 'bg-amber-50 text-amber-600 border-amber-100',
};

const TransportOptions: React.FC<{ options: TransportOption[] }> = ({ options }) => {
    if (!options || options.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 pt-5 pb-3">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <Car className="h-4 w-4 text-slate-400" /> Transport Options
                </h3>
            </div>
            <div className="px-5 pb-5 space-y-2.5">
                {options.map((opt, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${modeColors[opt.mode] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                {modeIcons[opt.mode] || <Car className="h-4 w-4" />}
                            </div>
                            <div>
                                <div className="font-semibold text-sm text-slate-800">{opt.mode}</div>
                                {opt.recommendation && (
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-0.5">
                                        <ThumbsUp className="h-2.5 w-2.5" /> {opt.recommendation}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium text-slate-700">{opt.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                                <Wallet className="h-3 w-3" />
                                <span className="font-mono font-semibold text-slate-700">{opt.cost}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransportOptions;
