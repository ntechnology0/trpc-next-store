import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

type Props = {
  text?: string;
  title?: string;
  link?: string;
};

const MenuStyled = styled(motion.div)``;

const MenuContainerItem: React.FC<Props> = ({ text, title, link }) => {
  const [isBeingHovered, setIsBeingHovered] = React.useState(false);

  return (
    <MenuStyled className="my-1 mb-6 group cursor-pointer w-full max-w-[320px]">
      <div className="flex flex-col space-y-1 justify-start items-center gap-4">
        <div className="w-full flex flex-col justify-start items-start space-y-1">
          <p className="font-medium text-black fonts__poppins_regular text-xs">
            {title}
          </p>
          <span className="font-medium text-justify text-slate-600 fonts__inter_regular text-xs">
            {text}
          </span>
          <Link href={link!}>
            <motion.div
              className="w-22 h-0.5 flex flex-col"
              onHoverStart={() => setIsBeingHovered(true)}
              onHoverEnd={() => setIsBeingHovered(false)}
            >
              <div className="w-full flex flex-row justify-start space-x-2 items-center">
                <span className="text-xs fonts__inter_regular text-[#0389ff] font-medium">
                  Voir plus
                </span>
                <FiChevronRight size={15} strokeWidth={2} color={"#0389ff"} />
              </div>
              {isBeingHovered && (
                <span className="w-22 h-0.5 bg-[#0389ff] rounded border border-[#0389ff]"></span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>
    </MenuStyled>
  );
};

export default MenuContainerItem;
