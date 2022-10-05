import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import clsx from "clsx";
import dynamic from "next/dynamic";

const MenuContainer = dynamic(() => import("./MenuContainer"));

type Props = {
  text: string;
  children?: React.ReactNode;
  noMenu?: boolean;
  className?: string;
  color?: string;
  isActive?: boolean;
  onClick?: () => void;
};

const MenuItemStyled = styled(motion.button)``;

const Underline: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <motion.div
      className={`absolute -bottom-2 left-0 right-0 h-0.5 rounded ${color}`}
      layoutId="underline"
      layout
    ></motion.div>
  );
};

const MenuItem: React.FC<Props> = ({
  text,
  children,
  className,
  noMenu = false,
  color = "bg-black",
  isActive = false,
  onClick,
}) => {
  const [isBeingHovered, setIsBeingHovered] = React.useState(false);

  return (
    <MenuItemStyled
      onClick={onClick}
      className={clsx("relative cursor-pointer", className)}
      onHoverStart={() => setIsBeingHovered(true)}
      onHoverEnd={() => setIsBeingHovered(false)}
    >
      <span className="relative fonts__poppins_regular text-xs font-medium ">
        {text}
        {(isBeingHovered || isActive) && <Underline color={color} />}
      </span>
      {isBeingHovered && !noMenu && <MenuContainer>{children}</MenuContainer>}
    </MenuItemStyled>
  );
};

export default MenuItem;
