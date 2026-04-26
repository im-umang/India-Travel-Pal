import React, { useState } from 'react';
import { Calendar, MapPin, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
  tip: string;
}

const ItineraryView: React.FC<{ itinerary: ItineraryDay[], activeDayIndex?: number }> = ({ itinerary, activeDayIndex }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  // Auto-expand day when being narrated
  React.useEffect(() => {
    if (activeDayIndex !== undefined && activeDayIndex >= 0 && activeDayIndex < itinerary.length) {
      setExpandedDay(activeDayIndex);
    }
  }, [activeDayIndex, itinerary.length]);

  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500" /> Day-wise Itinerary
        </h3>
      </div>
      <div className="px-5 pb-5 space-y-2">
        {itinerary.map((day, idx) => (
          <div
            key={day.day}
            className={cn(
              "border rounded-lg overflow-hidden transition-all duration-300",
              activeDayIndex === idx ? "border-blue-500 bg-blue-50/30" : "border-slate-100"
            )}
          >
            <button
              onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition-colors",
                activeDayIndex === idx ? "bg-blue-50/50" : ""
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {day.day}
                </div>
                <span className="font-medium text-sm text-slate-800">{day.title}</span>
              </div>
              {expandedDay === idx ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {expandedDay === idx && (
              <div className="px-4 pb-4 pt-1 border-t border-slate-50">
                <div className="space-y-2 mb-3">
                  {day.activities.map((activity, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
                {day.tip && (
                  <div className="flex items-start gap-2 px-3 py-2 bg-amber-50/60 rounded-md border border-amber-100/60">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-xs text-amber-700">{day.tip}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryView;
