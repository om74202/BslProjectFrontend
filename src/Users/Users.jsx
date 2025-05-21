import {
  BlockOutlined,
  CompassOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  EyeInvisibleFilled,
  ImportOutlined,
  MailOutlined,
  PhoneOutlined,
  RadarChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AddUser from "../Tools/AddUser";
import axios from "axios";
import NoImgAvailable from "../Assets/react.svg";
import { useAuth } from "../context/AuthContext";

function User() {
  const [userData, setUserData] = useState([]);
  const orgId = localStorage.getItem("OrgId");
  const [viewShiftMap, setViewShiftMap] = useState({}); // Track visibility per machine

  const toggleMachineVisibility = (machineId) => {
    setViewShiftMap((prev) => ({
      ...prev,
      [machineId]: !prev[machineId], // Toggle visibility only for the clicked machine
    }));
  };

  

  const { authUser } = useAuth();
  // Fetch organisations from API
  useEffect(() => {
    const token = authUser?.token;

    console.log(token);

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

    const fetchUser = async () => {
      try {
        if (authUser?.user.role === "Admin") {
          const response = await axios.get(
            `${
             
              "http://20.198.22.6:3001:3001/user"
            }/getUser/${orgId}`,
            {},
            { headers }
          );
          console.log("API Response (Admin):", response.data); // Debugging
          setUserData(Array.isArray(response.data) ? response.data : []);
        } else if (authUser?.user.role === "SuperAdmin") {
          const response = await axios.get(
            "http://20.198.22.6:3001/user/getUser",
            {},
            { headers }
          );
          console.log("API Response (SuperAdmin):", response.data.users); // Debugging
          setUserData(
            Array.isArray(response.data.users) ? response.data.users : []
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUserData([]);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="h-screen">
      {userData && userData.length === 0 ? (
        <>
          <div className="flex justify-center items-start h-screen">
            <div className="w-12 h-12 border-4 border-gray-800 border-solid border-t-transparent rounded-full animate-spin"></div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8 p-6">
            <div>
              <h2 className="text-lg font-bold mb-4">User Management</h2>
              <p className="text-sm text-gray-600">
                Manage all users effectively from this section.
              </p>
            </div>
            {/* <AddUser /> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.map((user, index) => (
              <div
                key={index}
                className={`bg-white border-2 border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-start gap-2 ${
                  user.role === "SuperAdmin"
                    ? "border-red-300 "
                    : user.role === "Admin"
                    ? "border-blue-600"
                    : user.role === "User"
                    ? "border-green-300"
                    : null
                }`}
              >
                <h2
                  className={`text-xs px-2 py-1 rounded-md w-fit h-fit ${
                    user.role === "SuperAdmin"
                      ? "bg-red-100 text-red-600"
                      : user.role === "Admin"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  <UserOutlined /> {user.role}
                </h2>

                <div className="flex items-center gap-4 border-b-2 mb-4">
                  <img
                    src={user.image === undefined ? NoImgAvailable : user.image}
                    alt={`${user.name} Avatar`}
                    className="w-24 h-24 rounded-full mb-4"
                  />

                  <div
                    key={user._id}
                    className="flex items-center space-x-2 w-44"
                  >
                    <p className="mr-2"><RadarChartOutlined /> Machine Granted</p>
                    {viewShiftMap[user._id] ? (
                      <>
                        <EyeInvisibleFilled
                          className="text-xs text-green-600 cursor-pointer"
                          onClick={() => toggleMachineVisibility(user._id)}
                        />

                        <br />
                      </>
                    ) : (
                      <>
                        <EyeFilled
                          className="text-xs text-green-600 cursor-pointer"
                          onClick={() => toggleMachineVisibility(user._id)}
                        />
                        {/* Show placeholder when hidden */}
                      </>
                    )}
                  </div>
                </div>
                {viewShiftMap[user._id] ? (
                  <div className="">
                    {user.machines.map((item, index) => {
                      return (
                        <>
                          <p key={item.machineId} className="text-sm pb-2">
                            <strong>{index+1}. {item.machineName}</strong>{" "}
                          </p>
                          
                        </>
                      );
                    })}
                  </div>
                ) : null}
                <p className="text-sm text-gray-600 mb-2 ">
                  <strong>
                    <MailOutlined /> Email:
                  </strong>{" "}
                  {user.email}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>
                    <PhoneOutlined /> Phone:
                  </strong>{" "}
                  {user.phone}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>
                    <BlockOutlined /> Organisation:
                  </strong>{" "}
                  {user.selectOrg}
                </p>
                {/* <p className="text-sm text-gray-600">
                  <strong>
                    <CompassOutlined /> Address:
                  </strong>{" "}
                  {user.address}
                </p> */}
                {/* <p className="text-sm text-gray-600">
              <strong>Machine Granted:</strong> {user.machineGranted}
            </p> */}

               
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default User;
