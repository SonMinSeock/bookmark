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
  margin-bottom: 24px;
  padding: 16px;
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
  min-height: 120px;
`;

const ScheduleBox = styled.div`
  position: relative;
  flex: 0 0 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ccc;
  }
`;

const ImageBox = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const DeleteIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 18px;
  &:hover {
    color: #d32f2f;
  }
`;

const MyGuideBookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 리덕스에서 가이드북 상태를 가져옴
  const guidebooks = useSelector((state) => state.guideBook.books);
  const guidebookFromRedux = guidebooks.find((book) => book.id === parseInt(id));

  const [guidebook, setGuidebook] = useState(JSON.parse(JSON.stringify(guidebookFromRedux)));
  const [isModified, setIsModified] = useState(false); // 변경 여부 확인을 위한 상태

  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (dayIndex, contentId) => {
    setDraggedItem({ dayIndex, contentId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dayIndex, targetContentId = null) => {
    if (!draggedItem) return;

    const newDays = guidebook.days.map((day) => ({
      ...day,
      contentIds: [...day.contentIds],
    }));

    const sourceDay = newDays[draggedItem.dayIndex];
    const targetDay = newDays[dayIndex];

    // 같은 Day 내에서 순서 변경하는 로직을 제거했으므로, 같은 Day에서는 순서 변경이 불가능
    if (draggedItem.dayIndex !== dayIndex) {
      sourceDay.contentIds = sourceDay.contentIds.filter((id) => id !== draggedItem.contentId);

      if (targetContentId) {
        const targetIndex = targetDay.contentIds.indexOf(targetContentId);
        targetDay.contentIds.splice(targetIndex + 1, 0, draggedItem.contentId);
      } else {
        targetDay.contentIds.push(draggedItem.contentId);
      }

      setGuidebook((prev) => ({
        ...prev,
        days: newDays,
      }));

      setIsModified(true); // 변경된 경우 상태 업데이트
    }

    setDraggedItem(null);
  };

  // 일정 삭제 기능
  const handleDelete = (dayIndex, contentId, e) => {
    e.stopPropagation(); // 'x' 아이콘 클릭 시 부모의 onClick 이벤트 중단

    const newDays = guidebook.days.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          contentIds: day.contentIds.filter((id) => id !== contentId),
        };
      }
      return day;
    });

    setGuidebook((prev) => ({
      ...prev,
      days: newDays,
    }));

    setIsModified(true); // 일정 삭제 시에도 변경 상태 업데이트
  };

  // 페이지 언마운트 시 호출
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isModified) {
        const daysData = guidebook.days.map((day) => ({
          dayNumber: day.dayNumber,
          contentIds: day.contentIds,
        }));
        updateGuidebookDaysApi(id, daysData); // API 호출
      }
    };

    // 언마운트 시 호출
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload(); // 언마운트 시 호출
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [guidebook, isModified, id]);

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
        <DayContainer key={dayIndex} onDragOver={handleDragOver} onDrop={() => handleDrop(dayIndex)}>
          <DayTitle>Day {day.dayNumber}</DayTitle>
          <ScheduleContainer>
            {day.contentIds.map((contentId, idx) => (
              <ScheduleBox
                key={contentId}
                draggable
                onDragStart={() => handleDragStart(dayIndex, contentId)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(dayIndex, contentId)}
                onClick={() => navigate(`/contents/${contentId}`)}
              >
                <ImageBox src={noImage} alt="Content" />
                {/* 'x' 아이콘 클릭 시 전파 중단 */}
                <DeleteIcon onClick={(e) => handleDelete(dayIndex, contentId, e)} />
              </ScheduleBox>
            ))}
          </ScheduleContainer>
        </DayContainer>
      ))}
    </Container>
  );
};

export default MyGuideBookDetail;
