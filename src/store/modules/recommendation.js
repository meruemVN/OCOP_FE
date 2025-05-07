// src/store/modules/recommendation.js
import recommendationService from '@/services/recommendation.service.js'; // Đảm bảo đường dẫn này đúng

const state = {
    lastViewedProductId: null, // State này sẽ được persist
    relatedRecommendations: [],
    loadingRecommendations: false,
    recommendationError: null
};

const mutations = {
    SET_LAST_VIEWED_PRODUCT_ID(state, productId) {
        state.lastViewedProductId = productId;
    },
    SET_RELATED_RECOMMENDATIONS(state, recommendations) {
        state.relatedRecommendations = recommendations || []; // Đảm bảo là mảng
    },
    SET_LOADING_RECOMMENDATIONS(state, status) {
        state.loadingRecommendations = status;
    },
    SET_RECOMMENDATION_ERROR(state, error) {
        state.recommendationError = error;
    },
    CLEAR_RECOMMENDATIONS(state) {
        state.relatedRecommendations = [];
        // state.lastViewedProductId = null; // KHÔNG NÊN reset lastViewedProductId ở đây
                                        // vì nó được dùng để trigger fetch.
                                        // HomeView sẽ clear localStorage nếu cần.
        state.recommendationError = null;
        state.loadingRecommendations = false; // Đảm bảo reset loading
    }
};

const actions = {
    async fetchRelatedRecommendations({ commit, state }, { productId, topN = 5 }) {
        console.log(`[Vuex Recommendation Action] fetchRelatedRecommendations CALLED for productId: ${productId}, topN: ${topN}`);
        if (!productId) { /* ... */ return; }
        commit('SET_LOADING_RECOMMENDATIONS', true);
        commit('SET_RECOMMENDATION_ERROR', null);
        try {
            const response = await recommendationService.getRecommendations(productId, topN);
            console.log(`[Vuex Recommendation] fetchRelatedRecommendations: API Response for ${productId} in ACTION:`, JSON.parse(JSON.stringify(response))); // Dòng này phải log ra data bạn vừa cung cấp
    
            // KIỂM TRA KỸ ĐIỀU KIỆN NÀY:
            if (response && response.recommendations && Array.isArray(response.recommendations)) {
                commit('SET_RELATED_RECOMMENDATIONS', response.recommendations);
                console.log(`[Vuex Recommendation] fetchRelatedRecommendations: Committed SET_RELATED_RECOMMENDATIONS for ${productId} with data:`, response.recommendations.length, 'items'); // Log này phải xuất hiện
            } else if (response && response.error) {
                // ...
            } else {
                 console.warn(`[Vuex Recommendation] Unexpected response format for ${productId}:`, JSON.parse(JSON.stringify(response))); // Log này có xuất hiện không?
                 commit('SET_RELATED_RECOMMENDATIONS', []);
                 commit('SET_RECOMMENDATION_ERROR', 'Unexpected response format from recommendation API.');
            }
        } catch (error) { /* ... */ }
        finally { commit('SET_LOADING_RECOMMENDATIONS', false); }
    },

    // Action này được gọi từ ProductDetailView
    setLastViewedProduct({ commit, dispatch }, productId) {
        const currentLastViewed = state.lastViewedProductId;
        commit('SET_LAST_VIEWED_PRODUCT_ID', productId);

        // Chỉ fetch gợi ý nếu ID thay đổi và là một ID hợp lệ
        if (productId && productId !== currentLastViewed) {
            // Bạn có thể dispatch fetchRelatedRecommendations trực tiếp ở đây
            // hoặc để ProductDetailView tự quản lý việc gọi fetch (như hiện tại với setTimeout).
            // Nếu ProductDetailView quản lý, thì action này chỉ cần commit.
            // Nếu muốn store tự động fetch, hãy thêm:
            // dispatch('fetchRelatedRecommendations', { productId: productId, topN: 4 }); // Ví dụ topN = 4
        } else if (!productId) {
            // Nếu productId là null/undefined, có thể xóa gợi ý
            commit('CLEAR_RECOMMENDATIONS');
        }
    },

    clearAllRecommendationData({ commit }) {
        commit('CLEAR_RECOMMENDATIONS');
        commit('SET_LAST_VIEWED_PRODUCT_ID', null); // Reset cả ID đã xem
    }
};

const getters = {
    lastViewedProductId: state => state.lastViewedProductId,
    relatedRecommendations: state => {
        console.log('[Vuex Getter relatedRecommendations] Returning state.relatedRecommendations:', JSON.parse(JSON.stringify(state.relatedRecommendations))); // THÊM LOG
        return state.relatedRecommendations;
    },
    loadingRecommendations: state => state.loadingRecommendations,
    recommendationError: state => state.recommendationError,
    hasRelatedRecommendations: state => {
        const hasRecs = state.relatedRecommendations && Array.isArray(state.relatedRecommendations) && state.relatedRecommendations.length > 0;
        console.log('[Vuex Getter hasRelatedRecommendations] state.relatedRecommendations:', JSON.parse(JSON.stringify(state.relatedRecommendations)), 'Result:', hasRecs); // THÊM LOG
        return hasRecs;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};