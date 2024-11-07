<template>
    <div class="container">
      <form @submit.prevent="submitInvoice">
        <!-- Invoice Information -->
       <div class="d-flex justify-content-between mt-5">
        <div style="font-weight: bold;color: black;font-size: 20px;">Dine In</div>
        <div style="font-weight: bold;color: black;font-size: 20px;">Date : {{ this.today }}</div>
       </div>
        <div class="mt-5 mb-5">
          <h3 style="font-size: 22px;"><span style="font-weight:200;color: black;">Invoice Number : </span>{{ orderId }}</h3>
          <h3 style="font-size: 22px;"><span style="font-weight:200;color: black;">Table Number: </span>{{ this.orderData.table_number }}</h3>
        </div>
        <!-- Product Details Table -->
        
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orderItems" :key="order.order_id">
              <td>{{  order.food_name }} </td>
              <td>{{ order.price }}</td>
              <td>{{ order.quantity }}</td>
              <td>{{ order.quantity*order.price }}</td>
            </tr>
          </tbody>
          <tfoot>
           <tr>
            <th colspan="3">Total Amount</th>
            <th>{{ this.orderData.payment_due }}</th>
           </tr>
          </tfoot>
        </table>
        <div class="form-group row" >
          <label for="staticName" class="col-sm-4 col-form-label">Payment Method : </label>
          <div class="col-sm-8">
            <span v-if="readOnly" style="text-align: right;">{{ payment_method }}</span>
            <select  v-else v-model="payment_method" class="form-select">
              <option value="CASH" class="selected" >CASH</option>
              <option value="CARD">CARD</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="staticName" class="col-sm-4 col-form-label">Paid Status : </label>
          <div class="col-sm-8">
            <span v-if="readOnly">{{ payment_status }}</span>
            <select v-else v-model="payment_status" class="form-select">
              <option value="PAID" class="selected">PAID</option>
              <option value="UNPAID">UNPAID</option>
            </select>
          </div>
        </div>
        <!-- Submit Invoice -->
        <input v-if="!readOnly" type="submit" class="btn btn-success m-2 no-print" value="Save Invoice">
        <!-- Print Invoice Button -->
      <input v-if="!readOnly" type="button" style="background: gray;" class="btn btn-md btn-success no-print" @click="printInvoice" value="Print">
      </form>
  
      
    </div>
  </template>
  
  <script>
import apiClient from '@/services/axios';

  export default {
    name: "InvoiceForm",
    data(){
        return{
            token: null,
            orderItems: [],
            orderData:{ 
              "order_id":'',
              "table_number":'',
              "total_count":0,
              "payment_due":0},
            today: '',
            payment_method:'CASH',
            payment_status:'PAID'
        }
    },
    props: {
        
    orderId: {
      type: String,
      required: true,
    },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    mounted(){
        this.token = localStorage.getItem("token");
        this.getToday();  
        this.getOrderItems();
        // this.printInvoice();
    },
    methods: {
      getToday() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
      const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed

      // Format as YYYY-MM-DD
      this.today = `${year}-${month}-${day}`;
    },
      async submitInvoice() {
        const invoiceData={
          "order_id": this.orderId,
          "payment_method":this.payment_method,
          "payment_status":this.payment_status || "PENDING", // Default to "PENDING" if not set
        }
        console.log(invoiceData);
        try {
        const response = await apiClient.post('/invoices', invoiceData, {
          headers: {
            token: this.token, // Include token in headers
          },
        });
        // Check response status
        if (response.status === 200) {
          console.log('Invoice added successfully!');
          // Set a flag in local storage to indicate successful invoice creation
          localStorage.setItem('invoiceCreated', 'true');
          window.alert('Invoice added successfully!');
          localStorage.setItem('orderUpdated', Date.now().toString());
          console.log("submitInvoice successfully");
          window.close();
          // this.fetchItems(); // Refresh the list after adding
        
        } else {
          console.log('Failed to add item. Status:', response.status);
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
        // Emit an event to the parent component with the invoice data
        // this.$emit('submit-invoice', this.invoice);
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
      printInvoice() {
        this.$emit("update:readOnly", true);
        window.print();
        // const invoiceHtml = `
        //   <html>
        //     <head>
        //       <title>Invoice </title>
        //       <style>
        //         body { font-family: Arial, sans-serif; }
        //         table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        //         table, th, td { border: 1px solid black; }
        //         th, td { padding: 8px; text-align: left; }
        //       </style>
        //     </head>
        //     <body>
            
  
        //       <h3>Product Details</h3>
        //       <table>
        //         <thead>
        //           <tr>
        //             <th>Product Name</th>
        //             <th>Quantity</th>
        //             <th>Price</th>
        //             <th>Total</th>
        //           </tr>
        //         </thead>
        //         <tbody>
                 
        //             <tr>
        //               <td>"{product.name"</td>
                    
        //             </tr>
                 
        //         </tbody>
        //       </table>
        //     </body>
        //   </html>
        // `;
  
        // Open a new window and write the HTML content
        // const newWindow = window.open("", "_blank");
        // newWindow.document.write(invoiceHtml);
        // newWindow.document.close();
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any specific styles for the invoice form here */
  @media print {
  .no-print {
    display: none !important;
  }
}
  </style>
  