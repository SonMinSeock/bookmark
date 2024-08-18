import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  @media (min-width: 393px) {
    max-width: 393px;
    margin: auto;
  }
`;

const RootLayout = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default RootLayout;
