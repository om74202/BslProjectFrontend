import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NoImgAvailable from "../Assets/react.svg";
import { useAuth } from "../context/AuthContext";

const EditMachineModal = ({ isOpen, onClose, machineId }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [certImage, setCertImage] = useState(null);
  const { authUser } = useAuth();
  const shiftNumbers = parseInt(localStorage.getItem("Shifts"), 10) || 0
  const orgId =
    authUser?.user.role === "SuperAdmin"
      ? localStorage.getItem("SelectedOrg")
      : localStorage.getItem("OrgId");

  const [formData, setFormData] = useState({
    organizationId: orgId,
    machineId: "",
    machineName: "",
    machineType: "CNC Milling",
    noOfShifts: 0,
    shiftTimings: [],
    orgInfo: [],
  });

  useEffect(() => {
    const fetchMachineData = async () => {
      if (!orgId || !machineId) return;

      const token = authUser?.token;

      if (!token) {
        console.error(
          "No token found in LocalStorage. User might be logged out."
        );
        return;
      }

      // Construct headers exactly like Postman
      const headers = {
        Authorization: `Bearer ${token}`, // Ensure proper Bearer token format
      };

      try {
        const response = await axios.get(
          `${
           
            "http://40.81.226.154:3030/api/v1"
          }/machines/organizations/${orgId}/${machineId}`,
          { headers }
        );
        const machineData = response.data;

        setFormData({
          organizationId: orgId,
          machineId: machineData.machineId || "",
          machineName: machineData.machineName || "",
          machineType: machineData.machineType || "CNC Milling",
          noOfShifts: machineData.noOfShifts || 0,
          shiftTimings: machineData.shiftTimings || [],
          orgInfo: machineData.orgInfo || [],
          shiftNumbers: machineData.noOfShifts || [],
        });

        setUploadedImage(machineData.uploadedImageURL || NoImgAvailable);
        setCertImage(machineData.certificateURL || NoImgAvailable);
      } catch (error) {
        console.error("Error fetching machine data:", error);
      }
    };

    if (isOpen) {
      fetchMachineData();
    }
  }, [isOpen, orgId, machineId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedImage(fileURL);
    }
  };

  const handleCertImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setCertImage(fileURL);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShiftTimingChange = (index, field, value) => {
    const updatedTimings = [...formData.shiftTimings];
    updatedTimings[index] = {
      ...updatedTimings[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      shiftTimings: updatedTimings,
    }));
  };

  const handleOrgInfoChange = (index, field, value) => {
    const updatedOrgInfo = [...formData.orgInfo];
    updatedOrgInfo[index] = {
      ...updatedOrgInfo[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      orgInfo: updatedOrgInfo,
    }));
  };

  const handleSave = async () => {
    const token = authUser?.token; // Use token from context
    if (!token) {
      console.error("No token found. User might be logged out.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const payload = {
        ...formData,
        uploadedImageURL: uploadedImage,
        certificateURL: certImage,
      };

      const response = await axios.put(
        `${
           "http://40.81.226.154:3030/api/v1"
        }/machines/organizations/${orgId}/${machineId}`,
        payload,
        { headers }
      );

      console.log("Machine updated successfully:", response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error updating machine:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
      } else {
        // Something else happened
        console.error("Error:", error.message);
      }
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            <SettingOutlined /> Edit Machine
          </h2>
        </div>

        <form>
          {/* Machine ID */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Machine ID
            </label>
            <input
              type="text"
              value={formData.machineId}
              onChange={(e) => handleInputChange("machineId", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter Machine ID"
            />
          </div>

          {/* Machine Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Machine Name
            </label>
            <input
              type="text"
              value={formData.machineName}
              onChange={(e) => handleInputChange("machineName", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter Machine Name"
              disabled
            />
          </div>

          {/* Machine Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Machine Type
            </label>
            <select
              value={formData.machineType}
              onChange={(e) => handleInputChange("machineType", e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="CNC Milling">CNC Milling</option>
              <option value="Robot">Robot</option>
              <option value="CNC Turning">CNC Turning</option>
              <option value="Energy Meter">Energy Meter</option>
              <option value="Injection Molding">Injection Molding</option>
            </select>
          </div>

          {/* Shift Timings */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Number of Shifts
            </label>
            <select
              value={formData.noOfShifts}
              onChange={(e) => {
                const shifts = parseInt(e.target.value, 10);
                handleInputChange("noOfShifts", shifts);
                handleInputChange(
                  "shiftTimings",
                  Array.from({ length: shifts }, () => ({ start: "", end: "" }))
                );
              }}
              className="w-full px-4 py-2 border rounded-lg"
            >
               {[...Array(shiftNumbers + 1).keys()].map(
                (
                  num // Dynamically create options up to shiftNumbers
                ) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                )
              )}
            </select>
          </div>

          {/* File Uploads */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div className="flex gap-2 items-center justify-end mt-6">
            <button
              className="px-6 py-2 bg-gray-300 text-black rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

const Machine = ({ machineId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="relative group inline-block mt-2">
        <button
          className="px-4 py-2 text-green-500 rounded hover:text-green-600 flex gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <EditOutlined /> <span className="text-xs">Edit</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex items-center px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg">
          Edit
        </div>
      </div>
      <EditMachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        machineId={machineId}
      />
    </div>
  );
};

export default Machine;
