import {
  SettingOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AddOrganisation from "../Tools/AddOrganisation";
import { Link } from "react-router-dom";
import axios from "axios";
import NoImgAvailable from "../Assets/react.svg";
import EditOrgModal from "../Edit/EditOrganization";
import { useAuth } from "../context/AuthContext";

function Organisation() {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();

  // Fetch organisations from API
  useEffect(() => {
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

 
    const fetchOrganisations = async () => {
      try {
        const response = await axios.get(
            "http://20.198.22.6:3001/org/getOrganization"
          ,
          { headers }
        );
        
        setOrganisations(response.data.organization);
      } catch (error) {
        setOrganisations([]);
        console.error("Error fetching Plant:", error);
      }
      finally {
        setLoading(false); 
      }
    };

   fetchOrganisations();
  }, []);


  const handleCardClick = (_id, orgInfo, name, shiftCount) => {
    localStorage.setItem("SelectedOrg", _id);
    localStorage.setItem("OrgName", name);
    localStorage.setItem("Shifts", shiftCount);
  };

  return (
    <div className="h-screen">
      {loading ? (
        
        <div className="flex justify-center items-start h-screen">
          <div className="w-12 h-12 border-4 border-gray-800 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : organisations.length === 0 ? (
        // Show "No Plant found" and Add button
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-lg font-semibold mb-4">No Plant found</p>
          <AddOrganisation />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-bold mb-4">
                Plants Management
              </h2>
              <p className="text-sm text-gray-600">
                Manage all Plants effectively from this section.
              </p>
            </div>
            <AddOrganisation />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
            {organisations.map((org) => (
            
                <div
                  key={org.id}
                  className={`ml-2 bg-white border-2 rounded-lg shadow-md border-green-300`}
                  onClick={() =>
                    handleCardClick(
                      org.id,
                      org.orgInfo,
                      org.name,
                      org.shiftCount
                    )
                  }
                >
                  <div className="flex items-center justify-between gap-2 w-full p-2">
                    <h2
                      className={`text-xs px-2 py-1 rounded-md w-fit h-auto bg-green-100 text-gray-800`}
                    >
                      <SettingOutlined className="animate-spin" /> Online
                    </h2>
                  </div>
                <Link to={`/dashboard/settings/${org.id}`} >
                    <div className="flex items-center w-full justify-around">
                      <img
                        src={
                          org.uploadedImage === undefined || NoImgAvailable
                            ? NoImgAvailable
                            : org.uploadedImage
                        }
                        alt={`${org.name.slice(0, 1)}`}
                        className="w-24 h-24 rounded-full mb-4"
                      />

                      <div className="flex-col">
                        <h3 className="text-lg font-bold mb-2">{org.name}</h3>
                        <p className="text-sm text-gray-600r">{org.address}</p>
                      </div>
                    </div>
                    <p className="w-full text-sm text-gray-600 text-center">
                      Total Number of Shifts : <strong>{org.noOfShifts}</strong>
                    </p>
                  </Link>

                  <div className="flex gap-4 mt-4 border-t-2 w-full items-center justify-center">
                    <p className="text-gray-800 text-sm">Options :</p>
                    <EditOrgModal orgId={org.id} />
                    {/* <button
                      className="px-4 py-2 text-red-500 rounded hover:text-red-600"
                      title="Delete"
                    >
                      <DeleteOutlined />
                    </button> */}
                  </div>
                </div>
              
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Organisation;
