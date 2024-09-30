import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import styled from "styled-components";
import noImage from "../../assets/noimage.png";

const Container = styled.div`
  padding: 16px;
  padding-bottom: 100px;
  background-color: #f0f0f0;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-top: 100%; /* 1:1 비율을 유지 */
  position: relative;
  background-color: #e0e0e0;
  overflow: hidden;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  & img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
`;

const BookMark = () => {
  const bookmarks = useSelector((state) => state.bookmarks);
  const navigate = useNavigate(); // navigate 함수 사용

  const handleClick = (content) => {
    navigate(`/contents/${content.contentId}`, { state: { content } });
  };

  console.log(bookmarks);

  return (
    <Container>
      <ImageGrid>
        {bookmarks.map((data) => (
          <ImagePlaceholder key={data.contentid} onClick={() => handleClick(data)}>
            {" "}
            {/* onClick 추가 */}
            <img src={data.firstimage || noImage} alt="북마크 이미지" />
          </ImagePlaceholder>
        ))}
      </ImageGrid>
    </Container>
  );
};

export default BookMark;
