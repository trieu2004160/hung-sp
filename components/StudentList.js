import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { fetchStudents } from "../data/mockData";
import { loadStudentsData, saveStudentsData } from "../services/storageService";

const StudentList = ({ onStudentPress }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const storedData = await loadStudentsData();
      if (storedData.students.length > 0) {
        setStudents(storedData.students);
        setPage(storedData.page);
        setHasMore(storedData.hasMore);
      } else {
        loadStudents(1, true);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      loadStudents(1, true);
    }
  }, []);

  const loadStudents = useCallback(
    async (pageNum, isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoadingMore(true);
        }

        const result = await fetchStudents(pageNum, 10);

        if (isRefresh) {
          setStudents(result.students);
          setPage(1);
          await saveStudentsData(result.students, 1, result.hasMore);
        } else {
          const newStudents = [...students, ...result.students];
          setStudents(newStudents);
          setPage(pageNum);
          await saveStudentsData(newStudents, pageNum, result.hasMore);
        }

        setHasMore(result.hasMore);
      } catch (error) {
        Alert.alert("Error", "Failed to load students");
        console.error("Error loading students:", error);
      } finally {
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [students]
  );

  const handleRefresh = useCallback(() => {
    loadStudents(1, true);
  }, [loadStudents]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && !refreshing && hasMore) {
      loadStudents(page + 1, false);
    }
  }, [loadingMore, refreshing, hasMore, page, loadStudents]);

  const renderStudent = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() => onStudentPress(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentEmail}>{item.email}</Text>
          <Text style={styles.courseCount}>
            {item.courses.length} course{item.courses.length !== 1 ? "s" : ""}{" "}
            enrolled
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    ),
    [onStudentPress]
  );

  const renderFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.loadingText}>Loading more students...</Text>
        </View>
      );
    }

    if (!hasMore && students.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.endText}>No more students available</Text>
        </View>
      );
    }

    return null;
  }, [loadingMore, hasMore, students.length]);

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id}
      renderItem={renderStudent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#2563eb"]}
          tintColor="#2563eb"
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  studentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  courseCount: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "500",
  },
  arrowContainer: {
    padding: 8,
  },
  arrow: {
    fontSize: 24,
    color: "#9ca3af",
    fontWeight: "300",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 14,
  },
  endText: {
    color: "#9ca3af",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default StudentList;
