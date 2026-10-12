import { describe, it, expect } from "vitest";
import { h } from "vue";
import { renderWithProviders } from "./test-utils";

const Dummy = { render: () => h("div", "halo") };

describe("renderWithProviders opsi global", () => {
  it("memakai global.stubs dan global.mocks bila diberikan", () => {
    const { wrapper } = renderWithProviders(Dummy, {
      global: { stubs: { Foo: true }, mocks: { $t: (k) => k } },
    });
    expect(wrapper.text()).toBe("halo");
  });
});
