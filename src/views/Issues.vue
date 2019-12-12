<template>
  <div>
    <b-table striped hover :items=issues :fields="fields"></b-table>
  </div>
</template>

<script>
import axios from "axios";
  export default {
    data() {
      return {
        issues: null,
        // Note 'isActive' is left out and will not appear in the rendered table
        fields: [
          {
            key: 'titol',
            label: 'Títol',
            sortable: true
          },
          {
            key: 'tipus',
            label: 'Tipus',
            sortable: true
          },
          {
            key: 'prioritat',
            label: 'Prioritat',
            sortable: true,
          },
          {
            key: 'status',
            label: 'Status',
            sortable: true,
          },
          {
            key: 'assignee',
            label: 'Assignat a',
            sortable: true,
          },
          {
            key: 'vote_set',
            label: 'Vots',
            sortable: true,
          },
          {
            key: 'data_creacio',
            label: 'Data de creació',
            sortable: true,
          },
          {
            key: 'watch_set',
            label: 'Watching',
            sortable: true,
          }
        ]
      };
    },
    methods: {
    getIssues: async function() {
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      // hauria de posar aqui les credencials i tal
      await axios
        .get(
          "https://asw-issue-tracker-2019.herokuapp.com/api/issues/"
        )
        .then(response => {
          this.issues = response.data;
          return response.data;
        });
    }
  },
  mounted() {
    this.getIssues();
  }
  }
</script>