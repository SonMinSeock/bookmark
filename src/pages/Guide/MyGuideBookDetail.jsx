import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import noImage from "../../assets/noimage.png"; // 대체 이미지 경로
import { useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai"; // 'x' 아이콘 추가
import { updateGuidebookDaysApi } from "../../api/backendApi";

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
    opacity: 0.5;
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

const MyGuideBookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 리덕스에서 가이드북 상태를 가져옴
  const guidebooks = useSelector((state) => state.guideBook.books);
  const guidebookFromRedux = guidebooks.find((book) => book.id === parseInt(id));

  const [guidebook, setGuidebook] = useState(JSON.parse(JSON.stringify(guidebookFromRedux)));
  const [isModified, setIsModified] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // 드래그 시작 시
  const handleDragStart = (dayIndex, contentId) => {
    setDraggedItem({ dayIndex, contentId });

    // 드래그 중인 항목에 클래스를 추가하여 스타일링 적용
    const element = document.querySelector(`[data-contentid="${contentId}"]`);
    if (element) {
      element.classList.add("dragging");
    }
  };

  const handleDragOver = (e, targetContentId = null) => {
    e.preventDefault();

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

  const handleDrop = (dayIndex, targetContentId = null) => {
    if (!draggedItem) return;

    const newDays = guidebook.days.map((day) => ({
      ...day,
      contentIds: [...day.contentIds],
    }));

    const sourceDay = [...newDays[draggedItem.dayIndex].contentIds]; // 원본 훼손 방지
    const targetDay = [...newDays[dayIndex].contentIds]; // 타겟 Day도 복사하여 사용

    const draggedIndex = sourceDay.indexOf(draggedItem.contentId);
    const targetIndex = targetContentId !== null ? targetDay.indexOf(targetContentId) : -1;

    if (draggedIndex !== -1) {
      const [movedItem] = sourceDay.splice(draggedIndex, 1); // 드래그된 항목 삭제

      if (draggedItem.dayIndex === dayIndex) {
        // **같은 Day 내에서 순서 변경**
        if (targetIndex === -1) {
          // 타겟이 없을 때 맨 끝에 삽입
          sourceDay.push(movedItem);
        } else if (draggedIndex > targetIndex) {
          // 왼쪽으로 이동 (타겟 앞에 삽입)
          sourceDay.splice(targetIndex, 0, movedItem);
        } else {
          // 오른쪽으로 이동 (타겟 뒤에 삽입)
          sourceDay.splice(targetIndex + 1, 0, movedItem);
        }
      } else {
        // **다른 Day로 이동**
        if (targetContentId) {
          const targetIndex = targetDay.indexOf(targetContentId); // 타겟 인덱스
          targetDay.splice(targetIndex, 0, movedItem); // 타겟의 앞에 삽입
        } else {
          // 타겟이 없으면 맨 끝에 삽입
          targetDay.push(movedItem);
        }
      }

      // 새로운 상태 업데이트
      newDays[draggedItem.dayIndex].contentIds = sourceDay; // 드래그된 Day의 상태 갱신
      newDays[dayIndex].contentIds = targetDay; // 타겟 Day의 상태 갱신

      console.log("After update:", { newDays });

      setGuidebook((prev) => ({
        ...prev,
        days: newDays, // 상태를 새로운 days로 업데이트
      }));

      setIsModified(true); // 상태 수정됨을 표시
      handleDragEnd(); // 드래그 후 관련 스타일 제거
    }
  };

  const handleDragLeave = (targetContentId = null) => {
    // 드롭할 위치에서 벗어나면 스타일 제거
    const element = document.querySelector(`[data-contentid="${targetContentId}"]`);
    if (element) {
      element.classList.remove("dropTarget");
    }
  };

  const handleDelete = (dayIndex, contentId, e) => {
    e.stopPropagation();

    const newDays = guidebook.days.map((day) => ({
      ...day,
      contentIds: day.contentIds.filter((id) => id !== contentId),
    }));

    setGuidebook((prev) => ({
      ...prev,
      days: newDays,
    }));
    setIsModified(true);
  };

  // 컴포넌트 언마운트 시 업데이트
  useEffect(() => {
    const handleBeforeUnloadOrNavigate = (event) => {
      if (isModified) {
        const daysData = guidebook.days.map((day) => ({
          dayNumber: day.dayNumber,
          contentIds: day.contentIds,
        }));
        // 실제 API 호출 (현재는 로그로 대체)
        console.log("Guidebook days data to update:", daysData);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnloadOrNavigate);

    return () => {
      handleBeforeUnloadOrNavigate();
      window.removeEventListener("beforeunload", handleBeforeUnloadOrNavigate);
    };
  }, [isModified, guidebook.days]);

  return (
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
            <ScheduleContainer
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(dayIndex)}
            >
              {day.contentIds.map((contentId, idx) => (
                <ScheduleBox
                  key={contentId}
                  draggable
                  onDragStart={() => handleDragStart(dayIndex, contentId)}
                  onDragOver={(e) => handleDragOver(e, contentId)}
                  onDragLeave={() => handleDragLeave(contentId)}
                  onDrop={() => handleDrop(dayIndex, contentId)}
                  onDragEnd={handleDragEnd}
                  data-contentid={contentId}
                >
                  <ImageBox src={noImage} alt="Content" />
                  <DeleteIcon onClick={(e) => handleDelete(dayIndex, contentId, e)} />
                </ScheduleBox>
              ))}
            </ScheduleContainer>
            <AddBox onClick={() => alert("일정 추가")}>일정 추가</AddBox>
          </ScheduleWrapper>
        </DayContainer>
      ))}
    </Container>
  );
};

export default MyGuideBookDetail;
