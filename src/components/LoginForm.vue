<template>
  <body class="img js-fullheight" :style="{ backgroundImage: 'url(' + imageUrl + ')' }">
    <section style="padding: 17em 0;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 text-center mb-5">
            <h2 class="heading-section">Login</h2>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="login-wrap p-0">
              <h3 class="mb-4 text-center">Have an account?    <a href="/signup" >Signup</a></h3>
              <form @submit.prevent="handleSubmit" class="sign-form">
                <div class="form-group">
                  <input type="text" class="form-control loginFormControl" v-model="username" placeholder="Email" required />
                </div>
                <div class="form-group">
                  <input type="password" class="form-control loginFormControl" v-model="password" placeholder="Enter Password" required />
                </div>
                <div class="form-group">
                  <button type="submit" class="form-control btn btn-primary loginFormControl">Sign In</button>
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
import eventBus from '@/eventBus';

export default {
  name: 'LoginForm', // Updated name
  data() {
    return {
      username: '',
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

        const response = await apiClient.post('/users/login', {
          email: this.username,
          password: this.password,
          token: this.token
        });

        // Handle successful login
        this.message = response.data.message || 'Login successful'; // Ensure message is set
        console.log("Message name:", response.data.name);
        console.log("userId",response.data.user_id);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId',response.data.user_id);
        localStorage.setItem('userRole',response.data.user_role);
        localStorage.setItem('userName',response.data.name);

        if (response.status === 200) {
          
          const userData = {
          userId: response.data.user_id,
          userRole: response.data.user_role,
          userName: response.data.name,
        };
        eventBus.emit('userLoggedIn', userData);
        console.log("Login successful, status:", response.status);
        // eventBus.setUser(userData); // Emit user data
        
          // Redirect to the Dashboard page
          if (response.data.user_role == "WAITER"){
            this.router.push('/order');
          }else{
            this.router.push('/menu');
          }
          // eventBus.emit('userLoggedIn', userData);
        }
      } catch (error) {
        if (error.response) {
          // Handle error response from server
          this.message = error.response.data.message || 'Login failed. Please try again.';
          console.log(error.response.data.message,"######");
        } else {
          console.log(error.response);
          this.message = 'An unexpected error occurred. Please try again.';
        }
        window.alert(this.message);
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
