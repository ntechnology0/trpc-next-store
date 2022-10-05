import React from "react";

type Props = {
  children?: React.ReactNode;
  onClick?: (() => void) | (() => Promise<void>);
  className?: string | undefined;
  type: "primary" | "neutral" | "transparent";
  disabled?: boolean;
  isSubmit?: boolean;
};

const Button: React.FC<Props> = ({
  onClick,
  className,
  children,
  type,
  isSubmit = false,
  disabled = false,
}) => {
  const __getAdequateType = (t: string) => {
    switch (t) {
      case "neutral":
        return "buttons__neutral";
      case "primary":
        return "buttons__primary";
      case "transparent":
        return "buttons__transparent";
    }
  };

  return (
    <button
      onClick={onClick}
      type={isSubmit ? "submit" : "button"}
      disabled={disabled}
      className={`${__getAdequateType(type)} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
