const blockchain = {
    state: {
        account: "",
        contract: {}
    },
    getters: {
        account(state) {
            return state.account;
        },
        contract(state) {
            return state.contract;
        },
    },
    mutations: {
        setAccount(state, account) {
            state.account = account;
        },
        setContract(state, contract) {
            state.contract = contract;
        },
    }
};

export default blockchain;