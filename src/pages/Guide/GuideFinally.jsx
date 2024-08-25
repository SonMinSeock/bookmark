import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 80px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #555;
  font-weight: bold;
  margin-bottom: 4px;
  &:last-child {
    margin-top: 6px;
  }
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: 0;
  border-top: 1px solid #eee;
`;

const DayContainer = styled.div`
  margin-bottom: 32px;
`;

const DayTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const ScheduleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ScheduleContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  max-width: calc(100% - 120px); /* 일정 추가 박스의 너비를 고려하여 설정 */
`;

const ScheduleBox = styled.div`
  min-width: 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #555;
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 16px;
`;

const AddBox = styled(ScheduleBox)`
  background-color: #ddd;
  color: #333;
  flex-shrink: 0;
`;

const GuideFinally = () => {
  const [schedule, setSchedule] = useState({
    day1: [],
    day2: [],
    day3: [],
  });

  const addSchedule = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], `일정 ${prev[day].length + 1}`],
    }));
  };

  return (
    <Container>
      <Header>
        <Title>제목</Title>
        <Subtitle>지역</Subtitle>
        <Subtitle>0000.00.00~0000.00.00</Subtitle>
      </Header>
      <Divider />
      {["day1", "day2", "day3"].map((day, index) => (
        <DayContainer key={day}>
          <DayTitle>Day{index + 1}</DayTitle>
          <ScheduleWrapper>
            <ScheduleContainer>
              {schedule[day].map((item, idx) => (
                <ScheduleBox key={idx}>{item}</ScheduleBox>
              ))}
            </ScheduleContainer>
            <AddBox onClick={() => addSchedule(day)}>일정 추가</AddBox>
          </ScheduleWrapper>
        </DayContainer>
      ))}
    </Container>
  );
};

export default GuideFinally;
