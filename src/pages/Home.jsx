import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaCalendarAlt, FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import Modal from "react-modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useInitialTravels, useTravels, useFestivals } from "../hooks/useTravelQuries";
import { FaRegBookmark } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader"; // 로딩 스피너 추가

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

const GuideContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & .bookmark-icon:hover {
    color: #007aff;
    cursor: pointer;
  }
`;

const Title = styled.h2`
  font-size: 14px;
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

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 70px;
  right: 30px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &:hover {
    background-color: #005bbb;
  }
`;

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
  const [selectedTag, setSelectedTag] = useState("모두");
  const [displayedTravels, setDisplayedTravels] = useState([]);
  const [page, setPage] = useState(1);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const { data: initialTravels, isLoading: isInitialLoading, error: initialError } = useInitialTravels();
  const {
    data: travels,
    isLoading,
    error,
    isFetching,
  } = useTravels(area.code, tagTypes[selectedTag], selectedTag, page);

  const startDate = selectedRange[0].startDate
    ? selectedRange[0].startDate.toISOString().split("T")[0].replace(/-/g, "")
    : null;
  const endDate = selectedRange[0].endDate
    ? selectedRange[0].endDate.toISOString().split("T")[0].replace(/-/g, "")
    : null;

  const {
    data: festivalData,
    isLoading: isFestivalLoading,
    error: festivalError,
  } = useFestivals(selectedTag === "행사" ? area.code : null, startDate, endDate, page);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }

      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
        if (!isFetching && !isLoading && !isFestivalLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, isLoading, isFestivalLoading]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTagClick = (tag) => {
    if (selectedTag !== tag) {
      setSelectedTag(tag);
      setDisplayedTravels([]);
      setPage(1); // 페이지도 초기화
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
    setDisplayedTravels([]);
    setPage(1);
  };

  const checkArea = (areaCode) => {
    return areaNames[areaCode] || "알 수 없는 지역";
  };

  useEffect(() => {
    if (selectedTag === "행사") {
      if (festivalData && festivalData.length > 0) {
        setDisplayedTravels((prevTravels) => {
          const newTravels = [...prevTravels, ...festivalData];
          const uniqueTravels = Array.from(new Set(newTravels.map((travel) => travel.contentid))).map((id) => {
            return newTravels.find((travel) => travel.contentid === id);
          });
          return uniqueTravels;
        });
      } else if (page === 1) {
        setDisplayedTravels([]); // 첫 페이지에서 데이터가 없을 경우 초기화
      }
    } else {
      if (page === 1) {
        setDisplayedTravels(travels || []);
      } else if (travels && travels.length > 0) {
        setDisplayedTravels((prevTravels) => {
          const newTravels = [...prevTravels, ...travels];
          const uniqueTravels = Array.from(new Set(newTravels.map((travel) => travel.contentid))).map((id) => {
            return newTravels.find((travel) => travel.contentid === id);
          });
          return uniqueTravels;
        });
      }
    }
  }, [page, travels, festivalData, selectedTag]);

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

      {showScrollToTop && (
        <ScrollToTopButton onClick={handleScrollToTop}>
          <FaArrowUp />
        </ScrollToTopButton>
      )}

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

      {(isInitialLoading || isLoading || isFestivalLoading) && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <ClipLoader color="#007aff" size={50} />
        </div>
      )}
      {error && <div>Error: {error.message}</div>}
      {festivalError && <div>Error: {festivalError.message}</div>}

      {displayedTravels.length > 0 &&
        displayedTravels.map((guide) => (
          <Guide key={guide.contentid}>
            <ImagePlaceholder>
              {guide.firstimage ? (
                <img src={guide.firstimage} />
              ) : guide.fistimage2 ? (
                <img src={guide.firstimage2} />
              ) : null}
            </ImagePlaceholder>
            <GuideContainer>
              <Title>{guide.title}</Title>
              <FaRegBookmark size={20} className="bookmark-icon" />
            </GuideContainer>
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
