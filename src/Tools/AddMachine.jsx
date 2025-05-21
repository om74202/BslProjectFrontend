import React, { useEffect, useState } from "react";
import axios from "axios";
import NoImgAvailable from "../Assets/react.svg";
import { useAuth } from "../context/AuthContext";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Import Lucide icons
import { Plus, Settings, Coffee, X, Upload, Clock } from "lucide-react";

const AddMachineModal = ({ isOpen, onClose }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const orgIdOther = localStorage.getItem("SelectedOrg");
  const shiftNumbers = parseInt(localStorage.getItem("Shifts"), 10) || 0;

  const [formData, setFormData] = useState({
    lineId: "",
    lineName: "",
    lineType: "", // Default value
    noOfShifts: 0,
    noOfCustomShifts: 0,
    customShiftsTimings: [{ start: "", end: "", plannedBreakCustom: [] }],
    noOfStations: 0,
    stations: [{ name: "", Pokayoke: false }],
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedImage(fileURL);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomShiftTimingChange = (index, field, value) => {
    const updatedTimings = [...formData.customShiftsTimings];
    updatedTimings[index] = {
      ...updatedTimings[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, customShiftsTimings: updatedTimings }));
  };

  const handlePlannedBreakChange = (shiftIndex, breakIndex, field, value) => {
    const updatedTimings = [...formData.customShiftsTimings];
    const breaks = updatedTimings[shiftIndex].plannedBreakCustom || [];
    breaks[breakIndex] = { ...breaks[breakIndex], [field]: value };
    updatedTimings[shiftIndex].plannedBreakCustom = breaks;
    setFormData((prev) => ({ ...prev, customShiftsTimings: updatedTimings }));
  };

  const handleshiftCountChange = (value) => {
    const numShifts = parseInt(value, 10);
    const updatedTimings = Array.from({ length: numShifts }, (_, index) => ({
      ...formData.customShiftsTimings[index], // Keep existing data for already defined shifts
      start: formData.customShiftsTimings[index]?.start || "",
      end: formData.customShiftsTimings[index]?.end || "",
      plannedBreakCustom: formData.customShiftsTimings[index]?.plannedBreakCustom || [],
    }));
    setFormData((prev) => ({
      ...prev,
      noOfCustomShifts: numShifts,
      customShiftsTimings: updatedTimings,
    }));
  };

  const handlenoOfStationsChange = (value) => {
    const numStations = parseInt(value, 10);
    const updatedStations = Array.from({ length: numStations }, (_, index) => ({
      ...formData.stations[index], // Keep existing data for already defined stations
      name: formData.stations[index]?.name || "",
      Pokayoke: formData.stations[index]?.Pokayoke || false,
    }));
    setFormData((prev) => ({
      ...prev,
      noOfStations: numStations,
      stations: updatedStations,
    }));
  };

  const handleStationChange = (index, field, value) => {
    const updatedStations = [...formData.stations];
    updatedStations[index] = {
      ...updatedStations[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, stations: updatedStations }));
  };

  const { authUser } = useAuth();

  const handleSave = async () => {
    const token = authUser?.token;
    if (!token) {
      console.log("Authentication error. Please log in again.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
  
      if (authUser?.user.role === "SuperAdmin") {
        const payload = {
          ...formData,
          imageURL: uploadedImage || NoImgAvailable,
          organizationId:orgIdOther,
        };
        console.log(payload);
      const response = await axios.post(
        "http://20.198.22.6:3001/createLine",
        payload,
        { headers }
      );

      console.log("Line added successfully:", response.data);
      onClose();
      window.location.reload();
    }
    } catch (error) {
      console.error("Error adding Line:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-3/4 max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <Settings className="h-5 w-5" />
            Add Line
          </DialogTitle>
          <DialogDescription>
            Configure your Line details and settings
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Machine Details Section */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 pb-3">
              <CardTitle className="text-lg text-blue-700">Line Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lineId" className="text-sm font-medium">
                    Line ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lineId"
                    value={formData.lineId}
                    onChange={(e) => handleInputChange("lineId", e.target.value)}
                    placeholder="Enter Line ID"
                    className="border-blue-100"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lineName" className="text-sm font-medium">
                    Line Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lineName"
                    value={formData.lineName}
                    onChange={(e) => handleInputChange("lineName", e.target.value)}
                    placeholder="Enter Line Name"
                    className="border-blue-100"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lineType" className="text-sm font-medium">
                    Line Type
                  </Label>
                  <Select
                    value={
                      formData.lineType == "" ? "" : formData.lineType
                    }
                    onValueChange={(value) => handleInputChange("lineType", value)}
                  >
                    <SelectTrigger className="border-blue-100">
                      <SelectValue placeholder="Select Line type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Front Seat">Front Seat</SelectItem>
                      <SelectItem value="Rear Cushion">Rear Cushion</SelectItem>
                      <SelectItem value="Rear Back">Rear Back</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Station Configuration Section */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 pb-3">
              <CardTitle className="text-lg text-blue-700">Station Configuration</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="noOfStations" className="text-sm font-medium">
                    Number of Stations <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="noOfStations"
                    type="number"
                    min= "0"
                    value={formData.noOfStations}
                    onChange={(e) => handlenoOfStationsChange(e.target.value)}
                    placeholder="Enter number of stations"
                    className="border-blue-100"
                  />
                </div>

                {formData.noOfStations > 0 && (
                  <div className="space-y-4 mt-2">
                    {formData.stations.map((station, index) => (
                      <Card key={index} className="border-blue-100 shadow-sm">
                        <CardHeader className="bg-blue-50 py-2">
                          <CardTitle className="text-md flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Station {index + 1}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                              <Label className="text-sm">Station Name</Label>
                              <Input
                                value={station.name}
                                onChange={(e) =>
                                  handleStationChange(index, "name", e.target.value)
                                }
                                className="border-blue-100"
                                placeholder="Enter station name"
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label className="text-sm">Pokayoke Station</Label>
                              <Select
                                value={station.Pokayoke.toString()}
                                onValueChange={(value) =>
                                  handleStationChange(index, "Pokayoke", value === "true")
                                }
                              >
                                <SelectTrigger className="border-blue-100">
                                  <SelectValue placeholder="Is this station critical?" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shift Configuration Section */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 pb-3">
              <CardTitle className="text-lg text-blue-700">Shift Configuration</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="noOfShifts" className="text-sm font-medium">
                    Number of Shifts
                  </Label>
                  <Select
                    value={formData.noOfShifts.toString()}
                    onValueChange={(value) => {
                      const shifts = parseInt(value, 10);
                      handleInputChange("noOfShifts", shifts);
                    }}
                  >
                    <SelectTrigger className="border-blue-100">
                      <SelectValue placeholder="Select number of shifts" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(shiftNumbers + 1).keys()].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="noOfCustomShifts" className="text-sm font-medium">
                    No. of Custom Shifts <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={
                      formData.noOfCustomShifts === 0 ? "" : formData.noOfCustomShifts.toString()
                  }
                    onValueChange={(value) => handleshiftCountChange(value)}
                  >
                    <SelectTrigger className="border-blue-100">
                      <SelectValue placeholder="Select number of custom shifts" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.noOfCustomShifts > 0 && (
                  <div className="space-y-4 mt-2">
                    {formData.customShiftsTimings.map((shift, index) => (
                      <Card key={index} className="border-blue-100 shadow-sm">
                        <CardHeader className="bg-blue-50 py-2">
                          <CardTitle className="text-md flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Shift {index + 1}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              onClick={(e) => {
                                e.preventDefault();
                                const updatedTimings = [...formData.customShiftsTimings];
                                updatedTimings[index].plannedBreakCustom = updatedTimings[index].plannedBreakCustom || [];
                                updatedTimings[index].plannedBreakCustom.push({
                                  start: "",
                                  end: "",
                                  typeOfBreak: "",
                                });
                                setFormData((prev) => ({
                                  ...prev,
                                  customShiftsTimings: updatedTimings,
                                }));
                              }}
                            >
                              <Coffee className="h-4 w-4 mr-1" /> Add Break
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-1.5">
                                <Label className="text-sm">Start Time</Label>
                                <Input
                                  type="time"
                                  value={shift.start}
                                  onChange={(e) =>
                                    handleCustomShiftTimingChange(index, "start", e.target.value)
                                  }
                                  className="border-blue-100"
                                />
                              </div>
                              <div className="grid gap-1.5">
                                <Label className="text-sm">End Time</Label>
                                <Input
                                  type="time"
                                  value={shift.end}
                                  onChange={(e) =>
                                    handleCustomShiftTimingChange(index, "end", e.target.value)
                                  }
                                  className="border-blue-100"
                                />
                              </div>
                            </div>

                            {shift.plannedBreakCustom?.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium mb-2 text-blue-700">Planned Breaks</h4>
                                {shift.plannedBreakCustom.map((plannedBreak, breakIndex) => (
                                  <div
                                    key={breakIndex}
                                    className="grid grid-cols-7 gap-2 mb-2 items-center"
                                  >
                                    <div className="col-span-2">
                                      <Input
                                        type="time"
                                        value={plannedBreak.start}
                                        onChange={(e) =>
                                          handlePlannedBreakChange(
                                            index,
                                            breakIndex,
                                            "start",
                                            e.target.value
                                          )
                                        }
                                        className="border-blue-100"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <Input
                                        type="time"
                                        value={plannedBreak.end}
                                        onChange={(e) =>
                                          handlePlannedBreakChange(
                                            index,
                                            breakIndex,
                                            "end",
                                            e.target.value
                                          )
                                        }
                                        className="border-blue-100"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <Select
                                        value={plannedBreak.typeOfBreak || ""}
                                        onValueChange={(value) =>
                                          handlePlannedBreakChange(
                                            index,
                                            breakIndex,
                                            "typeOfBreak",
                                            value
                                          )
                                        }
                                      >
                                        <SelectTrigger className="border-blue-100">
                                          <SelectValue placeholder="Break Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                                          <SelectItem value="Lunch">Lunch</SelectItem>
                                          <SelectItem value="Tea">Tea</SelectItem>
                                          <SelectItem value="Dinner">Dinner</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const updatedTimings = [...formData.customShiftsTimings];
                                        updatedTimings[index].plannedBreakCustom.splice(breakIndex, 1);
                                        setFormData((prev) => ({
                                          ...prev,
                                          customShiftsTimings: updatedTimings,
                                        }));
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 pb-3">
              <CardTitle className="text-lg text-blue-700">Line Image</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="image-upload" className="text-sm font-medium">
                    Upload Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="border-blue-100 file:bg-blue-50 file:border-none file:text-blue-600 file:rounded file:font-medium"
                    />
                    {uploadedImage && (
                      <div className="w-16 h-16 relative">
                        <img
                          src={uploadedImage}
                          alt="Uploaded preview"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Line
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Machine = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-4 w-4" />
        Add Line
      </Button>
      <AddMachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Machine;
