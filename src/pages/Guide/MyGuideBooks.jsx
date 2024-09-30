import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";
import noImage from "../../assets/noimage.png";
import { deleteGuideBookApi, fetchGuideBooksByUser } from "../../api/backendApi"; // API 호출 함수 임포트
import { setGuideBooks } from "../../redux/guideBookSlice"; // 리덕스 액션 임포트

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
`;

const GuideBookContainer = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  padding-top: 56.25%;
  background-color: #e0e0e0;
  border-radius: 12px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;

  & img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GuideInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const GuideTitle = styled.h2`
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const GuideSubtitle = styled.p`
  font-size: 14px;
  color: #aaa;
  margin: 4px 0 0;
`;

const NoGuidebooksMessage = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 18px;
  color: #777;
  line-height: 24px;
`;

const DeleteButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 1rem;
  margin-left: 8px;

  &:hover {
    background-color: #ff4e4e;
  }
`;

const MyGuideBooks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const guidebooks = useSelector((state) => state.guideBook.books) || [];
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!userId || !token) {
      // 로그인하지 않은 경우 welcome 페이지로 리다이렉트
      navigate("/welcome");
      return;
    }

    const loadGuideBooks = async () => {
      setLoading(true);
      try {
        const fetchedGuideBooks = await fetchGuideBooksByUser(userId, token);
        dispatch(setGuideBooks(fetchedGuideBooks)); // 가이드북 데이터를 리덕스 스토어에 저장
      } catch (error) {
        console.error("Failed to load guidebooks", error);
      } finally {
        setLoading(false);
      }
    };

    loadGuideBooks();
  }, [dispatch, userId, token, navigate]);

  const handleNavigate = (id) => {
    navigate(`/myGuideBooks/${id}`);
  };

  const getFirstImage = (days) => {
    if (days && days.length > 0) {
      for (let day of days) {
        if (day.bookmarks && day.bookmarks.length > 0) {
          return day.bookmarks[0].firstimage || noImage; // 첫 번째 이미지가 있으면 반환, 없으면 대체 이미지
        }
      }
    }
    return noImage; // days가 없으면 기본 이미지 반환
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 가이드북을 삭제하시겠습니까?")) {
      try {
        await deleteGuideBookApi(id, token); // 가이드북 삭제 API 호출
        alert("가이드북이 삭제되었습니다.");
        // 삭제 후 가이드북 리스트를 다시 불러옵니다
        const updatedGuideBooks = await fetchGuideBooksByUser(userId, token);
        dispatch(setGuideBooks(updatedGuideBooks)); // Redux 상태 업데이트
      } catch (error) {
        console.error("가이드북 삭제 실패", error);
        alert("가이드북 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <NoGuidebooksMessage>가이드북을 불러오는 중...</NoGuidebooksMessage>
      ) : guidebooks.length > 0 ? (
        guidebooks.map((guidebook, index) => (
          <GuideBookContainer key={index} onClick={() => handleNavigate(guidebook.id)}>
            <ImagePlaceholder>
              <img src={getFirstImage(guidebook.days)} alt={guidebook.title} />
            </ImagePlaceholder>
            <GuideInfo>
              <GuideTitle>{guidebook.title}</GuideTitle>
              <GuideSubtitle>
                {guidebook.destination}, {new Date(guidebook.startDate).toLocaleDateString()} ~{" "}
                {new Date(guidebook.endDate).toLocaleDateString()}
              </GuideSubtitle>
              {/* 삭제 버튼 추가 */}
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation(); // 가이드북 클릭 이벤트 전파 방지
                  handleDelete(guidebook.id);
                }}
              >
                삭제
              </DeleteButton>
            </GuideInfo>
          </GuideBookContainer>
        ))
      ) : (
        <NoGuidebooksMessage>
          아직 가이드북이 없습니다. <br /> 새로운 가이드북을 추가해보세요!
        </NoGuidebooksMessage>
      )}
    </Container>
  );
};

export default MyGuideBooks;
