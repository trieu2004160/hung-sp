import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const PAGE_SIZE = 20;

function createItems(startIndex, count) {
  return Array.from({ length: count }, (_, idx) => {
    const id = startIndex + idx + 1;
    return {
      id: String(id),
      title: `Item #${id}`,
      subtitle: `Mô tả cho item ${id}`,
    };
  });
}

function simulateFetch(page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * PAGE_SIZE;
      const items = createItems(start, PAGE_SIZE);
      resolve({ items, hasMore: page < 5 }); // tối đa 5 trang
    }, 800);
  });
}

export default function App() {
  const [tab, setTab] = useState("flat"); // 'flat' | 'section'

  // FlatList state
  const [data, setData] = useState(() => createItems(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadFirstPage = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await simulateFetch(1);
      setData(res.items);
      setPage(1);
      setHasMore(res.hasMore);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadNextPage = useCallback(async () => {
    if (loadingMore || refreshing || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await simulateFetch(next);
      setData((prev) => [...prev, ...res.items]);
      setPage(next);
      setHasMore(res.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, refreshing, hasMore]);

  // SectionList demo data
  const sectionData = useMemo(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return letters.slice(0, 8).map((ch, i) => ({
      title: `Nhóm ${ch}`,
      data: createItems(i * 6, 6).map((x) => ({
        ...x,
        title: `${x.title} (${ch})`,
      })),
    }));
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    ),
    []
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FlatList & SectionList Demo</Text>
        <Text style={styles.headerSubtitle}>
          Pull-to-Refresh & Infinite Scrolling
        </Text>
      </View>

      <View style={styles.tabs}>
        <TabButton
          label="FlatList"
          active={tab === "flat"}
          onPress={() => setTab("flat")}
        />
        <TabButton
          label="SectionList"
          active={tab === "section"}
          onPress={() => setTab("section")}
        />
      </View>

      {tab === "flat" ? (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadFirstPage} />
          }
          onEndReachedThreshold={0.2}
          onEndReached={loadNextPage}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              {loadingMore ? (
                <ActivityIndicator />
              ) : !hasMore ? (
                <Text>Hết dữ liệu</Text>
              ) : null}
            </View>
          )}
        />
      ) : (
        <SectionList
          contentContainerStyle={styles.listContent}
          sections={sectionData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => {}} />
          }
        />
      )}
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f8",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 2,
    color: "#6b7280",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#2563eb",
  },
  tabLabel: {
    color: "#374151",
    fontWeight: "600",
  },
  tabLabelActive: {
    color: "#ffffff",
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    color: "#6b7280",
  },
  sectionHeader: {
    backgroundColor: "#eef2ff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionHeaderText: {
    color: "#1d4ed8",
    fontWeight: "700",
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
