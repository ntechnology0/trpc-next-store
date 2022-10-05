import React from "react";
import styled from "styled-components";
import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts";
import moment from "moment";

const ChartStyled = styled.div``;

const hours = Array.from({ length: 24 }, (_, hour) => {
  return {
    value: Math.floor(Math.random() * (1 - 0 + 1) + 0),
    hour: moment({
      hour: hour,
    }).format("HH:mm A"),
  };
});

const ChartArea: React.FC = () => {
  return (
    <ChartStyled className="w-full pr-2 flex flex-col justify-center pt-7 space-y-1.5 items-center h-[128px]">
      <div className="w-full flex flex-col justify-start h-[70px] border-b border-dashed border-slate-200 items-start">
        <ResponsiveContainer
          width={"100%"}
          height={50}
          className="bg-transparent"
        >
          <LineChart data={hours} className="absolute z-20 px-0">
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0389ff"
              strokeWidth={1.4}
            />
            <XAxis dataKey={"hour"} hide={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full flex flex-row  justify-between items-center py-1 text-xs">
        <div className="text-slate-400 font-medium fonts__inter_regular">
          {hours[0].hour}
        </div>
        <div className="text-slate-400 font-medium fonts__inter_regular">
          {hours[hours.length - 1].hour}
        </div>
      </div>
    </ChartStyled>
  );
};

export default ChartArea;
