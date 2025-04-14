// store/modules/cart.js
const state = {
    items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
  };
  
  const getters = {
    cartItems: state => state.items,
    cartItemCount: state => state.items.reduce((count, item) => count + item.quantity, 0),
    cartTotal: state => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
  };
  
  const actions = {
    addToCart({ commit, state }, product) {
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        commit('updateCartItem', {
          id: product.id,
          quantity: existingItem.quantity + (product.quantity || 1)
        });
      } else {
        commit('addToCart', {
          ...product,
          quantity: product.quantity || 1
        });
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    updateCartItem({ commit, state }, { id, quantity }) {
      commit('updateCartItem', { id, quantity });
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    removeFromCart({ commit, state }, productId) {
      commit('removeFromCart', productId);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    clearCart({ commit }) {
      commit('clearCart');
      localStorage.removeItem('cart');
    }
  };
  
  const mutations = {
    addToCart(state, product) {
      state.items.push(product);
    },
    
    updateCartItem(state, { id, quantity }) {
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    
    removeFromCart(state, productId) {
      state.items = state.items.filter(item => item.id !== productId);
    },
    
    clearCart(state) {
      state.items = [];
    }
  };
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  };