import styled from "styled-components";
import { FaArrowLeft, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateRange } from "react-date-range";
import Modal from "react-modal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Container = styled.div`
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const SearchBox = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 12px;
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

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  color: #aaa;
  cursor: pointer;
`;

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
  margin-top: auto; /* 버튼을 하단에 배치 */
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

const GuideCreate = () => {
  const [showDateRange, setShowDateRange] = useState(false);
  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/guide/title");
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

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
      </Header>
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
      <Button onClick={handleNext}>다음</Button>
    </Container>
  );
};

export default GuideCreate;
