import { PlusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import axios from "axios";
import React, { useState } from "react";

const AddDeviceModal = ({ isOpen, onClose }) => {
  const orgId = localStorage.getItem("SelectedOrg");
  const [formData, setFormData] = useState({
    deviceID: "",
    deviceType: "EDGE 01", // Default device type
  });

  const deviceTypes = ["EDGE 01", "EDGE 02", "EDGE 03"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found in LocalStorage. User might be logged out.");
        return;
      }

      // Construct headers exactly like Postman
      const headers = {
        Authorization: `Bearer ${token}`, // Ensure proper Bearer token format
      };

    try {
      const payload = {
        organisationId: orgId,
        ...formData,
      };
      const response = await axios.post(
        `${ "http://40.81.226.154:3030/api/v1"}/device/addDevice/${orgId}`,
        payload,
        {headers}
      );
      console.log("Device added successfully:", response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error adding machine:", error);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          <UserAddOutlined /> Add Device
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Device ID */}
          <div>
            <label className="block text-sm font-medium pb-2">Device ID</label>
            <input
              type="text"
              name="deviceID"
              value={formData.deviceID}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Enter Device ID (IP, Serial No, or MAC Address)"
            />
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium pb-2">Device Type</label>
            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 bg-white cursor-pointer"
            >
              {deviceTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

const Device = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
        className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-600 flex items-center gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusCircleOutlined />
        Add Device
      </button>
      <AddDeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Device;