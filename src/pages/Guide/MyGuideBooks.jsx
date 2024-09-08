import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import styled from "styled-components";
import noImage from "../../assets/noimage.png";
import { fetchGuideBooksByUser } from "../../api/backendApi"; // API 호출 함수 임포트
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

const MyGuideBooks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const guidebooks = useSelector((state) => state.guideBook.books) || [];
  const userId = 1; // 실제 로그인한 유저 ID로 교체해야 함

  useEffect(() => {
    const loadGuideBooks = async () => {
      setLoading(true);
      try {
        const fetchedGuideBooks = await fetchGuideBooksByUser(userId);
        dispatch(setGuideBooks(fetchedGuideBooks)); // 가이드북 데이터를 리덕스 스토어에 저장
      } catch (error) {
        console.error("Failed to load guidebooks", error);
      } finally {
        setLoading(false);
      }
    };

    loadGuideBooks();
  }, [dispatch, userId]);

  const handleNavigate = (id) => {
    navigate(`/myGuideBooks/${id}`);
  };

  const getFirstImage = (days) => {
    for (let day of days) {
      if (day.contentIds.length > 0) {
        return day.contentIds[0].firstimage || noImage; // 첫 번째 이미지가 있으면 반환, 없으면 대체 이미지
      }
    }
    return noImage;
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
