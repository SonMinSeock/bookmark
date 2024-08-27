// src/hooks/useTravelQueries.js
import { useQuery } from "@tanstack/react-query";
import { fetchTravelData } from "../api/travelApi";

export function useInitialTravels() {
  return useQuery({
    queryKey: ["initialTravels"],
    queryFn: () => fetchTravelData(), // 전체 데이터를 불러오기 위한 함수 호출 (지역 코드 없이)
  });
}

export function useTravels(areaCode, tagType, selectedTag, page = 1) {
  return useQuery({
    queryKey: ["travels", areaCode, tagType, selectedTag, page],
    queryFn: () => fetchTravelData(areaCode, tagType, page),
    enabled: !!areaCode || !!selectedTag, // areaCode 또는 selectedTag가 변경될 때 실행
    keepPreviousData: true, // 이전 데이터를 유지하면서 새로운 데이터를 불러옵니다.
  });
}
