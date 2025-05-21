import { BankOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import NoImgAvailable from "../Assets/react.svg";
import { useAuth } from "../context/AuthContext";

const EditOrgModal = ({ isOpen, onClose, orgId }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const { authUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    noOfShifts: 0,
    shiftTimings: [],
    orgInfo: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch organization data by ID
  useEffect(() => {
    const fetchOrganization = async () => {
      if (!orgId || !isOpen) return;
      const token = authUser?.token
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
        setLoading(true);
        const response = await axios.get(
          `${ "http://40.81.226.154:3030/api/v1"}/organise/organizations/${orgId}`,
          { headers }
        );

        const orgData = response.data;

        setFormData({
          name: orgData.name || "",
          address: orgData.address || "",
          noOfShifts: orgData.noOfShifts || 0,
          shiftTimings: orgData.shiftTimings || [],
          orgInfo: orgData.orgInfo || [],
        });

        setUploadedImage(orgData.uploadedImage || NoImgAvailable);
        console.log(orgData)
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [orgId, isOpen]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedImage(fileURL);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftTimingChange = (index, field, value) => {
    const updatedTimings = [...formData.shiftTimings];
    updatedTimings[index] = {
      ...updatedTimings[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, shiftTimings: updatedTimings }));
  };

  const handleOrgInfoChange = (index, field, value) => {
    const updatedOrgInfo = [...formData.orgInfo];
    updatedOrgInfo[index] = {
      ...updatedOrgInfo[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, orgInfo: updatedOrgInfo }));
  };

  const addOrgInfoEntry = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      orgInfo: [...prev.orgInfo, { unit: "", department: "", designation: "" }],
    }));
  };

  const updateFormData = async () => {
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
        name: formData.name,
        address: formData.address,
        noOfShifts: formData.noOfShifts,
        shiftTimings: formData.shiftTimings.map((timing, index) => ({
          shiftNumber: index + 1,
          start: timing.start,
          lunchTime: timing.lunchTime || "",
          teaTime: timing.teaTime || "",
          end: timing.end,
        })),
        orgInfo: formData.orgInfo,
        uploadedImage: uploadedImage || NoImgAvailable,
      };

      const response = await axios.put(
        `${ "http://40.81.226.154:3030/api/v1"}/organise/organizations/${orgId}`,
        payload,
        {headers}
      );
      console.log("Organization updated successfully:", response.data);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-lg w-1/2 p-6 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          <BankOutlined /> Edit Organisation
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium pb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded-lg p-2 file:bg-gray-200 file:border-none file:rounded file:py-1 file:px-2 file:cursor-pointer mb-4"
              />
              {uploadedImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Preview:</p>
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">No. of Shifts</label>
              <input
                type="number"
                name="noOfShifts"
                value={formData.noOfShifts}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    noOfShifts: parseInt(e.target.value, 10),
                    shiftTimings: Array.from(
                      { length: parseInt(e.target.value, 10) },
                      () => ({
                        start: "",
                        lunchTime: "",
                        teaTime: "",
                        end: "",
                      })
                    ),
                  }))
                }
                className="w-full border rounded-lg p-2"
              />
            </div>
            {formData.shiftTimings.map((timing, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-medium">Shift {index + 1}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={timing.start || ""}
                      onChange={(e) =>
                        handleShiftTimingChange(index, "start", e.target.value)
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={timing.end || ""}
                      onChange={(e) =>
                        handleShiftTimingChange(index, "end", e.target.value)
                      }
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={updateFormData}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Organisation = ({ orgId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
        className="px-4 py-2 text-green-500 rounded hover:text-green-600"
        title="Edit"
        onClick={() => setIsModalOpen(true)}
      >
        <EditOutlined />
      </button>
      <EditOrgModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orgId={orgId}
      />
    </div>
  );
};

export default Organisation;
