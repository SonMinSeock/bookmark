import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const GuideBookContainer = styled.div`
  margin-bottom: 16px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-top: 56.25%; /* 16:9 비율을 유지 */
  background-color: #e0e0e0;
  border-radius: 12px;
  margin-bottom: 8px;
  position: relative;
`;

const GuideInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const GuideTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const GuideSubtitle = styled.p`
  font-size: 14px;
  color: #aaa;
  margin: 4px 0 0;
`;

const MyGuideBooks = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };
  return (
    <Container>
      {[1, 2].map((item, index) => (
        <GuideBookContainer key={index}>
          <ImagePlaceholder onClick={() => handleNavigate("index")} />
          <GuideInfo>
            <GuideTitle>제목</GuideTitle>
            <GuideSubtitle>위치, 날짜</GuideSubtitle>
          </GuideInfo>
        </GuideBookContainer>
      ))}
    </Container>
  );
};

export default MyGuideBooks;
