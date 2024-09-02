import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import noImage from "../../assets/noimage.png";

// 지역, 코드 이름구성된 객체
const areaNames = {
  1: "서울특별시",
  2: "인천광역시",
  3: "대전광역시",
  4: "대구광역시",
  5: "광주광역시",
  6: "부산광역시",
  7: "울산광역시",
  8: "세종특별자치시",
  31: "경기도",
  32: "강원도",
  33: "충청북도",
  34: "충청남도",
  35: "경상북도",
  36: "경상남도",
  37: "전북특별자치도",
  38: "전라남도",
  39: "제주특별자치도",
};

const Container = styled.div`
  padding: 16px;
  padding-bottom: 100px;
  background-color: #f0f0f0;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  background-color: #e0e0e0;
  overflow: hidden;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  ${(props) =>
    props.selected &&
    `
    border: 2px solid #007aff;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4);
  `}

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5; /* 비활성화된 항목을 희미하게 */
    pointer-events: none; /* 클릭 방지 */
  `}

  &:hover {
    transform: scale(1.05);
  }

  & img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
`;

const BookMarkSelect = () => {
  const bookmarks = useSelector((state) => state.bookmarks);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 선택된 지역 코드 가져오기
  const selectedAreaName = location.state.area;
  const selectedAreaCode = Object.keys(areaNames).find((key) => areaNames[key] === selectedAreaName);

  // 선택된 지역 코드와 일치하는 북마크만 필터링
  const filteredBookmarks = bookmarks.filter((bookmark) => bookmark.areacode === selectedAreaCode);

  // 모든 Day의 스케줄에서 이미 추가된 북마크 ID 목록 가져오기
  const allDaysSchedule = Object.values(location.state.previousSchedule || {}).flat();
  const addedBookmarkIds = allDaysSchedule.map((item) => item.contentid);

  const handleSelect = (data) => {
    setSelectedId(data.contentid);
    setTimeout(() => {
      navigate("/guidebook/create/finally-step", {
        state: {
          ...location.state, // 이전 상태를 유지하며 추가
          selectedContent: data,
          selectedDay: location.state.day, // 선택된 Day 전달
        },
      });
    }, 300);
  };

  return (
    <Container>
      <ImageGrid>
        {filteredBookmarks.map((data) => {
          const isDisabled = addedBookmarkIds.includes(data.contentid);
          return (
            <ImagePlaceholder
              key={data.contentid}
              selected={data.contentid === selectedId}
              disabled={isDisabled} // 이미 추가된 북마크를 비활성화
              onClick={() => handleSelect(data)}
            >
              <img src={data.firstimage || noImage} alt="북마크 이미지" />
            </ImagePlaceholder>
          );
        })}
      </ImageGrid>
    </Container>
  );
};

export default BookMarkSelect;
