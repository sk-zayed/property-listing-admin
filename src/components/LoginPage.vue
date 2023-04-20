<template>
    <el-form
        label-position="top"
        label-width="100px"
        :model="form"
        style="max-width: 460px"
    >
        <el-form-item label="Email">
            <el-input placeholder="Email" type="email" v-model="form.email" />
        </el-form-item>
        <el-form-item label="Password">
            <el-input placeholder="Password" type="password" v-model="form.password" />
        </el-form-item>
        <el-form-item>
            <el-button @click="login">Login</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import store from "@/store";
import { ElNotification } from "element-plus";

export default {
    name: "LoginPage",
    data() {
        return {
            form: {
                email: "",
                password: "",
            },
        };
    },
    methods: {
        async login() {
            store
                .dispatch("login", this.form)
                .then((user) => {
                    ElNotification.success({
                        title: "Login successful!",
                        message: `Welcome ${user}...`,
                        showClose: false,
                    });
                    this.$router.push({ name: "home" });
                })
                .catch((error) => {
                    ElNotification.error({
                        title: "Login failed!",
                        message: error.response.data.message,
                        showClose: false,
                    });
                    this.form.email = "";
                    this.form.password = "";
                });
        },
    },
};
</script>
