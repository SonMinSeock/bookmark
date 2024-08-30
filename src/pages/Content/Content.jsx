import styled from "styled-components";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import noImage from "../../assets/noimage.png";
import { useDispatch, useSelector } from "react-redux";
import { addBookmark, removeBookmark } from "../../redux/bookmarkSlice";

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
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const BookmarkSpan = styled.span`
  font-size: 24px;
  & .bookmark-icon {
    cursor: pointer;
  }
  & .bookmark-icon:hover {
    color: #007aff;
  }
  & .selected {
    color: #007aff;
  }
  padding: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
  margin: 0;
  margin-bottom: 12px;
`;

// const Description = styled.p`
//   font-size: 14px;
//   font-weight: bold;
//   color: #333;
//   line-height: 1.7;
//   margin: 0;
// `;

const Content = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.bookmarks); // 북마크 데이터 가져오기

  // 북마크 클릭핸들러
  const handleBookmarkClick = (guide) => {
    if (bookmarks.some((item) => item.contentid === guide.contentid)) {
      dispatch(removeBookmark(guide.contentid));
    } else {
      dispatch(addBookmark(guide));
    }
  };

  // location.state가 없으면 오류 발생 가능성이 있으므로 철저히 방어
  if (!location.state || !location.state.content) {
    // 오류가 발생하지 않도록 안전한 기본값을 제공하거나, 에러 페이지로 리디렉션
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <IoChevronBackOutline />
          </BackButton>
        </Header>
        <p>Content data is missing or unavailable.</p>
      </Container>
    );
  }

  const content = location.state.content;

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <IoChevronBackOutline />
        </BackButton>
      </Header>
      <ImagePlaceholder>
        <img src={content.firstimage || content.firstimage2 || noImage} alt={content.title || "No Image"} />
      </ImagePlaceholder>
      <TitleRow>
        <Title>{content.title || "제목 없음"}</Title>
        <BookmarkSpan>
          {bookmarks.some((item) => item.contentid === content.contentid) ? (
            <FaBookmark size={20} className="bookmark-icon selected" onClick={() => handleBookmarkClick(content)} />
          ) : (
            <FaRegBookmark size={20} className="bookmark-icon" onClick={() => handleBookmarkClick(content)} />
          )}
        </BookmarkSpan>
      </TitleRow>
      <Subtitle>{content.addr1 || "주소 정보 없음"}</Subtitle>
      {content.contenttypeid === "85" && <Subtitle>{`${content.eventstartdate} ~ ${content.eventenddate}`}</Subtitle>}
    </Container>
  );
};

export default Content;
