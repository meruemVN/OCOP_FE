// store/modules/cart.js
import api from '@/services/api';

const state = {
  cart: {
    items: [],
    totalPrice: 0
  }
};

const getters = {
  cartItems: state => state.cart.items,
  cartTotalPrice: state => state.cart.totalPrice
};

const mutations = {
  SET_CART(state, cart) {
    state.cart = cart;
  }
};

const actions = {
  async getCart({ commit }) {
    const data = await api.get('/cart');
    commit('SET_CART', data);
    return data;
  },
  async updateCartItem({ commit }, { productId, quantity }) {
    const response = await api.put('/cart', { productId, quantity });
    commit('SET_CART', response.data || response);
    return response.data || response;
  },
  async addToCart({ commit }, { productId, quantity }) {
    const response = await api.post('/cart', { productId, quantity });
    commit('SET_CART', response.data || response);
    return response.data || response;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};