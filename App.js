import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import StudentList from "./components/StudentList";
import StudentDetail from "./components/StudentDetail";
import {
  loadStudentsData,
  saveStudentsData,
  isDataStale,
} from "./services/storageService";
import { fetchStudents } from "./data/mockData";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("students"); // 'students' | 'detail'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from storage or fetch new data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedData = await loadStudentsData();

      // If no stored data or data is stale, fetch fresh data
      if (
        storedData.students.length === 0 ||
        isDataStale(storedData.lastRefresh)
      ) {
        const result = await fetchStudents(1, 10);
        await saveStudentsData(result.students, 1, result.hasMore);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStudentPress = useCallback((student) => {
    setSelectedStudent(student);
    setCurrentScreen("detail");
  }, []);

  const handleBackToStudents = useCallback(() => {
    setCurrentScreen("students");
    setSelectedStudent(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      const result = await fetchStudents(1, 10);
      await saveStudentsData(result.students, 1, result.hasMore);
    } catch (error) {
      console.error("Error refreshing data:", error);
      Alert.alert("Error", "Failed to refresh data");
    }
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading Student Courses App...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {currentScreen === "students" ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Student Courses App</Text>
            <Text style={styles.headerSubtitle}>
              Pull-to-refresh & Infinite scrolling
            </Text>
          </View>
          <StudentList onStudentPress={handleStudentPress} />
        </>
      ) : (
        <StudentDetail
          student={selectedStudent}
          onBack={handleBackToStudents}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
});
