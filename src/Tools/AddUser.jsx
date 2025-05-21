import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../Assets//placeholder.jpg";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, UserPlus, User as UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AddUserModal = ({ isOpen, onClose }) => {
  const { authUser } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [machines, setMachines] = useState([]);
  const API_URL = "http://20.198.22.6:3001";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    phoneNumber: "",
    lineName: [],
  });

  // Handle image uploads
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedImage(file);
      setPreviewImage(fileURL);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle role selection
  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  // Reset form data
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "User",
      lineName: [],
    });
    setUploadedImage(null);
    setPreviewImage(null);
  };
  const orgId = localStorage.getItem("SelectedOrg");

  // Handle save
  const token = authUser?.token;
  const handleSave = async () => {
    if (!token) {
      console.log("Authentication error. Please log in again.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const payload = {
        ...formData,
        uploadImageUrl: uploadedImage ||previewImage || defaultAvatar,
        organizationId:orgId,
      };

      const response = await axios.post(
        `${API_URL}/user/register`,
        payload,
        { headers }
      );

      console.log("User added successfully:", response.data);
      handleReset();
      onClose();
      window.location.reload();
      // Optional: add toast notification for success
    } catch (error) {
      console.error("Error adding user:", error);
      // Optional: add toast notification for error
    }
  };

  // Fetch machines on component mount
  useEffect(() => {
    if (!token) {
      console.log("Authentication error. Please log in again.");
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    const fetchMachines = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/getLines/${orgId}`,
          { headers }
        );

        setMachines(response.data.Lines);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };

    fetchMachines();
  }, []);

  // Handle machine checkbox changes
  const handleMachineCheckboxChange = (e, lineName) => {
    const isChecked = e.target.checked;

    setFormData((prev) => {
      let updatedMachines;

      if (isChecked) {
        updatedMachines = [...prev.lineName, lineName];
      } else {
        updatedMachines = prev.lineName.filter((m) => m !== lineName);
      }

      return {
        ...prev,
        lineName: updatedMachines,
      };
    });
  };

  return (
    
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl bg-slate-50 p-0 rounded-lg">
        <DialogHeader className=" p-4 rounded-t-lg">
          <DialogTitle className="flex items-center text-xl font-medium">
            <UserPlus className="mr-2" size={20} />
            Add New User
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-sky-700 font-medium mb-2 flex items-center">
                <UserIcon className="h-4 w-4 mr-1.5" />
                Personal Information
              </h3>
              <Separator className="mb-4 bg-sky-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-black-700">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 border-sky-100 focus-visible:ring-sky-400"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-black-700">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 border-sky-100 focus-visible:ring-sky-400"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Access & Security Section */}
            <div>
              <h3 className="text-sky-700 font-medium mb-2">Access & Security</h3>
              <Separator className="mb-4 bg-sky-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-black-700">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 border-sky-100 focus-visible:ring-sky-400"
                    placeholder="Create password"
                  />
                  <p className="text-xs text-sky-900 mt-1">
                    Password must be at least 8 characters with uppercase, number, and special character.
                  </p>
                </div>
                <div>
                  <Label htmlFor="role" className="text-black-700">User Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="mt-1 border-black-100 focus-visible:ring-sky-400">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {authUser?.user.role === "SuperAdmin" ? (
                        <>
                          <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="SuperUser">Super User</SelectItem>
                          <SelectItem value="Checksheet">Checksheet</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </>
                      ) : (
                        <SelectItem value="User">User</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="phone" className="text-black-700">Phone Number</Label>
                <Input
                  id="phone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 border-sky-100 focus-visible:ring-sky-400"
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>

            {/* Machine Access Section */}
            <div>
              <h3 className="text-sky-700 font-medium mb-2">Line Access</h3>
              <Separator className="mb-4 bg-sky-100" />

              <Card className="bg-white border-sky-100 shadow-sm">
                <CardContent className="p-4">
                  <Label className="text-black-700 mb-2 block">Selected Lines</Label>
                  <div className="mb-4">
                    <Input
                      placeholder="No machines selected"
                      value={formData.lineName.join(", ")}
                      className="border-sky-100 focus-visible:ring-sky-400 bg-slate-50"
                      readOnly
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-sky-100 rounded-md p-3 bg-slate-50">
                    {machines.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {machines.map((machine) => (
                          machine.machineStatus !== "inactive" && (
                            <div key={machine._id} className="flex items-center space-x-2 mb-1">
                              <Checkbox
                                id={`machine-${machine._id}`}
                                checked={formData.lineName.includes(machine.lineName)}
                                onCheckedChange={(checked) =>
                                  handleMachineCheckboxChange(
                                    { target: { checked } },
                                    machine.lineName
                                  )
                                }
                                className="border-sky-300 data-[state=checked]:bg-sky-500"
                              />
                              <Label
                                htmlFor={`machine-${machine._id}`}
                                className="text-sm text-sky-800"
                              >
                                {machine.lineName}
                              </Label>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-black-500 py-2 text-center">No line available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Image Section */}
            <div>
              <h3 className="text-sky-700 font-medium mb-2">Profile Image</h3>
              <Separator className="mb-4 bg-sky-100" />

              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center overflow-hidden border-2 border-sky-200">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-10 w-10 text-sky-300" />
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border-sky-100 focus-visible:ring-sky-400 file:bg-sky-500 file:text-white file:border-none file:rounded file:py-1 file:px-3 file:mr-3"
                  />
                  <p className="text-xs text-black-600 mt-1">
                    Upload a profile image (optional)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-slate-100 rounded-b-lg border-t border-sky-100">
          <Button
            variant="outline"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="mr-2 border-sky-200 text-sky-700 hover:bg-sky-50 hover:text-sky-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-2">
      <div className="flex justify-between items-center">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default User;
