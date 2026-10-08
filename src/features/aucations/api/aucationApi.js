import apiHelper from "../../../helpers/apiHelper";

const aucationApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/aucations`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postTodo(title, description) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiHelper.getAccessToken()}`,
      },
      body: JSON.stringify({ title, description }),
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success") {
      throw new Error(responseJson.message || "Gagal menambahkan todo");
    }
    return responseJson.data;
  }

  async function postTodoCover(todoId, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name || "cover.jpg");
    const response = await apiHelper.fetchData(_url(`/${todoId}/covers`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiHelper.getAccessToken()}`,
      },
      body: formData,
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success") {
      throw new Error(responseJson.message || "Gagal mengubah cover");
    }
    return responseJson.message;
  }

  async function putTodo(todoId, title, description, is_finished) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiHelper.getAccessToken()}`,
      },
      body: JSON.stringify({
        title,
        description,
        is_finished: is_finished ? 1 : 0,
      }),
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success") {
      throw new Error(responseJson.message || "Gagal mengubah todo");
    }
    return responseJson.message;
  }

  async function getTodos(is_finished) {
    let path = "/";
    if (is_finished !== undefined && is_finished !== null && is_finished !== "") {
      path = `/?is_finished=${is_finished}`;
    }
    const response = await apiHelper.fetchData(_url(path), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiHelper.getAccessToken()}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success") {
      throw new Error(responseJson.message || "Gagal mengambil data todo");
    }
    return responseJson.data?.todos ?? [];
  }

  async function getTodoById(todoId) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiHelper.getAccessToken()}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success") {
      throw new Error(responseJson.message || "Gagal mengambil detail todo");
    }
    return responseJson.data?.todo ?? responseJson.data;
  }

  async function deleteTodo(todoId) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiHelper.getAccessToken()}`,
      },
    });
    const responseJson = await response.json();
    if (responseJson.status !== "success") {
      throw new Error(responseJson.message || "Gagal menghapus todo");
    }
    return responseJson.message;
  }

  return {
    postTodo,
    postTodoCover,
    putTodo,
    getTodos,
    getTodoById,
    deleteTodo,
  };
})();

export default aucationApi;