<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :router="true"
        >
          <el-menu-item index="/">
            <el-icon><TrendCharts /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><UserFilled /></el-icon>
            <span>Users</span>
          </el-menu-item>
          <el-menu-item index="/properties">
            <el-icon><OfficeBuilding /></el-icon>
            <span>Properties</span>
          </el-menu-item>
          <el-menu-item @click="logout">
            <el-icon><OfficeBuilding /></el-icon>
            <span>Logout</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="padding: 0 1em">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
/*
 * responsive (collapse on small screens) - https://element-plus.org/en-US/component/layout.html#utility-classes-for-hiding-elements
 */

import store from "@/store";
import { ElNotification } from "element-plus";
import Web3 from "web3";

export default {
  name: "App",
  methods: {
    logout() {
      store
        .dispatch("logout")
        .then(() => {
          this.$router.push("/login");
          ElNotification.success({
            title: "Logout successful!",
            message: `Will be waiting for you...`,
            showClose: false,
          });
        })
        .catch((error) => {
          ElNotification.error({
            title: "Logout failed!",
            message: error.response.data.message,
            showClose: false,
          });
        });
    },
  },
  async created() {
    const web3 = new Web3("HTTP://127.0.0.1:7545");
    let account;
    const contractAddress = "0xE7017fb29230eD8097A60502EcAB689a2b18e7b8";
    const contractABI = [
      {
        inputs: [
          {
            internalType: "string",
            name: "_buyer",
            type: "string",
          },
          {
            internalType: "string",
            name: "_seller",
            type: "string",
          },
          {
            internalType: "string",
            name: "rera",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_zipcode",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_timestamp",
            type: "uint256",
          },
        ],
        name: "addTransaction",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_email",
            type: "string",
          },
          {
            internalType: "string",
            name: "_aadhaar",
            type: "string",
          },
        ],
        name: "addUser",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "rera",
            type: "string",
          },
        ],
        name: "getHistory",
        outputs: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "email",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "aadhaar",
                    type: "string",
                  },
                ],
                internalType: "struct RealEstate.User",
                name: "buyer",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "string",
                    name: "name",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "email",
                    type: "string",
                  },
                  {
                    internalType: "string",
                    name: "aadhaar",
                    type: "string",
                  },
                ],
                internalType: "struct RealEstate.User",
                name: "seller",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "zipcode",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct RealEstate.Transaction[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "aadhaar",
            type: "string",
          },
        ],
        name: "getUser",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "email",
                type: "string",
              },
              {
                internalType: "string",
                name: "aadhaar",
                type: "string",
              },
            ],
            internalType: "struct RealEstate.User",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "transactions",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "email",
                type: "string",
              },
              {
                internalType: "string",
                name: "aadhaar",
                type: "string",
              },
            ],
            internalType: "struct RealEstate.User",
            name: "buyer",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "email",
                type: "string",
              },
              {
                internalType: "string",
                name: "aadhaar",
                type: "string",
              },
            ],
            internalType: "struct RealEstate.User",
            name: "seller",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "zipcode",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        name: "users",
        outputs: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "email",
            type: "string",
          },
          {
            internalType: "string",
            name: "aadhaar",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      account = accounts[0];
    } else {
      alert("Get MetaMask!");
    }
    store.commit("setAccount", account);
    store.commit("setContract", contract);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
