import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import Modal from "react-modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useInitialTravels, useTravels } from "../hooks/useTravelQuries";

Modal.setAppElement("#root");

const Container = styled.div`
  margin-top: 40px;
  padding: 16px;
  padding-bottom: 80px;
  box-sizing: border-box;
`;

const SearchBox = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchSelect = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  background-color: #f0f0f0;
  color: #333;

  &::placeholder {
    color: #aaa;
  }
`;
const DateBox = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  color: #aaa;
`;

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  color: #aaa;
  cursor: pointer;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const TagRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const Tag = styled.div`
  background-color: ${(props) => (props.selected ? "#007aff" : "#e0e0e0")};
  color: ${(props) => (props.selected ? "white" : "#333")};
  padding: 8px 12px;
  border-radius: 20px;
  width: 89px;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.selected ? "#005bbb" : "#cce7ff")};
    color: white;
  }
`;

const Guide = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 150px;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  & img {
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
  margin: 0;
  margin-bottom: 12px;
`;

const DescriptionWrapper = styled.div`
  position: relative;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-right: 60px;
`;

const MoreButton = styled(Link)`
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  color: #007aff;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid #007aff;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #007aff;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  font-weight: bold;
`;

// const GUIDES = [
//   {
//     id: 1,
//     title: "부산 여행",
//     subTitle: "부산, 2024.08.16",
//     text: "광안리 해수욕장은 광안대교와 함께하는 야경이 유명합니다. 밤이 되면 화려하게 빛나는 광안대교와 함께하는 바다 풍경은 부산 여행의 하이라이트 중 하나입니다.",
//   },
//   {
//     id: 2,
//     title: "전북 여행",
//     subTitle: "전북, 2024.08.24 ",
//     text: "전북 전주의 한옥마을은 전통과 현대가 어우러진 고즈넉한 풍경을 자랑합니다. 골목을 따라 걷다 보면, 전통 한옥의 멋스러움과 맛집들을 즐길 수 있습니다.",
//   },
// ];

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

// 관광데이터 콘텐츠별 타입
const tagTypes = {
  모두: null,
  관광지: 76,
  문화시설: 78,
  행사: 85,
  음식점: 82,
};

const Home = () => {
  const [area, setArea] = useState("");
  const [showDateRange, setShowDateRange] = useState(false);
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [selectedTag, setSelectedTag] = useState(null); // 태그 하나만 선택 가능하도록 수정
  const [displayedTravels, setDisplayedTravels] = useState([]); // 표시할 여행 데이터 상태

  const handleTagClick = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setDisplayedTravels([]); // 태그 비활성화 시 데이터 초기화
    } else {
      setSelectedTag(tag);
      setDisplayedTravels([]); // 새로운 태그 선택 시 데이터 초기화
    }
  };

  const handleDateSelect = (ranges) => {
    setSelectedRange([ranges.selection]);
  };

  const formatDateDisplay = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    } else {
      return `0000.00.00`;
    }
  };

  const handleAreaInput = (event) => {
    const selectedArea = JSON.parse(event.target.value);
    setArea(selectedArea);
  };

  const checkArea = (areaCode) => {
    return areaNames[areaCode] || "알 수 없는 지역";
  };

  const { data: initialTravels, isLoading: isInitialLoading, error: initialError } = useInitialTravels();
  const { data: travels, isLoading, error, refetch } = useTravels(area.code, tagTypes[selectedTag], selectedTag);

  useEffect(() => {
    if (selectedTag !== null) {
      refetch().then((result) => {
        setDisplayedTravels(result.data || []); // 쿼리 실행 후 받은 데이터를 상태에 저장
      });
    }
  }, [selectedTag, refetch]);

  return (
    <Container>
      <SearchBox>
        <SearchSelect onChange={handleAreaInput} value={JSON.stringify(area)}>
          <option value="">어디로 떠나세요?</option>
          {Object.entries(areaNames).map(([code, areaName]) => (
            <option key={code} value={JSON.stringify({ code: Number(code), areaName })}>
              {areaName}
            </option>
          ))}
        </SearchSelect>
        <DateBox>
          <DateDisplay
            onClick={() => {
              setShowDateRange(true);
            }}
          >
            <FaCalendarAlt style={{ marginRight: "8px" }} />
            {`${formatDateDisplay(selectedRange[0].startDate)} ~ ${formatDateDisplay(selectedRange[0].endDate)}`}
          </DateDisplay>
        </DateBox>
      </SearchBox>

      <Modal
        isOpen={showDateRange}
        onRequestClose={() => setShowDateRange(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "12px",
            padding: "20px",
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <DateRange
          ranges={[
            {
              startDate: selectedRange[0].startDate || new Date(),
              endDate: selectedRange[0].endDate || new Date(),
              key: "selection",
            },
          ]}
          onChange={handleDateSelect}
          moveRangeOnFirstSelection={false}
        />
        <CloseButton onClick={() => setShowDateRange(false)}>닫기</CloseButton>
      </Modal>

      <TagContainer>
        <TagRow>
          <Tag selected={selectedTag === "모두"} onClick={() => handleTagClick("모두")}>
            모두
          </Tag>
          <Tag selected={selectedTag === "관광지"} onClick={() => handleTagClick("관광지")}>
            관광지
          </Tag>
          <Tag selected={selectedTag === "문화시설"} onClick={() => handleTagClick("문화시설")}>
            문화시설
          </Tag>
        </TagRow>
        <TagRow>
          <Tag selected={selectedTag === "행사"} onClick={() => handleTagClick("행사")}>
            행사
          </Tag>
          <Tag selected={selectedTag === "음식점"} onClick={() => handleTagClick("음식점")}>
            음식점
          </Tag>
        </TagRow>
      </TagContainer>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      {(displayedTravels.length > 0 ? displayedTravels : initialTravels)?.map((guide) => (
        <Guide key={guide.contentid}>
          <ImagePlaceholder>
            {guide.firstimage ? (
              <img src={guide.firstimage} />
            ) : guide.fistimage2 ? (
              <img src={guide.firstimage2} />
            ) : null}
          </ImagePlaceholder>
          <Title>{guide.title}</Title>
          <Subtitle>{`${checkArea(guide.areacode)}`}</Subtitle>
          <DescriptionWrapper>
            <Description>{guide.text}</Description>
            <MoreButton to={`guide/${guide.id}`} state={guide}>
              더보기
            </MoreButton>
          </DescriptionWrapper>
        </Guide>
      ))}
    </Container>
  );
};

export default Home;
