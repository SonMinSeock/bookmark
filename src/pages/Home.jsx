import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Container = styled.div`
  margin-top: 40px;
  padding: 16px;
  padding-bottom: 80px; /* 맨 마지막 가이드가 가리는 형상 방지 하기 위해 추가했음 */
  box-sizing: border-box;
`;

const SearchBox = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  background-color: #f0f0f0;
  color: #aaa;

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
  background-color: #e0e0e0;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  color: #333;
  width: 89px;
  font-weight: bold;
  text-align: center;
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
  -webkit-line-clamp: 2; /* 두 줄까지만 보이도록 설정 */
  -webkit-box-orient: vertical;
  padding-right: 60px; /* "더보기" 버튼을 위한 공간 확보 */
`;

const MoreButton = styled(Link)`
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  padding-left: 4px;
  color: #007aff;
  text-decoration: none;
  font-weight: bold;
`;

const GUIDES = [
  {
    id: 1,
    title: "부산 여행",
    subTitle: "부산, 2024.08.16",
    text: "광안리 해수욕장은 광안대교와 함께하는 야경이 유명합니다. 밤이 되면 화려하게 빛나는 광안대교와 함께하는 바다 풍경은 부산 여행의 하이라이트 중 하나입니다.",
  },
  {
    id: 2,
    title: "전북 여행",
    subTitle: "전북, 2024.08.24 ",
    text: "전북 전주의 한옥마을은 전통과 현대가 어우러진 고즈넉한 풍경을 자랑합니다. 골목을 따라 걷다 보면, 전통 한옥의 멋스러움과 맛집들을 즐길 수 있습니다.",
  },
];

const Home = () => {
  return (
    <Container>
      <SearchBox>
        <SearchInput placeholder="어디로 떠나세요?" />
        <DateBox>
          <FaCalendarAlt style={{ marginRight: "8px" }} />
          0000.00.00 ~ 0000.00.00
        </DateBox>
      </SearchBox>
      <TagContainer>
        <TagRow>
          <Tag>태그 1</Tag>
          <Tag>태그 2</Tag>
          <Tag>태그 3</Tag>
        </TagRow>
        <TagRow>
          <Tag>태그 4</Tag>
          <Tag>태그 5</Tag>
        </TagRow>
      </TagContainer>
      {GUIDES.map((guide) => {
        return (
          <Guide key={guide.id}>
            <ImagePlaceholder />
            <Title>{guide.title}</Title>
            <Subtitle>{guide.subTitle}</Subtitle>
            <DescriptionWrapper>
              <Description>{guide.text}</Description>
              <MoreButton to={`guide/${guide.id}`} state={guide}>
                더보기
              </MoreButton>
            </DescriptionWrapper>
          </Guide>
        );
      })}
    </Container>
  );
};

export default Home;
