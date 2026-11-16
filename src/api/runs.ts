import type { Run } from "../types/types";
import { mockRuns } from "../data/mockData";

export function fetchRuns(): Promise<Run[]> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      Math.random() > 0.8
        ? reject(new Error("Network Error: Не удалось загрузить данные"))
        : resolve(mockRuns);
    }, 1000),
  );
}
