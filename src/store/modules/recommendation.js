// src/store/modules/recommendation.js
import recommendationService from '@/services/recommendation.service.js'; // Đảm bảo đường dẫn này đúng

const state = {
    lastViewedProductId: null,
    relatedRecommendations: [],
    loadingRecommendations: false,
    recommendationError: null
};

const mutations = {
    SET_LAST_VIEWED_PRODUCT_ID(state, productId) {
        state.lastViewedProductId = productId;
    },
    SET_RELATED_RECOMMENDATIONS(state, recommendations) {
        state.relatedRecommendations = recommendations;
    },
    SET_LOADING_RECOMMENDATIONS(state, status) {
        state.loadingRecommendations = status;
    },
    SET_RECOMMENDATION_ERROR(state, error) {
        state.recommendationError = error;
    },
    CLEAR_RECOMMENDATIONS(state) { // Thêm mutation để xóa gợi ý khi cần
        state.relatedRecommendations = [];
        state.lastViewedProductId = null; // Có thể reset cả ID đã xem
        state.recommendationError = null;
    }
};

const actions = {
    async fetchRelatedRecommendations({ commit, state }, { productId, topN = 5 }) {
        if (!productId) {
            // console.warn("fetchRelatedRecommendations called without productId");
            return;
        }
        // console.log(`Action: Fetching recommendations for product ID: ${productId}`);
        commit('SET_LOADING_RECOMMENDATIONS', true);
        commit('SET_RECOMMENDATION_ERROR', null);
        // commit('SET_RELATED_RECOMMENDATIONS', []); // Tùy chọn: Xóa gợi ý cũ trước khi fetch mới
        try {
            const response = await recommendationService.getRecommendations(productId, topN);
            if (response.recommendations) {
                commit('SET_RELATED_RECOMMENDATIONS', response.recommendations);
            } else if (response.error) {
                console.error("API Error in fetchRelatedRecommendations:", response.error);
                commit('SET_RECOMMENDATION_ERROR', response.error);
                commit('SET_RELATED_RECOMMENDATIONS', []);
            } else {
                 // Trường hợp response không có recommendations cũng không có error (không mong muốn)
                 commit('SET_RELATED_RECOMMENDATIONS', []);
                 commit('SET_RECOMMENDATION_ERROR', 'Unexpected response format from recommendation API.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch recommendations';
            console.error("Catch Error in fetchRelatedRecommendations:", errorMessage);
            commit('SET_RECOMMENDATION_ERROR', errorMessage);
            commit('SET_RELATED_RECOMMENDATIONS', []);
        } finally {
            commit('SET_LOADING_RECOMMENDATIONS', false);
        }
    },
    setLastViewedProduct({ commit }, productId) {
        // console.log(`Action: Setting last viewed product ID: ${productId}`);
        commit('SET_LAST_VIEWED_PRODUCT_ID', productId);
    },
    clearRecommendations({ commit }) { // Action để gọi mutation xóa
        commit('CLEAR_RECOMMENDATIONS');
    }
};

const getters = {
    lastViewedProductId: state => state.lastViewedProductId,
    relatedRecommendations: state => state.relatedRecommendations,
    loadingRecommendations: state => state.loadingRecommendations,
    recommendationError: state => state.recommendationError,
    hasRelatedRecommendations: state => state.relatedRecommendations && state.relatedRecommendations.length > 0
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};