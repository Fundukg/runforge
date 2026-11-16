import { useState } from "react";
import type { Run, RunStatus } from "../../types/types";
import { RunDetails } from "../RunDetails";
import styles from "./RunList.module.css";

type RunListProps = {
  runs: Run[];
};

export function RunList({ runs }: RunListProps) {
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);

  const STATUS_CONFIG: Record<
    RunStatus,
    { className: string; label: string }
  > = {
    queued: { className: styles.statusQueued, label: "Ожидает" },
    running: { className: styles.statusRunning, label: "В процессе" },
    succeeded: { className: styles.statusSucceeded, label: "Успешно" },
    failed: { className: styles.statusFailed, label: "Ошибка" },
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {runs.map((run) => {
          const statusConfig = STATUS_CONFIG[run.status];
          return (
            <div
              key={run.id}
              className={styles.card}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedRun(run);
                }
              }}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.title}>{run.name}</h3>
                <span
                  className={`${styles.statusBadge} ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
              </div>

              <div className={styles.infoBlock}>
                <span>
                  <strong>Репозиторий:</strong> {run.repository}
                </span>
                <span>
                  <strong>Ветка:</strong> {run.branch}
                </span>
              </div>

              <div className={styles.infoBlock}>
                <span>
                  <strong>Создано:</strong>{" "}
                  {new Date(run.createdAt).toLocaleString()}
                </span>
                {run.durationSeconds !== undefined && (
                  <span>
                    <strong>Продолжительность:</strong> {run.durationSeconds}{" "}
                    сек.
                  </span>
                )}
              </div>

              <button
                className={styles.button}
                onClick={() => setSelectedRun(run)}
                tabIndex={-1}
              >
                Показать детали
              </button>
            </div>
          );
        })}
      </div>

      {selectedRun && (
        <RunDetails run={selectedRun} onClose={() => setSelectedRun(null)} />
      )}
    </div>
  );
}
