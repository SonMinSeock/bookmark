import styled from "styled-components";

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

const ScheduleBox = styled.div`
  width: 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 8px;
`;

const MyGuideBookDetail = () => {
  return (
    <Container>
      <Title>제목</Title>
      <Subtitle>지역</Subtitle>
      <DateRange>0000.00.00~0000.00.00</DateRange>
      <Divider />
      {[1, 2, 3].map((day, index) => (
        <DayContainer key={index}>
          <DayTitle>Day{day}</DayTitle>
          <ScheduleBox />
        </DayContainer>
      ))}
    </Container>
  );
};

export default MyGuideBookDetail;
