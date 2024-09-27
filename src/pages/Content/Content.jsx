import styled from "styled-components";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import noImage from "../../assets/noimage.png";
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../../redux/bookmarkSlice";
import { addBookmarkApi, removeBookmarkApi } from "../../api/backendApi"; // API 호출 모듈 가져오기
import { useEffect, useState } from "react";
import { fetchContentDetail } from "../../api/travelApi";

// 스타일 컴포넌트 정의
const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
  & img {
    width: 100%;
    height: 100%;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  max-width: calc(100% - 40px); /* 아이콘을 위한 여유 공간 확보 */
  overflow-x: auto; /* 가로 스크롤 허용 */
  white-space: nowrap; /* 한 줄로 표시 */
`;

const BookmarkSpan = styled.span`
  font-size: 24px;
  margin-left: 8px;
  & .bookmark-icon {
    cursor: pointer;
    font-size: 24px;
    border-radius: 0; /* 원형 제거 */
    padding: 0; /* 여백 제거 */
    margin: 0; /* 여백 제거 */
  }

  & .bookmark-icon:hover {
    color: #007aff;
  }

  & .selected {
    color: #007aff;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
  margin: 0;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 16px 0;
`;

// 전체 타이틀 보여주기 위한 Modal 스타일
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  max-width: 90%;
  text-align: center;
`;

const Content = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks);
  const userId = "someUserId"; // 실제 유저 ID를 이 변수에 할당해야 함
  // const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const [overview, setOverview] = useState(null); // 상세 데이터를 저장할 state 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const content = location.state?.content; // location.state로 전달된 content 데이터를 받음

  // 상세 조회 API에서 overview만 받아오기
  useEffect(() => {
    if (content?.contentid) {
      const loadOverview = async () => {
        setLoading(true);
        try {
          const detailData = await fetchContentDetail(content.contentid); // 상세 정보 API 호출
          setOverview(detailData.overview);
        } catch (error) {
          console.error("Error fetching content detail:", error);
        } finally {
          setLoading(false);
        }
      };

      loadOverview();
    }
  }, [content]);

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

  const removeHtmlTags = (htmlString) => {
    return htmlString.replace(/<[^>]*>/g, ""); // 정규 표현식을 사용하여 HTML 태그 제거
  };

  // 날짜 문자열을 "YYYYMMDD"에서 "YYYY-MM-DD" 형식으로 변환하는 함수
  const convertDateString = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  // 행사 시작, 끝나는 날짜 형식 "."형식으로 변환하는 함수 (같은 연도면 생략)
  const formatEventDate = (startDate, endDate) => {
    const start = new Date(convertDateString(startDate));
    const end = new Date(convertDateString(endDate));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "날짜 정보 없음"; // 유효하지 않은 날짜 처리
    }

    const startYear = start.getFullYear();
    const endYear = end.getFullYear();

    const format = (date, includeYear = true) => {
      const year = includeYear ? `${date.getFullYear()}.` : "";
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}.${day}`;
    };

    // 시작일과 끝나는일 연도가 같으면 두 번째 연도를 생략
    if (startYear === endYear) {
      return `${format(start)} ~ ${format(end, false)}`;
    } else {
      return `${format(start)} ~ ${format(end)}`;
    }
  };

  // 로딩 중일 때 처리
  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <IoChevronBackOutline />
          </BackButton>
        </Header>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <IoChevronBackOutline />
        </BackButton>
      </Header>
      <ImagePlaceholder>
        <img src={content?.firstimage || content?.firstimage2 || noImage} alt={content?.title || "No Image"} />
      </ImagePlaceholder>
      <TitleRow>
        <Title>{content?.title || "제목 없음"}</Title>

        <BookmarkSpan>
          {bookmarks.some((item) => item.contentid === content.contentid) ? (
            <FaBookmark size={20} className="bookmark-icon selected" onClick={() => handleBookmarkClick(content)} />
          ) : (
            <FaRegBookmark size={20} className="bookmark-icon" onClick={() => handleBookmarkClick(content)} />
          )}
        </BookmarkSpan>
      </TitleRow>
      <Subtitle>{content?.addr1 || "주소 정보 없음"}</Subtitle>
      {overview && <Description>{removeHtmlTags(overview)}</Description>}
      {content?.contenttypeid === "85" && (
        <Subtitle>{formatEventDate(content?.eventstartdate, content?.eventenddate)}</Subtitle>
      )}
    </Container>
  );
};

export default Content;
