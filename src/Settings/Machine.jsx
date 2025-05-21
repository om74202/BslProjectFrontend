import {
  CalculatorOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  GroupOutlined,
  HarmonyOSOutlined,
  IdcardOutlined,
  NodeIndexOutlined,
  NumberOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import AddMachine from "../Tools/AddMachine";
import axios from "axios";
import NoImgAvailable from "../Assets/react.svg";
import EditMachine from "../Edit/EditMachine";
import { useAuth } from "../context/AuthContext";
import { GrRevert } from "react-icons/gr";

function Machine() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuth();
  const [previousLength, setPreviousLength] = useState(0);

  const fetchMachines = useCallback(async () => {
    const token = authUser?.token;
    const orgId =
      authUser?.user.role === "SuperAdmin"
        ? localStorage.getItem("SelectedOrg")
        : localStorage.getItem("OrgId");

    if (!orgId || !token) {
      setError(
        !orgId
          ? "Plant ID not found."
          : "You must be logged in to view Lines."
      );
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        `${
          "http://20.198.22.6:3001/getLines"}/${orgId}`,
        { headers }
      );
console.log('====================================');
console.log(response);
console.log('====================================');
      // Check if the length has changed
      if (response.data.length !== previousLength) {
        setPreviousLength(response.data.length);
        setMachines(response.data.Lines);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching Lines:", error);
      setError(error.response?.data?.message || "Error fetching Lines");
      setLoading(false);
    }
  }, [authUser, previousLength]);

  // Initial fetch
  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  // Set up polling interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMachines();
    }, 20000); // Check every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchMachines]);

  const handleDelete = async (_id, currentStatus) => {
    if (
      !window.confirm("Are you sure you want to change the Line status?")
    ) {
      return;
    }

    const orgId = localStorage.getItem("SelectedOrg");
    const token = authUser?.token;

    if (!token) {
      console.error("No token found. User might be logged out.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const apiUrl = `${
      "http://40.81.226.154:3030/api/v1"
    }/machines/organizations/${orgId}/${_id}`;

    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await axios.delete(apiUrl, {
        headers: headers,
        data: { machineStatus: newStatus }, // Correctly pass the data in the request
      });

      if (response.data) {
        setMachines((prevMachines) =>
          prevMachines.map((machine) =>
            machine._id === _id
              ? { ...machine, machineStatus: newStatus }
              : machine
          )
        );
        alert("Line status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating Line status:", error);
      alert(error.response?.data?.message || "Error updating Line status");
    }
  };

  return (
    <div className="h-screen">
      {/* {machines && machines.length === 0 ? (
        <>
          <div className="flex justify-center items-start h-screen">
            <div className="w-12 h-12 border-4 border-gray-800 border-solid border-t-transparent rounded-full animate-spin"></div>
          </div>
        </>
      ) : ( */}
      <>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-bold mb-4">Line Management</h2>
            <p className="text-sm text-gray-600">
              Manage all lines effectively from this section.
            </p>
          </div>
          {authUser?.user.role === "SuperAdmin" ? <AddMachine /> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-0">
          {machines.map((machine, index) => (
            <div
              key={index}
              className={`bg-white border-2 rounded-lg shadow-md p-4 flex flex-col items-start gap-2 border-gray-800 `}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <h2
                  className={`text-xs px-2 py-1 rounded-md w-fit h-auto ${
                    machine.machineStatus === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <div className="flex gap-2">
                    <SettingOutlined className="animate-spin" />
                    <span className="capitalize">
                      {machine.machineStatus
                        ? machine.machineStatus
                        : "inactive"}
                    </span>
                  </div>
                </h2>
                {machine.status === "Available" ? null : (
                  <h2
                    className={`text-xs px-2 py-1 rounded-md w-fit h-auto bg-yellow-100 text-gray-800 animate-pulse`}
                  >
                    <ExclamationCircleOutlined /> Last Updated :{" "}
                    {Date(machine.updatedAt).slice(0, 15)}
                  </h2>
                )}
              </div>
              <div className="flex items-center w-full justify-around border-b-2 mb-4">
                <img
                  src={
                    machine.uploadedImageURL === undefined || NoImgAvailable
                      ? NoImgAvailable
                      : machine.uploadedImageURL
                  }
                  alt={`${machine.organisationName} Logo`}
                  className="w-24 h-24 rounded-full mb-4"
                />

                <div className="flex-col">
                  <p className="text-lg text-gray-600 mb-2">
                    <strong>Machine:</strong> {machine.machineName}
                  </p>
                  <h3 className="text-xs text-gray-600">
                    <strong>Org Id:</strong> {machine.organizationId}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <IdcardOutlined /> <strong>Line ID:</strong>{" "}
                {machine.machineId}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <GroupOutlined /> <strong>Line Type:</strong>{" "}
                {machine.machineType}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <NumberOutlined /> <strong>Total No. of Shifts :</strong>{" "}
                {machine.noOfShifts}
              </p>

              <div className="flex items-center justify-center gap-4 mt-3 border-t-2 w-full">
                {/* Nodes Button */}
                {/* <div className="relative group inline-block mt-2">
                    <button className="px-4 py-2 text-pink-500 rounded hover:text-pink-600">
                      <NodeIndexOutlined />
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex items-center px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg">
                      Nodes
                    </div>
                  </div> */}

                {/* Formulas Button */}
                {/* <div className="relative group inline-block mt-2">
                    <button className="px-4 py-2 text-orange-500 rounded hover:text-orange-600">
                      <CalculatorOutlined />
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex items-center px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg">
                      Formulas
                    </div>
                  </div> */}

                {/* Edit Button */}
              <div className="flex gap-2 items-center justify-center">
              <EditMachine machineId={machine._id} />

{/* Delete Button */}
{machine.machineStatus === "inactive" ? (
  <button
    className="px-4 mt-1 text-pink-500 rounded hover:text-pink-600 flex gap-1"
    title="Delete"
    onClick={() =>
      handleDelete(machine._id, machine.machineStatus)
    }
  >
    <GrRevert /> <span className="text-xs">Revert</span>
  </button>
) : (
  <>
    <button
      className="px-4 mt-1 text-red-500 rounded hover:text-red-600 flex gap-1"
      title="Delete"
      onClick={() =>
        handleDelete(machine._id, machine.machineStatus)
      }
    >
      <DeleteOutlined /> <span className="text-xs">Delete</span>
    </button>
  </>
)}
              </div>
              </div>
            </div>
          ))}
        </div>
      </>
      {/* )} */}
    </div>
  );
}

export default Machine;
