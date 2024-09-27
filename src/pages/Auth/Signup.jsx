import { useState } from "react";
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../api/backendApi";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  height: 100vh;
  box-sizing: border-box;
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
  line-height: 1.3;
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

const TogglePasswordButton = styled.div`
  position: absolute;
  top: 45px;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #aaa;
  margin-top: 10px;
  &.error {
    color: #e0302d;
  }
`;

const ErrorMessage = styled.p`
  font-size: 12px;
  margin-top: 6px;
  color: #e0302d;
`;

const SignupButton = styled.button`
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

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const onNavigate = (path) => {
    navigate(path);
  };

  const onChangeName = (event) => {
    setName(event.target.value);
    setNameError(false);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
    setEmailError(false);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 8 && password.length <= 20;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const isNameValid = name.trim().length > 0;
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid) setNameError(true);
    if (!isEmailValid) setEmailError(true);
    if (!isPasswordValid) setPasswordError(true);

    if (isNameValid && isEmailValid && isPasswordValid) {
      try {
        // 회원가입 처리
        const userData = {
          username: name,
          userEmail: email,
          password: password,
        };

        // 실제로 백엔드 서버가 있을 경우 주석 해제 후 사용
        /*
        const data = await signupUser(userData);
        console.log("회원가입 성공:", data);
        */

        // 백엔드 서버가 없을 때 테스트를 위한 가짜 응답 처리
        const data = await signupUser(userData);
        console.log("테스트용 회원가입 성공:", data);

        // 회원가입 성공 후 페이지 이동
        navigate("/welcome");
      } catch (error) {
        console.error("회원가입 실패:", error);
      }
    }
  };

  const isFormValid = name.trim().length > 0 && validateEmail(email) && validatePassword(password);

  return (
    <Container>
      <Header>
        <BackButton>
          <IoIosArrowBack size={28} onClick={() => onNavigate(-1)} />
        </BackButton>
        <Title>
          회원가입을 위해
          <br />
          정보를 입력해주세요.
        </Title>
      </Header>
      <Form onSubmit={onSubmit}>
        <div>
          <InputContainer>
            <Label>이름</Label>
            <Input type="text" placeholder="예: 메이트" value={name} onChange={onChangeName} $hasError={nameError} />
            {nameError && <ErrorMessage>이름 입력해주세요.</ErrorMessage>}
          </InputContainer>
          <InputContainer>
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="예: matecarpool@gmail.com"
              value={email}
              onChange={onChangeEmail}
              $hasError={emailError}
            />
            {emailError && <ErrorMessage>다른 이메일 혹은 이메일 형식에 맞추어 입력해주세요.</ErrorMessage>}
          </InputContainer>
          <PasswordInputContainer>
            <Label>비밀번호</Label>
            <PasswordInput
              type={passwordVisible ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={onChangePassword}
              $hasError={passwordError}
            />
            <TogglePasswordButton onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </TogglePasswordButton>
            <HelperText className={passwordError ? "error" : null}>
              영문과 숫자를 조합하여 8-20자 사이로 입력해주세요.
              <br />
              최소 1개 이상의 숫자, 소문자, 대문자로 구성해주세요.
            </HelperText>
          </PasswordInputContainer>
        </div>
        <SignupButton disabled={!isFormValid}>회원가입하기</SignupButton>
      </Form>
    </Container>
  );
};
export default Signup;
