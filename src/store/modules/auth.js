import authh from "@/services/auth";

const KEY_EMAIL = "email";
const KEY_TOKEN = "token";
const KEY_ROLE = "role";

const auth = {
    state: {
        email: localStorage.getItem(KEY_EMAIL) || "",
        token: localStorage.getItem(KEY_TOKEN) || "",
        role: localStorage.getItem(KEY_ROLE) || "",
    },
    getters: {
        isAuthenticated(state) {
            return !!state.token;
        },
        isAdmin(state) {
            return state.role === "admin";
        },
        token(state) {
            return state.token;
        },
    },
    mutations: {
        setEmail(state, email) {
            state.email = email;
        },
        setToken(state, token) {
            state.token = token;
        },
        setRole(state, role) {
            state.role = role;
        },
    },
    actions: {
        login({ commit }, credentials) {
            return authh.login(credentials).then((data) => {
                const { email, token, role } = data;

                localStorage.setItem(KEY_EMAIL, email);
                localStorage.setItem(KEY_TOKEN, token);
                localStorage.setItem(KEY_ROLE, role);

                commit("setEmail", email);
                commit("setToken", token);
                commit("setRole", role);

                return email;
            });
        },
        logout({ commit }) {
            localStorage.removeItem(KEY_EMAIL);
            localStorage.removeItem(KEY_TOKEN);
            localStorage.removeItem(KEY_ROLE);

            commit("setEmail", "");
            commit("setToken", "");
            commit("setRole", "");

            return Promise.resolve();
        },
    },
};

export default auth;
