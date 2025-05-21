export default function SummaryCard({ title, value, icon, color, percent }) {
    return (
        <div className={`rounded p-4 flex justify-between items-center ${color} min-h-30`}>
            <div>
                <div className="text-sm text-gray-500">{title}</div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-xs text-green-500"></div>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
        </div>
    );
  }