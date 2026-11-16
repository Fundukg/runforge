import type { FilterStatus, Sorted } from "../../App";
import styles from "./Controls.module.css";

type ControlsProps = {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: FilterStatus;
  setStatusFilter: (val: FilterStatus) => void;
  isSorted: string;
  setIsSorted: (val: Sorted) => void;
};

export function Controls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  isSorted,
  setIsSorted,
}: ControlsProps) {
  return (
    <header className={styles.container}>
      <div className={styles.searchGroup}>
        <label htmlFor="search" className={styles.label}>
          Поиск
        </label>
        <input
          id="search"
          type="text"
          className={styles.searchInput}
          placeholder="Название или репозиторий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="statusFilter" className={styles.label}>
          Статус
        </label>
        <select
          id="statusFilter"
          className={styles.statusSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
        >
          <option value="all">Все</option>
          <option value="queued">Ожидающие</option>
          <option value="running">Запущенные</option>
          <option value="succeeded">Успешные</option>
          <option value="failed">Неудачные</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="sortFilter" className={styles.label}>
          Сортировка
        </label>
        <select
          id="sortFilter"
          className={styles.statusSelect}
          value={isSorted}
          onChange={(e) => setIsSorted(e.target.value as Sorted)}
        >
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="longest">Сначала долгие</option>
          <option value="shortest">Сначала быстрые</option>
        </select>
      </div>
    </header>
  );
}
