import {
  CalculatorOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  IdcardOutlined,
  LayoutOutlined,
  NodeIndexOutlined,
  SettingOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AddDevice from "../Tools/AddDevice";
import axios from "axios";

function Device() {
  const [device, setDevice] = useState([]);
  const orgId = localStorage.getItem("SelectedOrg");
  // Fetch organisations from API
  useEffect(() => {
    const token = localStorage.getItem("authToken");
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

    const fetchDevice = async () => {
      try {
        const response = await axios.post(
          `${
           
            "http://40.81.226.154:3030/api/v1"
          }/device/getDevice/${orgId}`,
          {},
          { headers }
        );
        setDevice(response.data);
      } catch (error) {
        console.error("Error fetching Plants:", error);
      }
    };

    fetchDevice();
  }, []);

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-lg font-bold mb-4">Device Management</h2>
          <p className="text-sm text-gray-600">
            Manage all devices effectively from this section.
          </p>
        </div>
        <AddDevice />
      </div>
      {device && device.length === 0 ? (
        <>
           <div className="flex justify-center items-start h-screen">
            No Data Available
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
            {device && device.length === 0 ? (
              "No Device Available"
            ) : (
              <>
                {device.map((device, index) => (
                  <div
                    key={index}
                    className={`bg-white border-2 border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-start gap-2 ${
                      device.status === "Available"
                        ? "border-green-300"
                        : "border-red-300"
                    }`}
                  >
                    <h2
                      className={`text-xs px-2 py-1 rounded-md w-fit h-auto mb-2 ${
                        device.status === "Available"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      <SettingOutlined className="animate-spin" />{" "}
                      {device.status ? device.status : "Unavailable"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      <IdcardOutlined /> <strong>Device ID:</strong>{" "}
                      {device.deviceID}
                    </p>
                    <p className="text-sm text-gray-600 text-center mb-2">
                      <LayoutOutlined /> <strong>Template Type:</strong>{" "}
                      {device.deviceType}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <ClockCircleOutlined /> <strong>Created At:</strong>{" "}
                      {Date(device.createdAt).slice(0, 25)}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <UpCircleOutlined /> <strong>Updated At:</strong>{" "}
                      {Date(device.updatedAt).slice(0, 25)}
                    </p>

                    {/* <div className="flex gap-4 mt-2 items-center justify-center w-full border-t-2">
                      <div className="">
                        <button disabled className="px-4 py-2  rounded">
                          Options :
                        </button>
                      </div> */}
                      {/* Edit Button */}
                      {/* <div className="relative group inline-block">
                        <button className="px-4 py-2 text-green-500 rounded hover:text-green-600">
                          <EditOutlined />
                        </button>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex items-center px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg">
                          Edit
                        </div>
                      </div> */}

                      {/* Delete Button */}
                      {/* <div className="relative group inline-block">
                        <button className="px-4 py-2 text-red-500 rounded hover:text-red-600">
                          <DeleteOutlined />
                        </button>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex items-center px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg">
                          Delete
                        </div>
                      </div> */}
                    {/* </div> */}
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Device;
