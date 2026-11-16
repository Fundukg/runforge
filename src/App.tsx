import { useState, useEffect } from "react";
import { fetchRuns } from "./api/runs";
import type { Run, RunStatus } from "./types/types";
import { Controls } from "./components/Controls";
import { RunList } from "./components/RunList";
import { Skeleton } from "./components/Skeleton";
import "./App.css";
import { ThemeToggle } from "./components/ThemeToggle/Index";

const getInitialStatus = (): FilterStatus => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const validStatuses = ["all", "queued", "running", "succeeded", "failed"];

  // Если статус из URL валидный, возвращаем его. Иначе "all"
  return validStatuses.includes(status as string)
    ? (status as FilterStatus)
    : "all";
};

const getInitialSearch = (): string => {
  const params = new URLSearchParams(window.location.search);
  return params.get("search") || "";
};

export type FilterStatus = RunStatus | "all";
export type Sorted = "newest" | "oldest" | "longest" | "shortest";
function App() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);
  const [isSorted, setIsSorted] = useState<Sorted>("newest");
  const [statusFilter, setStatusFilter] =
    useState<FilterStatus>(getInitialStatus);
  const [searchQuery, setSearchQuery] = useState<string>(getInitialSearch);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRuns();
        if (isMounted) {
          setRuns(data);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [retryTrigger]);
  useEffect(() => {
    const url = new URL(window.location.href);

    // Управляем параметром status
    if (statusFilter === "all") {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", statusFilter);
    }

    // Управляем параметром search (бонусом сохраняем и текстовый поиск)
    if (searchQuery.trim() === "") {
      url.searchParams.delete("search");
    } else {
      url.searchParams.set("search", searchQuery);
    }

    // history.replaceState меняет URL без перезагрузки страницы
    window.history.replaceState({}, "", url.toString());
  }, [statusFilter, searchQuery]);
  const sortedRuns = structuredClone(runs);
  switch (isSorted) {
    case "newest":
      sortedRuns.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "oldest":
      sortedRuns.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      break;
    case "longest":
      sortedRuns.sort((a, b) => {
        if (a.durationSeconds === undefined) return 1;
        if (b.durationSeconds === undefined) return -1;
        return b.durationSeconds - a.durationSeconds;
      });
      break;
    case "shortest":
      sortedRuns.sort((a, b) => {
        if (a.durationSeconds === undefined) return 1;
        if (b.durationSeconds === undefined) return -1;
        return a.durationSeconds - b.durationSeconds;
      });
      break;

    default:
      break;
  }

  const filteredRuns = sortedRuns.filter((run) => {
    const matchesStatus =
      statusFilter === "all" || run.status === statusFilter;
    const matchesSearch =
      run.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.repository.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleRetry = () => {
    setRetryTrigger((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Runforge</h1>
        <ThemeToggle />
      </header>

      <Controls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        isSorted={isSorted}
        setIsSorted={setIsSorted}
      />
      <main>
        {isLoading && <Skeleton />}

        {error && !isLoading && (
          <div className="state-container error-state">
            <p>Произошла ошибка при загрузке данных: {error}</p>
            <button className="primary-button" onClick={handleRetry}>
              Повторить
            </button>
          </div>
        )}

        {!isLoading && !error && filteredRuns.length === 0 && (
          <div className="state-container empty-state">
            <p>По вашему запросу ничего не найдено.</p>
            <button className="primary-button" onClick={handleResetFilters}>
              Сбросить фильтры
            </button>
          </div>
        )}

        {!isLoading && !error && filteredRuns.length > 0 && (
          <RunList runs={filteredRuns} />
        )}
      </main>
    </div>
  );
}

export default App;
