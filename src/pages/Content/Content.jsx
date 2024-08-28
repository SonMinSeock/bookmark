import styled from "styled-components";
import { FaRegBookmark } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
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

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const BookmarkButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
  margin: 0;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #333;
  line-height: 1.7;
  margin: 0;
`;

const Content = () => {
  const navigate = useNavigate();
  const { state: guide } = useLocation();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <IoChevronBackOutline />
        </BackButton>
      </Header>
      <ImagePlaceholder />
      <TitleRow>
        <Title>{guide.title}</Title>
        <BookmarkButton>
          <FaRegBookmark size={23} />
        </BookmarkButton>
      </TitleRow>
      <Subtitle>{guide.subTitle}</Subtitle>
      <Description>{guide.text}</Description>
    </Container>
  );
};

export default Content;
