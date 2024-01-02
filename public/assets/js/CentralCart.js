const CentralCart = {
  host: location.host,
  /**
   *
   * @param {string} path
   * @param {Object} data
   * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' } method
   * @returns {Promise<{status: number, data?: object}>}
   */
  fetch: async function (path = "", data, method) {
    const options = {};
    if (data) {
      options.body = JSON.stringify(data);
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    if (method) options.method = method;

    return fetch("https://" + this.host + "/" + path, options).then(
      async (res) => {
        const response = { status: res.status };

        try {
          const data = await res.json();
          response.data = data;
        } catch {}

        if (res.ok) return response;

        return Promise.reject(response);
      }
    );
  },

  cartAdd: async function (package_id, options = {}) {
    return this.fetch(`/cart/add/${package_id}`, { options }, "POST");
  },

  cartRemove: async function (package_id) {
    return this.fetch(`/cart/remove/${package_id}`, {}, "POST");
  },

  cartSetOptions: async function (package_id, options = {}) {
    return this.fetch(`/cart/set/${package_id}`, { options }, "POST");
  },

  cartSetQuantity: async function (package_id, quantity) {
    return this.fetch(`/cart/set/${package_id}/${quantity}`, {}, "POST");
  },

  attachCoupon: async function (code) {
    return this.fetch(`/cart/coupon/${code}`, {}, "PUT");
  },

  detachCoupon: async function () {
    return this.fetch(`/cart/coupon`, {}, "DELETE");
  },

  _applications: {},
  requestDiscord: function () {
    return new Promise((resolve) => {
      window.open(`https://www.instagram.com/`, "_blank", "width=640;height=640");

      this._applications.discord = function (data) {
        const avatar_url = data.avatar
          ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${
              Math.floor(Math.random() * 5) + 1
            }.png`;

        resolve({
          id: data.id,
          display_name: data.username + "#" + data.discriminator,
          avatar_url,
        });
      };
    });
  },

  /**
   *
   * @param {Object} data
   * @param {string} data.gateway
   * @param {string} data.client_email
   * @param {string} data.client_identifier
   * @param {string} data.client_name
   * @param {string} data.client_phone
   * @param {string} data.client_document
   * @param {string} data.client_discord
   * @param {string} data.terms
   * @returns
   */
  checkout: async function (data) {
    return this.fetch("/cart/checkout", data, "POST");
  },
};

window.addEventListener("message", (e) => {
  if (e.data.hasOwnProperty("discord")) {
    CentralCart._applications.discord(e.data.discord);
  }
});

window.CentralCart = CentralCart;
