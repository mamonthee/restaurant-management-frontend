<template>
  <div class="menu-page">
    <h2 class="text-center">Menu Page</h2>
    <div style="margin-left: 25px;">
      <div class="row d-flex justify-content-between " style="margin: 15px;">
        <div class="col-auto">
          <button type="button" class="btn btn-success btn-lg" @click="showModal" >Add Menu</button>
        </div>
        <div class="col-auto">
          <input v-model="searchQuery" type="text" class="filter" placeholder="Search..." />
        </div>
      </div>
      
      <!-- Table Section -->
      <div class="section table-section card border-0 shadow">
        <!-- <div class="card-body p-5"></div> -->
        <div class="table-responsive"> 
          <table class="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredItems" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.category }}</td>
                <td>
                  <!-- Call to action buttons -->
                  <ul class="list-inline m-0">
                    <!-- <li class="list-inline-item">
                      <button class="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Add"><i class="fa fa-table"></i></button>
                    </li> -->
                    <li class="list-inline-item">
                      <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" @click="openEditModal(item.menu_id, item.name, item.category,item.start_date,item.end_date)"><i class="fa fa-edit"></i></button>
                    </li>
                    <!-- <li class="list-inline-item">
                      <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>
                    </li> -->
                  </ul>                                            
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--Add  Modal -->
        <div class="modal fade" id="addMenuModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Menu</h5>
                <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addItem">
                  <div class="form-group row">
                    <label for="staticName" class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="staticName" v-model="name" required>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputCategory" class="col-sm-2 col-form-label">Category</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="inputCategory" v-model="category" required>
                    </div>
                  </div>
                  <div class="form-group row btn-groups" style="display: flex;;gap: 15px;margin-top: 30px;">
                    <button type="button" class="btn btn-secondary" id="btnClose" @click="closeAddMenuModal">Close</button>
                    <input type="submit" class=" btn btn-primary " id="btnAdd"  value="Create Menu">
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
         
      <!-- Update Menu Modal -->
      <div class="modal fade" id="updateMenuModal" tabindex="-1" role="dialog" aria-labelledby="updateMenuLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="updateMenuLabel">Update Menu</h5>
              <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateItem">
                <div class="form-group row">
                  <label for="updateName" class="col-sm-2 col-form-label">Name</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="updateName" v-model="editName" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="updateCategory" class="col-sm-2 col-form-label">Category</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="updateCategory" v-model="editCategory" required>
                  </div>
                </div>
                  <div class="form-group row btn-groups" >
                    <button type="button" class="btn btn-secondary" id="btnClose" @click="closeUpdateMenuModal">Close</button>
                    <button type="submit" class="btn btn-primary" id="btnUpdate">Update Menu</button>
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
  name: 'MenuPage',
  data() {
    return {
      searchQuery: '',
      items: [],
      token: null,
      name:'',
      category:'',
      editMenuId: null,
      editName:'',
      editCategory:'',
      start_date:'',
      end_date:'',
      username:'',
      password:''
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchItems() {
      try {
        const response = await apiClient.get('/menus', {
          headers: {
            'token': this.token, // Include token in headers
          },
        });
        if (response.data.status === 200) {
          this.items = response.data.data;
        }else{
          window.alert("Error"+response.data.message);
        }
        
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle token expiration (status code 401)
          alert('Your session has expired. Please log in again.');
          this.$router.push('/');
        } else {
          console.error('Error fetching items:', error);
          alert('Failed to load the menu. Please try again later.');
        }
      }
    },
    showModal() {
      this.addMenuModal.show();
    },
    async addItem() {
      const newItem = {
        name: this.name, // Update with actual item data
        category: this.category, 
      };
      try {
        const response = await apiClient.post('/menus', newItem, {
          headers: {
            token: this.token, // Include token in headers
          },
        });
        // Check response status
        if (response.status === 200) {
          console.log('Item added successfully!');
          this.fetchItems(); // Refresh the list after adding
         
          if (this.addMenuModal._isShown) {
            this.name = '';
            this.category = '';
            this.addMenuModal.hide(); // Use the modal instance to hide it
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
    closeAddMenuModal(){
      this.addMenuModal.hide();
    },
    closeUpdateMenuModal(){
      this.updateMenuModal.hide();
    },
    openEditModal(menu_id, name, category,start_date,end_date) {
    this.editMenuId = menu_id;
    this.editName = name;
    this.editCategory = category;
    this.start_date = start_date;
    this.end_date = end_date;
    this.updateMenuModal.show();
  },
    // Function to handle updating the item
    async updateItem() {
    const updatedItem = {
      menu_id: this.editMenuId,
      name: this.editName,
      category: this.editCategory,
      start_date: this.start_date,
      end_date: this.end_date
    };
    try {
      const response = await apiClient.patch(`/menus?menu_id=${this.editMenuId}`, updatedItem, {
        headers: {
          token: this.token // Pass the token if required
        }
      });
      
      // Close the modal on success
      if (response.status === 200) {
        this.updateMenuModal.hide();
        this.fetchItems(); // Refresh the items list
      }else{
        this.updateMenuModal.hide();
        window.alert("Failed To update");
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }
  },
  mounted() {
    this.token = localStorage.getItem('token');
    this.addMenuModal = new Modal(document.getElementById('addMenuModal'));
    this.updateMenuModal = new Modal(document.getElementById('updateMenuModal'));
    this.fetchItems(); // Fetch items when the component is mounted
  },
};
</script>
<style scoped>
@import '../style.css';
.menu-page {
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
