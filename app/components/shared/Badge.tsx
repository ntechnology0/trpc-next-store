import React from "react";

type Props = {
  withDot: boolean;
  color: string;
  textColor: string;
  badgeColor?: string;
  text: string;
};

const Badge: React.FC<Props> = ({
  withDot = false,
  textColor,
  color,
  text,
  badgeColor,
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full ${color} px-2.5 py-0.5 font-medium ${textColor}`}
    >
      {withDot && (
        <svg
          className={`-ml-0.5 mr-1.5 h-1 w-1 ${badgeColor}`}
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx={4} cy={4} r={3} />
        </svg>
      )}
      <span className="text-[0.7rem] fonts__inter_regular">{text}</span>
    </span>
  );
};

export default Badge;
