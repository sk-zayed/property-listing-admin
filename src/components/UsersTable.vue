<template>
    <el-table v-loading="loadingData" :data="users" style="width: 100%">
        <el-table-column label="Sr. no." width="100" #default="{ row }">
            {{ rowIndex(row) }}.
        </el-table-column>
        <el-table-column label="Name" width="400" #default="{ row }"
            >{{ row.firstname }} {{ row.lastname }}
        </el-table-column>
        <el-table-column label="Email" width="400" #default="{ row }"
            >{{ row.email }}
        </el-table-column>
        <el-table-column label="Details" #default="{ row }">
            <el-button @click="userDetails(row._id)" link>
                <el-icon size="20"><InfoFilled /></el-icon>
            </el-button>
        </el-table-column>
        <!-- <el-table-column label="Delete" #default="{ row }">
            <el-button @click="deleteUser(row._id)" link>
                <el-icon size="20"><DeleteFilled /></el-icon>
            </el-button>
        </el-table-column> -->
        <el-table-column label="Verified" justify="center" #default="{ row }">
            <el-icon :size="20" color="green" v-if="row.verifiedUser"
                ><SuccessFilled
            /></el-icon>
            <el-icon :size="20" color="red" v-else
                ><CircleCloseFilled
            /></el-icon>
        </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog v-model="visible" :show-close="false" center="false">
        <template #header="{ titleId, titleClass }">
            <div class="header">
                <h4 :id="titleId" :class="titleClass">User details</h4>
                <el-button @click="visible = false" link>
                    <el-icon size="25"><Close /></el-icon>
                </el-button>
            </div>
        </template>
        <el-row v-loading="loadingUser">
            <el-col tag="b" :span="6">Firstname</el-col>
            <el-col :span="18">{{ user.firstname }}</el-col>
            <el-col tag="b" :span="6">Lastname</el-col>
            <el-col :span="18">{{ user.lastname || "NaN" }}</el-col>
            <el-col tag="b" :span="6">Email</el-col>
            <el-col :span="18">{{ user.email }}</el-col>
            <el-col tag="b" :span="6">Email verified</el-col>
            <el-col :span="18">{{ user.emailVerified }}</el-col>
            <el-col tag="b" :span="6">Aadhaar</el-col>
            <el-col :span="18">Image</el-col>
        </el-row>
        <template #footer>
            <div class="footer">
                <el-button @click="visible = false">Cancel</el-button>
                <el-button type="primary" disabled v-if="loadingUser || user.verifiedUser"
                    >Verify</el-button
                >
                <el-button type="primary" @click="verifyUser(user._id)" v-else
                    >Verify</el-button
                >
            </div>
        </template>
    </el-dialog>
</template>

<script>
import services from "@/services/services";
import { ElNotification } from "element-plus";

export default {
    name: "UsersTable",
    data() {
        return {
            loadingData: false,
            visible: false,
            loadingUser: false,
            users: [],
            user: {},
        };
    },
    methods: {
        async getUsers() {
            try {
            this.loadingData = true;
            const response = await services.getUsers();
            this.users = response.data;
            this.loadingData = false;
        } catch (error) {
            ElNotification.error({
                title: "Exception occured!",
                message: error.message,
                showClose: false,
            });
        }
        },
        rowIndex(row) {
            return this.users.indexOf(row) + 1;
        },
        userDetails(_id) {
            this.loadingUser = true;
            this.visible = true;
            this.user = this.users.filter((user) => user._id === _id)[0];
            this.loadingUser = false;
        },
        async verifyUser(_id) {
            try {
                this.loadingUser = true;
                await services.verifyUser(_id);
                this.loadingUser = false;
                this.visible = false;
                this.getUsers();

            } catch (error) {
                ElNotification.error({
                    title: "Exception occured!",
                    message: error.response.data.message,
                    showClose: false,
                });
            }
        },
        async deleteUser(_id) {
            try {
                await services.deleteUser(_id);
                this.getUsers();

            } catch (error) {
                ElNotification.error({
                    title: "Exception occured!",
                    message: error.response.data.message,
                    showClose: false,
                });
            }
        },
    },
    created() {
        this.getUsers();    
    },
};
</script>
<style scoped>
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* padding: 0 */
}

.header h4 {
    margin: auto 0 auto 0.25em;
}

.el-col {
    margin-bottom: 20px;
}
.el-col:last-child {
    margin-bottom: 0;
}

.footer {
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding: 0;
}
</style>
