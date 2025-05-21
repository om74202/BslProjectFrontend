import { useState, useEffect } from 'react';
import { Bell, RefreshCw, ChevronDown } from 'lucide-react';

// Custom Gauge Chart Component
const GaugeChart = ({ value, color }) => {
    // Calculate the angle based on the percentage
    const angle = (value / 100) * 180;

    return (
        <div className="relative w-32 h-32">
            {/* Gauge background */}
            <svg className="w-full h-full" viewBox="0 0 100 50">
                <path
                    d="M10,50 A40,40 0 1,1 90,50"
                    fill="none"
                    stroke="#e6e6e6"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                {/* Gauge value indicator */}
                <path
                    d={`M10,50 A40,40 0 ${angle > 90 ? 1 : 0},1 ${10 + 40 * Math.sin(angle * Math.PI / 180)},${50 - 40 * Math.cos(angle * Math.PI / 180)}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                />
            </svg>
            {/* Percentage text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-0 text-2xl font-bold text-center">
                {value}%
            </div>
        </div>
    );
};

// Line Chart Component
const LineChart = ({ data, type }) => {
    const maxY = 120;
    const minY = 0;
    const chartHeight = 200;
    const chartWidth = 300;

    // Determine color zones
    const getZoneColor = (y) => {
        if (y <= 20 || y >= 110) return 'rgba(255, 200, 200, 0.5)'; // Red zone
        if (y <= 40 || y >= 90) return 'rgba(255, 255, 200, 0.5)'; // Yellow zone
        return 'rgba(200, 255, 200, 0.5)'; // Green zone
    };

    // Create points for the line
    const points = data.map((point, index) => {
        const x = (index / (data.length - 1)) * chartWidth;
        const y = chartHeight - ((point.value - minY) / (maxY - minY)) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="mt-4 relative h-64">
            {/* Background color zones */}
            <div className="absolute inset-0">
                <div className="absolute top-0 h-1/6 w-full bg-red-200" />
                <div className="absolute top-1/6 h-1/6 w-full bg-yellow-100" />
                <div className="absolute top-2/6 h-3/6 w-full bg-green-100" />
                <div className="absolute top-5/6 h-1/6 w-full bg-yellow-100" />
                <div className="absolute bottom-0 h-1/6 w-full bg-red-200" />
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-0 h-full flex flex-col justify-between">
                {[120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((value) => (
                    <div key={value} className="text-xs">{value}</div>
                ))}
            </div>

            {/* Chart */}
            <svg className="w-full h-full overflow-visible">
                {/* Horizontal dotted lines */}
                {[20, 40, 90, 110].map((value) => {
                    const y = chartHeight - ((value - minY) / (maxY - minY)) * chartHeight;
                    return (
                        <line
                            key={value}
                            x1="20"
                            y1={y}
                            x2="100%"
                            y2={y}
                            stroke="rgba(0,0,0,0.2)"
                            strokeDasharray="2,2"
                        />
                    );
                })}

                {/* Line chart */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="orange"
                    strokeWidth="2"
                />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between">
                {['06', '07', '08', '09', '10', '11', '12', '13', '14'].map((label) => (
                    <div key={label} className="text-xs">{label}</div>
                ))}
            </div>

            {/* Toggle buttons */}
            <div className="absolute top-0 right-0 flex space-x-2">
                <button className={`px-2 py-1 text-xs border rounded ${type === 'Value' ? 'bg-gray-200' : 'bg-white'}`}>Value</button>
                <button className={`px-2 py-1 text-xs border rounded ${type === 'Angle' ? 'bg-gray-200' : 'bg-white'}`}>Angle</button>
            </div>
        </div>
    );
};

// Station Card Component
const StationCard = ({ station }) => {
    const [selectedPosition, setSelectedPosition] = useState('1');

    // Mock data for charts
    const lineData = Array(9).fill().map((_, i) => ({
        time: `0${i + 6}`,
        value: 40 + Math.random() * 40 + (i % 3 === 0 ? 10 : 0)
    }));

    return (
        <div className="border rounded p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Station {station.id} - Torque Gun {station.torqueGun}</h3>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center border rounded px-2 py-1">
                        <span>Position {selectedPosition}</span>
                        <ChevronDown size={16} className="ml-2" />
                    </div>
                    <button className="border rounded px-2 py-1 text-orange-500 text-sm flex items-center">
                        <span className="mr-1">{station.hasAlert ? '•' : ''}</span>
                        Alert
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Torque Value In-Spec (%)</p>
                        <div className="mt-2">
                            <div className="flex items-center">
                                <GaugeChart value={station.torqueValuePercent} color="#3b82f6" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Torque Angle In-Spec(%)</p>
                        <div className="mt-2">
                            <div className="flex items-center">
                                <GaugeChart value={station.torqueAnglePercent} color="#3b82f6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Total Readings</p>
                        <p className="font-medium text-lg">{station.totalReadings}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">In Spec</p>
                        <p className="font-medium text-lg text-green-500">{station.inSpec}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Out Of Spec</p>
                        <p className="font-medium text-lg text-red-500">{station.outOfSpec}</p>
                    </div>
                </div>
            </div>

            <LineChart data={lineData} type="Value" />
        </div>
    );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, percentageChange }) => {
    return (
        <div className="bg-white rounded p-4 flex justify-between items-start">
            <div>
                <h3 className="text-sm text-gray-500">{title}</h3>
                <p className="text-3xl font-bold mt-1">{value}</p>
                <p className="text-xs text-green-500 mt-1">
                    ↗ {percentageChange}% up from previous Shift
                </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${title.includes('Alerts') ? 'bg-red-100' :
                    title.includes('Offline') ? 'bg-yellow-100' :
                        title.includes('Online') ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                {icon}
            </div>
        </div>
    );
};

// Main Dashboard Component
const TorqueMonitoring = () => {
    const [selectedLine, setSelectedLine] = useState('All Lines');
    const [selectedStation, setSelectedStation] = useState('All Stations');
    const [selectedTorqueGun, setSelectedTorqueGun] = useState('All Torque Gun');
    const [selectedDate, setSelectedDate] = useState('Today');
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock API call to fetch stations data
    useEffect(() => {
        // Simulate API call with setTimeout
        const fetchData = async () => {
            setLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data for stations
            const stationsData = [
                {
                    id: 1,
                    torqueGun: 1,
                    torqueValuePercent: 82,
                    torqueAnglePercent: 93,
                    totalReadings: '1150',
                    inSpec: '1000',
                    outOfSpec: '150',
                    hasAlert: true,
                },
                {
                    id: 1,
                    torqueGun: 2,
                    torqueValuePercent: 82,
                    torqueAnglePercent: 93,
                    totalReadings: '1150',
                    inSpec: '1000',
                    outOfSpec: '150',
                    hasAlert: true,
                }
            ];

            setStations(stationsData);
            setLoading(false);
        };

        fetchData();
    }, []);

    const refreshData = () => {
        // Reload data
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 bg-gray-100 p-4 overflow-auto">
                <div className="flex justify-between mb-4">
                    <div></div>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <button className="bg-white border rounded px-4 py-2 flex items-center">
                                {selectedDate}
                                <ChevronDown size={16} className="ml-2" />
                            </button>
                        </div>
                        <button
                            className="bg-blue-500 text-white rounded px-4 py-2 flex items-center"
                            onClick={refreshData}
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="flex space-x-2 mb-4">
                    <div className="relative">
                        <button className="bg-white border rounded px-4 py-2 flex items-center">
                            {selectedLine}
                            <ChevronDown size={16} className="ml-2" />
                        </button>
                    </div>
                    <div className="relative">
                        <button className="bg-white border rounded px-4 py-2 flex items-center">
                            {selectedStation}
                            <ChevronDown size={16} className="ml-2" />
                        </button>
                    </div>
                    <div className="relative">
                        <button className="bg-white border rounded px-4 py-2 flex items-center">
                            {selectedTorqueGun}
                            <ChevronDown size={16} className="ml-2" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <SummaryCard
                        title="Total Stations"
                        value="03"
                        icon={<div className="text-blue-500">📊</div>}
                        percentageChange="7.5"
                    />
                    <SummaryCard
                        title="Online Stations"
                        value="02"
                        icon={<div className="text-green-500">📶</div>}
                        percentageChange="7.5"
                    />
                    <SummaryCard
                        title="Offline Station"
                        value="02"
                        icon={<div className="text-yellow-500">📴</div>}
                        percentageChange="7.5"
                    />
                    <SummaryCard
                        title="Alerts"
                        value="03"
                        icon={<div className="text-red-500">⚠️</div>}
                        percentageChange="7.5"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading stations data...</p>
                    </div>
                ) : (
                    <div>
                        {stations.map((station, index) => (
                            <StationCard key={index} station={station} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TorqueMonitoring;