import { useSelector } from "react-redux";
import styled from "styled-components";
import noImage from "../../assets/noimage.png";
const Container = styled.div`
  padding: 16px;
  padding-bottom: 100px; /* 하단 네비게이션 바와 겹치지 않도록 패딩 추가 */
  background-color: #f0f0f0; /* 밝은 회색 배경 */
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
  border: 1px solid #ddd; /* 테두리 추가 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  transition: transform 0.3s ease; /* 부드러운 전환 효과 추가 */

  &:hover {
    transform: scale(1.05); /* 호버 시 확대 */
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
  const bookmarks = useSelector((state) => state.bookmarks); // 북마크 데이터 가져오기
  // const noImage = "https://via.placeholder.com/150"; // 대체 이미지 URL

  return (
    <Container>
      <ImageGrid>
        {bookmarks.map((data) => (
          <ImagePlaceholder key={data.contentid}>
            <img src={data.firstimage || noImage} alt="북마크 이미지" />
          </ImagePlaceholder>
        ))}
      </ImageGrid>
    </Container>
  );
};

export default BookMark;
