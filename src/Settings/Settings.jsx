import React, {  useState } from "react";
import Organisations from "./Organisation";
import Users from "../Users/Users";
import { useAuth } from "../context/AuthContext";
import OrganisaationInfo from "./OrganisationInfo";

const Settings = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("Plants");
  const { authUser } = useAuth();

  // Tab content
  const renderContent = () => {
    switch (activeTab) {
      case "Plants":
        return (
          <div className="p-4">
            <Organisations />
          </div>
        );
      case "Users":
        return (
          <div>
            {authUser?.user.role === "SuperAdmin" ? (
              <>
                <Users />
              </>
            ) : null}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-4 rounded-lg ">
      {/* Tab Buttons */}
      {authUser?.user.role === "SuperAdmin" ? (
        <>
          <div className="flex border-b mb-4">
            {["Plants", "Users"].map((tab) => (
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
          <div className="rounded-lg">{renderContent()}</div>
        </>
      ) : (
        <>
          <OrganisaationInfo />
        </>
      )}

      {/* Tab Content */}
    </div>
  );
};

export default Settings;
