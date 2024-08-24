import styled from "styled-components";

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 4px;
`;

const ImageBox = styled.div`
  width: 100%;
  padding-top: 100%; /* 1:1 비율을 유지하기 위해 패딩 비율을 100%로 설정 */
  position: relative;
  background-color: #e0e0e0;
  background-size: cover;
  background-position: center;
  background-image: url(${(props) => props.src});
`;

const dummyImages = [
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
];

const BookMarkSelect = () => {
  return (
    <Container>
      <ImageGrid>
        {dummyImages.map((src, index) => (
          <ImageBox key={index} src={src} />
        ))}
      </ImageGrid>
    </Container>
  );
};

export default BookMarkSelect;
