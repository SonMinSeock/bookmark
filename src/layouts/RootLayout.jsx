import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";

const LayoutContainer = styled.div`
  height: 100%;
  @media (min-width: 393px) {
    max-width: 393px;
    margin: auto;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const NavBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 393px;
  height: 60px;
  background-color: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000; /* Ensure NavBar is on top */
`;

const NavIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  cursor: pointer;
`;

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 홈 경로일 때만 NavBar를 표시합니다.
  // const showNavBar = location.pathname === "/" || location.pathname.startsWith("/guide/");
  const showNavBar =
    location.pathname === "/" ||
    location.pathname.startsWith("/guide/finally") ||
    location.pathname === "/bookmark" ||
    location.pathname.startsWith("/myGuideBooks");

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <LayoutContainer>
      <Content>
        <Outlet />
      </Content>
      {showNavBar && (
        <NavBar>
          <NavIcon>
            {location.pathname === "/" ? (
              <FaHome size={24} />
            ) : (
              <IoHomeOutline size={24} onClick={() => handleNavigate("/")} />
            )}
          </NavIcon>
          <NavIcon>
            <IoIosAddCircleOutline size={24} onClick={() => handleNavigate("/guide/create")} />
          </NavIcon>
          <NavIcon>
            {location.pathname.startsWith("/bookmark") ? (
              <FaBookmark size={24} />
            ) : (
              <FaRegBookmark size={24} onClick={() => handleNavigate("/bookmark")} />
            )}
          </NavIcon>
        </NavBar>
      )}
    </LayoutContainer>
  );
};

export default RootLayout;
