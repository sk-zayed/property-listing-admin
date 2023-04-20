import Vuex from "vuex";
import auth from "./modules/auth";
import blockchain from "./modules/blockchain";

const store = new Vuex.Store({
    modules: {
        auth,
        blockchain
    },
});

export default store;
