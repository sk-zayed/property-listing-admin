<template>
    <el-table v-loading="loadingData" :data="properties" style="width: 100%">
        <el-table-column label="Sr. no." width="75" #default="{ row }">
            {{ rowIndex(row) }}.
        </el-table-column>
        <el-table-column label="RERA number" width="250" #default="{ row }"
            >{{ row.reraNumber }}
        </el-table-column>
        <el-table-column label="Posted by" width="250" #default="{ row }"
            >{{ row.postedBy.email }}
        </el-table-column>
        <el-table-column label="City" width="300" #default="{ row }"
            >{{ row.city }}, {{ row.zipcode }}
        </el-table-column>
        <el-table-column label="Willing to" width="150" #default="{ row }"
            >{{ row.for }}
        </el-table-column>
        <el-table-column label="Details" #default="{ row }">
            <el-button @click="propertyDetails(row._id)" link>
                <el-icon size="20"><InfoFilled /></el-icon>
            </el-button>
        </el-table-column>
        <el-table-column label="Delete" #default="{ row }">
            <el-button @click="deleteProperty(row._id)" link>
                <el-icon size="20"><DeleteFilled /></el-icon>
            </el-button>
        </el-table-column>
        <el-table-column label="Verified" justify="center" #default="{ row }">
            <el-icon :size="20" color="green" v-if="row.verifiedProp"
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
                <h4 :id="titleId" :class="titleClass">Property details</h4>
                <el-button @click="visible = false" link>
                    <el-icon size="25"><Close /></el-icon>
                </el-button>
            </div>
        </template>

        <!-- history from blockchain -->
        <h3>Property history from Blockchain</h3>
        <el-steps :active="history.length" align-center finish-status="black">
            <el-step v-for="txn in history" :key="txn.timestamp" :title="formatDate(txn.timestamp)" :description="txn.seller.name +' to '+ txn.buyer.name" />
        </el-steps>

        <!-- property details -->
        <el-row class="pt-1" v-loading="loadingProperty">
            <el-col tag="b" :span="6">Posted by</el-col>
            <el-col :span="18">{{ property.postedBy.firstname }} {{ property.postedBy.lastname }}</el-col>
            <el-col tag="b" :span="6">RERA number</el-col>
            <el-col :span="18">{{ property.reraNumber }}</el-col>
            <el-col tag="b" :span="6">Willing to</el-col>
            <el-col :span="18">{{ property.for }}</el-col>
            <el-col tag="b" :span="6">City</el-col>
            <el-col :span="18"
                >{{ property.city }}, {{ property.zipcode }}</el-col
            >
            <el-col tag="b" :span="6">Posted on</el-col>
            <el-col :span="18">{{ property.postedOn }}</el-col>
            <el-col tag="b" :span="6">Aadhaar</el-col>
            <el-col :span="18">Image</el-col>
        </el-row>
        <template #footer>
            <div class="footer">
                <el-button @click="visible = false">Cancel</el-button>
                <el-button
                    type="primary"
                    disabled
                    v-if="loadingProperty || property.verifiedProp"
                    >Verify</el-button
                >
                <el-button
                    type="primary"
                    @click="verifyProperty(property._id)"
                    v-else
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
    name: "ProperiesTable",
    data() {
        return {
            loadingData: false,
            visible: false,
            loadingProperty: false,
            properties: [],
            history: [],
            property: {},
        };
    },
    methods: {
        async getProperties() {
            try {
                this.loadingData = true;
                const response = await services.getProperties();
                this.properties = response.data;
                this.properties.sort(() => Math.random() - 0.5);
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
            return this.properties.indexOf(row) + 1;
        },
        async propertyDetails(_id) {
            this.loadingProperty = true;
            this.visible = true;
            this.property = this.properties.filter(property => property._id === _id)[0];
            this.history = await services.getHistory(this.property.reraNumber);
            this.loadingProperty = false;
        },
        formatDate(timestamp) {
            const unix = timestamp * 1000;
            const date =  new Date(unix);
            return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        },
        async verifyProperty(_id) {
            try {
                this.loadingProperty = true;
                await services.verifyProperty(_id);
                this.loadingProperty = false;
                this.visible = false;
                this.getProperties();
            } catch (error) {
                ElNotification.error({
                    title: "Exception occured!",
                    message: error.response.data.message,
                    showClose: false,
                });
            }
        },
        async deleteProperty(_id) {
            try {
                await services.deleteProperty(_id);
                this.getProperties();
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
        this.getProperties();
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
    margin: 0 0 0 0.25em;
}

h3 {
    margin: 0;
    padding-bottom: 1em;
}

.pt-1 {
    padding-top: 2em;
}

.el-col {
    margin-bottom: 1em;
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
