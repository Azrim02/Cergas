import React, { createContext, useState, useEffect, useContext } from "react";
import { useIsWorking } from "./IsWorkingProvider"; 
import useStepRangeData from "../hooks/useStepRangeData"; 

const StepsContext = createContext();

export const StepsProvider = ({ children }) => {
    const { checkInTime, checkOutTime } = useIsWorking(); // ✅ Use check-in/out times
    const [workHourSteps, setWorkHourSteps] = useState(0);
    const { steps, stepEntries, fetchStepsForCheckInOut } = useStepRangeData(); // ✅ Updated function

    // 🔄 Fetch steps only when check-in/out changes
    useEffect(() => {
        if (checkInTime) {
            const startTime = checkInTime;
            const endTime = checkOutTime || new Date(); // If no check-out, use current time

            console.log(`📊 Fetching steps from ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()}`);

            fetchStepsForCheckInOut(startTime, endTime);
        }
    }, [checkInTime, checkOutTime]); 

    useEffect(() => {
        if (steps !== null) {
            setWorkHourSteps(steps);
        }
    }, [steps]);

    return (
        <StepsContext.Provider value={{ workHourSteps, stepEntries, fetchStepsForCheckInOut }}> 
            {children}
        </StepsContext.Provider>
    );
};

export const useSteps = () => useContext(StepsContext);
