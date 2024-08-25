import { useState } from "react";
import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import Modal from "react-modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  color: #aaa;
  position: relative;
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-right: 60px;
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
  const [showDateRange, setShowDateRange] = useState(false);
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

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

  return (
    <Container>
      <SearchBox>
        <SearchInput placeholder="어디로 떠나세요?" />
        <DateBox>
          <DateDisplay onClick={() => setShowDateRange(true)}>
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
          <Tag>태그 1</Tag>
          <Tag>태그 2</Tag>
          <Tag>태그 3</Tag>
        </TagRow>
        <TagRow>
          <Tag>태그 4</Tag>
          <Tag>태그 5</Tag>
        </TagRow>
      </TagContainer>

      {GUIDES.map((guide) => (
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
      ))}
    </Container>
  );
};

export default Home;
