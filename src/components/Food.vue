<template>
    <div class="food-page">
      <!-- <h2 class="text-center">Food</h2> -->
      <div style="margin-left: 25px;">
        <div class="row d-flex justify-content-between " style="margin: 15px;">
          <div class="col-auto">
            <button type="button" class="btn btn-success btn-lg" @click="showModal" >Add Food</button>
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
                  <th>Food Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filteredItems" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ getCategoryName(item.menu_id) }}</td>
                  <td>
                    <!-- Call to action buttons -->
                    <ul class="list-inline m-0">
                      <!-- <li class="list-inline-item">
                        <button class="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Add"><i class="fa fa-table"></i></button>
                      </li> -->
                      <li class="list-inline-item">
                        <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" @click="openEditModal(item.food_id, item.name, item.price,item.menu_id)"><i class="fa fa-edit"></i></button>
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
        <div class="modal fade" id="addFoodModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Food</h5>
                <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="addItem">
                  <div class="form-group row">
                    <label for="staticName" class="col-sm-2 col-form-label">Select Menu</label>
                    <div class="col-sm-10">
                      <select v-model="menuId" class="form-select">
                        <option disabled value="" class="selected">Please Select Food</option>
                        <option v-for="menu in menuItems" :value="menu.menu_id" :key="menu.menu_id">
                          {{ menu.category }}
                        </option>
                      </select>
                      <!-- <input type="text" class="form-control" id="staticName" v-model="name" required> -->
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="staticName" class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="staticName" v-model="name" required>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputPrice" class="col-sm-2 col-form-label">Price</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" id="inputPrice" v-model="price" required>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputImage" class="col-sm-2 col-form-label">Upload Image</label>
                    <div class="col-sm-10">
                      <input type="file"  class="form-control-file" id="inputImage" @change="handleImageUpload">
                    </div>
                  </div>
                  <div class="form-group row btn-groups" style="justify-content: center;margin-top: 30px;">
                    <button type="button" class="btn btn-secondary" id="btnClose"  @click="closeAddFoodModal">Close</button>
                    <button type="submit" class="btn btn-primary" id="btnAdd">Create Food</button>
                  </div>
                </form>
              </div>
              <!-- <div class="modal-footer">
                
              </div> -->
            </div>
          </div>
        </div>
     </div>
           
     <!-- Update Menu Modal -->
  <div class="modal fade" id="updateFoodModal" tabindex="-1" role="dialog" aria-labelledby="updateMenuLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="updateMenuLabel">Update Food</h5>
          <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateItem">
            <div class="form-group row">
              <label for="staticName" class="col-sm-2 col-form-label">Select Menu</label>
              <div class="col-sm-10">
                <select v-model="editMenuId" class="form-select">
                  <option v-for="menu in menuItems" :value="menu.menu_id" :key="menu.menu_id">
                          {{ menu.name }}
                  </option>
                </select>
                      <!-- <input type="text" class="form-control" id="staticName" v-model="name" required> -->
              </div>
            </div>
            <div class="form-group row">
              <label for="updateName" class="col-sm-2 col-form-label">Food Name</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="updateName" v-model="editName" required>
              </div>
            </div>
            <div class="form-group row">
              <label for="updatePrice" class="col-sm-2 col-form-label">Price</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="updatePrice" v-model="editPrice" required>
              </div>
            </div>
            <div class="form-group row">
            <label for="foodImage" class="col-sm-2 col-form-label">Food Image</label>
            <div class="col-sm-10">
              <input type="file" class="form-control" id="foodImage" @change="handleFileUpload" required>
              <img v-if="foodImagePreview" :src="foodImagePreview" alt="Food Image Preview" style="margin-top: 10px; max-width: 100%; height: auto;">
            </div>
          </div>
             <!-- <div class="form-group row" style="justify-content: center;margin-top: 30px;">
                    <button type="button" class="btn btn-secondary" style="margin-right: 25px;line-height: 30px;width: 110px;background: #db1f1f;"   @click="closeAddFoodModal">Close</button>
                    <button type="submit" class="btn btn-primary" style="background: #007bff !important;color: #fff !important;">Update Menu</button>
                  </div> -->
            <div class="form-group row" style="justify-content: center; margin-top: 30px; flex-wrap: nowrap;">
              <button type="button" class="btn btn-secondary" style="margin-right: 10px; line-height: 30px; width: auto; padding: 10px 20px; background: #db1f1f;" @click="closeUpdateFoodModal">Close</button>
              <button type="submit" class="btn btn-primary" style="background: #007bff !important; color: #fff !important; line-height: 30px; width: auto; padding: 10px 20px;">Update Food</button>
            </div>

          </form>
        </div>
        <!-- <div class="modal-footer">
        </div> -->
      </div>
    </div>
  </div>
  
  
      </div>
    </div>
    
  </template>
  <!--  Appetizersအမြည်း
        Main Courses အဓိကသင်တန်းများ
        Desserts အချိုပွဲ
        Beverages ယမကာ
        Salads အသုပ်-->
  <script>
  import apiClient from '@/services/axios';
  import { Modal } from 'bootstrap';
  
  export default {
    name: 'FoodPage',
    data() {
      return {
        selected: null,
        options: [
          { value: 'A', text: 'Option A (from options prop)' },
          { value: 'B', text: 'Option B (from options prop)' }
        ],
        searchQuery: '',
        items: [],
        menuItems : [],
        menuId: '',
        token: null,
        name:'',
        price:'',
        foodImage:null,
        foodImagePreview: null, // For image preview  
        editMenuId: null,
        editFoodId: '',
        editName:'',
        editPrice:'',
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
      handleImageUpload(){
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.foodImage = e.target.result; // This is the base64 string
          };
          reader.readAsDataURL(file);
        }
      },
      handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            // this.foodImagePreview = e.target.result; // Set the preview
            this.foodImage = e.target.result; // Set the base64 string
          };
          reader.readAsDataURL(file);
        }
      },
      async getMenus(){
        try{
          const response = await apiClient.get('/menus',{
            headers :{
              'token':this.token
            }
          });
          if (response.data.status === 200){
            this.menuItems = response.data.data;
          }else{
            window.alert("Error"+response.data.message);
          }
        }catch(error){
          console.error("Error fetching menu items : ",error)
        }
      },
      getCategoryName(menuId){
        const menu = this.menuItems.find(menu => menu.menu_id === menuId);
        return menu ? menu.name : 'Unknown';
      },
      async fetchItems() {
        try {

          const response = await apiClient.get('/foods', {
            headers: {
              'token': this.token, // Include token in headers
            },
          });
        
          if (response.data.status === 200) {
            this.items = response.data.data[0].food_items;
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
          alert('Failed to load the foods. Please try again later.');
        }
        }
      },
      showModal() {
        this.addFoodModal.show();
      },
      async addItem() {
      if(!this.menuId){
        window.alert("Please Select Menu");
        return
      }
      if(!this.foodImage){
        window.alert("Please upload a food image.")
        return
      }

       const newItem = {
          name: this.name, // Update with actual item data
          price: parseInt(this.price), 
          food_image: this.foodImage,
          menu_id: this.menuId
        };
        try {
          const response = await apiClient.post('/foods', newItem, {
            headers: {
              token: this.token, // Include token in headers
            },
          });
          // Check response status
          if (response.status === 200) {
            console.log('Item added successfully!');
            this.fetchItems(); // Refresh the list after adding
           
            if (this.addFoodModal._isShown) {
              this.name = '';
              this.price = '';
              this.menuId= null;
              this.addFoodModal.hide(); // Use the modal instance to hide it
          }else{ 
            console.log("Modal is hidden.");
          }
          } else {
            console.log('Failed to add item. Status:', response.status);
            window.alert(response.status);
          }
        } catch (error) {
          console.error('Error adding item:', error);
        }
      },
      searchItem() {
        // This function is just for demonstration
        console.log('Search query:', this.searchQuery);
      },
      closeAddFoodModal(){
        this.addFoodModal.hide();
      },
      closeUpdateFoodModal(){
        this.updateFoodModal.hide();
      },
      openEditModal(food_id, name, price,menu_id) {
        this.editFoodId = food_id;
        this.editMenuId = menu_id;
        this.editName = name;
        this.editPrice = price;
        this.updateFoodModal.show();
    },
      // Function to handle updating the item
      async updateItem() {
      const updatedItem = {
        menu_id: this.editMenuId,
        name: this.editName,
        food_image : this.foodImage,
        price: this.editPrice,
        // start_date: this.start_date,
        // end_date: this.end_date
      };
      try {
        const response = await apiClient.patch(`/foods/${this.editFoodId}`, updatedItem, {
          headers: {
            token: this.token // Pass the token if required
          }
        });
        
        // Close the modal on success
        if (response.status === 200) {
          this.updateFoodModal.hide();
          this.fetchItems(); // Refresh the items list
        }else{
          this.updateFoodModal.hide();
          window.alert("Failed To update");
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
    },
    mounted() {
      this.token = localStorage.getItem('token');
      this.addFoodModal = new Modal(document.getElementById('addFoodModal'));
      this.updateFoodModal = new Modal(document.getElementById('updateFoodModal'));
      console.log("mounted food");
      this.fetchItems(); // Fetch items when the component is mounted
      this.getMenus();
    },
  };
  </script>
  
  <style scoped>
  .food-page {
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
  .modal{
    /* width: 650px;
    height: 400px; */
  
  }
  </style>
  