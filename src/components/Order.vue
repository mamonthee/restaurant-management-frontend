<template>
  <div  class="table-page">
    <h2 class="text-center">Create Order</h2>
    <div class="row" style="margin-left: 25px;">
      <div class="col-md-8">
        <label class="col-sm-2 col-form-label">Select Menu</label>
        <select v-model="selectedTable" class="form-select mb-3" style="width:300px;height: 50px;"  @change="getTableNumber">
          <option value="">Please Select Table</option> 
          <option v-for="table in tables" :key="table.table_id" :value="table.table_id" style="height: 50px;">
            {{ table.table_number }} (Guests: {{ table.number_of_guests }})
          </option>
        </select>

        <h3>Menus</h3>
        <MenuList @menuId="getFoods"/>
        <!-- <OrderItems @addItem="addItemToOrder" /> -->
        <div class="d-flex flex-wrap">
          <div v-for="food in foodItems" :key="food.food_id">
            <div class="card" style="width: 18rem;margin-right:10px;">
              <img class="card-img-top" :src="food.food_image"  alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">{{ food.name }}</h5>
                <p class="card-text">Price :$ {{ food.price }}</p>
                <a href="#" class="btn btn-primary" @click="addItemToOrder(food)">Add To Order</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 card" >
        <h3 class="text-center">Order Items</h3>
        <!-- <ul>
          <li v-for="item in orderItems" :key="item.id">
            {{ item.name }} - Price: {{ item.unit_price }}
          </li>
        </ul> -->
       
      <!-- Order Items List -->
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderItems" :key="item.id">
            <td> {{ item.name }}</td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.quantity  }}</td>
            <td>{{ item.unit_price * item.quantity }}</td>
            <td>
              <!-- Quantity Controls -->
          <input type="button" @click="decreaseQuantity(item)" value="-">
          <span> {{ item.quantity }} </span>
          <input type="button" @click="increaseQuantity(item)" value="+">
            </td>
            <td><button @click="removeItem(index)" class="btn btn-danger btn-sm">Remove</button></td>
          </tr>
        </tbody>
      </table>
      <div>
      <div>
        <strong>Total Amount: {{ totalAmount }}</strong>
      </div>
    </div>
    <div style="text-align: center; margin-top: 500px;margin-bottom:10px;">
      <input v-if="!orderCreated" type="button" class="btn btn-lg" @click="createOrder" style="background: #306ddb;color:#fff;" value="Create Order">
       <!-- Show Print Invoice Button After Order is Created -->
      <input v-else type="button" class="btn btn-lg btn-success" @click="printInvoice" value="Print Invoice">
      <input type="button" class="btn btn-lg" @click="cancelOrder" style="background: rgb(219 146 48);color:#fff;margin-left:20px;" value="Cancel">
    </div>
     <!-- Show Invoice Form After Order is Created -->
     <div v-if="showInvoice" style="text-align: center;">
      <InvoiceForm :invoice="invoice" @submit-invoice="saveInvoice" :readOnly="false" />
     </div>
  </div>
</div>

    <div >
     
    
    </div>
    
  </div>
</template>

<script>
import MenuList from './MenuList.vue';
// import OrderItems from './OrderItems.vue';
import apiClient from '@/services/axios';

export default {
  name: 'OrdersPage',
  components: { 
    // OrderItems ,
    MenuList,
  },
  data() {
    return {
      token: null,
      selectedTable: '',
      selectedTableNumber: null,
      tables: [],
      orderItems: [],
      foodItems:[],
      // Separate array to track quantities (default is 1 for each item)
      quantities: [1, 1, 1],
      orderCreated: false, // Track if the order is created
      showInvoice: false,  // Show invoice section
      insertedOrderId: '',
      userName: '',
      userId : ''
    };
  },
  computed: {
    // Compute total order amount
    totalAmount() {
      return this.orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    },
    totalQuantity(){
      return this.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    }
  },  
  methods: {
    getTableNumber() {
      const selectedTableData = this.tables.find(table => table.table_id === this.selectedTable);
      if (selectedTableData) {
        this.selectedTableNumber = selectedTableData.table_number;
      } else {
        this.selectedTableNumber = null; // Reset if no table is selected
      }
    },
    async fetchTables() {
      try{
      // Fetch tables from backend
      const response = await apiClient.get('/tables', {
            headers: {
              'token': this.token, // Include token in headers
            },
          });
    
        this.tables = response.data.data;
    }catch(error){
      if (error.response && error.response.status === 401) {
          // Handle token expiration (status code 401)
          alert('Your session has expired. Please log in again.');
          this.$router.push('/');
        } else {
          console.error('Error fetching items:', error);
          alert('Failed to load the table. Please try again later.');
        }
    }
    },
    addItemToOrder(item) {
      if (this.orderCreated){
        window.alert("Already Invoice Create!");
        return
      }
      if(this.selectedTable==""){
        window.alert("Please select Table!");
        return
      }
      // Check if item already exists in orderItems
      const existingItem = this.orderItems.find(orderItem => orderItem.food_id === item.food_id);
      if (existingItem) {
        // Item already exists; increase quantity and alert
        // existingItem.quantity++;
        window.alert("Item already exists! Please quantity increased.");
      } else {
        // Add item to orderItems array
        const orderItem = {
                    quantity: 1, // Assuming item has a quantity property
                    unit_price: item.price,   // Assuming item has a price property
                    food_id: item.food_id, 
                    name: item.name,        // Assuming item has an id property
                    order_id: ""              // This will be set by the backend or when the order is created
                  };
        this.orderItems.push(orderItem);
      }
    },
   async  getFoods(menuId){
      try {
          const response = await apiClient.get(`/foodsbymenu/${menuId}`, {
            headers: {
              'token': this.token, // Include token in headers
            },
          });
          if (response.data.status === 200) {
            this.foodItems = response.data.data;
          }else{
            window.alert("Error"+response.data.message);
          }
          
        } catch (error) {
          console.error('Error fetching items:', error);
        }
    },
     // Increase quantity of the selected item
     increaseQuantity(item) {
      item.quantity++;
    },
    // Decrease quantity of the selected item but ensure it doesn't go below 1
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    },
    removeItem(index) {
    this.orderItems.splice(index, 1);
  },
   async createOrder() {
      if(this.selectedTable==null){
        window.alert("Please select Table");
      }else{
        const orderData = {
          table_id: this.selectedTable,
          table_number: parseInt(this.selectedTableNumber),
          Total_amount: this.totalAmount,
          Total_quantity: this.totalQuantity,
          Created_by : this.userName,
          User_id : this.userId,
          Order_items: this.orderItems
        };
        try {
            const response = await apiClient.post('/orderItems', orderData, {
              headers: {
                token: this.token, // Include token in headers
              },
            });
            // Check response status
            if (response.status === 200) {
              console.log('OrderItem added successfully!',response.data.order_id);
              this.insertedOrderId = response.data.order_id;
              // this.orderItems = [];
              this.orderCreated = true;
              // this.notifyKitchen(); // Notify kitchen
            } else {
              console.log('Failed to add item. Status:', response.status);
              window.alert(response.status);
            }
          } catch (error) {
            console.error('Error adding item:', error);
          }
      }     
    },
    cancelOrder(){
      this.clearOrderData();
    },
    printInvoice() {
      this.showInvoice = true; // Display the invoice form
      const orderId = this.insertedOrderId;
      const url = this.$router.resolve({name:'InvoiceForm',params:{orderId}}).href;
      window.open(url,'_blank');
    },
    closeInvoice() {
      this.showInvoice = false;
    },
    handleStorageChange(event) {
      if (event.key === 'iTable_numbernvoiceCreated' && event.newValue === 'true') {
        // Clear order data on invoice creation
        this.clearOrderData();
        
        // Remove the flag to prevent duplicate clearing
        localStorage.removeItem('invoiceCreated');
      }
    },
    clearOrderData() {
      this.orderCreated = false;
      this.selectedTable = "";
      this.orderItems = [];
      this.orderData = {
        order_id: '',
        table_number: '',
        total_count: 0,
        payment_due: 0,
      };
    },
  beforeDestroy() {
    window.removeEventListener('storage', this.handleStorageChange);
  },
    async notifyKitchen() {
      try {
        // Notify kitchen API call (adjust the endpoint)
        const response = await apiClient.post('/notifyKitchen', {
          orderItems: this.orderItems,
          table: this.selectedTable
        }, {
          headers: { token: this.token }
        });
        if (response.status === 200) {
          console.log('Kitchen notified successfully!');
        }
      } catch (error) {
        console.error('Error notifying kitchen:', error);
      }
    }
  },
  mounted() {
    this.token = localStorage.getItem('token');
    this.userName = localStorage.getItem('userName');
    this.userId = localStorage.getItem('userId');
    this.fetchTables();
    window.addEventListener('storage', this.handleStorageChange);
    window.addEventListener('storage', (event) => {
      if (event.key === 'orderUpdated') {
        this.clearOrderData();  // Refresh orders when an update occurs
      }
    });
    
  }
};
</script>
<style>
.order-page {
    width: 100%;
    margin: 0 auto;
    margin-left: 25px;
  }
  .card-img-top {
  height: 200px; /* Set the desired height */
  object-fit: cover; /* Maintain aspect ratio */
  width: 100%; /* Ensure it fills the card width */
}

</style>