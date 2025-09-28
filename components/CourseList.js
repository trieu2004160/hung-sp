import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
} from "react-native";
import { groupCoursesByCategory, searchCourses } from "../data/mockData";

const CourseList = ({
  courses,
  onRefresh,
  refreshing = false,
  student = null,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and group courses based on search query
  const filteredSections = useMemo(() => {
    const filteredCourses = searchCourses(courses, searchQuery);
    return groupCoursesByCategory(filteredCourses);
  }, [courses, searchQuery]);

  const renderCourse = useCallback(
    ({ item }) => (
      <View style={styles.courseItem}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseDuration}>{item.duration}</Text>
        </View>
        <View style={styles.creditsContainer}>
          <Text style={styles.creditsText}>{item.credits} credits</Text>
        </View>
      </View>
    ),
    []
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
        <Text style={styles.sectionCount}>
          ({section.data.length} course{section.data.length !== 1 ? "s" : ""})
        </Text>
      </View>
    ),
    []
  );

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No courses found</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? "Try adjusting your search terms"
            : "No courses available"}
        </Text>
      </View>
    ),
    [searchQuery]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const renderStudentHeader = useCallback(() => {
    if (!student) return null;

    return (
      <View style={styles.studentCard}>
        <Image source={{ uri: student.avatar }} style={styles.avatar} />
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentEmail}>{student.email}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{student.courses.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {student.courses.reduce(
                (total, course) => total + course.credits,
                0
              )}
            </Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Set(student.courses.map((course) => course.category)).size}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Enrolled Courses</Text>
      </View>
    );
  }, [student]);

  const renderSearchHeader = useCallback(
    () => (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchQuery, clearSearch]
  );

  const renderFullHeader = useCallback(
    () => (
      <View>
        {renderStudentHeader()}
        {renderSearchHeader()}
      </View>
    ),
    [renderStudentHeader, renderSearchHeader]
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
        renderItem={renderCourse}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={renderFullHeader}
        stickySectionHeadersEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },
  clearButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ef4444",
    borderRadius: 16,
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 24,
  },
  courseItem: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  courseDuration: {
    fontSize: 14,
    color: "#6b7280",
  },
  creditsContainer: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563eb",
  },
  sectionHeader: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3730a3",
  },
  sectionCount: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  studentCard: {
    backgroundColor: "#ffffff",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  studentName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  studentEmail: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
});

export default CourseList;
