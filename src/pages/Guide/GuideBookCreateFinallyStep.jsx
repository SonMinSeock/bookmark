import { useState, useEffect } from "react";
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
  flex-direction: column; // 세로로 배치
`;

const ScheduleContainer = styled.div`
  display: flex;
  overflow-x: auto; // 가로 스크롤 활성화
  white-space: nowrap;
  max-width: 100%;
  margin-bottom: 16px; // 일정과 일정 추가 버튼 사이에 간격 추가
`;

const ScheduleBox = styled.div`
  position: relative;
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

  &.dragging {
    opacity: 0.5; // 드래그 중인 항목 투명도
    border: 2px dashed #007aff; // 드래그 중인 항목 강조
  }

  &.dropTarget {
    border: 2px solid #ff4d4f; // 드롭할 수 있는 위치 강조
  }
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
  margin-top: 16px; // 일정과의 간격 추가
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

  // ScheduleBox의 스타일링 수정
  const handleDragStart = (day, contentId) => {
    setDraggedItem({ day, contentId });

    // 드래그 중인 항목에 클래스를 추가하여 스타일링 적용
    const element = document.querySelector(`[data-contentid="${contentId}"]`);
    if (element) {
      element.classList.add("dragging");
    }
  };

  const handleDragOver = (e, targetContentId = null) => {
    e.preventDefault();

    // 드롭할 위치 강조
    const element = document.querySelector(`[data-contentid="${targetContentId}"]`);
    if (element) {
      element.classList.add("dropTarget");
    }
  };

  const handleDragEnd = () => {
    // 드래그가 끝난 후 드래그 관련 스타일 제거
    const draggingElement = document.querySelector(".dragging");
    if (draggingElement) {
      draggingElement.classList.remove("dragging");
    }

    // 드롭 대상 스타일 제거
    const dropTargetElement = document.querySelector(".dropTarget");
    if (dropTargetElement) {
      dropTargetElement.classList.remove("dropTarget");
    }

    setDraggedItem(null); // 드래그된 항목 상태 초기화
  };

  const handleDrop = (day, targetContentId = null) => {
    if (!draggedItem) return;

    const newSchedule = { ...schedule };
    const sourceDay = newSchedule[draggedItem.day];
    const targetDay = newSchedule[day];

    // 같은 Day 내에서 순서 변경
    if (draggedItem.day === day) {
      const draggedIndex = sourceDay.findIndex((item) => item.contentid === draggedItem.contentId);
      const targetIndex = sourceDay.findIndex((item) => item.contentid === targetContentId);

      if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
        const [movedItem] = sourceDay.splice(draggedIndex, 1);
        sourceDay.splice(targetIndex, 0, movedItem);
      }
    } else {
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
    handleDragEnd(); // 드롭 후 스타일 제거
  };

  const handleDragLeave = (targetContentId = null) => {
    // 드롭할 위치에서 벗어나면 스타일 제거
    const element = document.querySelector(`[data-contentid="${targetContentId}"]`);
    if (element) {
      element.classList.remove("dropTarget");
    }
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
                  onDragOver={(e) => handleDragOver(e, item.contentid)}
                  onDragLeave={() => handleDragLeave(item.contentid)} // 드래그가 떠날 때 호출
                  onDrop={() => handleDrop(day, item.contentid)}
                  onDragEnd={handleDragEnd} // 드래그 끝날 때 스타일 제거
                  data-contentid={item.contentid} // 드래그 스타일 적용을 위한 데이터 속성
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
