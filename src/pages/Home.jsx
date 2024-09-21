import { useState, useEffect } from "react";
import {
  Container,
  SearchBox,
  SearchSelect,
  DateBox,
  DateDisplay,
  TagContainer,
  TagRow,
  Tag,
  ContentContainer,
  ImagePlaceholder,
  ContentHeader,
  Title,
  Subtitle,
  DescriptionWrapper,
  Description,
  MoreButton,
  CloseButton,
  ScrollToTopButton,
} from "../styles/HomeStyles"; // 경로를 상황에 맞게 조정하세요.
import { FaCalendarAlt, FaArrowUp, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { DateRange } from "react-date-range";
import Modal from "react-modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useInitialTravels, useTravels, useFestivals } from "../hooks/useTravelQuries";
import ClipLoader from "react-spinners/ClipLoader"; // 로딩 스피너 추가
import noImage from "../assets/noimage.png";
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark, resetBookmarks } from "../redux/bookmarkSlice"; // slice에서 가져오기
import { useLocation, useNavigate } from "react-router-dom";
import { addBookmarkApi, fetchBookmarks, removeBookmarkApi } from "../api/backendApi";
import { fetchContentDetail } from "../api/travelApi";

Modal.setAppElement("#root");

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
  // 1. 상태 관리
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
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
  const dispatch = useDispatch(); // Redux dispatch 사용
  const bookmarks = useSelector((state) => state.bookmarks); // 북마크 데이터 가져오기
  const navigate = useNavigate();

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

  const location = useLocation();

  // 2. 핸들러 함수 정의
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

  // 북마크 클릭핸들러
  const handleBookmarkClick = async (guide) => {
    // userId 또는 token이 없을 경우 welcome 페이지로 리다이렉트
    if (!userId || !token) {
      console.log("로그인되지 않은 상태에서 북마크를 시도하였습니다.");
      navigate("/welcome"); // 로그인 페이지 또는 웰컴 페이지로 리다이렉트
      return;
    }

    // API 호출하여 overview 데이터를 가져옴
    let overview = "";
    try {
      const detailData = await fetchContentDetail(guide.contentid); // 상세 조회 API 호출
      overview = detailData?.overview || "상세내용 없음"; // overview 값 설정
    } catch (error) {
      console.error("상세 조회 API 호출 실패:", error);
    }

    console.log("HandleBookmark 핸들러 북마크 할 data 확인 : ", guide);
    // 백엔드로 보낼 데이터 구성
    const bookmarkData = {
      userId, // 현재 로그인된 사용자 ID
      contentid: guide.contentid, // 콘텐츠 ID
      title: guide.title || "제목 없음", // 제목
      firstimage: guide.firstimage || "", // 첫 번째 이미지 URL (없으면 빈 문자열)
      firstimage2: guide.firstimage2 || "", // 두 번째 이미지 URL (없으면 빈 문자열)
      areacode: guide.areacode || "", // 지역 코드
      addr1: guide.addr1 || "주소 정보 없음", // 주소 (없으면 기본값)
      contenttypeid: guide.contenttypeid || "", // 콘텐츠 타입 (관광, 음식점 등)
      tel: guide.tel || "", // 전화번호 (없으면 빈 문자열)
      eventenddate: guide.eventenddate || null, // 행사 끝나는 날짜 (없으면 null)
      eventstartdate: guide.eventstartdate || null, // 행사 시작 날짜 (없으면 null)
      overview, // 상세 조회 API에서 가져온 overview
    };

    console.log("백엔드로 보낼 북마크 데이터:", bookmarkData);

    try {
      if (bookmarks.some((item) => item.contentid === guide.contentid)) {
        // 북마크 삭제 로직
        dispatch(removeBookmark(guide.contentid));

        // 나중에 사용할 백엔드 호출 (주석 처리)
        /*
        await removeBookmarkApi(userId, guide.contentid, token); // API로 북마크 삭제 요청
        console.log("북마크 삭제 성공");
        */

        console.log("북마크 삭제 로컬 상태 업데이트 성공");
      } else {
        // 북마크 추가 로직
        dispatch(addBookmark(guide));

        // 나중에 사용할 백엔드 호출 (주석 처리)
        /*
        await addBookmarkApi(userId, bookmarkData, token); // API로 북마크 추가 요청
        console.log("북마크 추가 성공");
        */

        console.log("북마크 추가 로컬 상태 업데이트 성공");
      }
    } catch (error) {
      console.error("북마크 처리 실패:", error);
    }
  };

  const handleMoreButtonClick = (content) => {
    navigate(`contents/${content.contentid}`, { state: { content } });
  };

  // 3. useEffect 정의

  console.log(userId, token);
  useEffect(() => {
    // 페이지 로드 시 스크롤을 상단으로 초기화
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!userId || !token) {
        console.log("로그인되지 않은 상태에서 북마크 조회를 시도하지 않습니다.");
        return; // userId 또는 token이 없을 경우 함수 종료
      }

      try {
        const bookmarkContentIds = await fetchBookmarks(userId, token); // API로 북마크 조회
        dispatch(resetBookmarks()); // 기존 북마크 초기화

        bookmarkContentIds.forEach((contentId) => {
          const bookmarkDetail = displayedTravels.find((item) => item.contentid === contentId.contentId);
          if (bookmarkDetail) {
            dispatch(addBookmark(bookmarkDetail));
          }
        });
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    };

    // 페이지 이동 시마다 북마크 불러오기
    loadBookmarks();
  }, [location, dispatch, userId, token, displayedTravels]);

  // 디바운스 함수 정의
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // useEffect에서 스크롤 핸들러에 디바운스 적용
  useEffect(() => {
    const handleScroll = debounce(() => {
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
    }, 200); // 200ms 디바운스

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, isLoading, isFestivalLoading]);

  useEffect(() => {
    if (selectedTag === "행사") {
      if (festivalData && festivalData.length > 0) {
        setDisplayedTravels((prevTravels) => {
          const newTravels = [...prevTravels, ...festivalData];
          const uniqueTravels = Array.from(new Set(newTravels.map((travel) => travel.contentid))).map((id) => {
            return newTravels.find((travel) => travel.contentid === id);
          }); // Set 이용하여 관광 데이터 콘텐츠 id 중복 제거후 Set에서 배열로 형변환
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

  console.log(bookmarks);

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
        <Modal
          isOpen={true}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000, // 모달이 상위에 뜨도록 설정
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <ClipLoader color="#007aff" size={50} />
        </Modal>
      )}

      {error && <div>Error: {error.message}</div>}
      {festivalError && <div>Error: {festivalError.message}</div>}

      {displayedTravels.length > 0 &&
        displayedTravels.map((content) => (
          <ContentContainer key={content.contentid}>
            <ImagePlaceholder>
              <img src={content.firstimage || content.firstimage2 || noImage} alt={content.title || "No Image"} />
            </ImagePlaceholder>
            <ContentHeader>
              <Title>{content.title}</Title>
              {bookmarks.some((item) => item.contentid === content.contentid) ? (
                <FaBookmark size={20} className="bookmark-icon selected" onClick={() => handleBookmarkClick(content)} />
              ) : (
                <FaRegBookmark size={20} className="bookmark-icon" onClick={() => handleBookmarkClick(content)} />
              )}
            </ContentHeader>
            <Subtitle>{`${checkArea(content.areacode)}`}</Subtitle>
            <DescriptionWrapper>
              <Description>{content.text}</Description>
              {content && (
                <MoreButton to={`contents/${content.contentid}`} onClick={handleMoreButtonClick.bind(null, content)}>
                  더보기
                </MoreButton>
              )}
            </DescriptionWrapper>
          </ContentContainer>
        ))}
    </Container>
  );
};

export default Home;
