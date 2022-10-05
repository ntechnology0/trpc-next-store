import React from "react";
import styled from "styled-components";

const GuidesStyle = styled.div`
  min-height: 100vh;
  height: 100%;
  display: grid;
  grid: 1fr / repeat(4, 1fr);
  position: relative;
  max-width: 1080px;
  height: 100%;
  margin: 0 auto;
  width: 100%;
  justify-content: center;
  align-content: center;
  grid-auto-flow: column;

  .guide {
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(66, 71, 112, 0.09),
      rgba(66, 71, 112, 0.09) 50%,
      transparent 0,
      transparent
    );
    background-size: 1px 8px;
    &:first-child {
      width: 0px !important;
    }
  }
`;

const Guides: React.FC = () => {
  return (
    <GuidesStyle className="absolute z-20 h-full top-0 bg-transparent">
      <div className="guide"></div>
      <div className="guide"></div>
      <div className="guide"></div>
      <div className="guide"></div>
    </GuidesStyle>
  );
};

export default Guides;
