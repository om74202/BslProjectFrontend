import {
  BlockOutlined,
  CompassOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  ImportOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AddUser from "../Tools/AddUser";
import axios from "axios";
import NoImgAvailable from "../Assets/react.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GrRevert } from "react-icons/gr";


function User() {
  const [userData, setUserData] = useState([]);
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);


  const orgId =
    authUser?.user.role === "SuperAdmin"
      ? localStorage.getItem("SelectedOrg")
      : localStorage.getItem("OrgId");
  console.log(orgId);

  // Fetch organisations from API
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const token = authUser?.token;

      if (!token) {
        console.error("No token found in LocalStorage. User might be logged out.");
        setIsLoading(false);
        return;
      }

      if (!orgId) {
        console.error("No Plant ID found");
        setIsLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.post(
          `${
            "http://40.81.226.154:3030/api/v1"
          }/user/getUser/${orgId}`,
          {},
          { headers }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [authUser, orgId]);

  const navigate = useNavigate();

  const handleDelete = async (_id, currentStatus) => {
    if (!window.confirm("Are you sure you want to change the user status?")) {
      return; // If user cancels, do nothing
    }


    const token = authUser?.token;
    const orgId = authUser?.user.role === "SuperAdmin" ? localStorage.getItem("SelectedOrg") : localStorage.getItem("OrgId")
    if (!token) {
      console.error("No token found. User might be logged out.");
      return;
    }

    const apiUrl = `${
     "http://40.81.226.154:3030/api/v1"
    }/user/deleteUser/${orgId}/${_id}`;

    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await axios.post(
        apiUrl,
        { userStatus: newStatus }, // Send updated status in request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUserData((prevUsers) =>
        prevUsers.map((user) =>
          user._id === _id ? { ...user, userStatus: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-lg font-bold mb-4">User Management</h2>
          <p className="text-sm text-gray-600">
            Manage all users effectively from this section.
          </p>
        </div>
        <AddUser />
      </div>
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.map((user, index) => (
              <div
                key={index}
                className={`bg-white border-2 border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-start gap-2 ${
                  user.role === "SuperAdmin"
                    ? "border-red-300 "
                    : user.role === "Admin"
                    ? "border-blue-300"
                    : user.role === "User"
                    ? "border-green-300"
                    : null
                }`}
              >
                <h2
                  className={`text-xs px-2 py-1 rounded-md w-fit h-full ${
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

                  <div className="">
                    <h3 className="text-lg font-bold mb-2 flex">
                      {user.name}{" "}
                    </h3>
                    <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2">
                      <ImportOutlined /> Status :{" "}
                      <h3 className={`mt-0.5 cursor-pointer capitalize ${user.userStatus === "active" ? "text-green-600" : "text-red-600"}`}>
                        {user.userStatus}
                      </h3>
                    </h3>
                  </div>
                </div>
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

                <div className="flex items-center gap-4 mt-4 border-t-2 w-full justify-center">
                  {/* Edit Button */}
                  <p className="text-gray-800">Options :</p>
                  {user.userStatus === "inactive" ? <button
                        className="px-4 py-4 text-pink-500 rounded hover:text-pink-600 flex gap-1"
                        title="Delete"
                        onClick={() => handleDelete(user._id, user.userStatus)}
                      >
                        <GrRevert /> <span className="text-xs">Revert</span>
                      </button> : (
                    <>
                      <button
                        className="px-4 py-2 text-red-500 rounded hover:text-red-600"
                        title="Delete"
                        onClick={() => handleDelete(user._id, user.userStatus)}
                      >
                        <DeleteOutlined /> <span className="text-xs">Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
    </div>
  );
}

export default User;
