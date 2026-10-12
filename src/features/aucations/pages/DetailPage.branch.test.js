import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DetailPage from "./DetailPage.vue";
import { renderWithProviders } from "../../../test-utils";

const h = vi.hoisted(() => ({ params: {} }));

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRoute: () => ({ params: h.params }),
    useRouter: () => ({ push: vi.fn() }),
  };
});

vi.mock("../components/MarkdownViewer.vue", () => ({
  default: { render: () => null },
}));

const profile = { id: 1, name: "A", email: "a@b.c" };
const todo = {
  id: 1,
  title: "",
  description: "isi",
  cover: "https://x.test/cover.png",
  is_finished: 0,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-02T00:00:00Z",
};

describe("DetailPage cabang tambahan", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("memakai alt bawaan Cover bila judul kosong", () => {
    h.params = { todoId: "1" };
    const { wrapper } = renderWithProviders(DetailPage, {
      preloadedState: { profile, todo },
    });
    expect(wrapper.find('img[alt="Cover"]').exists()).toBe(true);
  });

  it("memakai params.aucationId bila todoId tidak ada", () => {
    h.params = { aucationId: "7" };
    const { wrapper } = renderWithProviders(DetailPage, {
      preloadedState: { profile, todo },
    });
    expect(wrapper.vm.todoId).toBe("7");
  });
});
