import axios from 'axios';
export const authMixin = {
    methods: {
        checkToken: function(redirect){
            axios.post("http://localhost:8000/api/check/", {"token": localStorage.getItem("vue-authenticate.vueauth_token")}).then((response) => {
                    var path = (response.data.status)? true : "/";
                    redirect({ path: path});
                }).catch((error) => {
                    throw new Error(error.message);
            });
        },
        authenticate: function() {
            this.$auth.authenticate('google', {provider: "google-oauth2"}).then(function () {
            }).catch(function(error) {
                throw new Error(error.message);
            });
        }
    }
}