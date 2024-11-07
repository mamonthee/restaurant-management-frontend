<!-- <template>
    <div class="report-page">
      <h2 class="text-center">Sales Report</h2>
      <div class="filters">
        <label>Filter by Date:</label>
        <input type="date" v-model="startDate" @change="fetchReportData" />
        <input type="date" v-model="endDate" @change="fetchReportData" />
      </div>
      
      <div v-if="reportData && reportData.length" class="report-table">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table Number</th>
              <th>Order Date</th>
              <th>Total Qty</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in reportData" :key="index">
              <td>{{ order.order_id }}</td>
              <td>{{ order.table_id }}</td>
              <td>{{ formatDate(order.order_date) }}</td>
              <td>{{ order.total_quantity }}</td>
              <td>${{ order.total_amount.toFixed(2) }}</td>
              <td>{{ order.status }}</td>
            </tr>
          </tbody>
        </table>
        <div class="report-summary">
          <p><strong>Total Sales: </strong> ${{ totalSales.toFixed(2) }}</p>
          <p><strong>Total Quantity Sold: </strong> {{ totalQuantity }}</p>
        </div>
        <div class="report-actions">
          <button class="btn btn-primary" @click="exportToCSV">Export to CSV</button>
          <button class="btn btn-success" @click="exportToPDF">Export to PDF</button>
        </div>
      </div>
      <div v-else class="text-center">
        <p>No data available for the selected date range.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
//   import { jsPDF } from "jspdf";
//   import "jspdf-autotable";
  
  export default {
    name: 'ReportPage',
    data() {
      return {
        startDate: '',
        endDate: '',
        reportData: []
      };
    },
    computed: {
      totalSales() {
        return this.reportData.reduce((total, order) => total + order.total_amount, 0);
      },
      totalQuantity() {
        return this.reportData.reduce((total, order) => total + order.total_quantity, 0);
      }
    },
    methods: {
      async fetchReportData() {
        try {
          const response = await axios.get('http://13.51.198.170:9000/orders', {
            params: {
              startDate: this.startDate,
              endDate: this.endDate
            }
          });
          this.reportData = response.data;
        } catch (error) {
          console.error("Error fetching report data:", error);
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
      exportToCSV() {
        // const csvContent = 'Order ID,Table Number,Order Date,Total Qty,Total Amount,Status\n' +
        //   this.reportData.map(order => `${order.order_id},${order.table_id},${this.formatDate(order.order_date)},${order.total_quantity},${order.total_amount.toFixed(2)},${order.status}`).join('\n');
        
        // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `sales_report_${this.startDate}_to_${this.endDate}.csv`);
        // link.click();
      },
      exportToPDF() {
        // const doc = new jsPDF();
        // doc.text("Sales Report", 14, 10);
        // doc.autoTable({
        //   head: [['Order ID', 'Table Number', 'Order Date', 'Total Qty', 'Total Amount', 'Status']],
        //   body: this.reportData.map(order => [
        //     order.order_id,
        //     order.table_id,
        //     this.formatDate(order.order_date),
        //     order.total_quantity,
        //     `$${order.total_amount.toFixed(2)}`,
        //     order.status
        //   ]),
        // });
        // doc.save(`sales_report_${this.startDate}_to_${this.endDate}.pdf`);
      }
    }
  };
  </script>
  
  <style scoped>
  .report-page {
    width: 90%;
    margin: 20px auto;
  }
  .filters {
    margin-bottom: 20px;
  }
  .report-table {
    overflow-x: auto;
  }
  .report-summary {
    margin-top: 10px;
  }
  .report-actions {
    margin-top: 15px;
    display: flex;
    justify-content: space-around;
  }
  </style>
   -->

   <template>
    <div class="report-page mt-4">
      <h2 class="text-center mb-4">Invoice Report</h2>
      <div class="date-filters mb-4 row d-flex ">
        <div class="col-lg-3">
          <label for="startDate" class="mr-2">Start Date:</label>
          <input type="date" v-model="startDate" @change="fetchInvoices" class="form-control d-inline-block" />
        </div>
        <div class="col-lg-3">
          <label for="endDate" class="mr-2">End Date:</label>
          <input type="date" v-model="endDate" @change="fetchInvoices" class="form-control d-inline-block" />
        </div>
        <div class="col-lg-4 d-flex justify-content-around mt-3">
          <button @click="fetchInvoices" class="btn btn-primary ml-2 mr-5" style="width: 100px;line-height: 30px;">Filter</button>
          <button @click="exportToCSV" class="btn btn-danger ml-2">Export to PDF</button>
          <button @click="exportToCSV" class="btn btn-success ml-2">Export to CSV</button>
        </div>
       
      
      </div>
      
      <table class="table table-bordered table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Invoice Number</th>
            <th>Date</th>
            <th>Table Number</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
            <th>Paid Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td>{{ invoice.invoice_number }}</td>
            <td>{{ formatDate(invoice.created_at) }}</td>
            <td>{{ invoice.table_number }}</td>
            <td>${{ invoice.total_amount.toFixed(2) }}</td>
            <td>{{ invoice.payment_method }}</td>
            <td>{{ invoice.payment_status }}</td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="invoices.length === 0" class="alert alert-warning text-center">
        No invoices found for the selected date range.
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from '@/services/axios';
  export default {
    name: 'ReportPage',
    data() {
      return {
        invoices: [],
        startDate: '',
        endDate: '',
        token: null
      };
    },
    mounted() {
      this.token = localStorage.getItem('token');
    },
    methods: {
      async fetchInvoices() {
        try {
          const response = await apiClient.get(`/invoicesByDates/${this.startDate}/${this.endDate}`, {
            headers: {
              token: this.token, // Include token in headers
            },
          });
          if (response.status === 200) {
            this.invoices = response.data;
          } else {
            console.error('Failed to fetch invoices:', response.status);
            window.alert(`Failed to fetch invoices: ${response.status}`);
          }
        } catch (error) {
          console.error('Error fetching invoices:', error);
        }
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      exportToCSV() {
        // CSV export logic goes here
      }
    }
  }
  </script>
  
  <style scoped>
  .report-page{
    width: 100%;
    margin: 0 auto;
    margin-left: 25px;
  }
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    border-radius: 8px;
    background-color: #f8f9fa; /* Light background for contrast */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }
  
  .date-filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .table {
    margin-top: 20px;
  }
  
  .alert {
    margin-top: 20px;
  }
  </style>
  