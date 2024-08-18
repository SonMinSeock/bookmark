import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #fff;
  flex: 0.3;
`;

const LogoContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0.8;
`;

const Logo = styled.div`
  width: 200px;
  height: 200px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const LogoText = styled.p`
  font-size: 24px;
  color: #000;
`;

const LoginLinkContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LoginLink = styled.p`
  margin-top: 10px;
  color: #999;
  font-size: 14px;

  a {
    color: #333;
    text-decoration: underline;
    cursor: pointer;
  }
`;

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

  &.start {
    background-color: #1e88e5;
  }

  &.line {
    background-color: #00c300;
  }
`;

const Welcome = () => {
  const navigate = useNavigate();

  const onNavigate = (path) => {
    navigate(path);
  };
  return (
    <Container>
      <LogoContainer>
        <Logo>
          <LogoText>로고</LogoText>
        </Logo>
      </LogoContainer>
      <LoginLinkContainer>
        <LoginLink>
          이미 아이디가 있으신가요? <Link to="/login">로그인 하기</Link>
        </LoginLink>
        <Button className="start" onClick={() => onNavigate("/signup")}>
          시작하기
        </Button>
        <Button className="line">LINE 간편로그인</Button>
      </LoginLinkContainer>
    </Container>
  );
};

export default Welcome;
