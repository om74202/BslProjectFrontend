import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    LineChart,
    Gauge,
    Car,
    BadgeAlert,
    FileSpreadsheet,
    Users,
    Settings as SettingsIcon,
    LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [{ name: "Plant Dashboard", icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: "/dashboard", end: true },
    { name: "Line Dashboard", icon: <LineChart className="w-5 h-5 mr-3" />, path: "/dashboard/line-dashboard" },
    { name: "Torque Monitoring", icon: <Gauge className="w-5 h-5 mr-3" />, path: "/dashboard/torque-monitoring" },
    { name: "Drive Monitoring", icon: <Car className="w-5 h-5 mr-3" />, path: "/dashboard/drive-monitoring" },
    { name: "Quality Monitoring", icon: <BadgeAlert className="w-5 h-5 mr-3" />, path: "/dashboard/quality-monitoring" },
    { name: "Data Sheets", icon: <FileSpreadsheet className="w-5 h-5 mr-3" />, path: "/dashboard/data-sheets" },
    { name: "User Management", icon: <Users className="w-5 h-5 mr-3" />, path: "/dashboard/user-management" },
    { name: "Settings", icon: <SettingsIcon className="w-5 h-5 mr-3" />, path: "/dashboard/settings" }
];

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = async () => {
        logout(); // Clear auth context and localStorage
        navigate("/login");
    };

    return (
        <aside className="w-64 h-screen bg-white shadow-md fixed flex flex-col justify-between">
      
            <div className="p-4 border-b">
                <div className="flex items-center justify-center">
                    <img
                        src="../../public/assets/BSL.png"
                        alt="OPSIGHT.AI Logo"
                        className="h-10 mx-auto"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="p-4">
                <nav>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.path} className="mb-2">
                                <NavLink
                                    to={item.path}
                                    end={item.end}
                                    className={({ isActive }) =>
                                        `flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-blue-50"
                                        }`
                                    }
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>

                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Logout Button */}
            <div className="p-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-red-100 transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
