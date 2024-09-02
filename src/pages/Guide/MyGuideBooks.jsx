import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import noImage from "../../assets/noimage.png"; // 대체 이미지 경로

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
`;

const GuideBookContainer = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-top: 56.25%; /* 16:9 비율을 유지 */
  background-color: #e0e0e0;
  border-radius: 12px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;

  & img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const NoGuidebooksMessage = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 18px;
  color: #777;
  line-height: 24px;
`;

const MyGuideBooks = () => {
  const navigate = useNavigate();
  const guidebooks = useSelector((state) => state.guideBook.books) || [];

  const handleNavigate = (id) => {
    navigate(`/myGuideBooks/${id}`);
  };

  console.log(guidebooks);

  const getFirstImage = (schedule) => {
    for (let day of Object.keys(schedule)) {
      for (let item of schedule[day]) {
        if (item.firstimage) {
          return item.firstimage;
        }
      }
    }
    return noImage; // 모든 날의 이미지가 없는 경우 대체 이미지 반환
  };

  return (
    <Container>
      {guidebooks.length > 0 ? (
        guidebooks.map((guidebook, index) => (
          <GuideBookContainer key={index} onClick={() => handleNavigate(guidebook.id)}>
            <ImagePlaceholder>
              <img src={getFirstImage(guidebook.schedule)} alt={guidebook.title} />
            </ImagePlaceholder>
            <GuideInfo>
              <GuideTitle>{guidebook.title}</GuideTitle>
              <GuideSubtitle>
                {guidebook.area}, {new Date(guidebook.dateRange.startDate).toLocaleDateString()} ~{" "}
                {new Date(guidebook.dateRange.endDate).toLocaleDateString()}
              </GuideSubtitle>
            </GuideInfo>
          </GuideBookContainer>
        ))
      ) : (
        <NoGuidebooksMessage>
          아직 가이드북이 없습니다. <br /> 새로운 가이드북을 추가해보세요!
        </NoGuidebooksMessage>
      )}
    </Container>
  );
};

export default MyGuideBooks;
