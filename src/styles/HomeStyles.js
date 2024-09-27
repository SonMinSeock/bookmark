// src/styles/HomeStyles.js
import styled from "styled-components";

export const Container = styled.div`
  margin-top: 40px;
  padding: 16px;
  padding-bottom: 80px;
  box-sizing: border-box;
`;

export const SearchBox = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const SearchSelect = styled.select`
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

export const DateBox = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  color: #aaa;
  cursor: pointer;
`;

export const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  color: #aaa;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const TagRow = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Tag = styled.div`
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

export const ContentContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

export const ImagePlaceholder = styled.div`
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

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* 북마크 아이콘 크기 고정 */
  & .bookmark-icon {
    font-size: 24px; /* 아이콘 크기를 고정 */
    cursor: pointer;
  }

  & .bookmark-icon:hover {
    color: #007aff;
  }

  & .selected {
    color: #007aff;
  }
`;

export const Title = styled.h2`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 8px;
  white-space: nowrap; /* 타이틀이 긴 경우 말줄임표로 표시 */
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 40px); /* 아이콘 공간을 제외한 타이틀 너비 */
`;

export const Subtitle = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
  margin: 0;
  margin-bottom: 12px;
`;

export const DescriptionWrapper = styled.div`
  position: relative;
`;

export const Description = styled.p`
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

export const MoreButton = styled.button`
  font-size: 16px;
  position: absolute;
  cursor: pointer;
  border: none;
  right: 0;
  bottom: 0;
  background: white;
  color: #007aff;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid transparent;
  padding-left: 0px;
  padding-right: 0px;
  &:hover {
    border-bottom: 1px solid #007aff;
  }
`;

export const CloseButton = styled.button`
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

export const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 140px; /* 플러스 버튼 바로 위에 위치 */
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
  z-index: 1400; /* 플러스 버튼 바로 아래에 위치 */

  &:hover {
    background-color: #005bbb;
  }
`;
