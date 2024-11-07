<template>
    <div class="">
    <div class="d-flex">
      <!-- Use v-for to loop through a list of buttons -->
      <div v-for="menu in menus" :key="menu.menu_id" class=" mb-3">
        <button style="margin-right:20px;"
          type="button"
          class="btn btn-secondary"
          @click="clickMenu(menu.menu_id)">
          {{ menu.name }}
        </button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import apiClient from '@/services/axios';
  
  export default {
    data() {
      return {
        token: null,
        menus: []
      };
    },
    methods: {
     async fetchMenu() {
        // Fetch menu items from backend
        try {
        const response = await apiClient.get('/menus', {
          headers: {
            'token': this.token, // Include token in headers
          },
        });
        if (response.data.status === 200) {
            this.menus = response.data.data;
              // Automatically select and show food items for the first menu if available
          if (this.menus.length > 0) {
            this.clickMenu(this.menus[0].menu_id); // Auto-select the first menu
          }
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
      clickMenu(menuId) {
        this.$emit('menuId', menuId);
      }
    },
    mounted() {
        this.token = localStorage.getItem('token');
      this.fetchMenu();
    }
  };
  </script>
  