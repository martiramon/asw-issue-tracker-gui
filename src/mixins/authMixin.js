import axios from 'axios';
import { Store } from '../store/store.js';

export const authMixin = {
    methods: {
        checkToken: function(redirect){
            axios.post("https://asw-issue-tracker-2019.herokuapp.com/api/check/", {"token": localStorage.getItem("vue-authenticate.vueauth_token")}).then((response) => {
                    var path = (response.data.status)? true : "/";
                    redirect({ path: path});
                }).catch((error) => {
                    throw new Error(error.message);
            });
        },
        authenticate: function() {
            this.$auth.authenticate('google', {provider: "google-oauth2"}).then(function () {
                Store.commit('change', true);
            }).catch(function(error) {
                throw new Error(error.message);
            });
        }
    }
}