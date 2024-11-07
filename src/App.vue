<template>
  <div id="app">
    <!-- Conditionally render the navbar and sidebar only if the user is NOT on the login page -->
    <div v-if="!isLoginPage && !isInvoicePage">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#" style="font-weight: bold;">MIMON</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <button type="button" id="sidebarCollapse" class="btn btn-dark" style="margin-left: 110px;" @click="toggleSidebar">
                <i class="fas fa-align-left"></i>
                <span></span>
              </button>
            </li>
          </ul>
        </div>
        <div class="form-inline my-2 my-lg-0 ml-auto">
          <button v-if="this.users.user_role === 'KITCHEN'" class="btn btn-light my-2 my-lg-0" style="margin-right:10px;" type="button" @click="viewNotifications">
            <i class="fas fa-bell" style="font-size: 22px;"></i>
            <span class="badge" >{{ notificationCount }}</span> <!-- Notification Count -->
          </button>
          <button v-else class="btn btn-light my-2 my-lg-0" style="margin-right:10px;" type="button" @click="viewNotifications">
            <i class="fas fa-bell" style="font-size: 22px;"></i>
            <span class="badge" style="color: green;">{{ prepareNotiCount }}</span> <!-- Notification Count -->
          </button>
          <button class="btn btn-light my-2 my-lg-0" style="margin-right:10px;" type="submit" @click="viewProfile"><i class="fas fa-user"></i> Profile</button>
          <button class="btn btn-outline-light my-2 my-sm-0" style="margin-right: 10px;" type="submit" @click="logout">Signout</button>
        </div>
      </nav>

      <!-- Sidebar -->
      <div class="wrapper">
        <nav id="sidebar" :class="{ active: isActive }">
          <ul class="list-unstyled">
            <!-- <li :class="{ active: isActiveRoute('/dashboard') }">
              <router-link to="/dashboard" ><i class="fas fa-home"></i><span>Dashboard</span></router-link>
            </li>  -->
            <li v-if="isAdminRole || isKitchenRole" :class="{ active: isActiveRoute('/menu') }">
              <router-link to="/menu"><i class="fa fa-bars" aria-hidden="true"></i><span> Menu</span></router-link>
            </li>
            <li v-if="isAdminRole || isKitchenRole" :class="{ active: isActiveRoute('/food') }">
              <router-link to="/food"><i class="fas fa-utensils"></i><span> Food</span></router-link>
            </li>
            <li v-if="isAdminRole || isWaiterRole" :class="{ active: isActiveRoute('/order') }">
              <router-link to="/order"><i class="fas fa-shopping-cart"></i><span>Order</span></router-link>
            </li>
            <li :class="{ active: isActiveRoute('/viewOrder') }">
              <router-link to="/viewOrder"><i class="fas fa-list"></i><span>View Order</span></router-link>
            </li>
            <li  v-if="isAdminRole || isKitchenRole" :class="{ active: isActiveRoute('/kitchen') }">
              <router-link to="/kitchen"><i class="fas fa-utensils"></i><span>Kitchen</span></router-link>
            </li> 
            <li :class="{ active: isActiveRoute('/table') }">
              <router-link to="/table"><i class="fas fa-table"></i><span>Table</span></router-link>
            </li>
            <li v-if="isAdminRole" :class="{ active: isActiveRoute('/report') }">
              <router-link to="/report"><i class="fas fa-file-alt"></i><span>Report</span></router-link>
            </li>
            <li v-if="isAdminRole" :class="{ active: isActiveRoute('/administration') }">
              <router-link to="/administration"><i class="fas fa-cog"></i><span>Administration</span></router-link>
            </li>
          </ul>
        </nav>

        <!-- Main Content -->
        <div id="content">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <!-- If login page, only show router-view (login form) -->
    <div v-else>
      <router-view></router-view>
    </div>
  </div>


   <!-- Profile Modal -->
  <div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="profileLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="profileLabel">Profile</h5>
          <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateItem">
            <div class="form-group row">
              <label for="updateName" class="col-sm-2 col-form-label">User Name</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="updateName" :value="this.userName" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label for="updateCategory" class="col-sm-2 col-form-label">Role</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="updateCategory" :value="this.userRole" disabled>
              </div>
            </div>
            <div class="form-group row" style="justify-content: center;margin-top: 30px;">
                    <!-- <button type="button" class="btn btn-secondary" style="margin-right: 25px;line-height: 30px;width: 110px;background: #db1f1f;"   @click="closeAddMenuModal">Close</button> -->
                    <!-- <button type="submit" class="btn btn-primary" style="background: #007bff !important;color: #fff !important;width: 130px;">Update Menu</button> -->
                  </div>
          </form>
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div>

  <!-- Notification Modal -->
  <div class="modal fade" id="showNotificationModal" tabindex="-1" role="dialog" aria-labelledby="profileLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="profileLabel">Notifications</h5>
          <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="(prepareNotis.length === 0 && this.users.user_role === 'WAITER') || (notifications.length === 0 && this.users.user_role === 'KITCHEN')">No notifications</div>
            <div v-else>
              <div v-if="this.users.user_role === 'KITCHEN'">
                <div class="list-group" v-for="notification in notifications" :key="notification.id" @click="viewOrder(notification.orderId)">
                  <a href="#" class="list-group-item list-group-item-action">Service alert: Order Id <span style="color: #dc3545;">{{ notification.orderId }}</span> for Table  {{ notification.tableNumber }} has placed an order!</a>
                </div>
              </div>
              <div v-else>
                <div class="list-group" v-for="notification in prepareNotis" :key="notification.id" @click="viewPrepareStatus(notification.orderId)">
                  <a href="#" class="list-group-item list-group-item-action">Order Id <span style="color: #dc3545;">{{ notification.orderId }}</span> for Table {{ notification.tableNumber }} is ready for pickup.</a>
                </div>
              </div>
              
          <div>
          </div>
        </div>
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/style.css';
import WebSocketService from '@/services/websocketService';
import apiClient from './services/axios';
import { Modal } from 'bootstrap';
import eventBus from './eventBus';

export default {
  name: 'App',
  data() {
    return {
      isActive: false,
      users: [],
      user: null,
      token: null,
      userId: '',
      userRole:'',
      userName:'',
      isLoggedIn: localStorage.getItem('token') ? true : false,
      notificationCount: parseInt(localStorage.getItem('notificationCount')) || 0, // Load notification count from localStorage
      notifications: JSON.parse(localStorage.getItem('notifications')) || [], // Load notifications from localStorage
      notificationSound: new Audio(require('@/assets/sounds/mixkit-clear-announce-tones-2861.wav')), // Load sound
      showNotificationList: false, 

      prepareNotis: JSON.parse(localStorage.getItem('prepareNotis')) || [], // Load notifications from localStorage
      prepareNotiCount: parseInt(localStorage.getItem('prepareNotiCount')) || 0, // Load notification count from localStorage
      prepareNotiSound: new Audio(require('@/assets/sounds/school-bell-87744.mp3')), // Load sound
      showPrepareNotiList: false, 
    };
  },
  computed: {
    isActiveRoute() {
      return (path) => this.$route.path === path;
    },
    isLoginPage() {
      // Check if current route is the login page (adjust path as necessary)
      return this.$route.path === '/' || this.$route.path === '/login' || this.$route.path === '/signup';
    },
    isInvoicePage() {
      return this.$route.path.startsWith('/invoice'); // Adjust this path as needed
    },
    isKitchenRole() {
      return this.users.user_role === 'KITCHEN';
    },
    isAdminRole(){
      return this.users.user_role === 'ADMIN';
    },
    isWaiterRole(){
      return this.users.user_role === 'WAITER';
    }
  },
  mounted(){
    // if (this.$route.path !== '/'){
    //   console.log("MOUNT*******",this.$route.path);
    eventBus.on('userLoggedIn', (data) => {
         this.user = data;
        //  console.log(this.user)
        //  console.log(this.user.userName);
         this.userName = this.user.userName;
         this.userRole = this.user.userRole;
         this.userId = this.user.userId;
           this.fetchUsers();
           WebSocketService.connect();

          WebSocketService.on('newOrder', (order) => {
            console.log("Webservice");
            // console.log("order",order)
            this.orderId=order; // Store the full order details
            if (this.users.user_role === 'KITCHEN'){
              this.handleNewOrder(this.orderId);
              eventBus.emit('refreshOrders'); 
            }
            
          });
      });

      this.token = localStorage.getItem('token');
      this.userId = localStorage.getItem('userId');
      this.userRole = localStorage.getItem('userRole');
      this.userName = localStorage.getItem('userName');
      console.log("mounted",this.userName);
    
      this.allowSoundOnInteraction();
      this.profileModal = new Modal(document.getElementById('profileModal'));
      this.showNotificationModal = new Modal(document.getElementById('showNotificationModal'));
    // }
  },
  methods: {
    toggleSidebar() {
      this.isActive = !this.isActive;
    },
    viewProfile(){
      console.log("view");
      this.profileModal.show();
    },
    logout(){
      console.log("logout");
      
      this.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('notifications');
      localStorage.removeItem('notificationCount');

      this.$router.push("/");
    },
    async fetchUsers() {
      try {
        const response = await apiClient.get(`/users/${this.userId}`, {
          headers: {
            'token': this.token, // Include token in headers
          },
        });
        if (response.status === 200) {
          this.users = response.data;
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
          alert('Failed to load the user from app.vue. Please try again later.');
        }
      }
    },
    viewNotifications() {
      // Logic to show notifications
      // alert('Here are your notifications!'); // Replace with actual notification logic
      this.showNotificationModal.show();
      this.showNotificationList = !this.showNotificationList;
    },
    viewOrder(orderId) {
      this.notifications = this.notifications.filter(notification => notification.orderId !== orderId);
    
      // Update local storage with the modified notifications array
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    
    // Update the notification count
    this.notificationCount = this.notifications.length;
    localStorage.setItem('notificationCount', this.notificationCount);
      // Navigate to the viewOrder page with the orderId
      this.$router.push('/kitchen');

      this.showNotificationModal.hide();
    },
    viewPrepareStatus(orderId){
      console.log("viewPrepareStatus");
      this.prepareNotis = this.prepareNotis.filter(notification => notification.orderId !== orderId);
       // Update local storage with the modified prepare notifications array
      localStorage.setItem('prepareNotis', JSON.stringify(this.prepareNotis));
    
    // Update the notification count
    this.prepareNotiCount = this.prepareNotis.length;
    localStorage.setItem('prepareNotiCount', this.prepareNotiCount);
      // Navigate to the viewOrder page with the orderId
      this.$router.push({path: '/viewOrder',query:{orderId}});

      this.showNotificationModal.hide();
    },
    playNotificationSound() {
      console.log("playNotificationSound");
      this.notificationSound.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    },
    playPrepareNotiSound() {
      this.prepareNotiSound.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    },
    allowSoundOnInteraction() {
    // Try playing the sound when the user interacts for the first time
    // document.addEventListener('click', () => {
      if (this.users.user_role === 'KITCHEN'){
        this.notificationSound.play().catch(() => {});
      }else if (this.users.user_role === 'WAITER'){
        this.prepareNotiSound.play().catch(() => {});
      }
      
    // }, { once: true }); // Ensures the listener only triggers once
  },
    handleNewOrder(orderId,tableNumber) {
      console.log("handleNewOrder");
      const newNotification = {
        id: this.notificationCount + 1, // Unique ID for the notification
        // message: `A new order has been created: ${orderDetails}`, // Custom message
        orderId: orderId, // Assuming orderDetails has an ID
        tableNumber: tableNumber
      };

      this.notifications.push(newNotification); // Add to notifications array
      this.notificationCount++;
      localStorage.setItem('notificationCount', this.notificationCount); // Save updated count in localStorage
      localStorage.setItem('notifications', JSON.stringify(this.notifications)); // Store notifications in localStorage

      this.playNotificationSound();
    },
    handlePrepareStatus(order){
      const newPrepareNoti = {
        id: this.prepareNotiCount +1,
        orderId: order.order_id,
        tableNumber: order.table_number
      };
      // console.log("prepareStatus");
      this.prepareNotis.push(newPrepareNoti); // Add to notifications array
      this.prepareNotiCount++;
      localStorage.setItem('prepareNotiCount', this.prepareNotiCount); // Save updated count in localStorage
      localStorage.setItem('prepareNotis', JSON.stringify(this.prepareNotis)); // Store notifications in localStorage
      this.playPrepareNotiSound();

    }
  },
  created() {
   
    this.user = eventBus.user; // Get initial user data

    // Watch for changes in the event bus
    this.$watch(
      () => eventBus.user,
      (newUser) => {
        this.user = newUser;
        if (newUser) {
          console.log(`User logged in: ${newUser.userName}`);
        }
      }
    );
    if (this.isLoggedIn) {
      this.userId = localStorage.getItem('userId');
      this.fetchUsers();
    }
    // this.handleNewOrder();
    WebSocketService.connect();
    console.log("CREATED");

    WebSocketService.on('newOrder', (order) => {
      console.log("Webservice!!!!!");
      console.log(order.table_number)
      this.orderId=order.order_id; // Store the full order details
      if (this.users.user_role === 'KITCHEN'){
        this.handleNewOrder(this.orderId,order.table_number);
        eventBus.emit('refreshOrders'); 
      }
      
    });
    WebSocketService.on('prepareStatus',(orderData)=>{
      console.log("prepareStatus11");
      console.log(orderData.table_number);
      if (this.users.user_role === 'WAITER' && this.users.name === this.users.name){
        this.handlePrepareStatus(orderData);
      }
      console.log(orderData);
    })
  },
  beforeUnmount() {
    eventBus.off('userLoggedIn');
    WebSocketService.off('newOrder'); // Clear the specific listener
    WebSocketService.off('prepareStatus');
     // Clear WebSocket callbacks on unmount
     WebSocketService.callbacks = {}; // Clears all registered callbacks
    if (WebSocketService.connection) {
      WebSocketService.connection.close();
    }
  },
};
</script>
<style src="./style.css"></style>
<style>

/* Import Bootstrap CSS */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');

/* Import Font Awesome CSS */
@import url('https://use.fontawesome.com/releases/v5.0.13/css/all.css');

/* @import url('https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js'); */

    
 /* body{
    background: #fafafa;
    font-family: 'Poppins', sans-serif;
    width: 1000px;
 } */
  #app{
    background: #fff;
  }
 .wrapper {
    display: flex;
    align-items: stretch;
    background-color: #fff;
}
 #sidebar{
    background: #393A3C;
    width: 220px;
    min-height: 100vh;
    color: #fff;
    transition: all 0.3s;
 }
 #sidebar .sidebar-header{
    padding: 20px;
    background: #303033;
    
 }
 #sidebar ul li.active > a {
    color: #fff;
    background: #6d7fcc;
}

#sidebar ul li a {
    font-weight: 500;
    padding: 20px;
    font-size: 1.1em;
    display: block;
    color: #fff;
    text-decoration: none;
}
#sidebar ul li a:hover{
    color: #7386D5;
    background: #fff;
 }
 ul ul a {
    font-size: 0.9em !important;
    padding-left: 30px !important;
    background: #666363;
}
/* #sidebar ul li.active > a, a[aria-expanded="true"] {
    color: #fff;
    background: #6d7fcc;
} */
 a,a:focus,a:hover{
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
 }
 
 /* #sidebar.active {
        margin-left: 0;
    } */

#sidebar.active {
    margin-left: -250px;
}
#sidebar ul li a i {
        margin-right: 15px;         /* Space between icon and text */
        font-size: 24px;           /* Set a consistent size for all icons */
        
}  
#content{
  width: 100%;
}

/* notification style */
.btn-light {
  position: relative;
}
.btn-light .fas.fa-bell {
  position: relative;
}
.btn-light .badge {
  position: absolute !important;
  top: -5px !important;
  right: -10px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 4px 7px;
  font-size: 12px;
}

</style>
