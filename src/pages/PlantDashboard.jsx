import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DriveMonitoringPage } from './DriveMonitoring';
import { QualityMonitoringPage } from './QualityMonitoring';

export function PlantDashboard() {
    const [shiftValue, setShiftValue] = useState("Present Shift");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div></div>
                <div className="flex space-x-2">
                    <Select value={shiftValue} onValueChange={setShiftValue}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Present Shift" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="morning">Morning Shift</SelectItem>
                            <SelectItem value="evening">Evening Shift</SelectItem>
                            <SelectItem value="night">Night Shift</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 4.5V8L10.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center">Seat Productions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between pt-0">
                        {/* This would contain the production charts */}
                        <div className="text-center">
                            <div className="text-3xl font-bold">1200</div>
                            <div className="text-xs">Line 1</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">500</div>
                            <div className="text-xs">Line 2</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">800</div>
                            <div className="text-xs">Line 3</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center">Quality summary</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {/* This would contain the quality donut chart */}
                        <div className="h-40 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-lg">Pass: 1100</div>
                                <div className="text-lg">Rework: 400</div>
                                <div className="text-lg">Reject: 100</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center">Line Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {/* This would contain the efficiency bars */}
                        <div className="h-40 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-4 w-full">
                                <div className="text-center">
                                    <div className="text-lg text-blue-500">90%</div>
                                    <div className="h-20 bg-gray-200 rounded-full w-4 mx-auto">
                                        <div className="bg-blue-500 h-[90%] rounded-full w-4"></div>
                                    </div>
                                    <div className="text-xs mt-1">Line 1</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg text-yellow-500">82%</div>
                                    <div className="h-20 bg-gray-200 rounded-full w-4 mx-auto">
                                        <div className="bg-yellow-500 h-[82%] rounded-full w-4"></div>
                                    </div>
                                    <div className="text-xs mt-1">Line 2</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg text-red-500">50%</div>
                                    <div className="h-20 bg-gray-200 rounded-full w-4 mx-auto">
                                        <div className="bg-red-500 h-[50%] rounded-full w-4"></div>
                                    </div>
                                    <div className="text-xs mt-1">Line 3</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle>OEE</CardTitle>
                        <div className="text-xl font-bold text-orange-400">46%</div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {/* This would contain the OEE chart */}
                        <div className="h-40 bg-gray-100 rounded"></div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle>Availability</CardTitle>
                        <div className="text-xl font-bold text-purple-500">46%</div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {/* This would contain the Availability chart */}
                        <div className="h-40 bg-gray-100 rounded"></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Create placeholder components for other pages
export function LineDashboard() {
    return <div className="p-4">Line Dashboard Content Goes Here</div>;
}


export function DriveMonitoring() {
    return <div className="p-4">
    <DriveMonitoringPage/>
    </div>;
}

export function QualityMonitoring() {
    return <div className="p-4">
        <QualityMonitoringPage/>
    </div>;
}

export function DataSheets() {
    return <div className="p-4">Data Sheets Content Goes Here</div>;
}

export function UserManagement() {
    return <div className="p-4">User Management Content Goes Here</div>;
}

