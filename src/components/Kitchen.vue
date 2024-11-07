<template>
  <div class="kitchen-page">
    <div class="d-flex flex-wrap" id="orderItems">
      <div v-for="order in ordersWithItems" :key="order.order_id">
        <div class="card m-2">
          <div class="card-title p-3">
            <div>
              <strong>Order ID:</strong> {{ order.Order.order_id }}
            </div>
            <strong>Table Number:</strong> {{ order.Order.table_number }}
            <div>
              <strong>Waiter Name :</strong> {{ order.Order.created_by }}
            </div>
          </div>
          <div class="card-body">
            <ol class="list-group list-group-numbered">
            <li  v-for="food in order.order_items" :key="food.food_id" class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <!-- <div class="fw-bold">{{ food.food_id }}</div> -->
               <strong> {{ food.food_name }}</strong>
              </div>
              <span class="badge bg-primary rounded-pill">{{ food.quantity }}</span>
            </li>
          </ol>
          <div class="mt-3" style="align-items: center;">
            <input type="button" class="btn btn-primary" value="Complete" @click="completePrepare(order.Order)" />
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WebSocketService from '@/services/websocketService';
// import axios from 'axios';
import apiClient from '@/services/axios';
import eventBus from '@/eventBus';
export default {
  name:'KitchenPage',
data() {
  return {
    token: null,
    orderId: '',
    orders:[],
    ordersWithItems:[],
    orderData:{ 
              "order_id":'',
              "table_number":'',
              "total_count":0,
              "payment_due":0
            },
    userRole:'',
    userName: '',
    userId:'',
  }
},
mounted(){
  this.token = localStorage.getItem('token');
  this.userRole = localStorage.getItem('userRole');
  this.userName = localStorage.getItem('userName');
  this.userId = localStorage.getItem('userId');
  this.fetchOrders();
  if(this.orderId != ""){
    this.getOrderItems()
  }
},
methods:{
  async fetchOrders() {
      try{
        const response = await apiClient.get('/orderswithitems',{
                          headers:{
                            token: this.token
                          }});
        this.ordersWithItems = response.data;
        console.log(response);
      }catch(error){
        console.log('Error fetching orders:',error);
      }
    },
  async getOrderItems(){
        try {
            console.log("token",this.token);
            console.log("OrderId",this.orderId);
            const response = await apiClient.get(`/orderItems-order/${this.orderId}`,{
                headers:{
                    token: this.token
                }
            });
            // console.log(response);
            if(response.status === 200){
             
              this.orderData.table_number= response.data[0].table_number;
              this.orderData.total_count = response.data[0].total_count;
              this.orderData.payment_due = response.data[0].payment_due;
                this.orderItems = response.data[0].order_items;
                console.log(this.orderItems);
            }
            
        } catch (error) {
            console.log("Error",error);
        }
      },
      async completePrepare(orderData){
        const updatedItem = {
            order_id: orderData.order_id,
            prepare_status: "Ready",
            created_by: this.userName,
            user_id: this.userId,
            table_number: orderData.table_number
            };
      try {
            const response = await apiClient.patch(`/orders/${orderData.order_id}`, updatedItem, {
              headers: {
                token: this.token // Pass the token if required
              }
            });
            
            // Close the modal on success
            if (response.status === 200) {
              this.fetchOrders();// Refresh the items list
              
            }else{
              window.alert("Failed To update");
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
},
},

created() {
//   WebSocketService.connect();

//   WebSocketService.on('newOrder', (order) => {
//     this.orderId=order; // Store the full order details
//     this.fetchOrders();
//     console.log('New order received from kitchen:', order);
//   });
 eventBus.on('refreshOrders', () => {
      this.fetchOrders(); // Call fetchOrders when a new order is received
    });
},
beforeUnmount() {
  if (WebSocketService.connection) {
    WebSocketService.connection.close();
  }
},
};
</script>
<style>
.kitchen-page {
    width: 100%;
    margin: 0 auto;
    margin-left: 25px;
  }
  .orderItems{
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
  }
</style>