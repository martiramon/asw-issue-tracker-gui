<template>
  <div class="container mt-4">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="input-group-1" label="Títol:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.titol"
          required
          placeholder="Anomeneu l'issue"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Descripció:" label-for="input-2">
        <b-form-textarea
          id="textarea"
          v-model="form.descripcio"
          rows="3"
          max-rows="6"
        ></b-form-textarea>

        <pre class="mt-3 mb-0">{{ text }}</pre>
      </b-form-group>

      <b-form-group id="input-group-3" label="Tipus:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.tipus"
          :options="tipus"
          required
        ></b-form-select>
      </b-form-group>
      <b-form-group id="input-group-3" label="Prioritat:" label-for="input-3">
        <b-form-select
          id="input-3"
          v-model="form.prioritat"
          :options="prioritat"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-4">
        <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
          <b-form-checkbox value="me">Check me out</b-form-checkbox>
          <b-form-checkbox value="that">Check that out</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Crea l'issue</b-button>
      <b-button type="reset" variant="danger">Descartar</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        titol: "",
        descripcio: "",
        tipus: null,
        prioritat: null,
        checked: []
      },
      prioritat: [
        { text: "Tria'n una", value: null },
        "Trivial",
        "Menor",
        "Major",
        "Crítica",
        "Bloquejant"
      ],
      tipus: [
        { text: "Tria'n un", value: null },
        "Bug",
        "Millora",
        "Proposta",
        "Tasca"
      ],
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.titol = "";
      this.form.descripcio = "";
      this.form.tipus = null;
      this.form.prioritat = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>
