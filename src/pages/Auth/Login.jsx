import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/backendApi";
import { setAuthData } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  height: 100%;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const BackButton = styled.div`
  align-self: flex-start;
  margin-bottom: 20px;
  cursor: pointer;
`;

const Title = styled.h1`
  align-self: flex-start;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  flex: 1;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid ${({ $hasError }) => ($hasError ? "red" : "#ddd")};
  border-radius: 8px;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }
`;

const PasswordInputContainer = styled(InputContainer)`
  position: relative;
`;

const PasswordInput = styled(Input)`
  padding-right: 40px;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  top: 45px;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  font-size: 12px;
  margin-top: 6px;
  color: #e0302d;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 18px;
  color: #ffffff;
  background-color: ${({ disabled }) => (disabled ? "#e0e0e0" : "#007aff")};
  border: none;
  border-radius: 25px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  margin-top: auto; /* 자동으로 위쪽 여백을 채워 하단에 위치 */
`;

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState(""); // 로그인 에러 메시지 상태 추가

  const navigate = useNavigate();

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
    if (emailError) {
      setEmailError(false);
    }
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
    if (passwordError) {
      setPasswordError(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid) setEmailError(true);
    if (!isPasswordValid) setPasswordError(true);

    if (isEmailValid && isPasswordValid) {
      // 모듈화된 API 호출
      try {
        const { userId, token } = await loginUser(email, password); // backendApi.js의 loginUser 호출
        dispatch(setAuthData({ userId, token })); // Update Redux state

        navigate("/"); // 성공 시 메인 페이지로 이동
      } catch (error) {
        if (error.message === "Unauthorized") {
          setLoginError("아이디 또는 비밀번호가 잘못되었습니다."); // 401 에러에 대한 사용자에게 보여줄 메시지
        } else {
          setLoginError("로그인에 실패했습니다. 다시 시도해주세요."); // 일반 에러 메시지
        }
      }
    }
  };

  const isFormValid = validateEmail(email) && validatePassword(password);

  return (
    <Container>
      <Header>
        <BackButton>
          <IoIosArrowBack size={28} onClick={() => navigate(-1)} />
        </BackButton>
        <Title>로그인하기</Title>
      </Header>
      <Form onSubmit={onSubmit}>
        <div>
          <InputContainer>
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={onChangeEmail}
              $hasError={emailError}
            />
            {emailError && <ErrorMessage>이메일을 다시 입력해주세요.</ErrorMessage>}
          </InputContainer>
          <PasswordInputContainer>
            <Label>비밀번호</Label>
            <PasswordInput
              type={passwordVisible ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={onChangePassword}
              $hasError={passwordError}
            />
            {passwordError && <ErrorMessage>비밀번호를 다시 입력해주세요.</ErrorMessage>}
            <TogglePasswordButton type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </TogglePasswordButton>
          </PasswordInputContainer>
        </div>
        <LoginButton disabled={!isFormValid}>로그인하기</LoginButton>
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>} {/* 로그인 에러 메시지 */}
      </Form>
    </Container>
  );
};

export default Login;
