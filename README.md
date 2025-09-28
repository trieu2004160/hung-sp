# Student Courses App

A comprehensive React Native app demonstrating FlatList and SectionList components with advanced features like infinite scrolling, pull-to-refresh, search functionality, and data persistence.

## Features

### Part 1 - FlatList (Student List)
- ✅ **Student List Display**: Shows students with name, email, and profile avatar
- ✅ **Pull-to-Refresh**: Swipe down to reload the student list
- ✅ **Infinite Scrolling**: Load more students as you scroll to the bottom
- ✅ **Loading States**: Shows loading spinner while fetching data
- ✅ **End State**: Displays "No more students available" when all data is loaded

### Part 2 - SectionList (Course Categories)
- ✅ **Grouped Courses**: Courses are organized by category (Programming, Design, Math, etc.)
- ✅ **Sticky Headers**: Category names remain visible while scrolling
- ✅ **Search Functionality**: Real-time search to filter courses by name
- ✅ **Course Details**: Shows course title, duration, and credits
- ✅ **Section Counts**: Displays number of courses in each category

### Part 3 - Infinite Scrolling
- ✅ **Pagination**: Loads 10 students initially, then 10 more on scroll
- ✅ **Loading Indicators**: Shows spinner while loading more data
- ✅ **End Detection**: Automatically detects when user reaches bottom
- ✅ **State Management**: Properly manages loading and hasMore states

### Bonus Features
- ✅ **Navigation**: Tap student to view detailed course list
- ✅ **Data Persistence**: Uses AsyncStorage to persist data between app restarts
- ✅ **Modern UI**: Beautiful, responsive design with shadows and animations
- ✅ **Error Handling**: Graceful error handling with user-friendly messages
- ✅ **Performance**: Optimized with useCallback and proper key extraction

## Technical Implementation

### Components Structure
```
App.js (Main Navigation)
├── StudentList.js (FlatList with infinite scroll)
└── StudentDetail.js (Student info + CourseList)
    └── CourseList.js (SectionList with search)
```

### Data Management
- **Mock Data**: Realistic student and course data generation
- **AsyncStorage**: Persistent storage for offline functionality
- **State Management**: React hooks for efficient state updates
- **API Simulation**: Mock API calls with realistic delays

### Key Features
- **Pull-to-Refresh**: RefreshControl component
- **Infinite Scroll**: onEndReached with threshold
- **Search**: Real-time filtering with TextInput
- **Sticky Headers**: stickySectionHeadersEnabled
- **Loading States**: ActivityIndicator components
- **Error Handling**: Try-catch with user alerts

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Install AsyncStorage:
```bash
npm install @react-native-async-storage/async-storage
```

3. Run the app:
```bash
npm start
# or
npm run android
npm run ios
```

## Usage

1. **Student List**: Scroll through the list of students, pull down to refresh
2. **Load More**: Scroll to bottom to load more students automatically
3. **Student Details**: Tap any student to view their enrolled courses
4. **Course Search**: Use the search bar to filter courses by name
5. **Navigation**: Use the back button to return to the student list

## Data Structure

### Student Object
```javascript
{
  id: "1",
  name: "John Doe",
  email: "john.doe@email.com",
  avatar: "https://ui-avatars.com/api/...",
  courses: [...]
}
```

### Course Object
```javascript
{
  id: "course-id",
  title: "React Native Development",
  category: "Programming",
  duration: "8 weeks",
  credits: 3
}
```

## Performance Optimizations

- **useCallback**: Prevents unnecessary re-renders
- **keyExtractor**: Efficient list item identification
- **onEndReachedThreshold**: Optimized scroll detection
- **Memoization**: Cached search results and filtered data
- **Lazy Loading**: Load data only when needed

## Future Enhancements

- Add course enrollment functionality
- Implement user authentication
- Add course ratings and reviews
- Include course progress tracking
- Add push notifications for new courses


