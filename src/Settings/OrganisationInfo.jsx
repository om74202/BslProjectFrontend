import React, {  useState, useEffect } from "react";
import Machine from './Machine';
import User from "./User";
import Device from "./Device";
import { useAuth } from "../context/AuthContext";

const OrgInfo = () => {
  const { authUser } = useAuth();

  // Get initial tab from localStorage, or set based on user role
  const getInitialTab = () => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) return savedTab; // Return the saved tab if available

    // Default tab selection based on role
    return authUser?.user.role === "Admin"
      ? "User"
      : authUser?.user.role === "User"
      ? null
      : "Machine";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Update localStorage when tab changes
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);

  // Tab content rendering
  const renderContent = () => {
    switch (activeTab) {
      case "Line":
        return (
          <div className="p-4">
            <Machine />
          </div>
        );
      case "User":
        return (
          <div className="p-4">
            <User />
          </div>
        );
      case "Device":
        return (
          <div className="p-4">
            <Device />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4 rounded-lg">
      {/* Tab Buttons */}
      {authUser?.user.role === "Admin" ? (
        <div className="flex border-b mb-4">
          {["User"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 font-medium border-b-2 transition duration-300 text-md ${
                activeTab === tab
                  ? "border-gray-800 text-gray-800"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : authUser?.user.role === "User" ? null : (
        <div className="flex border-b mb-4">
          {["Line", "User", "Device"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 font-medium border-b-2 transition duration-300 text-md ${
                activeTab === tab
                  ? "border-gray-800 text-gray-800"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div className="rounded-lg">{renderContent()}</div>
    </div>
  );
};

export default OrgInfo;