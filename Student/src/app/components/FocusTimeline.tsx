import { motion } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface TimeSegment {
  time: string;
  focus: number;
  message: string;
}

const timeData: TimeSegment[] = [
  { time: "9:00", focus: 85, message: "Great start to the day!" },
  { time: "9:30", focus: 92, message: "Peak focus time!" },
  { time: "10:00", focus: 78, message: "Good attention" },
  { time: "10:30", focus: 65, message: "Stay focused!" },
  { time: "11:00", focus: 88, message: "Excellent recovery!" },
  { time: "11:30", focus: 95, message: "Amazing focus!" },
];

export default function FocusTimeline() {
  const getColor = (focus: number) => {
    if (focus >= 85) return "#22C55E";
    if (focus >= 70) return "#3B82F6";
    if (focus >= 60) return "#FBBF24";
    return "#FB7185";
  };

  return (
    <Tooltip.Provider>
      <div className="bg-white rounded-[20px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">📈 Focus Timeline</h3>

        <div className="relative overflow-x-auto pb-2 -mx-2 px-2">
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-40 min-w-[400px] sm:min-w-0">
            {timeData.map((segment, index) => (
              <Tooltip.Root key={index}>
                <Tooltip.Trigger asChild>
                  <motion.div
                    className="flex-1 rounded-t-lg cursor-pointer relative group min-w-[50px]"
                    style={{
                      height: `${segment.focus}%`,
                      backgroundColor: getColor(segment.focus),
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${segment.focus}%` }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    whileHover={{ opacity: 0.8 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white rounded-t-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                    />
                  </motion.div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-4 py-3 rounded-lg text-sm max-w-xs z-50"
                    sideOffset={5}
                  >
                    <div>
                      <div className="font-semibold">{segment.time}</div>
                      <div className="text-sm opacity-90">Focus: {segment.focus}%</div>
                      <div className="text-sm mt-1">{segment.message}</div>
                    </div>
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-600 min-w-[400px] sm:min-w-0">
            {timeData.map((segment, index) => (
              <div key={index} className="flex-1 text-center min-w-[50px]">
                {segment.time}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center sm:hidden">
          ← Swipe to see more →
        </div>
      </div>
    </Tooltip.Provider>
  );
}