import styled from "styled-components";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import Modal from "react-modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSelector } from "react-redux";
import { DateDisplay } from "../../styles/HomeStyles";
import { IoIosArrowBack } from "react-icons/io";

// 컨테이너 스타일
const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// 헤더 스타일
const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  line-height: 28px;
  margin-bottom: 1rem;
`;

// 뒤로가기 버튼 스타일
const BackButton = styled.div`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
`;

// 검색 박스 스타일
const SearchBox = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// 검색 드롭다운 스타일
const SearchSelect = styled.select`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  background-color: #f0f0f0;
  color: #333;
`;

// 날짜 박스 스타일
const DateBox = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  color: #aaa;
  cursor: pointer;
`;

// 입력 박스 스타일
const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  margin-bottom: 12px;
  background-color: #f0f0f0;
`;

// 버튼 스타일
const Button = styled.button`
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
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

const GuideBookCreate = () => {
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const [showDateRange, setShowDateRange] = useState(false);
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [selectedArea, setSelectedArea] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedArea && selectedRange[0].startDate && selectedRange[0].endDate && title) {
      navigate("/guidebook/create/finally-step", {
        state: { title, area: selectedArea, dateRange: selectedRange[0] },
      });
    } else {
      alert("모든 필드를 작성해주세요.");
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
    }
    return "0000.00.00";
  };

  // useEffect(() => {
  //   if (!userId || !token) {
  //     navigate("/welcome");
  //   }
  // }, [userId, token, navigate]);

  return (
    <Container>
      <Header>
        <BackButton>
          <IoIosArrowBack size={28} onClick={() => navigate(-1)} />
        </BackButton>
      </Header>
      <Title>
        가이드북에 대해
        <br /> 정보를 작성해주세요.
      </Title>
      <SearchBox>
        <Input
          type="text"
          placeholder="가이드북 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <SearchSelect
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          placeholder="어디로 떠나세요?"
        >
          <option value="" disabled>
            지역을 선택하세요
          </option>
          {Object.entries(areaNames).map(([code, areaName]) => (
            <option key={code} value={areaName}>
              {areaName}
            </option>
          ))}
        </SearchSelect>
        {/* <DateBox onClick={() => setShowDateRange(true)}>
          <FaCalendarAlt style={{ marginRight: "8px" }} />
          {`${formatDateDisplay(selectedRange[0].startDate)} ~ ${formatDateDisplay(selectedRange[0].endDate)}`}
        </DateBox> */}
        <DateBox
          onClick={() => {
            setShowDateRange(true);
          }}
        >
          <DateDisplay>
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
      <Button onClick={handleNext}>다음</Button>
    </Container>
  );
};

export default GuideBookCreate;
