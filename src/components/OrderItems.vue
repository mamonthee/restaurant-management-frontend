<template>
    <div>
      <ul>
        <li v-for="food in menu" :key="food.food_id">
          {{ food.category }} - Price: {{ food.price }}
          <button @click="addToOrder(food)">Add to Order</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import apiClient from '@/services/axios';
  
  export default {
    data() {
      return {
        token: null,
        menu: []
      };
    },
    methods: {
     async fetchMenu() {
        // Fetch menu items from backend
        try {
        const response = await apiClient.get('/foods', {
          headers: {
            'token': this.token, // Include token in headers
          },
        });
        if (response.data.status === 200) {
            this.menu = response.data.data[0].food_items;
        }else{
          window.alert("Error"+response.data.message);
        }
        
      } catch (error) {
        console.error('Error fetching items:', error);
      }
      },
      addToOrder(food) {
        this.$emit('addItem', food);
      }
    },
    mounted() {
        this.token = localStorage.getItem('token');
      this.fetchMenu();
    }
  };
  </script>
  