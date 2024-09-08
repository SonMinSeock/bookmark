// 로그인 API (더미 데이터 사용)
export const loginUser = async (email, password) => {
  try {
    // 실제 백엔드 호출 주석 처리
    /*
    const response = await fetch("/loginProc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data; // 로그인 성공 시 받은 데이터를 반환
    */

    // 더미 데이터로 로그인 성공 처리
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "로그인 성공",
          user: { email, password, userId: 1 }, // userId는 더미로 1로 설정
        });
      }, 500); // 500ms 후에 성공 응답
    });
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// 회원가입 API (더미 데이터 사용)
export const signupUser = async (userData) => {
  try {
    // 실제 백엔드 호출 주석 처리
    /*
    const response = await fetch("https://your-backend-api.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("회원가입 실패");
    }

    return await response.json();
    */

    // 더미 데이터로 회원가입 성공 처리
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "회원가입 성공",
          user: {
            userEmail: userData.userEmail,
            provider: userData.provider,
          },
        });
      }, 500);
    });
  } catch (error) {
    console.error("회원가입 에러:", error);
    throw error;
  }
};

// 북마크 조회 API (더미 데이터 사용)
export const fetchBookmarks = async (userId) => {
  // userId가 없으면 빈 배열 반환
  if (!userId) return [];

  // 실제 백엔드 호출 주석 처리
  /*
  try {
    const response = await fetch(`/api/bookmark/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookmarks");
    }
    const data = await response.json();
    return data; // API로부터 받은 북마크 contentid 리스트 반환
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
  */

  // 더미 데이터 반환 (테스트용)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]); // 더미 contentid 리스트
    }, 500);
  });
};

// 북마크 추가 API (더미 데이터 사용)
export const addBookmarkApi = async (userId, contentId) => {
  try {
    // 실제 백엔드 호출 주석 처리
    /*
    const response = await fetch("/api/bookmark/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        contentId: contentId,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to add bookmark");
    }
    const data = await response.json();
    return data;
    */

    // 더미 데이터로 북마크 추가 처리
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`북마크 추가 (더미): userId: ${userId}, contentId: ${contentId}`);
        resolve({ success: true });
      }, 500);
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

// 북마크 삭제 API (더미 데이터 사용)
export const removeBookmarkApi = async (userId, contentId) => {
  // 실제 백엔드 호출 주석 처리
  /*
  try {
    const response = await fetch(`/api/bookmark/delete?userId=${userId}&contentId=${contentId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("북마크 삭제 실패");
  }
  */

  // 더미 데이터로 북마크 삭제 처리
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`북마크 삭제 (더미): userId: ${userId}, contentId: ${contentId}`);
      resolve({ success: true });
    }, 500); // 테스트를 위해 500ms 후 성공 응답
  });
};

// 가이드북 생성 API (더미 데이터 사용)
export const createGuideBookApi = async (guideBookData) => {
  // 실제 백엔드 호출 주석 처리
  /*
  try {
    const response = await fetch("/api/guidebook/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  */

  // 더미 데이터로 가이드북 생성 처리
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: "가이드북 생성 성공",
        guideBook: { id: Date.now(), ...guideBookData }, // 더미로 생성된 가이드북 데이터
      });
    }, 500);
  });
};

// 가이드북 조회 API (더미 데이터 사용)
export const fetchGuideBooksByUser = async (userId) => {
  // 실제 백엔드 호출 주석 처리
  /*
  try {
    const response = await fetch(`/api/guidebook/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch guidebooks");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching guidebooks:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
  */

  // 더미 데이터 반환 (테스트용)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          userId,
          title: "Jeju Island Trip",
          destination: "Jeju Island",
          startDate: "2024-09-15",
          endDate: "2024-09-20",
          days: [
            { dayNumber: 1, contentIds: ["123456", "789012"] },
            { dayNumber: 2, contentIds: ["345678"] },
          ],
        },
        {
          id: 2,
          userId,
          title: "Seoul City Tour",
          destination: "Seoul",
          startDate: "2024-10-01",
          endDate: "2024-10-03",
          days: [
            { dayNumber: 1, contentIds: [] },
            { dayNumber: 2, contentIds: ["123456", "789012"] },
          ],
        },
      ]);
    }, 500);
  });
};

//가이드북 일정 변경 API 호출
export const updateGuidebookDaysApi = async (guidebookId, days) => {
  try {
    const response = await fetch(`/api/guidebook/${guidebookId}/updateDays`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
