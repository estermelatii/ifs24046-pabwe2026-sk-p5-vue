import "@testing-library/jest-dom";
import { vi } from "vitest";

if (typeof globalThis.DELCOM_BASEURL === "undefined") {
  globalThis.DELCOM_BASEURL = "https://open-api.delcom.org/api/v1";
}

if (typeof document !== "undefined") {
  if (typeof document.elementFromPoint !== "function") {
    document.elementFromPoint = () => null;
  }
}

if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  if (!window.getComputedStyle) {
    window.getComputedStyle = () => ({
      getPropertyValue: () => "0",
    });
  }
}

// Mock SweetAlert2 agar tidak ada timer setelah test selesai
vi.mock("sweetalert2", () => {
  return {
    default: {
      fire: vi.fn(async () => ({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      })),
      close: vi.fn(),
      getPopup: vi.fn(() => null),
      isVisible: vi.fn(() => false),
    },
  };
});