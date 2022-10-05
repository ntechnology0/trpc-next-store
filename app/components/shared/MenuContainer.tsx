import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

type Props = {
  children?: React.ReactNode;
};

const MenuStyled = styled(motion.div)``;

const MenuContainer: React.FC<Props> = ({ children }) => {
  return (
    <MenuStyled className="min-w-max">
      <motion.div
        className="absolute z-50 border min-w-[320px] border-1 top-8 rounded shadow-lg py-5 px-5 bg-white rounded-box"
        initial="hidden"
        animate="visible"
        layoutId="menu"
      >
        {children}
      </motion.div>
    </MenuStyled>
  );
};

export default MenuContainer;
