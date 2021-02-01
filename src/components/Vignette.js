import styled from "styled-components";

const Vignette = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0;
  transition: 0.2s;
  &:hover {
    opacity: 1;
    background: rgb(0, 0, 0);
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.65) 0%,
      rgba(0, 0, 0, 0.1) 35%,
      rgba(0, 0, 0, 0.1) 67%,
      rgba(0, 0, 0, 0.65) 100%
    );
  }
`;

export default Vignette;
