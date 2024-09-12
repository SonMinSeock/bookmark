import styled from "styled-components";
import { useDrop } from "react-dnd";

const ScheduleContainer = styled.div`
  display: flex;
  min-height: 100px;
  border: 2px dashed ${({ $isOver }) => ($isOver ? "#007aff" : "#ddd")};
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  white-space: nowrap;
  max-width: 100%;
  margin-bottom: 16px;
`;

const DroppableContainer = ({ day, dayIndex, moveContent, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "content",
    drop: (draggedItem) => {
      if (draggedItem.dayIndex !== dayIndex) {
        moveContent(draggedItem, 0, dayIndex); // 빈 Day로 드롭된 경우 첫 번째 위치로 이동
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <ScheduleContainer ref={drop} $isOver={isOver}>
      {children}
    </ScheduleContainer>
  );
};

export default DroppableContainer;
