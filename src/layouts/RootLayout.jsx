import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaRegBookmark, FaBookmark, FaBookOpen, FaPlus } from "react-icons/fa";
// import { IoIosAddCircleOutline } from "react-icons/io";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";

const LayoutContainer = styled.div`
  height: ${(props) => (props.$fullHeight ? props.$fullHeight : null)};

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

const FloatingAddButton = styled.button`
  position: fixed;
  bottom: 80px; /* Scroll to top button보다 위에 위치 */
  right: 30px;
  background-color: #ff6b6b; // 파란색 대신 밝은 빨간색 사용
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1500; /* Scroll to top button보다 위에 위치 */
  transition: all 0.3s ease;

  &:hover {
    background-color: #f23e3e;
    transform: scale(1.1);
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
    location.pathname.startsWith("/myGuideBooks") ||
    location.pathname === "/guidebook/create/finally-step";

  const isGuidebookCreatePath =
    location.pathname.startsWith("/guidebook/create") ||
    location.pathname.startsWith("/welcome") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/contents");

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <LayoutContainer $fullHeight={location.pathname === "/welcome" || location.pathname === "/login" ? "100vh" : null}>
      <Outlet />
      {!isGuidebookCreatePath && (
        <FloatingAddButton onClick={() => handleNavigate("/guidebook/create/first-step")}>
          <FaPlus />
        </FloatingAddButton>
      )}
      {showNavBar && (
        <NavBar>
          <NavIcon>
            {location.pathname === "/" ? (
              <IoHomeSharp size={24} className="selected" />
            ) : (
              <IoHomeOutline size={24} onClick={() => handleNavigate("/")} />
            )}
          </NavIcon>
          <NavIcon>
            {location.pathname === "/myGuideBooks" ? (
              <FaBookOpen size={24} className="selected" />
            ) : (
              <FaBookOpen size={24} onClick={() => handleNavigate("/myGuideBooks")} />
            )}
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
