export const Api = {
  async call(url, method, body = {}) {
    const data = {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (Object.keys(body).length > 0) {
      data.body = JSON.stringify(body);
    }
    const response = await fetch(url, data);
    let ans = await response.json();
    console.log(ans);
    return ans;
  },

  get(url, body = {}) {
    return this.call(url, "get");
  },

  post(url, body = {}) {
    return this.call(url, "post", body);
  },

  delete(url) {
    return this.call(url, "delete");
  },

  routes: {
    createComment: "/createComment",
    getComment: "/getComment",
    getComments: "/getComments",
    deleteComments: "/deleteComments",
  },
  REST_SERVER_URL: "http://localhost:3001",
  COMMENT_SOCKET_URL: "ws://localhost:3001",
};
