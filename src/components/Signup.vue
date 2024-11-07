<template>
    <body class="img js-fullheight" :style="{ backgroundImage: 'url(' + imageUrl + ')' }">
      <section style="padding: 10em 0;">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-6 text-center mb-5">
              <h2 class="heading-section">Signup</h2>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
              <div class="login-wrap p-0">
                <h3 class="mb-4 text-center">Have an account?      <span><a href="/" style="color: #fff;">Login</a></span></h3>
                <form @submit.prevent="handleSubmit" class="sign-form">
                  <div class="form-group d-flex align-items-center">
                    <input type="text" class="form-control loginFormControl" id="inputFUserRole" v-model="userRole" placeholder="Enter User Role" required />
                    <select v-model="userRole" class="form-select">
                      <option value="KITCHEN" class="selected">KITCHEN</option>
                      <option value="WAITER">WAITER</option>
                      <option value="USER">USER</option>
                    </select>
                  </div>
                  <div class="form-group d-flex align-items-center">
                    <input type="text" class="form-control loginFormControl" id="inputName" v-model="name" placeholder="Enter Name" required />
                  </div>
                  <div class="form-group d-flex align-items-center">
                    <input type="text" class="form-control loginFormControl" id="inputFEmail" v-model="email" placeholder="Enter Email" required />
                  </div>
                  <div class="form-group d-flex align-items-center">
                    <input type="text" class="form-control loginFormControl" id="inputPhone" v-model="phone" placeholder="Enter Phone" required />
                  </div>
                  <div class="form-group">
                    <input type="password" class="form-control loginFormControl" v-model="password" placeholder="Enter Password" required />
                  </div>
                  <div class="form-group">
                    <button type="submit" class="form-control btn btn-primary loginFormControl">Sign Up</button>
                  </div>
                  <div class="form-group">
                    <div>
                      <label class="checkbox-wrap">Remember me
                        <input type="checkbox" v-model="rememberMe" />
                        <span></span>
                      </label>
                    </div>
                    <div>
                      <a href="#">Forgot Password</a>
                    </div>
                  </div>
                </form>
                <p v-if="message">{{ message }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </body>
  </template>
  
  <script>
  import apiClient from '@/services/axios';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'SignupForm', // Updated name
    data() {
      return {
        userRole: '',
        name:'',
        email: '',
        phone:'',
        password: '',
        token:'',
        rememberMe: false,
        message: '  ',
        imageUrl: require('@/assets/table-5356682.jpg'), // Reference to the image
      };
    },
    setup() {
      const router = useRouter(); // Initialize the router here
      return { router };
    },
    methods: {
      async handleSubmit() {
        try {
          console.log("Handling form submission");
  
          const response = await apiClient.post('/users/signup', {
            user_role : this.userRole,
            name : this.name,
            email: this.email,
            phone : this.phone,
            password: this.password,
            token: this.token
          });
  
          // Handle successful login
          this.message = response.data.message || 'Login successful'; // Ensure message is set
          console.log("Message:", this.message);
          console.log(response.data.token);
          localStorage.setItem('token', response.data.token);
  
          if (response.status === 200) {
            console.log("Signup successful, status:", response.status);
            // Redirect to the Dashboard page
            this.router.push('/');
          }
        } catch (error) {
          if (error.response) {
            // Handle error response from server
            this.message = error.response.data.message || 'Login failed. Please try again.';
          } else {
            this.message = 'An unexpected error occurred. Please try again.';
          }
        }
      },
    },
  }
  </script>
  
  <style>
  /* Import Bootstrap from CDN */
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
  
      body {
      font-family: "Lato", Arial, sans-serif;
      font-size: 16px;
      line-height: 1.8;
      font-weight: normal;
      color: gray;
      position: relative;
      z-index: 0;
      padding: 0;
  }
  body:after {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
      background: #000;
      opacity: .3;
      z-index: -1;
  }
  
  .img {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center; }
      .form-group {
          margin-bottom: 1rem; 
      }
      .form-text {
          display: block;
          margin-top: 0.25rem; 
      }
      .loginFormControl {
          background-color: transparent;
          background: transparent;
          border: none;
          height: 50px;
          color: #fff !important;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 40px;
          padding-left: 20px;
          padding-right: 20px;
          -webkit-transition: 0.3s;
          -o-transition: 0.3s;
          transition: 0.3s; 
      }
  
      .heading-section {
          font-size: 28px;
          color: #fff; 
        }
          .login-wrap h3{
          font-weight: 300;
          color: #fff;
      }
      .loginFormControl:focus {
              background-color: transparent; /* Ensure background stays transparent on focus */
              color: white;
              outline: none;
              box-shadow: none; /* Remove default bootstrap shadow */
      }
    .row {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin-right: -15px;
      margin-left: -15px;
  }
  .justify-content-center {
      -webkit-box-pack: center !important;
      -ms-flex-pack: center !important;
      justify-content: center !important;
  }
  .btn.btn-primary {
      background: #fbceb5 !important;
      border: 1px solid #fbceb5 !important;
      color: #000 !important;
  }
  .loginFormControl::placeholder {
      color: white;
      opacity: 1; }
      input,
  button,select,optgroup,textarea {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit; }
  
  button,input {
    overflow: visible; }
    
  
  </style>
  