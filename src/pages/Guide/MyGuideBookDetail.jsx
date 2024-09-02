import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import noImage from "../../assets/noimage.png"; // 대체 이미지 경로

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 80px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 32px 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 8px 0;
`;

const DateRange = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 24px 0;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #ddd;
  margin: 24px 0;
`;

const DayContainer = styled.div`
  margin-bottom: 24px;
`;

const DayTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
`;

const ScheduleContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
`;

const ScheduleBox = styled.div`
  flex: 0 0 100px; /* 고정된 너비를 설정 */
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ImageBox = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const MyGuideBookDetail = () => {
  const { id } = useParams();
  const guidebooks = useSelector((state) => state.guideBook.books);
  const navigate = useNavigate();

  const guidebook = guidebooks.find((book) => book.id === +id);

  if (!guidebook) {
    return (
      <Container>
        <Title>가이드북을 찾을 수 없습니다.</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{guidebook.title || "제목 없음"}</Title>
      <Subtitle>{guidebook.area || "지역 없음"}</Subtitle>
      <DateRange>
        {guidebook.dateRange
          ? `${new Date(guidebook.dateRange.startDate).toLocaleDateString()} ~ ${new Date(
              guidebook.dateRange.endDate
            ).toLocaleDateString()}`
          : "0000.00.00~0000.00.00"}
      </DateRange>
      <Divider />
      {Object.keys(guidebook.schedule).map((day, index) => {
        // 일정이 있는 Day만 렌더링
        if (guidebook.schedule[day].length > 0) {
          return (
            <DayContainer key={index}>
              <DayTitle>Day{index + 1}</DayTitle>
              <ScheduleContainer>
                {guidebook.schedule[day].map((item, idx) => (
                  <ScheduleBox
                    key={idx}
                    onClick={() => navigate(`/contents/${item.contentid}`, { state: { content: item } })}
                  >
                    <ImageBox src={item.firstimage || item.firstimage2 || noImage} alt={item.title} />
                  </ScheduleBox>
                ))}
              </ScheduleContainer>
            </DayContainer>
          );
        }
        return null; // 일정이 없는 경우는 렌더링하지 않음
      })}
    </Container>
  );
};

export default MyGuideBookDetail;
