import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaHome, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";

const LayoutContainer = styled.div`
  height: ${location.pathname === "/welcome" ? "100vh" : null};

  @media (min-width: 393px) {
    max-width: 393px;
    margin: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 데스크탑에서 가볍게 그림자를 추가하여 입체감 부여 */
  }
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
  &:hover {
    color: #007aff; /* 아이콘에 호버 시 약간의 색상 변경으로 인터랙션 추가 */
  }
  .selected {
    color: #007aff;
  }
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
      <Outlet />
      {showNavBar && (
        <NavBar>
          <NavIcon>
            {location.pathname === "/" ? (
              <FaHome size={24} className="selected" />
            ) : (
              <IoHomeOutline size={24} onClick={() => handleNavigate("/")} />
            )}
          </NavIcon>
          <NavIcon>
            <IoIosAddCircleOutline size={24} onClick={() => handleNavigate("/guide/create")} />
          </NavIcon>
          <NavIcon>
            {location.pathname.startsWith("/bookmark") ? (
              <FaBookmark size={24} className="selected" />
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
