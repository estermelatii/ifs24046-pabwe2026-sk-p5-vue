import { describe, it, expect, vi, afterEach } from "vitest";
import * as apiHelperModule from "../../../helpers/apiHelper";
import * as aucationApiModule from "./aucationApi";

const apiHelper = apiHelperModule.default ?? apiHelperModule;
const aucationApi = aucationApiModule.default ?? aucationApiModule;

function mockResponse(json) {
  return vi.spyOn(apiHelper, "fetchData").mockResolvedValue({ json: async () => json });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("aucationApi.getTodoById", () => {
  it("mengembalikan data.todo bila ada", async () => {
    mockResponse({ status: "success", data: { todo: { id: 1 } } });
    expect(await aucationApi.getTodoById(1)).toEqual({ id: 1 });
  });

  it("mengembalikan data bila todo tidak ada", async () => {
    mockResponse({ status: "success", data: { id: 2 } });
    expect(await aucationApi.getTodoById(2)).toEqual({ id: 2 });
  });

  it("mengembalikan undefined bila data tidak ada", async () => {
    mockResponse({ status: "success" });
    expect(await aucationApi.getTodoById(3)).toBeUndefined();
  });
});
