<template>
    <h1>DashBoard</h1>
    <!-- sell and rent count - doughnut -->
    <el-row :gutter="20" class="py-2">
        <el-col :span="12">
            <el-card v-loading="forSellLoading">
                <el-progress type="dashboard" :width="400" :percentage="forSell">
                    <template #default="{ percentage }">
                        <span class="percentage-value">{{ percentage }}%</span>
                        <span class="percentage-label">for sell</span>
                    </template>
                </el-progress>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card v-loading="forRentLoading">
                <el-progress type="dashboard" :width="400" :percentage="forRent">
                    <template #default="{ percentage }">
                        <span class="percentage-value">{{ percentage }}%</span>
                        <span class="percentage-label">for rent</span>
                    </template>
                </el-progress>
            </el-card>
        </el-col>
    </el-row>

    <!-- verification - pie -->
    <el-row :gutter="20" class="py-2">
        <el-col :span="12">
            <el-card v-loading="verifiedUsersLoading">
                <h2>Verified users</h2>
                <canvas id="userVerification"></canvas>
            </el-card>
        </el-col>
        <el-col :span="12">
            <el-card v-loading="verifiedPropertiesLoading">
                <h2>Verified properties</h2>
                <canvas id="propertyVerification"></canvas>
            </el-card>
        </el-col>
    </el-row>

    <!-- revenue -->
    <el-row class="py-2">
        <el-col>
            <el-card v-loading="revenueLoading">
                <h2>Revenue</h2>
                <canvas id="revenue"></canvas>
            </el-card>
        </el-col>
    </el-row>

    <!-- listing stats -->
    <el-row class="py-2">
        <el-col>
            <el-card v-loading="listingLoading">
                <h2>Listing record</h2>
                <canvas id="listing"></canvas>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import Chart from "chart.js/auto";
import services from "@/services/services";
import { ElNotification } from "element-plus";

export default {
    name: "DashBoard",
    data() {
        return {
            forSellLoading: true,
            forRentLoading: true,
            verifiedUsersLoading: true,
            verifiedPropertiesLoading: true,
            revenueLoading: true,
            listingLoading: true,
            users: [],
            properties: [],
            forSell: 0,
            forRent: 0,
            verifiedUsers: 0,
            unverifiedUsers: 0,
            verifiedProperties: 0,
            unverifiedProperties: 0,
            revenue: 0,
            revenueData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            sellListingData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            rentListingData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
    },
    async mounted() {
        try {
            // getting users
            const users = await services.getUsers();
            this.users = users.data;
            this.verifiedUsers = this.users.filter(
                (user) => user.verifiedUser === true
            ).length;
            this.unverifiedUsers = this.users.length - this.verifiedUsers;
            this.verifiedUsersLoading = false;

            // getting properties
            const properties = await services.getProperties();
            this.properties = properties.data;

            const totalProperties = this.properties.length;
            const forSell = this.properties.filter((property) => property.for === "Sell")
                .length;
            this.forSell = ((forSell / totalProperties) * 100).toFixed(2);
            this.forSellLoading = false;
            const forRent = totalProperties - forSell;
            this.forRent = ((forRent / totalProperties) * 100).toFixed(2);
            this.forRentLoading = false;

            this.verifiedProperties = this.properties.filter(
                (property) => property.verifiedProp === true
            ).length;
            this.unverifiedProperties = totalProperties - this.verifiedProperties;
            this.verifiedPropertiesLoading = false;

            let revenue = 0;
            this.properties.forEach((property) => {
                if (property.premium) {
                    revenue += property.paid;
                    const month = new Date(property.paidOn).getMonth();
                    this.revenueData[month] += property.paid;
                }
                const month = new Date(property.postedOn).getMonth();
                this.sellListingData[month] += 1;
                this.rentListingData[month] += 1;
                this.listingLoading = false;
            });
            this.revenue = revenue / 1000;

            this.revenueLoading = false;
        } catch (error) {
            ElNotification.error({
                title: "An exception occured!",
                message: error.response.data.message,
                showClose: false,
            });
        }

        // user verifications
        new Chart(document.getElementById("userVerification"), {
            type: "doughnut",
            data: {
                labels: ["Verified users", "Unverified users"],
                datasets: [
                    {
                        label: "User verifications",
                        data: [this.verifiedUsers, this.unverifiedUsers],
                        backgroundColor: ["#0ded49c8", "#ff6384"],
                    },
                ],
            },
        });

        // property verifications
        new Chart(document.getElementById("propertyVerification"), {
            type: "doughnut",
            data: {
                labels: ["Verified properties", "Unverified properties"],
                datasets: [
                    {
                        label: "Property verifications",
                        data: [this.verifiedProperties, this.unverifiedProperties],
                        backgroundColor: ["#0ded49c8", "#ff6384"],
                    },
                ],
            },
        });

        // revenue
        new Chart(document.getElementById("revenue"), {
            type: "bar",
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                datasets: [
                    {
                        label: `Total revenu: ${this.revenue}K`,
                        data: this.revenueData,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(48, 57, 96, 0.2)",
                            "rgba(255, 205, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(201, 203, 207, 0.2)",
                            "rgba(86, 43, 8, 0.2)",
                            "rgba(210, 118, 133, 0.2)",
                            "rgba(102, 52, 127, 0.2)",
                            "rgba(34, 124, 112, 0.2)",
                            "rgba(234, 154, 150, 0.2)",
                        ],
                        borderColor: [
                            "rgb(255, 99, 132)",
                            "rgb(48, 57, 96)",
                            "rgb(255, 205, 86)",
                            "rgb(75, 192, 192)",
                            "rgb(54, 162, 235)",
                            "rgb(153, 102, 255)",
                            "rgb(201, 203, 207)",
                            "rgb(86, 43, 8)",
                            "rgb(210, 118, 133)",
                            "rgb(102, 52, 127)",
                            "rgb(34, 124, 112)",
                            "rgb(234, 154, 150)",
                        ],
                        borderWidth: 1.5,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // listing stats
        new Chart(document.getElementById("listing"), {
            type: "line",
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ],
                datasets: [
                    {
                        label: "Registration for sell",
                        data: [65, 59, 80, 81, 56, 0, 0, 0, 0, 0, 0, 0], // this.sellListingData,
                        borderColor: "rgb(75, 192, 192)",
                    },
                    {
                        label: "Registration for rent",
                        data: [12, 43, 23, 43, 89, 0, 0, 0, 0, 0, 0, 0], // this.rentListingData,
                        borderColor: "rgb(75, 132, 162)",
                    },
                ],
            },
        });
    },
};
</script>

<style scoped>
.py-2 {
    padding: 1em 0;
}

canvas {
    padding: 2.5em;
}

.percentage-value {
    display: block;
    font-size: 2em;
}

.percentage-label {
    display: block;
    margin-top: 0.5em;
    font-size: 1em;
}
</style>
