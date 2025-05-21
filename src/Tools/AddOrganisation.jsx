import { useState } from "react";
import {
  Building,
  Plus,
  Trash2,
  Copy,
  Clock,
  Coffee,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import placeholderImg from "../Assets/placeholder.jpg";
import { useAuth } from "../context/AuthContext";


const AddOrganizationModal = ({ isOpen, onClose }) => {
  const { authUser } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    shiftNumber: 1,
    shifts: [{
      start: "",
      end: "",
      plannedBreaks: []
    }],
    unit: "",
    Department: "",
    Desingation: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const fileURL = URL.createObjectURL(file);
      setImagePreview(fileURL);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftTimingChange = (index, field, value) => {
    const normalizedTime = value.padStart(5, "0").slice(0, 5); // Ensures HH:MM format
    const updatedShifts = [...formData.shifts];
    updatedShifts[index] = {
      ...updatedShifts[index],
      [field]: normalizedTime,
    };
    setFormData((prev) => ({ ...prev, shifts: updatedShifts }));
  };

  const handlePlannedBreakChange = (shiftIndex, breakIndex, field, value) => {
    const updatedShifts = [...formData.shifts];

    // Ensure plannedBreaks array exists
    if (!updatedShifts[shiftIndex].plannedBreaks) {
      updatedShifts[shiftIndex].plannedBreaks = [];
    }

    // Ensure the break object exists at the specified index
    if (!updatedShifts[shiftIndex].plannedBreaks[breakIndex]) {
      updatedShifts[shiftIndex].plannedBreaks[breakIndex] = {
        start: "",
        end: "",
        typeOfBreak: "",
      };
    }

    // If it's a time field, normalize it
    if (field === "start" || field === "end") {
      value = value.padStart(5, "0").slice(0, 5); // Ensures HH:MM format
    }

    // Update the specific field
    updatedShifts[shiftIndex].plannedBreaks[breakIndex] = {
      ...updatedShifts[shiftIndex].plannedBreaks[breakIndex],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      shifts: updatedShifts,
    }));
  };

  const handleShiftNumberChange = (value) => {
    const numShifts = parseInt(value, 10);
    const updatedShifts = Array.from({ length: numShifts }, (_, index) => ({
      ...formData.shifts[index], // Keep existing data for already defined shifts
      start: formData.shifts[index]?.start || "",
      end: formData.shifts[index]?.end || "",
      plannedBreaks: formData.shifts[index]?.plannedBreaks || [],
    }));
    setFormData((prev) => ({
      ...prev,
      shiftNumber: numShifts,
      shifts: updatedShifts,
    }));
  };

  const addPlannedBreak = (shiftIndex) => {
    const updatedShifts = [...formData.shifts];
    const breaks = updatedShifts[shiftIndex].plannedBreaks || [];

    if (breaks.length < 5) {
      breaks.push({ start: "", end: "", typeOfBreak: "" });
      updatedShifts[shiftIndex].plannedBreaks = breaks;
      setFormData((prev) => ({ ...prev, shifts: updatedShifts }));
    }
  };

  const removePlannedBreak = (shiftIndex, breakIndex) => {
    const updatedShifts = [...formData.shifts];
    updatedShifts[shiftIndex].plannedBreaks.splice(breakIndex, 1);
    setFormData((prev) => ({ ...prev, shifts: updatedShifts }));
  };

  const validateBreakTimes = () => {
    // Reset previous errors
    setError("");

    for (const shift of formData.shifts) {
      for (const breakTime of shift.plannedBreaks || []) {
        // Skip validation if break times are not set
        if (!breakTime.start || !breakTime.end) continue;

        // Convert times to minutes for easier comparison
        const convertToMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return hours * 60 + minutes;
        };

        const shiftStart = convertToMinutes(shift.start);
        const shiftEnd = convertToMinutes(shift.end);
        const breakStart = convertToMinutes(breakTime.start);
        const breakEnd = convertToMinutes(breakTime.end);

        // Check if it's an overnight shift (end time is less than start time)
        const isOvernightShift = shiftEnd <= shiftStart;

        if (isOvernightShift) {
          // For overnight shifts
          const adjustedShiftEnd = shiftEnd + (24 * 60); // Add 24 hours in minutes

          // For breaks after midnight, add 24 hours to both start and end
          if (breakStart < shiftStart) {
            if (breakStart + (24 * 60) <= adjustedShiftEnd &&
              breakEnd + (24 * 60) <= adjustedShiftEnd) {
              continue; // Break is valid
            }
          } else {
            // For breaks before midnight
            if (breakStart >= shiftStart && breakEnd <= (24 * 60)) {
              continue; // Break is valid
            }
          }
          setError("Break times must be within shift's start and end times.");
          return false;
        } else {
          // For regular shifts, simple comparison
          if (breakStart < shiftStart || breakEnd > shiftEnd) {
            setError("Break times must be within shift's start and end times.");
            return false;
          }
        }

        // Validate that break end comes after break start
        if (breakEnd < breakStart && !isOvernightShift) {
          setError("Break end time must be after break start time.");
          return false;
        }
      }
    }

    return true;
  };

  const validateForm = () => {
    if (!formData.name) {
      setError("Organization name is required");
      return false;
    }

    if (!formData.email) {
      setError("Email is required");
      return false;
    }

    if (!formData.phoneNumber) {
      setError("Phone number is required");
      return false;
    }

    if (!formData.unit) {
      setError("Unit name is required");
      return false;
    }

    for (const shift of formData.shifts) {
      if (!shift.start || !shift.end) {
        setError("All shift times must be filled");
        return false;
      }
    }

    return validateBreakTimes();
  };

  const saveFormData = async () => {

    if (!validateForm()) {
      return;
    }
    const token = authUser?.token;
    if (!token) {
      setError("Authentication error. Please log in again.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        shiftCount: formData.shiftNumber,
        shifts: formData.shifts,
        unit: formData.unit,
        Department: formData.Department,
        Desingation: formData.Desingation,
        imageUrl: imagePreview || placeholderImg,
      };
     
      const response = await axios.post(
        `http://20.198.22.6:3001/org/createOrganization`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Response:", response.data);
      resetForm();
      onClose();
      window.location.reload();
      // You might want to trigger a refresh or notification here
    } catch (error) {
      console.error("Error saving data:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      phoneNumber: "",
      shiftNumber: 1,
      shifts: [{
        start: "",
        end: "",
        plannedBreaks: []
      }],
      unit: "",
      Department: "",
      Desingation: "",
    });
    setUploadedImage(null);
    setImagePreview(null);
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-50 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2 text-blue-600">
            <Building className="h-5 w-5" /> Add Plant
          </DialogTitle>
          <DialogDescription>
            Create a new Plant with associated shifts and department information.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Organization Image */}
          <div className="flex flex-col items-center justify-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={imagePreview || placeholderImg} alt="plant logo" />
              <AvatarFallback className="bg-blue-100 text-blue-600">ORG</AvatarFallback>
            </Avatar>
            <Label htmlFor="image-upload" className="cursor-pointer text-blue-500 hover:text-blue-700">
              Upload Logo
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div>
              <Label htmlFor="name" className="text-slate-700 mb-1">
                Plant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white border-slate-200"
                placeholder="Enter Plant name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-700 mb-1 block">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white border-slate-200"
                placeholder="contact@plant.com"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="bg-white border-slate-200"
                placeholder="+XX XXX XXX XXXX"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-slate-700 mb-1">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="bg-white border-slate-200"
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Department Information */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-blue-600 flex items-center gap-2">
                <Building className="h-4 w-4" /> Department Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="unit" className="text-slate-700 mb-1">
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="bg-white border-slate-200"
                  placeholder="e.g. Research"
                />
              </div>

              <div>
                <Label htmlFor="Department" className="text-slate-700 mb-1">
                  Department
                </Label>
                <Input
                  id="Department"
                  name="Department"
                  value={formData.Department}
                  onChange={handleInputChange}
                  className="bg-white border-slate-200"
                  placeholder="e.g. IT"
                />
              </div>

              <div>
                <Label htmlFor="Desingation" className="text-slate-700 mb-1">
                  Designation
                </Label>
                <Input
                  id="Desingation"
                  name="Desingation"
                  value={formData.Desingation}
                  onChange={handleInputChange}
                  className="bg-white border-slate-200"
                  placeholder="e.g. Manager"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shift Information */}
          <Card className="bg-white shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-blue-600 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Shift Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-1/3">
                <Label htmlFor="shiftNumber" className="text-slate-700 mb-1">
                  Number of Shifts <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.shiftNumber.toString()}
                  onValueChange={(value) => handleShiftNumberChange(value)}
                >
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select shifts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.shifts.map((shift, index) => (
                <Card key={index} className="bg-blue-50 border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-blue-600 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Shift {index + 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPlannedBreak(index)}
                        className="bg-white text-blue-600 hover:bg-blue-100 border-blue-200"
                      >
                        <Coffee className="h-4 w-4 mr-1" /> Add Break
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700  mb-1">Start Time <span className="text-red-500">*</span></Label>
                        <Input
                          type="time"
                          value={shift.start}
                          onChange={(e) => handleShiftTimingChange(index, "start", e.target.value)}
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-700  mb-1">End Time <span className="text-red-500">*</span></Label>
                        <Input
                          type="time"
                          value={shift.end}
                          onChange={(e) => handleShiftTimingChange(index, "end", e.target.value)}
                          className="bg-white border-slate-200"
                        />
                      </div>
                    </div>

                    {shift.plannedBreaks?.length > 0 && (
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Planned Breaks</h4>
                        <div className="space-y-2">
                          {shift.plannedBreaks.map((breakItem, breakIndex) => (
                            <div key={breakIndex} className="grid grid-cols-7 gap-2 items-center">
                              <div className="col-span-2">
                                <Input
                                  type="time"
                                  value={breakItem.start}
                                  onChange={(e) => handlePlannedBreakChange(index, breakIndex, "start", e.target.value)}
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="time"
                                  value={breakItem.end}
                                  onChange={(e) => handlePlannedBreakChange(index, breakIndex, "end", e.target.value)}
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="col-span-2">
                                <Select
                                  value={breakItem.typeOfBreak || ""}
                                  onValueChange={(value) => handlePlannedBreakChange(index, breakIndex, "typeOfBreak", value)}
                                >
                                  <SelectTrigger className="bg-white border-slate-200">
                                    <SelectValue placeholder="Break Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                                    <SelectItem value="Lunch">Lunch</SelectItem>
                                    <SelectItem value="Tea">Tea</SelectItem>
                                    <SelectItem value="Dinner">Dinner</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-1 flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePlannedBreak(index, breakIndex)}
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-slate-200">
            Cancel
          </Button>
          <Button
            onClick={saveFormData}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Plant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Organization component that contains the "Add Organization" button
const Organization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4">
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Plant
      </Button>
      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Organization;
