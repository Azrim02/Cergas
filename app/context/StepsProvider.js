import React, { createContext, useState, useEffect, useContext } from "react";
import { useIsWorking } from "./IsWorkingProvider"; // Get work hour condition
import { useWorkplace } from "./WorkplaceProvider";
import useStepRangeData from "../hooks/useStepRangeData"; // Fetch steps in a range

const StepsContext = createContext();

export const StepsProvider = ({ children }) => {
    const { isWithinWorkHours } = useIsWorking(); // Work hour condition
    const { workplaceData } = useWorkplace(); 
    const [workHourSteps, setWorkHourSteps] = useState(0);
    const { steps, fetchStepsForTimeRanges } = useStepRangeData(); // Fetch step range
    
    useEffect(() => {
        if (isWithinWorkHours && workplaceData?.startTime && workplaceData?.endTime) {
            // Get today's work hours from IsWorkingProvider
            const now = new Date();
            const workplaceStart = new Date(now);
            const workplaceEnd = new Date(now);

            const startTimeObj = new Date(workplaceData.startTime);
            const endTimeObj = new Date(workplaceData.endTime);

            workplaceStart.setHours(startTimeObj.getUTCHours(), startTimeObj.getUTCMinutes(), 0, 0);
            workplaceEnd.setHours(endTimeObj.getUTCHours(), endTimeObj.getUTCMinutes(), 0, 0);
            fetchStepsForTimeRanges([{ startTime: workplaceStart, endTime: workplaceEnd }]);
        }
    }, [isWithinWorkHours]);

    useEffect(() => {
        if (steps !== null) {
            setWorkHourSteps(steps);
        }
    }, [steps]);

    return (
        <StepsContext.Provider value={{ workHourSteps }}>
            {children}
        </StepsContext.Provider>
    );
};

export const useSteps = () => useContext(StepsContext);
