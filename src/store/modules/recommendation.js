// src/store/modules/recommendation.js
import recommendationService from '@/services/recommendation.service.js'; // Service FE

const state = {
    lastViewedProductId: null,
    relatedRecommendations: [],
    loadingRecommendations: false, // Cho related (product-based)
    recommendationError: null,   // Cho related

    userSpecificRecommendations: [],
    loadingUserSpecificRecommendations: false, // Cho user-based
    userSpecificRecommendationError: null,   // Cho user-based
};

const mutations = {
    // ... (các mutations giữ nguyên như phiên bản trước, đảm bảo có đủ cho cả related và user-specific)
    SET_LAST_VIEWED_PRODUCT_ID(state, productId) { state.lastViewedProductId = productId; },
    SET_RELATED_RECOMMENDATIONS(state, recommendations) { state.relatedRecommendations = recommendations || []; },
    SET_LOADING_RECOMMENDATIONS(state, status) { state.loadingRecommendations = status; },
    SET_RECOMMENDATION_ERROR(state, error) { state.recommendationError = error; },
    CLEAR_RELATED_RECOMMENDATIONS(state) {
        state.relatedRecommendations = [];
        state.recommendationError = null;
        state.loadingRecommendations = false;
    },

    SET_USER_SPECIFIC_RECOMMENDATIONS(state, recommendations) { state.userSpecificRecommendations = recommendations || []; },
    SET_LOADING_USER_SPECIFIC_RECOMMENDATIONS(state, isLoading) { state.loadingUserSpecificRecommendations = isLoading; },
    SET_USER_SPECIFIC_RECOMMENDATION_ERROR(state, error) { state.userSpecificRecommendationError = error; },
    CLEAR_USER_SPECIFIC_RECOMMENDATIONS(state) {
        state.userSpecificRecommendations = [];
        state.userSpecificRecommendationError = null;
        state.loadingUserSpecificRecommendations = false;
    }
};

const actions = {
    async fetchRelatedRecommendations({ commit }, { productId, topN = 5 }) {
        // ... (Giữ nguyên logic, đảm bảo gọi recommendationService.getRecommendations
        // và xử lý response.data từ service)
        if (!productId) { /* ... */ return; }
        commit('SET_LOADING_RECOMMENDATIONS', true);
        commit('SET_RECOMMENDATION_ERROR', null);
        try {
            const data = await recommendationService.getRecommendations(productId, topN); // data = {recommendations} hoặc {error}
            if (data.error) {
                commit('SET_RECOMMENDATION_ERROR', data.error);
                commit('SET_RELATED_RECOMMENDATIONS', []);
            } else {
                commit('SET_RELATED_RECOMMENDATIONS', data.recommendations || []);
            }
        } catch (error) {
            const errorMessage = error?.error || error?.message || 'Failed to fetch related recommendations.';
            commit('SET_RECOMMENDATION_ERROR', errorMessage);
            commit('SET_RELATED_RECOMMENDATIONS', []);
        } finally {
            commit('SET_LOADING_RECOMMENDATIONS', false);
        }
    },

    setLastViewedProduct({ commit }, productId) { /* ... Giữ nguyên ... */ },

    async fetchUserSpecificRecommendations({ commit, rootGetters }) {
        const currentUser = rootGetters['auth/currentUser'];
        const isAuthenticated = rootGetters['auth/isLoggedIn'];

        if (!isAuthenticated || !currentUser || !currentUser._id) {
            commit('CLEAR_USER_SPECIFIC_RECOMMENDATIONS');
            return;
        }
        const userId = currentUser._id; // Lấy userId để truyền cho service
        const topN = 8; // Hoặc lấy từ payload

        commit('SET_LOADING_USER_SPECIFIC_RECOMMENDATIONS', true);
        commit('SET_USER_SPECIFIC_RECOMMENDATION_ERROR', null);
        try {
            // Gọi service FE, service này sẽ gọi API Node.js.
            // Node.js controller sẽ tự lấy lịch sử tương tác của userId này.
            const data = await recommendationService.getUserRecommendations(userId, topN); // data = {recommendations} hoặc {error, message}

            if (data.error) {
                commit('SET_USER_SPECIFIC_RECOMMENDATION_ERROR', data.error);
                commit('SET_USER_SPECIFIC_RECOMMENDATIONS', []);
            } else {
                if (data.message && (!data.recommendations || data.recommendations.length === 0)){
                     console.info(`[UserRec Store FE] Message for user ${userId}: ${data.message}`);
                }
                commit('SET_USER_SPECIFIC_RECOMMENDATIONS', data.recommendations || []);
            }
        } catch (error) {
            const errorMessage = error?.error || error?.message || 'Không thể tải gợi ý dành cho bạn.';
            commit('SET_USER_SPECIFIC_RECOMMENDATION_ERROR', errorMessage);
            commit('SET_USER_SPECIFIC_RECOMMENDATIONS', []);
        } finally {
            commit('SET_LOADING_USER_SPECIFIC_RECOMMENDATIONS', false);
        }
    },

    clearUserSessionData({ commit }) { /* ... Giữ nguyên ... */ },
    clearAllRecommendationData({ commit }) { /* ... Giữ nguyên ... */ }
};

const getters = { /* Giữ nguyên getters */
    lastViewedProductId: state => state.lastViewedProductId,
    relatedRecommendations: state => state.relatedRecommendations,
    loadingRecommendations: state => state.loadingRecommendations,
    recommendationError: state => state.recommendationError,
    hasRelatedRecommendations: state => state.relatedRecommendations && Array.isArray(state.relatedRecommendations) && state.relatedRecommendations.length > 0,

    userSpecificRecommendations: state => state.userSpecificRecommendations,
    loadingUserSpecificRecommendations: state => state.loadingUserSpecificRecommendations,
    userSpecificRecommendationError: state => state.userSpecificRecommendationError,
    hasUserSpecificRecommendations: state => state.userSpecificRecommendations && Array.isArray(state.userSpecificRecommendations) && state.userSpecificRecommendations.length > 0,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};