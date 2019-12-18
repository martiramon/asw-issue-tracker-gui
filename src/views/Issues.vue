<template>
  <div>
    <div>
        Welcome home!
    </div>
    <div v-if="haveToken"> 
        <button @click="authenticate('google')">Log Out</button>
    </div>
    <div v-else>
      <button @click="authenticate('google')">Log In</button>
    </div>
  </div>
</template>

<script>
  import { authMixin } from '../mixins/authMixin';
  let token = localStorage.getItem('vue-authenticate.vueauth_token');
  export default {
    mixins: [ authMixin ],
    computed: {
      haveToken() {
        return token != null;
      }
    }
  };
</script>
