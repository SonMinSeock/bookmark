import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableBox from "../../components/DragDrop/DraggableBox";
import DroppableContainer from "../../components/DragDrop/DroppableContainer";
import { createGuideBookApi } from "../../api/backendApi";
import { useSelector } from "react-redux";

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
  flex-direction: column;
`;

const AddBox = styled.div`
  background-color: #007aff;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 16px;
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
  const { area, dateRange, title, previousSchedule, selectedDay, selectedContent } = location.state || {};
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    let currentDay = 1;

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      days.push(`day${currentDay}`);
      currentDay++;
    }
    return days;
  };

  const days = calculateDays(dateRange.startDate, dateRange.endDate);

  const [schedule, setSchedule] = useState(previousSchedule || Object.fromEntries(days.map((day) => [day, []])));
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (selectedDay && selectedContent) {
      setSchedule((prev) => {
        const existingDaySchedule = prev[selectedDay];
        const isDuplicate = existingDaySchedule.some((item) => item.contentid === selectedContent.contentid);
        if (!isDuplicate) {
          setIsModified(true);
          return {
            ...prev,
            [selectedDay]: [...existingDaySchedule, selectedContent],
          };
        }
        return prev;
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

  const moveContent = (draggedItem, targetIndex, targetDayIndex) => {
    const { dayIndex: sourceDayIndex, index: sourceIndex } = draggedItem;
    if (sourceDayIndex === targetDayIndex && sourceIndex === targetIndex) return;

    const updatedSchedule = { ...schedule };
    const sourceContentIds = [...updatedSchedule[sourceDayIndex]];
    const [movedItem] = sourceContentIds.splice(sourceIndex, 1);

    if (sourceDayIndex === targetDayIndex) {
      sourceContentIds.splice(targetIndex, 0, movedItem);
      updatedSchedule[sourceDayIndex] = sourceContentIds;
    } else {
      const targetContentIds = [...updatedSchedule[targetDayIndex]];
      targetContentIds.splice(targetIndex, 0, movedItem);
      updatedSchedule[sourceDayIndex] = sourceContentIds;
      updatedSchedule[targetDayIndex] = targetContentIds;
    }

    setSchedule(updatedSchedule);
    setIsModified(true);
  };

  const handleDelete = (day, contentId, e) => {
    e.stopPropagation();

    const updatedSchedule = { ...schedule };
    updatedSchedule[day] = updatedSchedule[day].filter((item) => item.contentid !== contentId);

    setSchedule(updatedSchedule);
    setIsModified(true);
  };

  const handleCreateGuideBook = async () => {
    const newGuideBook = {
      userId,
      title,
      destination: area,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      schedule,
    };

    try {
      const response = await createGuideBookApi(newGuideBook, token);
      alert("가이드북이 성공적으로 생성되었습니다!");
      navigate("/myGuideBooks");
    } catch (error) {
      alert("가이드북 생성에 실패했습니다.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (!userId || !token) {
      // 로그인하지 않은 경우 welcome 페이지로 리다이렉트
      navigate("/welcome");
      return;
    }
  }, [userId, token, navigate]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        <Header>
          <Title>{title || "제목 없음"}</Title>
          <Subtitle>{area || "지역 없음"}</Subtitle>
          <Subtitle>
            {dateRange
              ? `${new Date(dateRange.startDate).toLocaleDateString()} ~ ${new Date(
                  dateRange.endDate
                ).toLocaleDateString()}`
              : "0000.00.00 ~ 0000.00.00"}
          </Subtitle>
        </Header>
        <Divider />
        {days.map((day, index) => (
          <DayContainer key={day}>
            <DayTitle>Day {index + 1}</DayTitle>
            <ScheduleWrapper>
              <DroppableContainer day={day} dayIndex={day} moveContent={moveContent}>
                {schedule[day].length > 0 ? (
                  schedule[day].map((item, idx) => (
                    <DraggableBox
                      key={item.contentid}
                      contentId={item.contentid}
                      index={idx}
                      dayIndex={day}
                      moveContent={moveContent}
                      handleDelete={handleDelete}
                      item={item}
                    />
                  ))
                ) : (
                  <p>일정이 없습니다.</p>
                )}
              </DroppableContainer>
              <AddBox onClick={() => addSchedule(day)}>일정 추가</AddBox>
            </ScheduleWrapper>
          </DayContainer>
        ))}
        <FloatingButton onClick={handleCreateGuideBook}>
          <FaSave />
        </FloatingButton>
      </Container>
    </DndProvider>
  );
};

export default GuideBookCreateFinallyStep;
