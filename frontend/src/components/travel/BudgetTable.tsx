import React from 'react';
import { BadgeIndianRupee } from 'lucide-react';

interface CostRow {
  category: string;
  budget: string;
  mid_range: string;
  luxury: string;
}

const BudgetTable: React.FC<{ cost_breakdown: CostRow[] }> = ({ cost_breakdown }) => {
  if (!cost_breakdown || cost_breakdown.length === 0) return null;

  return (
    <div className="overflow-hidden bg-white border border-blue-100 rounded-lg shadow-sm mb-6 mt-4">
      <div className="bg-blue-50/50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
        <BadgeIndianRupee className="h-4 w-4 text-[#1E3A8A]" />
        <h3 className="font-semibold text-sm text-[#1E3A8A] uppercase tracking-wider">Estimated Budget (Per Person)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#eff6ff] text-[#1E3A8A] border-b border-blue-100 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-3 font-semibold text-slate-500 min-w-[120px]">Category</th>
              <th className="p-3 font-semibold text-green-700 min-w-[100px]">Budget</th>
              <th className="p-3 font-semibold text-blue-700 min-w-[100px]">Mid-Range</th>
              <th className="p-3 font-semibold text-purple-700 min-w-[100px]">Luxury</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-mono text-xs">
            {cost_breakdown.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-3 font-semibold text-slate-700">{row.category}</td>
                <td className="p-3 text-slate-600">{row.budget}</td>
                <td className="p-3 text-slate-600 font-medium">{row.mid_range}</td>
                <td className="p-3 text-slate-600">{row.luxury}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetTable;
