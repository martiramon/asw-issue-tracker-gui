<template>
  <div class="container mt-5">
    <div class="row">
      <div class=col-xl-3>
     <h1>Issue Tracker</h1>
      </div>
      <div class="col-xl-2 offset-xl-7">
        <b-button href='#/issues/new'> Nova Issue</b-button>
      </div>
    </div> 
        <b-button-toolbar>
          Filtrar per:
          <b-button-group class="mx-1">
            <b-button v-on:click="getIssues">Totes</b-button>
            <b-button v-on:click="getFilter('Nou')">Obertes</b-button>
            <b-button>Les meves issues</b-button>
            <b-button>Observant</b-button>
          </b-button-group>
        </b-button-toolbar>
      <h5>Issues:</h5>
      <b-table ref="table" striped hover :items=issues :fields="fields">
        <template v-slot:cell(titol)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <a class="link" :href="`#/issues/${data.item.id}`" target="_self" >{{ data.value }}</a>
        </template>
        <template v-slot:cell(tipus)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <a :href="`#/issues/`" @click="getFilter(data.item.tipus)" >{{ data.value }}</a>
        </template>
        <template v-slot:cell(prioritat)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <a :href="`#/issues/`" @click="getFilter(data.item.prioritat)" >{{ data.value }}</a>
        </template>
        <template v-slot:cell(status)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <a :href="`#/issues/`" @click="getFilter(data.item.status)" >{{ data.value }}</a>
        </template>
        <template v-slot:cell(prioritat)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <a :href="`#/issues/`" @click="getFilter(data.item.prioritat)" >{{ data.value }}</a>
        </template>
        <template v-slot:cell(data_creacio)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <a :href="`#/issues/`" @click="getFilter(data.item.data_creacio)" >{{ data.value }}</a>
        </template>
      </b-table>
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
            formatter: 'countVotes'
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
            formatter: 'iswatching'
          }
        ]
      };
    },
    methods: {
    getFilter: async function(f) {
      await axios
        .get(
          "https://asw-issue-tracker-2019.herokuapp.com/api/issues/?search="+f
        )
        .then(response => {
          this.issues = response.data;
          this.$$refs.table.refresh();
          return response.data;
        });
    },
    getIssues: async function() {
      // hauria de posar aqui les credencials i tal
      await axios
        .get(
          "https://asw-issue-tracker-2019.herokuapp.com/api/issues/"
        )
        .then(response => {
          this.issues = response.data;
          return response.data;
        });
    },
    countVotes(value) {
      return `${Object.keys(value).length}`
    },
    iswatching(value) {
      var watchers = `${Object.keys(value).map(function(e){
        return value[e].watcher;
      })}`;
      if (watchers.includes(6)) {return "Sí"}
      else {return "No"}
    },
  },
  mounted() {
    this.getIssues();
    this.countVotes();
    this.iswatching();
  }
  }
</script>