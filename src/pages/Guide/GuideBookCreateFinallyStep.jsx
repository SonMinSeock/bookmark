import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import noImage from "../../assets/noimage.png";
import { FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai"; // 'x' 아이콘 추가
import { createGuideBookApi } from "../../api/backendApi";

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
  position: relative; // 아이콘을 이미지 내부에 위치시키기 위해 필요
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
  &:hover {
    background-color: #ccc;
  }
`;

const DeleteIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 8px; // 여유 공간을 둬서 이미지 상단에서 떨어지게 함
  right: 8px; // 이미지 우측에서 8px 떨어지게 조정
  cursor: pointer;
  color: #ff4d4f;
  font-size: 18px;
  &:hover {
    color: #d32f2f;
  }
`;

const ImageBox = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
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

  const { area, dateRange, title, previousSchedule, selectedDay, selectedContent } = location.state || {};

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
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (selectedDay && selectedContent) {
      setSchedule((prev) => {
        const existingDaySchedule = prev[selectedDay];
        const isDuplicate = existingDaySchedule.some((item) => item.contentid === selectedContent.contentid);
        if (!isDuplicate) {
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

  // Drag 시작
  const handleDragStart = (day, contentId) => {
    setDraggedItem({ day, contentId });
  };

  // 드래그된 요소를 다른 요소 위로 올릴 때 (마우스를 다른 요소 위로 이동 중일 때)
  const handleDragOver = (e) => {
    e.preventDefault(); // 기본 동작 방지
  };

  // 드롭 시 처리
  const handleDrop = (day, targetContentId = null) => {
    if (!draggedItem) return;

    const newSchedule = { ...schedule };
    const sourceDay = newSchedule[draggedItem.day];
    const targetDay = newSchedule[day];

    // 다른 Day로 이동하는 경우만 허용
    if (draggedItem.day !== day) {
      const draggedIndex = sourceDay.findIndex((item) => item.contentid === draggedItem.contentId);
      if (draggedIndex !== -1) {
        const [movedItem] = sourceDay.splice(draggedIndex, 1);
        if (targetContentId) {
          const targetIndex = targetDay.findIndex((item) => item.contentid === targetContentId);
          targetDay.splice(targetIndex + 1, 0, movedItem);
        } else {
          targetDay.push(movedItem);
        }
      }
    }

    setSchedule(newSchedule);
    setDraggedItem(null);
  };

  // 일정 삭제
  const handleDelete = (day, contentId, e) => {
    e.stopPropagation();

    const newSchedule = { ...schedule };
    newSchedule[day] = newSchedule[day].filter((item) => item.contentid !== contentId);

    setSchedule(newSchedule);
  };

  // 가이드북 생성
  const handleCreateGuideBook = async () => {
    const newGuideBook = {
      userId: 1,
      title,
      destination: area,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      schedule,
    };

    try {
      const response = await createGuideBookApi(newGuideBook);
      alert("가이드북이 성공적으로 생성되었습니다!");
      navigate("/myGuideBooks");
    } catch (error) {
      alert("가이드북 생성에 실패했습니다.");
      console.error(error);
    }
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
      {days.map((day, index) => (
        <DayContainer key={day} onDragOver={handleDragOver} onDrop={() => handleDrop(day)}>
          <DayTitle>Day{index + 1}</DayTitle>
          <ScheduleWrapper>
            <ScheduleContainer>
              {schedule[day].map((item, idx) => (
                <ScheduleBox
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(day, item.contentid)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(day, item.contentid)}
                >
                  <ImageBox src={item.firstimage || item.firstimage2 || noImage} alt={item.title} />
                  <DeleteIcon onClick={(e) => handleDelete(day, item.contentid, e)} />
                </ScheduleBox>
              ))}
            </ScheduleContainer>
            <AddBox onClick={() => addSchedule(day)}>일정 추가</AddBox>
          </ScheduleWrapper>
        </DayContainer>
      ))}
      <FloatingButton onClick={handleCreateGuideBook}>
        <FaSave />
      </FloatingButton>
    </Container>
  );
};

export default GuideBookCreateFinallyStep;
