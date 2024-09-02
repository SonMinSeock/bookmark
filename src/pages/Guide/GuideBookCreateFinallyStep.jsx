import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import noImage from "../../assets/noimage.png";
import { FaSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addGuideBook } from "../../redux/guideBookSlice"; // 리덕스 액션 임포트

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
  max-width: calc(100% - 120px);
  margin-right: 1rem;
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

const ImageBox = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 16px;
  object-fit: cover;
`;

const AddBox = styled(ScheduleBox)`
  background-color: #ddd;
  color: #333;
  flex-shrink: 0;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 82px;
  right: 20px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  z-index: 1000;
`;

const GuideBookCreateFinallyStep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 리덕스 디스패치 훅

  const { area, dateRange, title, previousSchedule, selectedDay, selectedContent } = location.state || {};

  const [schedule, setSchedule] = useState(previousSchedule || { day1: [], day2: [], day3: [] });

  useEffect(() => {
    if (selectedDay && selectedContent) {
      setSchedule((prev) => {
        const existingDaySchedule = prev[selectedDay];
        // 중복된 항목이 있는지 확인
        const isDuplicate = existingDaySchedule.some((item) => item.contentid === selectedContent.contentid);
        if (!isDuplicate) {
          return {
            ...prev,
            [selectedDay]: [...existingDaySchedule, selectedContent],
          };
        }
        return prev; // 중복이 있다면 기존 상태 반환
      });
    }
  }, [selectedDay, selectedContent]);

  const addSchedule = (day) => {
    navigate("/guidebook/select", {
      state: {
        day,
        previousSchedule: schedule,
        area,
        dateRange,
        title,
      },
    });
  };

  const handleCreateGuideBook = () => {
    const newGuideBook = {
      id: Date.now(), // 고유 ID 생성
      title,
      area,
      dateRange: {
        startDate: dateRange.startDate.toISOString(), // Date 객체를 문자열로 변환
        endDate: dateRange.endDate.toISOString(), // Date 객체를 문자열로 변환
      },
      schedule,
    };
    dispatch(addGuideBook(newGuideBook)); // 리덕스 액션 디스패치
    alert("가이드북이 생성되었습니다!");
    navigate("/myGuideBooks"); // 생성 후 가이드북 리스트 페이지로 이동
  };

  return (
    <Container>
      <Header>
        <Title>{title || "제목 없음"}</Title>
        <Subtitle>{area || "지역 없음"}</Subtitle>
        <Subtitle>
          {dateRange
            ? `${new Date(dateRange.startDate).toLocaleDateString()} ~ ${new Date(
                dateRange.endDate
              ).toLocaleDateString()}`
            : "0000.00.00~0000.00.00"}
        </Subtitle>
      </Header>
      <Divider />
      {["day1", "day2", "day3"].map((day, index) => (
        <DayContainer key={day}>
          <DayTitle>Day{index + 1}</DayTitle>
          <ScheduleWrapper>
            <ScheduleContainer>
              {schedule[day].map((item, idx) =>
                item.firstimage ? (
                  <ImageBox key={idx} src={item.firstimage || item.firstimage2 || noImage} alt={item.title} />
                ) : (
                  <ScheduleBox key={idx}>{item.title}</ScheduleBox>
                )
              )}
            </ScheduleContainer>
            <AddBox onClick={() => addSchedule(day)}>일정 추가</AddBox>
          </ScheduleWrapper>
        </DayContainer>
      ))}
      <FloatingButton onClick={handleCreateGuideBook}>
        <FaSave /> {/* 저장 아이콘 사용 */}
      </FloatingButton>
    </Container>
  );
};

export default GuideBookCreateFinallyStep;
