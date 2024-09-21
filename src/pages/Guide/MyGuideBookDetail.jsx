import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect"; // react-device-detect 사용
import DraggableBox from "../../components/DragDrop/DraggableBox";
import DroppableContainer from "../../components/DragDrop/DroppableContainer";
import { updateGuidebookDaysApi } from "../../api/backendApi";

// 스타일링 추가
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
  margin-bottom: 32px;
`;

const DayTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px 0;
`;

const ScheduleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

// 버튼 스타일 추가
const SaveButton = styled.button`
  position: fixed;
  bottom: 140px;
  right: 30px;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#007aff")};
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: transform 0.3s ease;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#005bb5")};
    transform: scale(1.1);
  }
`;

const MyGuideBookDetail = () => {
  // 모바일 기기인지 확인 후 적절한 백엔드 선택
  const backend = isMobile ? TouchBackend : HTML5Backend;
  const { id } = useParams();
  // Redux에서 가져온 데이터
  const guidebooks = useSelector((state) => state.guideBook.books);
  const guidebookFromRedux = guidebooks.find((book) => book.id === parseInt(id));
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  const [guidebook, setGuidebook] = useState(JSON.parse(JSON.stringify(guidebookFromRedux)));
  const [isModified, setIsModified] = useState(false); // 변경 여부 추적
  const [isSaving, setIsSaving] = useState(false); // 저장 중 상태
  const navigate = useNavigate();

  const moveContent = (draggedItem, targetIndex, targetDayIndex) => {
    const { dayIndex: sourceDayIndex, index: sourceIndex } = draggedItem;
    if (sourceDayIndex === targetDayIndex && sourceIndex === targetIndex) return;

    const updatedDays = [...guidebook.days];
    const sourceContentIds = [...updatedDays[sourceDayIndex].contentIds];
    const [movedItem] = sourceContentIds.splice(sourceIndex, 1);

    if (sourceDayIndex === targetDayIndex) {
      sourceContentIds.splice(targetIndex, 0, movedItem);
      updatedDays[sourceDayIndex].contentIds = sourceContentIds;
    } else {
      const targetContentIds = [...updatedDays[targetDayIndex].contentIds];
      targetContentIds.splice(targetIndex, 0, movedItem);
      updatedDays[sourceDayIndex].contentIds = sourceContentIds;
      updatedDays[targetDayIndex].contentIds = targetContentIds;
    }

    setGuidebook({
      ...guidebook,
      days: updatedDays,
    });

    // 데이터가 수정된 상태로 설정 (수정 버튼 활성화)
    setIsModified(true);
  };

  const handleDelete = (dayIndex, contentId, e) => {
    e.stopPropagation();

    const newDays = guidebook.days.map((day) => ({
      ...day,
      contentIds: day.contentIds.filter((id) => id !== contentId),
    }));

    setGuidebook({
      ...guidebook,
      days: newDays,
    });

    // 데이터가 수정된 상태로 설정 (수정 버튼 활성화)
    setIsModified(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const daysData = guidebook.days.map((day) => ({
      dayNumber: day.dayNumber,
      contentIds: day.contentIds,
    }));

    console.log("Saving data to the backend:", daysData);

    try {
      // 여기에 실제 백엔드 API 호출을 추가합니다.
      await updateGuidebookDaysApi(guidebook.id, daysData, token);
      console.log("백엔드로 업데이트 성공");
      alert("수정사항이 저장되었습니다!");
      setIsModified(false); // 저장이 완료되면 버튼 비활성화
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false); // 저장 완료 상태로 변경
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
    <DndProvider backend={backend}>
      <Container>
        <Title>{guidebook.title || "제목 없음"}</Title>
        <Subtitle>{guidebook.area || guidebook.destination || "지역 없음"}</Subtitle>
        <DateRange>
          {guidebook.startDate
            ? `${new Date(guidebook.startDate).toLocaleDateString()} ~ ${new Date(
                guidebook.endDate
              ).toLocaleDateString()}`
            : "0000.00.00~0000.00.00"}
        </DateRange>
        <Divider />
        {guidebook.days.map((day, dayIndex) => (
          <DayContainer key={dayIndex}>
            <DayTitle>Day {day.dayNumber}</DayTitle>
            <ScheduleWrapper>
              <DroppableContainer day={day} dayIndex={dayIndex} moveContent={moveContent}>
                {day.contentIds.length > 0 ? (
                  day.contentIds.map((contentId, index) => (
                    <DraggableBox
                      key={contentId}
                      contentId={contentId}
                      index={index}
                      moveContent={moveContent}
                      dayIndex={dayIndex}
                      handleDelete={handleDelete}
                    />
                  ))
                ) : (
                  <p>일정이 없습니다.</p>
                )}
              </DroppableContainer>
            </ScheduleWrapper>
          </DayContainer>
        ))}
      </Container>

      <SaveButton onClick={handleSave} disabled={!isModified || isSaving}>
        {isSaving ? "..." : "저장"}
      </SaveButton>
    </DndProvider>
  );
};

export default MyGuideBookDetail;
