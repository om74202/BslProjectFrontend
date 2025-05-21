import { Outlet, useLocation } from 'react-router-dom';
import  Sidebar  from './Sidebar';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
    "/dashboard": "Plant Dashboard",
    "/dashboard/line-dashboard": "Line Dashboard",
    "/dashboard/torque-monitoring": "Torque Monitoring",
    "/dashboard/drive-monitoring": "Drive Monitoring",
    "/dashboard/quality-monitoring": "Quality Monitoring",
    "/dashboard/data-sheets": "Data Sheets",
    "/dashboard/user-management": "User Management",
    "/dashboard/settings": "Settings"
  };
export function DashboardLayout() {
    const location = useLocation(); 
    const { authUser } = useAuth();  // Get current route
    let pageTitle = pageTitles[location.pathname];

    if (!pageTitle) {
        if (location.pathname.startsWith("/dashboard/settings/")) {
            pageTitle = "Organisation Info";
        } else {
            pageTitle = "Dashboard";
        }
    }
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64 ">
                <header className="bg-white border-b">
                    <div className="flex items-center justify-between px-6 h-16">
                        <h1 className="text-xl font-semibold">{pageTitle}</h1>
                        <div className="flex items-center">
                            <button className="p-2 rounded-full hover:bg-gray-100">
                                <Bell className="h-5 w-5 text-gray-500" />
                            </button>

                            {/* User Profile */}
                            {authUser && (
                                <div className="flex items-center ml-4 gap-2">
                                    <span className="text-sm font-medium text-gray-700">{authUser.name}</span>
                                    <div className="w-8 h-8 rounded-full overflow-hidden">
                                        <img
                                            src={authUser.imageUrl || "/default-profile.png"} // fallback image
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
