import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

const SpinContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default function Spinner() {
  return (
    <SpinContainer>
      <Spin />
    </SpinContainer>
  );
}
