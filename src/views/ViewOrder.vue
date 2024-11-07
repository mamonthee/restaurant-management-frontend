<template>
  <div style="margin-left: 25px;">
    <h2>Orders</h2>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Table Number</th>
          <th>Order Date</th>
          <th>Qty</th>
          <th>Total Amount</th>
          <th>Prepare Status</th>
          <th>Paid Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" :class="{ 'highlighted-order': order.order_id === selectedOrderId }" @click="toggleHighlight(order.order_id)">
          <td>{{ order.order_id }}</td>
          <td>{{ order.table_number }}</td>
          <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
          <td>{{ order.total_quantity }}</td>
          <td>{{ order.total_amount }}</td>
          <td>{{ order.prepare_status }}</td>
          <td>{{ order.status }}</td>

          <td><input type="button" v-if="order.status !== 'PAID'" class="btn btn-warning" value="details" @click="viewDetails(order.order_id)"></td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Show Invoice Form After Clicking Create Invoice Button -->
  <div v-if="invoiceFormVisible" style="text-align: center;">
      <InvoiceForm :invoice="orders" @submit-invoice="saveInvoice" :readOnly="false" />
  </div>
</template>

<script>
import apiClient from '@/services/axios';
import InvoiceForm from '@/components/InvoiceForm.vue';

export default {
  name: 'ViewOrderPage',
  components: {
    InvoiceForm
  },
  data() {
    return {
      orders: [],
      token: null,
      invoiceFormVisible: false,
      selectedOrderId: null
    };
  },
  computed: {
    filteredOrders() {
      if (this.selectedOrderId) {
        return this.orders.filter(order => order.order_id === this.selectedOrderId);
      }
      return this.orders;
    }
  },
  mounted() {
    // Retrieve the selected order ID from the query parameter
    this.selectedOrderId = this.$route.query.orderId;

     // Listen for localStorage changes
     window.addEventListener('storage', (event) => {
      if (event.key === 'orderUpdated') {
        this.fetchOrders();  // Refresh orders when an update occurs
      }
    });
    this.token = localStorage.getItem("token");
    this.fetchOrders();
  },
   methods: {
    async fetchOrders() {
      try{
        const response = await apiClient.get('/orders',{
                          headers:{
                            token: this.token
                          }});
        this.orders = response.data;
      }catch(error){
        console.log('Error fetching orders:',error);
      }
    },
    viewDetails(orderId){
      // this.invoiceFormVisible = true;
      // const orderId = '12345';  // This should be the order ID or other identifying info
      const url = this.$router.resolve({ name: 'InvoiceForm', params: { orderId } }).href;
      window.open(url, '_blank');  // Opens in a new tab
    },
    toggleHighlight(orderId) {
      // Toggle the highlight if the same order is clicked again
      // this.selectedOrderId = this.selectedOrderId === orderId ? null : orderId;
      this.selectedOrderId = null;
      console.log(orderId);
    }
  },
  // Hook to update the highlighted order ID when the route changes
  beforeRouteUpdate(to, from, next) {
    if (to.query.orderId !== from.query.orderId) {
      this.selectedOrderId = to.query.orderId;
    }
    next();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}
.highlighted-order {
  background-color: #70abea;
  color: white;
}
</style>
