import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function GaugeChart({ value, label }) {
    const clamped = Math.min(Math.max(value, 0), 100);
    const finalValue=parseFloat(clamped.toFixed(2));
    // console.log(finalValue)
    return (
        <div className="flex flex-col items-center w-28">
            <CircularProgressbar
                value={finalValue}
                maxValue={100}
                text={`${finalValue}%`}
                circleRatio={0.5}
                styles={buildStyles({
                    rotation: 0.75, // 0.75*360deg = 270deg, so it starts at the bottom
                    strokeLinecap: "round",
                    pathColor: "#3b82f6",
                    textColor: "#222",
                    trailColor: "#e6e6e6"
                })}
            />
            <span className="text-xs -mt-5 text-center">{label}</span>
        </div>
    );
}