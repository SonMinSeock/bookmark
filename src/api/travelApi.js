// src/api/travelApi.js

export async function fetchTravelData(areaCode, tagType, page = 1) {
  const apiConfig = {
    apiKey: import.meta.env.VITE_AREA_TRAVLE,
  };
  console.log(tagType);
  try {
    const areaCodeParam = areaCode ? `&areaCode=${areaCode}` : "";
    const typeParam = tagType ? `&contentTypeId=${tagType}` : ""; // 타입 코드 추가
    const pageParam = `&pageNo=${page}`; // 페이지 번호를 추가

    const response = await fetch(
      `https://apis.data.go.kr/B551011/JpnService1/areaBasedList1?serviceKey=${apiConfig.apiKey}&numOfRows=10${pageParam}&MobileOS=ETC&MobileApp=AppTest&listYN=Y&arrange=A${areaCodeParam}${typeParam}&_type=json`
    );

    const res = await response.json();
    console.log(res);
    if (res?.response?.body?.items?.item) {
      return res.response.body.items.item;
    } else {
      console.error("No items found in the response");
      return [];
    }
  } catch (error) {
    console.error("Error fetching travel data:", error);
    throw new Error("Failed to fetch travel data");
  }
}

export async function fetchFestivalData(areaCode, startDate, endDate, page = 1) {
  const apiConfig = {
    apiKey: import.meta.env.VITE_AREA_TRAVLE,
  };

  const areaCodeParam = areaCode ? `&areaCode=${areaCode}` : "";
  const startDateParam = startDate
    ? `&eventStartDate=${startDate}`
    : `&eventStartDate=${new Date().toISOString().split("T")[0].replace(/-/g, "")}`;
  const endDateParam = endDate ? `&eventEndDate=${endDate}` : `&eventEndDate=20241231`;
  const pageParam = `&pageNo=${page}`;

  try {
    const response = await fetch(
      `https://apis.data.go.kr/B551011/JpnService1/searchFestival1?serviceKey=${apiConfig.apiKey}&numOfRows=10${pageParam}&MobileOS=ETC&MobileApp=AppTest&listYN=Y&arrange=A${areaCodeParam}${startDateParam}${endDateParam}&_type=json`
    );

    const res = await response.json();
    console.log("festival data res : ", res);
    if (res?.response?.body?.items?.item) {
      return res.response.body.items.item;
    } else {
      console.error("No items found in the response");
      return [];
    }
  } catch (error) {
    console.error("Error fetching festival data:", error);
    throw new Error("Failed to fetch festival data");
  }
}

// travelApi.js 상세조회 API
export async function fetchContentDetail(contentId) {
  const apiConfig = {
    apiKey: import.meta.env.VITE_AREA_TRAVLE,
  };

  try {
    const response = await fetch(
      `https://apis.data.go.kr/B551011/JpnService1/detailCommon1?serviceKey=${apiConfig.apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentId=${contentId}&overviewYN=Y&_type=json`
    );

    const res = await response.json();
    if (res?.response?.body?.items?.item) {
      return res.response.body.items.item[0]; // 상세 정보는 배열로 리턴되므로 첫 번째 아이템을 반환
    } else {
      console.error("No detailed information found in the response");
      return null;
    }
  } catch (error) {
    console.error("Error fetching content detail:", error);
    throw new Error("Failed to fetch content detail");
  }
}
