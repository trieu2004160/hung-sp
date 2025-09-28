// Mock data generator for Student Courses App

const COURSE_CATEGORIES = [
  "Programming",
  "Design",
  "Math",
  "Science",
  "Language",
  "Business",
];
const PROGRAMMING_COURSES = [
  "React Native Development",
  "JavaScript Fundamentals",
  "Python Programming",
  "Web Development",
  "Mobile App Development",
  "Data Structures",
  "Algorithms",
];
const DESIGN_COURSES = [
  "UI/UX Design",
  "Graphic Design",
  "Web Design",
  "Mobile Design",
  "Typography",
  "Color Theory",
  "Design Systems",
];
const MATH_COURSES = [
  "Calculus I",
  "Linear Algebra",
  "Statistics",
  "Discrete Mathematics",
  "Probability",
  "Differential Equations",
  "Number Theory",
];
const SCIENCE_COURSES = [
  "Physics I",
  "Chemistry",
  "Biology",
  "Environmental Science",
  "Astronomy",
  "Geology",
  "Computer Science",
];
const LANGUAGE_COURSES = [
  "English Literature",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Creative Writing",
];
const BUSINESS_COURSES = [
  "Marketing",
  "Finance",
  "Management",
  "Entrepreneurship",
  "Economics",
  "Accounting",
  "Business Strategy",
];

const COURSE_LISTS = {
  Programming: PROGRAMMING_COURSES,
  Design: DESIGN_COURSES,
  Math: MATH_COURSES,
  Science: SCIENCE_COURSES,
  Language: LANGUAGE_COURSES,
  Business: BUSINESS_COURSES,
};

const FIRST_NAMES = [
  "Alex",
  "Jordan",
  "Taylor",
  "Casey",
  "Morgan",
  "Riley",
  "Avery",
  "Quinn",
  "Blake",
  "Cameron",
  "Drew",
  "Emery",
  "Finley",
  "Hayden",
  "Jamie",
  "Kendall",
  "Logan",
  "Parker",
  "Reese",
  "Sage",
  "Skyler",
  "Sydney",
  "Tatum",
  "River",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
];

const EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "student.edu",
  "university.edu",
];

// Generate random student data
export function generateStudent(id) {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const emailDomain =
    EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];

  return {
    id: id.toString(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
    avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&color=fff&size=100`,
    courses: generateStudentCourses(),
  };
}

// Generate courses for a student
function generateStudentCourses() {
  const numCategories = Math.floor(Math.random() * 4) + 2; // 2-5 categories
  const selectedCategories = COURSE_CATEGORIES.sort(
    () => 0.5 - Math.random()
  ).slice(0, numCategories);

  const courses = [];
  selectedCategories.forEach((category) => {
    const categoryCourses = COURSE_LISTS[category];
    const numCourses = Math.floor(Math.random() * 3) + 1; // 1-3 courses per category
    const selectedCourses = categoryCourses
      .sort(() => 0.5 - Math.random())
      .slice(0, numCourses);

    selectedCourses.forEach((courseTitle) => {
      courses.push({
        id: `${category}-${courseTitle}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        title: courseTitle,
        category: category,
        duration: `${Math.floor(Math.random() * 8) + 4} weeks`,
        credits: Math.floor(Math.random() * 3) + 2,
      });
    });
  });

  return courses;
}

// Generate students with pagination
export function generateStudents(page, pageSize = 10) {
  const startIndex = (page - 1) * pageSize;
  const students = [];

  for (let i = 0; i < pageSize; i++) {
    students.push(generateStudent(startIndex + i + 1));
  }

  return students;
}

// Simulate API delay
export function simulateApiDelay(ms = 800) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Mock API functions
export async function fetchStudents(page = 1, pageSize = 10) {
  await simulateApiDelay();
  const students = generateStudents(page, pageSize);
  const hasMore = page < 10; // Simulate 10 pages of data
  return { students, hasMore, page };
}

export async function fetchStudentById(id) {
  await simulateApiDelay(500);
  return generateStudent(id);
}

// Group courses by category for SectionList
export function groupCoursesByCategory(courses) {
  const grouped = {};
  courses.forEach((course) => {
    if (!grouped[course.category]) {
      grouped[course.category] = [];
    }
    grouped[course.category].push(course);
  });

  return Object.keys(grouped).map((category) => ({
    title: category,
    data: grouped[category],
  }));
}

// Search courses by title
export function searchCourses(courses, query) {
  if (!query.trim()) return courses;
  return courses.filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase())
  );
}
