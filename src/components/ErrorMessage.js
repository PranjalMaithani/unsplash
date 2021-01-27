import styled from "styled-components";
const ErrorDiv = styled.div`
  width: 100vw;
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: 300;
`;

const ErrorMessage = ({ message }) => {
  return <ErrorDiv>{message}</ErrorDiv>;
};

export default ErrorMessage;
