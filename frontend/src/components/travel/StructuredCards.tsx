
import {
    Plane, Train, Bus, Utensils, Hotel, Calendar, MapPin,
    Clock, IndianRupee, Briefcase, Info, ArrowRight, Star
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { speak, stopSpeaking } from '@/lib/voiceService';

// Map string keys to Lucide icons
const iconMap: Record<string, React.ReactNode> = {
    "plane": <Plane className="h-5 w-5" />,
    "plane-landing": <div className="rotate-90"><Plane className="h-5 w-5" /></div>,
    "train": <Train className="h-5 w-5" />,
    "bus": <Bus className="h-5 w-5" />,
    "utensils": <Utensils className="h-5 w-5" />,
    "hotel": <Hotel className="h-5 w-5" />,
    "calendar": <Calendar className="h-5 w-5" />,
    "map-pin": <MapPin className="h-5 w-5" />,
    "clock": <Clock className="h-4 w-4" />,
    "indian-rupee": <IndianRupee className="h-4 w-4" />,
    "briefcase": <Briefcase className="h-4 w-4" />,
    "info": <Info className="h-4 w-4" />,
};

interface CardDetailItem {
    icon: string;
    label: string;
    value: string;
}

interface CardDetail {
    heading?: string;
    desc?: string;
    items?: CardDetailItem[];
    tip?: string;
    voice?: string;
}

interface StructuredCardProps {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    badge?: string;
    meta?: string[];
    icons?: string[];
    color?: string;
    detail?: CardDetail;
}

const StructuredCards: React.FC<{ cards: StructuredCardProps[]; lang?: string }> = ({ cards, lang }) => {
    if (!cards || cards.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full mt-4">
            {cards.map((card, idx) => (
                <Card key={card.id || idx} className="overflow-hidden border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 bg-white group">
                    {/* Header with Color Strip */}
                    <div className="h-1.5 w-full" style={{ backgroundColor: card.color || '#6366f1' }}></div>

                    <CardHeader className="p-4 pb-2 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col">
                                {card.badge && (
                                    <Badge
                                        variant="secondary"
                                        className="w-fit mb-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md"
                                        style={{
                                            backgroundColor: `${card.color}15`,
                                            color: card.color,
                                            borderColor: `${card.color}30`
                                        }}
                                    >
                                        {card.badge}
                                    </Badge>
                                )}
                                <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                                    {card.title}
                                </h3>
                                {card.subtitle && (
                                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                        {card.subtitle}
                                    </p>
                                )}
                            </div>
                            {/* Icon Bubble */}
                            <div
                                className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100"
                                style={{ backgroundColor: `${card.color}10`, color: card.color }}
                            >
                                {card.icons && card.icons[0] && iconMap[card.icons[0]] ? iconMap[card.icons[0]] : <Info className="h-5 w-5" />}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-2 space-y-4">
                        {/* Meta Tags */}
                        {card.meta && card.meta.length > 0 && (
                            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                                {card.meta.map((m, i) => (
                                    <span key={i} className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-md flex items-center gap-1.5">
                                        {card.icons && card.icons[i + 1] && iconMap[card.icons[i + 1]] && (
                                            <span className="text-slate-400 scale-75">{iconMap[card.icons[i + 1]]}</span>
                                        )}
                                        {m}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Details Grid */}
                        {card.detail?.items && (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {card.detail.items.map((item, i) => (
                                    <div key={i} className="flex flex-col space-y-0.5 bg-slate-50/50 p-2 rounded-lg border border-slate-50">
                                        <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            {iconMap[item.icon] && <span className="opacity-70 scale-75">{iconMap[item.icon]}</span>}
                                            {item.label}
                                        </div>
                                        <div className="text-sm font-semibold text-slate-800">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tip */}
                        {card.detail?.tip && (
                            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100/50 p-2.5 rounded-md flex gap-2 items-start leading-relaxed">
                                <span className="text-amber-500 mt-0.5">💡</span>
                                {card.detail.tip}
                            </div>
                        )}

                        {/* Description */}
                        {card.detail?.desc && (
                            <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-slate-200 pl-2">
                                {card.detail.desc}
                            </p>
                        )}
                    </CardContent>

                    {/* Footer Actions */}
                    <CardFooter className="p-3 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-xs">
                        {card.detail?.voice && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    speak(card.detail!.voice!, lang || 'en');
                                }}
                                className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors font-medium px-2 py-1 rounded-md hover:bg-slate-200/50"
                            >
                                <span className="text-base">🔊</span> Listen
                            </button>
                        )}
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold px-2 py-1">
                            Book Now <ArrowRight className="h-3 w-3" />
                        </button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default StructuredCards;
