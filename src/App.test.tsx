import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import App from "./App";
import { fetchRuns } from "./api/runs";
import type { Run } from "./types/types";

vi.mock("./api/runs", () => ({
  fetchRuns: vi.fn(),
}));

const mockData: Run[] = [
  {
    id: "1",
    name: "Auth refactor",
    repository: "web-platform",
    branch: "main",
    status: "succeeded",
    createdAt: new Date().toISOString(),
    logs: ["Starting auth task...", "Success!"],
  },
  {
    id: "2",
    name: "Fix checkout",
    repository: "payments",
    branch: "dev",
    status: "failed",
    createdAt: new Date().toISOString(),
    logs: ["Connecting to payment gateway...", "Timeout error"],
  },
];

describe("Runforge Dashboard", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");

    vi.mocked(fetchRuns).mockResolvedValue(mockData);
  });

  it("должен фильтровать список при вводе в поиск", async () => {
    render(<App />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText("Auth refactor")).toBeInTheDocument();
    });

    const searchInput = screen.getByRole("textbox");

    await user.type(searchInput, "checkout");

    expect(screen.getByText("Fix checkout")).toBeInTheDocument();
    expect(screen.queryByText("Auth refactor")).not.toBeInTheDocument();
  });

  it("должен фильтровать список по статусу", async () => {
    render(<App />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText("Auth refactor")).toBeInTheDocument();
      expect(screen.getByText("Fix checkout")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Статус");

    await user.selectOptions(select, "succeeded");

    expect(screen.getByText("Auth refactor")).toBeInTheDocument();
    expect(screen.queryByText("Fix checkout")).not.toBeInTheDocument();
  });

  it("должен открывать детали запуска с логами по клику", async () => {
    render(<App />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText("Auth refactor")).toBeInTheDocument();
    });

    const detailButtons = screen.getAllByText("Показать детали");

    await user.click(detailButtons[0]);

    expect(screen.getByText("Success!")).toBeInTheDocument();
  });
});
