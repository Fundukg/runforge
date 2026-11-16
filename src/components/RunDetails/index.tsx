import { useEffect } from "react";
import type { Run, RunStatus } from "../../types/types";
import styles from "./RunDetails.module.css";

interface RunDetailsProps {
  run: Run;
  onClose: () => void;
}

export function RunDetails({ run, onClose }: RunDetailsProps) {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleContentClick}>
        <div className={styles.header}>
          <h2>{run.name}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className={styles.infoGrid}>
          <p>
            <strong>ID:</strong> {run.id}
          </p>
          <p>
            <strong>Статус:</strong>{" "}
            <span
              className={`${styles.statusBadge} ${STATUS_CONFIG[run.status].className}`}
            >
              {STATUS_CONFIG[run.status].label}
            </span>
          </p>
          <p>
            <strong>Репозиторий:</strong> {run.repository}
          </p>
          <p>
            <strong>Ветка:</strong> {run.branch}
          </p>
          <p>
            <strong>Создано:</strong>{" "}
            {new Date(run.createdAt).toLocaleString()}
          </p>
          {run.durationSeconds !== undefined && (
            <p>
              <strong>Продолжительность:</strong> {run.durationSeconds} сек
            </p>
          )}
          {run.result && (
            <p>
              <strong>Результат:</strong> {run.result}
            </p>
          )}
        </div>

        <div className={styles.logsSection}>
          <h3>Logs:</h3>
          <div className={styles.logsContainer}>
            {run.logs.length > 0 ? (
              run.logs.map((log, index) => (
                <div key={index} className={styles.logLine}>
                  {log}
                </div>
              ))
            ) : (
              <div className={styles.logEmpty}>No logs available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
