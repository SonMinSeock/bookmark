// src/api/travelApi.js

export async function fetchTravelData(areaCode, tagType) {
  const apiConfig = {
    apiKey: import.meta.env.VITE_AREA_TRAVLE,
  };
  console.log(tagType);
  try {
    const areaCodeParam = areaCode ? `&areaCode=${areaCode}` : "";
    const typeParam = tagType ? `&contentTypeId=${tagType}` : ""; // 타입 코드 추가
    const response = await fetch(
      `http://apis.data.go.kr/B551011/JpnService1/areaBasedList1?serviceKey=${apiConfig.apiKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&listYN=Y&arrange=A${areaCodeParam}${typeParam}&_type=json`
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
