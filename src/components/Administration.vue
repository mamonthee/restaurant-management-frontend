<template>
  <div class="menu-page">
    <h2 class="text-center">User Page</h2>
    <div style="margin-left: 25px;">
      <div class="row d-flex justify-content-between " style="margin: 15px;">
        <div class="col-auto">
          <button type="button" class="btn btn-success btn-lg" @click="showUserModal" >Add User</button>
        </div>
        <div class="col-auto">
          <input v-model="searchQuery" type="text" class="filter" placeholder="Search..." />
          <!-- <button @click="searchItem">Search</button> -->
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
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user,index) in filteredItems" :key="index">
                <td>{{ index+1 }}</td>
                <td>{{ user.name}}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.user_role }}</td>
                <td>{{ user.phone }}</td>
                <td>{{ user.password }}</td>
                <td>
                  <!-- Call to action buttons -->
                  <ul class="list-inline m-0">
                    <li class="list-inline-item">
                      <button class="btn btn-primary btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Add"><i class="fa fa-table"></i></button>
                    </li>
                    <li class="list-inline-item">
                      <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" @click="showUpdateUserModal(user.user_id,user.name,user.user_role,user.email,user.phone,user.password)"><i class="fa fa-edit"></i></button>
                    </li>
                    <li class="list-inline-item">
                      <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>
                    </li>
                  </ul>                                            
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--Add  Modal -->
      <div class="modal fade" id="addUserModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Add User</h5>
              <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addUserItems">
                <div class="form-group row">
                  <label for="staticName" class="col-sm-2 col-form-label">Name</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="staticName" v-model="name" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                  <div class="col-sm-10">
                    <input type="email" class="form-control" id="staticEmail" v-model="email" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticPhone" class="col-sm-2 col-form-label">Phone</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="staticPhone" v-model="phone" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticRole" class="col-sm-2 col-form-label">Role</label>
                  <div class="col-sm-10">
                    <select v-model="role" class="form-select">                       
                      <option value="ADMIN" >ADMIN</option>
                      <option value="WAITER" >WAITER</option>
                      <option value="KITCHEN" >KITCHEN</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" v-model="password" required>
                  </div>
                </div>
                <div class="form-group row" style="justify-content: center;margin-top: 30px;">
                  <button type="button" class="btn btn-secondary" style="margin-right: 25px;line-height: 30px;width: 110px;background: #db1f1f;"   @click="closeAddUserModal">Close</button>
                  <button type="submit" class="btn btn-primary" style="background: #007bff !important;color: #fff !important;width: 120px;line-height: 30px;">Create User</button>
                </div>
              </form>
            </div>  <!-- End Modal Body -->
          </div> <!-- End of Modal Content -->
        </div>
      </div><!--End Modal Div-->

      <!--Update User Modal -->
      <div class="modal fade" id="updateUserModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Update User</h5>
              <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateUsers">
                <div class="form-group row">
                  <label for="staticName" class="col-sm-2 col-form-label">Name</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="staticName" v-model="editName" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                  <div class="col-sm-10">
                    <input type="email" class="form-control" id="staticEmail" v-model="editEmail" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticPhone" class="col-sm-2 col-form-label">Phone</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="staticPhone" v-model="editPhone" required>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="staticRole" class="col-sm-2 col-form-label">Role</label>
                  <div class="col-sm-10">
                    <select v-model="editRole" class="form-select">                       
                      <option value="ADMIN" >ADMIN</option>
                      <option value="WAITER" >WAITER</option>
                      <option value="KITCHEN" >KITCHEN</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" v-model="editPassword" required>
                  </div>
                </div>
                <div class="form-group row btn-groups" style="justify-content: center;margin-top: 30px;">
                  <button type="button" class="btn btn-secondary" id="btnClose" @click="closeUpdateUserModal">Close</button>
                  <button type="submit" class="btn btn-primary" id="btnUpdate">Update User</button>
                </div>
              </form>
            </div>  <!-- End Modal Body -->
          </div> <!-- End of Modal Content -->
        </div>
      </div><!--End Modal Div-->
    </div>
  </div> 
</template>
<script>
import apiClient from '@/services/axios';
import { Modal } from 'bootstrap';
export default{
    name: "AdminiPage",
    data(){
        return{
          searchQuery: '',
          token: null,
            users:[],
            name: '',
            email: '',
            phone: '',
            password: '',
            role: '',
            editName: '',
            editEmail: '',
            editRole: '',
            editPhone: '',
            editPassword: '',
            editUserId: '',
        }
    },
    methods:{
      async fetchUsers() {
        try {
          const response = await apiClient.get(`/users`);
          console.log(response.data);
          if (response.status === 200) {
            this.users = response.data;
            console.log(this.users);
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
            alert('Failed to load the User. Please try again later.');
          }
        }
      },
      async addUserItems(){
        const newUsers = {
          name: this.name, 
          email: this.email,
          phone: this.phone,
          password: this.password,
          user_role: this.role
        };
        try {
          const response = await apiClient.post('/users/signup'
          , newUsers,
        // {
        //     headers: {
        //       token: this.token, // Include token in headers
        //     },
        //   }
        );
          // Check response status
          if (response.status === 200) {
            console.log('Item added successfully!');
            this.fetchUsers(); // Refresh the list after adding
           
            if (this.addUserModal._isShown) {
              this.name = '';
              this.email= '';
              this.phone= '';
              this.password= '';
              this.addUserModal.hide(); // Use the modal instance to hide it
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
    async updateUsers() {
      const updatedUsers = {
        name: this.editName,
        user_role : this.editRole,
        email : this.editEmail,
        phone: this.editPhone,
        password: this.editPassword
      };
      try {
        const response = await apiClient.patch(`/users/${this.editUserId}`, updatedUsers
        , {
          headers: {
            token: this.token // Pass the token if required
          }
        }
      );
        
        // Close the modal on success
        if (response.status === 200) {
          this.updateUserModal.hide();
          this.fetchUsers(); // Refresh the items list
        }else{
          this.updateFoodModal.hide();
          window.alert("Failed To user update");
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
    showUserModal(){
        this.addUserModal.show();
    },
    showUpdateUserModal(userId,name,userRole,email,phone,password){
      this.editUserId = userId;
      this.editName = name;
      this.editRole = userRole;
      this.editEmail = email;
      this.editPhone = phone;
      this.editPassword = password;
      this.updateUserModal.show();
    },
    closeAddUserModal(){
      this.addUserModal.hide();
    },
    closeUpdateUserModal(){
      this.updateUserModal.hide();
    },
    },
    mounted(){
      this.token = localStorage.getItem('token');
      this.fetchUsers();
      this.addUserModal = new Modal(document.getElementById('addUserModal'));
      this.updateUserModal = new Modal(document.getElementById('updateUserModal'));
    },
    computed: {
  filteredItems() {
    const query = typeof this.searchQuery === 'string' ? this.searchQuery.toLowerCase() : '';

    return this.users.filter(user => {
      if (!user || typeof user.name !== 'string') {
        return false;
      }

      // Combine `first_name` and `last_name` into `fullName`
      const fullName = `${user.name.toLowerCase()}`;
      // Check if `fullName` includes the search query
      return fullName.includes(query);
    });
  }
}


}
</script>