import { useState } from "react";
import styled from "styled-components";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

const FormContainer = styled.div`
  margin-top: 20px;
  & h2 {
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    margin-bottom: 1rem;
  }
`;

const InputLabel = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
  width: 100%;
  margin-top: auto; /* 버튼을 하단에 배치 */
`;

const GuideBookCreateSecondStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination } = location.state || {};
  const [title, setTitle] = useState("");

  const handleNext = () => {
    // handle next steps, for example, saving the guide
    console.log("Destination:", destination);
    console.log("Title:", title);
    navigate("/guidebook/create/finally-step");
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <IoChevronBackOutline />
        </BackButton>
      </Header>
      <FormContainer>
        <h2>
          이번 여행 가이드북의 <br /> 제목을 작성해주세요
        </h2>
        <InputLabel>제목</InputLabel>
        <Input
          type="text"
          placeholder="여행 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormContainer>
      <Button onClick={handleNext}>다음</Button>
    </Container>
  );
};

export default GuideBookCreateSecondStep;
