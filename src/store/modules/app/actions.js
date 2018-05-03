import {SET_LOADING, SET_LOADING_MESSAGE} from "./mutations";

export const START_LOADING = "START_LOADING"
export const STOP_LOADING = "STOP_LOADING"

export default {
    [START_LOADING]({commit}, message = null) {
        commit(SET_LOADING, true)
        commit(SET_LOADING_MESSAGE, message)
    },

    [STOP_LOADING]({commit}) {
        commit(SET_LOADING, false)
        commit(SET_LOADING_MESSAGE, null)
    },

}