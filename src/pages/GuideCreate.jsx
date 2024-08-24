import styled from "styled-components";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

const SearchBox = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  background-color: #f0f0f0;
  color: #aaa;

  &::placeholder {
    color: #aaa;
  }
`;

const DateBox = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  color: #aaa;
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
  width: 100%;
  margin-top: auto; /* 버튼을 하단에 배치 */
`;

const GuideCreate = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/guide/title");
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
      </Header>
      <SearchBox>
        <SearchInput placeholder="어디로 떠나세요?" />
        <DateBox>
          <FaCalendarAlt style={{ marginRight: "8px" }} />
          0000.00.00 ~ 0000.00.00
        </DateBox>
      </SearchBox>
      <Button onClick={handleNext}>다음</Button>
    </Container>
  );
};

export default GuideCreate;
