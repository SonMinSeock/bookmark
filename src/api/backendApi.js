// 로그인 API (더미 데이터 사용)
const API_URL = "https://port-0-last-guide-book-1mrfs72llwuqd2yb.sel5.cloudtype.app";

// Base64Url 디코딩 함수
const base64UrlDecode = (str) => {
  // Base64Url 포맷을 일반 Base64 포맷으로 변경
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // 디코딩하기 위해 패딩 추가
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  base64 += padding;

  // Base64 디코딩
  const decodedData = atob(base64);

  try {
    // 디코딩된 JSON 파싱
    return JSON.parse(decodedData);
  } catch (e) {
    console.error("디코딩 오류:", e);
    return null;
  }
};

// JWT 토큰 디코딩 함수
const decodeJwtToken = (token) => {
  // 토큰이 "Bearer "로 시작하면 분리
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  // 토큰을 '.' 기준으로 분리
  const [header, payload] = token.split(".");

  // 각각의 부분을 디코딩
  const decodedHeader = base64UrlDecode(header);
  const decodedPayload = base64UrlDecode(payload);

  return {
    header: decodedHeader,
    payload: decodedPayload,
  };
};

export const loginUser = async (email, password) => {
  try {
    const formData = new FormData();

    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });

    // 401 상태 코드를 직접 확인하여 예외 처리
    if (response.status === 401) {
      throw new Error("Unauthorized"); // 401 에러인 경우 예외를 던집니다.
    }

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const token = response.headers.get("Authorization");
    const {
      payload: { userId },
    } = decodeJwtToken(token);

    return { userId, token };

    // const data = await response.json();
    // return data; // 로그인 성공 시 받은 데이터를 반환
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// 회원가입 API (더미 데이터 사용)
export const signupUser = async (userData) => {
  try {
    // 실제 백엔드 호출 주석 처리
    const formData = new FormData();
    formData.append("username", userData.userEmail);
    formData.append("password", userData.password);
    // formData.append("userEmail", userData.userEmail);

    const response = await fetch(`${API_URL}/join`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("회원가입 실패");
    }

    return await response.json();

    // 더미 데이터로 회원가입 성공 처리
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve({
    //       message: "회원가입 성공",
    //       user: {
    //         userEmail: userData.userEmail,
    //         provider: userData.provider,
    //       },
    //     });
    //   }, 500);
    // });
  } catch (error) {
    console.error("회원가입 에러:", error);
    throw error;
  }
};

// 북마크 조회 API (더미 데이터 사용)
export const fetchBookmarks = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/bookmark/${userId}`, {
      headers: {
        Authorization: token,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch bookmarks");
    }
    const { data } = await response.json();
    console.log("fetchBookmarks API : ", data);
    return data; // API로부터 받은 북마크 리스트 반환
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// 북마크 추가 API (더미 데이터 사용)
export const addBookmarkApi = async (bookmarkData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/bookmark/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(bookmarkData),
    });
    if (!response.ok) {
      throw new Error("Failed to add bookmark");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

// 북마크 삭제 API (더미 데이터 사용)
export const removeBookmarkApi = async (userId, contentId, token) => {
  // 실제 백엔드 호출 주석 처리

  try {
    const response = await fetch(`${API_URL}/api/bookmark/delete?userId=${userId}&contentId=${contentId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("북마크 삭제 실패");
  }

  // 더미 데이터로 북마크 삭제 처리
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     console.log(`북마크 삭제 (더미): userId: ${userId}, contentId: ${contentId}`);
  //     resolve({ success: true });
  //   }, 500); // 테스트를 위해 500ms 후 성공 응답
  // });
};

// 가이드북 생성 API (더미 데이터 사용)
export const createGuideBookApi = async (guideBookData, token) => {
  // 실제 백엔드 호출 주석 처리

  console.log("생성할 가이드북 데이터 : ", guideBookData);
  try {
    const response = await fetch(`${API_URL}/api/guidebook/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(guideBookData),
    });

    if (!response.ok) {
      throw new Error("Failed to create guidebook");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating guidebook:", error);
    throw error;
  }

  // 더미 데이터로 가이드북 생성 처리
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       message: "가이드북 생성 성공",
  //       guideBook: { id: Date.now(), ...guideBookData }, // 더미로 생성된 가이드북 데이터
  //     });
  //   }, 500);
  // });
};

// 가이드북 조회 API (더미 데이터 사용)
export const fetchGuideBooksByUser = async (userId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/guidebook/${userId}`, {
      method: "GET",
      headers: {
        Authorization: token, // JWT 토큰을 헤더에 포함
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("가이드북 조회 실패");
    }

    const { data } = await response.json();
    console.log("가이드북 목록 조회 응답 데이터:", data);
    return data; // 응답 JSON에서 'data' 필드를 반환
  } catch (error) {
    console.error("가이드북 목록 조회 에러:", error);
    throw error;
  }
};

// 가이드 북 상세 조회 API
export const fetchGuideBookDetail = async (guidebookId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/guidebook/${guidebookId}/full`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("가이드북 조회 실패");
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("가이드북 상세 조회 실패", error);
    throw error;
  }
};

//가이드북 일정 변경 API 호출
export const updateGuidebookDaysApi = async (guidebookId, days, token) => {
  try {
    const response = await fetch(`${API_URL}/api/guidebook/${guidebookId}/updateDays`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(days),
    });

    if (!response.ok) {
      throw new Error("Failed to update guidebook days");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating guidebook days", error);
    throw error;
  }
};

// 가이드북 삭제 API
export const deleteGuideBookApi = async (guidebookId, token) => {
  try {
    const response = await fetch(`${API_URL}/api/guidebook/${guidebookId}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("가이드북 삭제 실패");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting guidebook", error);
    throw error;
  }
};
