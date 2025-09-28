import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  STUDENTS: "students_data",
  STUDENT_PAGE: "student_page",
  STUDENT_HAS_MORE: "student_has_more",
  LAST_REFRESH: "last_refresh",
};

// Save students data to storage
export const saveStudentsData = async (students, page, hasMore) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.STUDENTS, JSON.stringify(students)],
      [STORAGE_KEYS.STUDENT_PAGE, page.toString()],
      [STORAGE_KEYS.STUDENT_HAS_MORE, hasMore.toString()],
      [STORAGE_KEYS.LAST_REFRESH, new Date().toISOString()],
    ]);
  } catch (error) {
    console.error("Error saving students data:", error);
  }
};

// Load students data from storage
export const loadStudentsData = async () => {
  try {
    const [studentsData, pageData, hasMoreData, lastRefreshData] =
      await AsyncStorage.multiGet([
        STORAGE_KEYS.STUDENTS,
        STORAGE_KEYS.STUDENT_PAGE,
        STORAGE_KEYS.STUDENT_HAS_MORE,
        STORAGE_KEYS.LAST_REFRESH,
      ]);

    const students = studentsData[1] ? JSON.parse(studentsData[1]) : [];
    const page = pageData[1] ? parseInt(pageData[1], 10) : 1;
    const hasMore = hasMoreData[1] ? hasMoreData[1] === "true" : true;
    const lastRefresh = lastRefreshData[1]
      ? new Date(lastRefreshData[1])
      : null;

    return { students, page, hasMore, lastRefresh };
  } catch (error) {
    console.error("Error loading students data:", error);
    return { students: [], page: 1, hasMore: true, lastRefresh: null };
  }
};

// Clear all stored data
export const clearStoredData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Error clearing stored data:", error);
  }
};

// Check if data is stale (older than 1 hour)
export const isDataStale = (lastRefresh) => {
  if (!lastRefresh) return true;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  return lastRefresh < oneHourAgo;
};

// Save individual student data
export const saveStudentData = async (studentId, studentData) => {
  try {
    const key = `student_${studentId}`;
    await AsyncStorage.setItem(key, JSON.stringify(studentData));
  } catch (error) {
    console.error("Error saving student data:", error);
  }
};

// Load individual student data
export const loadStudentData = async (studentId) => {
  try {
    const key = `student_${studentId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading student data:", error);
    return null;
  }
};
