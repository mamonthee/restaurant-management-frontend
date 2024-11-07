<template>
  <div class="table-page">
    <div style="margin-left: 25px;">
      <div class="row d-flex justify-content-between " style="margin: 15px;">
        <div class="col-auto">
          <button type="button" class="btn btn-success btn-lg" @click="showModal">Create Table</button>
        </div>
        <div class="col-auto">
          <input v-model="searchQuery" type="text" class="filter" placeholder="Search..." />
        </div>
      </div>
        
      <!-- Table Section -->
      <div class="section table-section card border-0 shadow">
        <div class="table-responsive"> 
          <table class="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Table Number</th>
                <th>Number of guests</th>
                <th>Availiable</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredItems" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.table_number }}</td>
                <td>{{ item.number_of_guests }}</td>
                <td>{{ item.availiable }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <!-- Call to action buttons -->
                  <ul class="list-inline m-0">
                    <li class="list-inline-item">
                      <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" @click="openEditModal(item.table_id, item.table_number, item.number_of_guests,item.status)"><i class="fa fa-edit"></i></button>
                    </li>
                  </ul>                                            
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--Add  Modal -->
      <div class="modal fade" id="addTableModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Add Table</h5>
              <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addItem">
                <div class="form-group row">
                  <label for="staticName" class="col-sm-2 col-form-label">Table Number</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="staticName" v-model="tableNumber" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputCategory" class="col-sm-2 col-form-label">Number Of Guests</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputCategory" v-model="numOfGuest" required>
                  </div>
                </div>
                 <!-- Switch for Available/Status -->
                <div class="form-group row form-check form-switch">
                  <label class="form-check-label col-sm-2" for="flexSwitchCheckDefault">Status</label>
                  <div class="col-sm-10">
                    <input class="form-check-input" v-model="status" style="width: 60px;height: 25px;" type="checkbox" id="flexSwitchCheckDefault">
                  </div>
                </div>    
                <div class="form-group row" style="justify-content: center;margin-top: 30px;">
                  <button type="button" class="btn btn-secondary" style="margin-right: 25px;line-height: 30px;width: 110px;background: #db1f1f;"   @click="closeAddTableModal">Close</button>
                  <button type="submit" class="btn btn-primary" style="background: #007bff !important;color: #fff !important;width: 120px;">Create Table</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
           
      <!-- Update Table Modal -->
      <div class="modal fade" id="updateTableModal" tabindex="-1" role="dialog" aria-labelledby="updateTableLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updateTableLabel">Update Table</h5>
              <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateItem">
                <div class="form-group row">
                  <label for="updateTableNumber" class="col-sm-2 col-form-label">Table Number</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="updateTableNumber" v-model="editTableNumber" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="updateNumOfGuest" class="col-sm-2 col-form-label">Number Of Guests</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="updateNumOfGuest" v-model="editNumOfGuest" required>
                  </div>
                </div>
                <!-- Switch for Available/Status -->
                <div class="form-group row form-check form-switch">
                    <!-- <label class="col-sm-2 col-form-label">Status</label> -->
                    <label class="form-check-label col-sm-2" for="flexSwitchCheckDefault">Status</label>
                    <div class="col-sm-10">
                      <input class="form-check-input" v-model="editStatus" style="width: 60px;height: 25px;" type="checkbox" id="flexSwitchCheckDefault">
                    </div>
                  </div>
                <div class="form-group row" style="justify-content: center;margin-top: 30px;">
                        <button type="button" class="btn btn-secondary" style="margin-right: 25px;line-height: 30px;width: 110px;background: #db1f1f;"   @click="closeUpdateTableModal">Close</button>
                        <button type="submit" class="btn btn-primary" style="background: #007bff !important;color: #fff !important;width: 120px;">Update Table</button>
                      </div>
              </form>
            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>   
</template>
  
<script>
  import apiClient from '@/services/axios';
  import { Modal } from 'bootstrap';
  
  export default {
    name: 'TablePage',
    data() {
      return {
        searchQuery: '',
        tableItems: [],
        token: null,
        numOfGuest:null,
        tableNumber:null,
        availiable: true,
        status: false,
        editTableId: null,
        editTableNumber:'',
        editNumOfGuest:'',
        editStatus: false,
        start_date:'',
        end_date:'',
        username:'',
        password:''
      };
    },
    computed: {
      filteredItems() {
        return (this.tableItems || []).filter(item =>
        //   item.table_number.toLowerCase().includes(this.searchQuery.toLowerCase())
        // );
        item.table_number &&// Check if table_number is defined and not empty
        item.table_number.toString().toLowerCase().includes(this.searchQuery.toLowerCase()));
      },
    },
    methods: {
      async fetchItems() {
        try {
          const response = await apiClient.get('/tables', {
            headers: {
              'token': this.token, // Include token in headers
            },
          });
          if (response.data.status === 200) {
            console.log(response.data.data);
            this.tableItems = response.data.data;
          }else{
            window.alert("Error"+response.data.message);
          }
          
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      },
      async addItem() {
        const newItem = {
          table_number: parseInt(this.tableNumber), // Update with actual item data
          number_of_guests: parseInt(this.numOfGuest), 
          status: this.status,
          availiable: this.availiable,
        };
        try {
          const response = await apiClient.post('/tables', newItem, {
            headers: {
              token: this.token, // Include token in headers
            },
          });
          // Check response status
          if (response.status === 200) {
            console.log('Item added successfully!');
            this.fetchItems(); // Refresh the list after adding
           
            if (this.addTableModal._isShown) {
              this.tableNumber = '';
              this.numOfGuest = '';
              this.addTableModal.hide(); // Use the modal instance to hide it
          }else{ 
            console.log("Modal is hidden.");
          }
          } else {
            console.log('Failed to add item. Status:', response.status);
          }
        } catch (error) {
          console.error('Error adding item:', error);
        }
      },
      searchItem() {
        // This function is just for demonstration
        console.log('Search query:', this.searchQuery);
      },
      showModal() {
        this.addTableModal.show();
      },
      updateTableModal(){
        this.updateTableModal.show();
      },
      closeAddTableModal(){
        this.addTableModal.hide();
      },
      closeUpdateTableModal(){
        this.updateTableModal.hide();
      },
      openEditModal(table_id, tableNumber, numOfGuest,editStatus) {
      this.editTableId = table_id;
      this.editTableNumber = tableNumber;
      this.editNumOfGuest = numOfGuest;
      this.editStatus = editStatus;
    
      this.updateTableModal.show();
    },
      // Function to handle updating the item
      async updateItem() {
      const updatedItem = {
        table_id: this.editTableId,
        table_number: parseInt(this.editTableNumber),
        number_of_guests: parseInt(this.editNumOfGuest),
        status: this.editStatus
      };
      try {
        const response = await apiClient.patch(`/tables/${this.editTableId}`, updatedItem, {
          headers: {
            token: this.token // Pass the token if required
          }
        });
        
        // Close the modal on success
        if (response.status === 200) {
          this.updateTableModal.hide();
          this.fetchItems(); // Refresh the items list
        }else{
          this.updateTableModal.hide();
          window.alert("Failed To update");
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
    },
    mounted() {
      this.token = localStorage.getItem('token');
      this.addTableModal = new Modal(document.getElementById('addTableModal'));
      this.updateTableModal = new Modal(document.getElementById('updateTableModal'));
      this.fetchItems(); // Fetch items when the component is mounted
    },
  };
  </script>
  
  <style scoped>
  .table-page {
    width: 100%;
    margin: 0 auto;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Space between sections */
  }
  
  .section {
    padding: 20px;
    border: 1px solid #ccc;
    /* border-radius: 5px; */
  }
  
  .search-section {
    background-color: #f9f9f9;
  }
  
  .add-section {
    background-color: #f9f9f9;
  }
  
  .table-section {
    
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    padding: 8px;
    text-align: left;
  }
  thead{
    background: #716f6c;
    color: white;
  }
  .filter{
    /* background-image: url('/css/searchicon.png'); */
    background-position: 10px 12px;
    background-repeat: no-repeat;
    width: 100%;
    height: 50px;
    font-size: 16px;
    padding: 12px 20px 12px 40px;
    border: 1px solid #ddd;
    /* margin-bottom: 12px; */
    outline: none;
  }
  </style>
  