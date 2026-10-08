import apiHelper from "../../../helpers/apiHelper";

const aucationApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/aucations`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postAucation(title, description, start_bid, closed_at) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        start_bid: Number(start_bid),
        closed_at,
      }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan lelang");
    }
    return result.data;
  }

  async function postAucationCover(aucationId, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${aucationId}/cover`), {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover");
    }
    return result.message;
  }

  async function putAucation(aucationId, title, description, start_bid, closed_at) {
    const response = await apiHelper.fetchData(_url(`/${aucationId}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        start_bid: Number(start_bid),
        closed_at,
      }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah lelang");
    }
    return result.message;
  }

  async function getAucations(params = {}) {
    // support legacy string is_finished from old UI - ignore it
    const query =
      typeof params === "object" && params !== null && !Array.isArray(params)
        ? params
        : {};
    const qs = new URLSearchParams(
      Object.fromEntries(
        Object.entries(query).filter(
          ([, v]) => v !== "" && v !== null && v !== undefined
        )
      )
    ).toString();
    const response = await apiHelper.fetchData(_url(qs ? `/?${qs}` : "/"), {
      method: "GET",
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data lelang");
    }
    return result.data?.aucations || result.data || [];
  }

  // aliases for old store method names
  async function getTodos(is_finished) {
    return getAucations();
  }

  async function getAucationById(aucationId) {
    const response = await apiHelper.fetchData(_url(`/${aucationId}`), {
      method: "GET",
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail lelang");
    }
    return result.data?.aucation || result.data;
  }

  async function getTodoById(id) {
    return getAucationById(id);
  }

  async function deleteAucation(aucationId) {
    const response = await apiHelper.fetchData(_url(`/${aucationId}`), {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus lelang");
    }
    return result.message;
  }

  async function deleteTodo(id) {
    return deleteAucation(id);
  }

  async function postTodo(title, description, start_bid, closed_at) {
    // map old signature: if only 2 args, use defaults for bid/date
    if (arguments.length <= 2) {
      const closed = new Date();
      closed.setDate(closed.getDate() + 7);
      const closed_at_default = closed.toISOString().slice(0, 19).replace("T", " ");
      return postAucation(title, description, 10000, closed_at_default);
    }
    return postAucation(title, description, start_bid, closed_at);
  }

  async function putTodo(id, title, description, is_finished) {
    // old UI may pass is_finished; for auction keep existing detail fields best-effort
    const closed = new Date();
    closed.setDate(closed.getDate() + 7);
    const closed_at = closed.toISOString().slice(0, 19).replace("T", " ");
    return putAucation(id, title, description, 10000, closed_at);
  }

  async function postTodoCover(id, cover) {
    return postAucationCover(id, cover);
  }

  async function postBid(aucationId, bid) {
    const response = await apiHelper.fetchData(_url(`/${aucationId}/bids`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bid: Number(bid) }),
    });
    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengajukan bid");
    }
    return result.message;
  }

  return {
    postAucation,
    postAucationCover,
    putAucation,
    getAucations,
    getAucationById,
    deleteAucation,
    postBid,
    // backward compatible aliases used by existing store/UI
    postTodo,
    postTodoCover,
    putTodo,
    getTodos,
    getTodoById,
    deleteTodo,
  };
})();

export default aucationApi;
