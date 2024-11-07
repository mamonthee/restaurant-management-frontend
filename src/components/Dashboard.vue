<template>`
  <form @submit.prevent="login">
    <label for="username">Username:</label>
    <input type="text" id="username" v-model="formData.username" required>
    <label for="password">Password:</label>
    <input type="password" id="password" v-model="formData.password" required>
    <button type="submit">Login</button>
  </form>
</template>

<script>
export default {
  name:'DashboardPage',
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      console.log(this.formData);
    }
  }
}
</script>