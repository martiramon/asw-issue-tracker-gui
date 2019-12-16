<template>
  <div class="container mt-4">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-1" label="Títol:" label-for="input-1">
        <b-form-input id="input-1" v-model="form.titol" required placeholder="Anomeneu l'issue"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Descripció:" label-for="input-2">
        <b-form-textarea id="textarea" v-model="form.descripcio" value="this.issue.descripcio" rows="3" max-rows="6"></b-form-textarea>

        <pre class="mt-3 mb-0">{{ text }}</pre>
      </b-form-group>

      <b-form-group id="input-group-3" label="Tipus:" label-for="input-3">
        <b-form-select id="input-3" v-model="form.tipus" :options="tipus" required></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-4" label="Prioritat:" label-for="input-4">
        <b-form-select
          id="input-4"
          v-model="form.prioritat"
          :options="prioritat"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-5" label="Assignat:" label-for="input-5">
        <b-form-select v-model="form.assignee">
          <option v-for="item in users" :value="item.id" :key="item.id">
            {{ item.username }}
          </option>
        </b-form-select>
      </b-form-group>

      <b-button type="submit" variant="primary">Crea l'issue</b-button>
      <b-button type="reset" variant="secondary">Descartar</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";

  export default {
    data() {
      return {
        form: {
          titol: '',
          descripcio: '',
          data_creacio: '',
          assignee: null,
          tipus: null,
          prioritat: null,
          status: "Nou"
        },
        prioritat: [{text: "Tria'n una", value: null}, 'Trivial', 'Menor', 'Major', 'Crítica', 'Bloquejant'],
        tipus: [{ text: "Tria'n un", value: null }, 'Bug', 'Millora', 'Proposta', 'Tasca'],
        users: [],
        issue: null,
        user: {
          id: null,
          username: null
        },
        show: true
      }
    },
  methods: {
    getIssue: async function() {
      // hauria de posar aqui les credencials i tal
      await axios
        .get(
          "http://asw-issue-tracker-2019.herokuapp.com/api/issues/" +
            this.$route.params.id
        )
        .then(response => {
          
          this.issue = response.data;
          this.form.titol = this.issue.titol;
          this.form.descripcio = this.issue.descripcio;
          this.form.data_creacio = this.issue.data_creacio; 
          this.form.assignee = this.issue.assignee;
          this.form.tipus = this.issue.tipus;
          this.form.prioritat = this.issue.prioritat;
          this.form.status = this.issue.status;
          return response.data;
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset() {
      this.$router.push('/issues/' + this.$route.params.id + '/')
    }},
    mounted() {
      this.getIssue();
    }
  };
</script>
