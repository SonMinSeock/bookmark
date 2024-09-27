import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/logo.png"; // 로고 이미지 파일 import

// 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #fff;
`;

// 로고 섹션
const LogoSection = styled.section`
  display: flex;
  flex: 0.8;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${logo}); // 로고 이미지 설정
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 20px;
`;

// 로그인 링크 섹션
const LinkSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LoginLinkText = styled.p`
  margin-top: 10px;
  color: #999;
  font-size: 14px;

  a {
    color: #333;
    text-decoration: underline;
    cursor: pointer;
  }
`;

// 공통 버튼 스타일
const Button = styled.button`
  width: 80%;
  max-width: 300px;
  padding: 15px;
  margin-top: 20px;
  font-size: 18px;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  background-color: ${({ variant }) => (variant === "line" ? "#00c300" : "#1e88e5")};
`;

const Welcome = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container>
      <LogoSection>
        <Logo />
      </LogoSection>
      <LinkSection>
        <LoginLinkText>
          이미 아이디가 있으신가요? <Link to="/login">로그인 하기</Link>
        </LoginLinkText>
        <Button variant="start" onClick={() => handleNavigate("/signup")}>
          시작하기
        </Button>
      </LinkSection>
    </Container>
  );
};

export default Welcome;
