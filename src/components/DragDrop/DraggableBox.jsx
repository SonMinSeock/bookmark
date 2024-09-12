import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import { AiOutlineClose } from "react-icons/ai"; // 'x' 아이콘 추가
import noImage from "../../assets/noimage.png"; // 대체 이미지 경로

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
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`;

const ImageBox = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
`;

const DeleteIcon = styled(AiOutlineClose)`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
  color: #ff4d4f;
  font-size: 18px;
  &:hover {
    color: #d32f2f;
  }
`;

const DraggableBox = ({ contentId, index, moveContent, dayIndex, handleDelete, item }) => {
  // 드래그 상태 수집
  const [{ isDragging }, ref] = useDrag({
    type: "content",
    item: { index, dayIndex, contentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "content",
    hover: (draggedItem) => {
      if (draggedItem.index !== index || draggedItem.dayIndex !== dayIndex) {
        moveContent(draggedItem, index, dayIndex);
        draggedItem.index = index;
        draggedItem.dayIndex = dayIndex;
      }
    },
  });

  // Fallback mechanism to handle missing item or properties
  const imageSource = item?.firstimage || item?.firstimage2 || noImage;

  return (
    <ScheduleBox
      ref={(node) => ref(drop(node))}
      isDragging={isDragging}
      isOver={false} // 드래그 중일 때 테두리 상태를 드래그 중에만 적용
    >
      {/* Ensure item exists before accessing properties */}
      <ImageBox src={imageSource} alt={item?.title || "No title"} />
      <DeleteIcon onClick={(e) => handleDelete(dayIndex, contentId, e)} />
    </ScheduleBox>
  );
};

export default DraggableBox;
