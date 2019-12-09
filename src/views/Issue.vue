<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <!-- Issue -->
        <h4>
          Issue {{issue2.id}}
          <b-badge>{{issue2.tipus}}</b-badge>
        </h4>
        <h1>{{issue2.titol}}</h1>
        <p>
          <b>{{issue2.creator}}</b>
          created an issue on {{issue2.data_creacio}}
        </p>
        <p>{{issue2.descripcio}}</p>
        <hr />
        <!-- Comentaris -->
        <h5>Comentaris ({{comments2.length}})</h5>
        <b-row>
          <b-col>
            <b-form class="mx-auto" @submit="postComment">
              <b-form-textarea placeholder="Escriu aquí el teu comentari" v-model="comentari" />

              <div class="mt-3 float-right">
                <base-button
                  class="btn btn-primary mb-3"
                  type="primary"
                  native-type="submit"
                >Save changes</base-button>
              </div>
            </b-form>
          </b-col>
        </b-row>

        <b-col class="mx-auto" v-for="(comment) in comments2" :key="comment.id" :id="comment.id">
          <b-row>
            <p>
              <b>{{comment.owner}}</b>
              <br />
              {{comment.content}}
            </p>
          </b-row>

          <b-row :id="comments-actions-menu">
            <!-- user-only visible content-->
            <!-- posar aqui un modal bonic per la confirmacio -->
            <button type="button" class="btn btn-link">Esborra</button>
            <button type="button" class="btn btn-link">Edita</button>
            <!-- public content-->
            <button type="button" class="btn btn-text">{{comment.data_creacio}}</button>
          </b-row>
          <hr />
        </b-col>
      </div>
      <div class="col-lg-4">
        <div>
          <b-card>
            <b-card-text>
              <b>Assignat:</b>
              {{issue2.assignee}}
              <br />
              <b>Tipus:</b>
              {{issue2.tipus}}
              <br />
              <b>Prioritat:</b>
              {{issue2.prioritat}}
              <br />
              <b>Estat:</b>
              {{issue2.status}}
              <br />
              <b>Vots:</b>
              {{issue2.vote_set}}
              <br />
              <b>Watchers:</b>
              {{issue2.watch_set}}
              <br />
            </b-card-text>
          </b-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      comentari: "", //camp per guardar el comentari quan toqui
      issue: null,
      // issue per testejar la gui, la que s'ha de fer servir es la que es diu 'issue' que s'obte amb request
      issue2: {
        id: 10,
        titol: "Test Issue",
        descripcio:
          "DESCRIPCIO ISSUE skdnvksndvklsndvlks knvsdlksnvlkdsnvlks dkvnslkdmslkndvlksndlkvs nvdks nvdlksnvlkndsvdsnlk",
        data_creacio: "2019-12-05",
        creator: "Aina Garcia",
        assignee: "Marti Ramon",
        tipus: "Bug",
        prioritat: "Trivial",
        status: "Nou",
        vote_set: 2,
        watch_set: 4
      },
      comments2: [
        {
          id: 1,
          content: "Comentari 1",
          issue: 10,
          adjunt: null,
          data_creacio: "2019-11-20",
          owner: "Aina Garcia"
        },
        {
          id: 2,
          content: "Comentari 2",
          issue: 10,
          adjunt: null,
          data_creacio: "2019-11-20",
          owner: "Marti Ramon"
        },
        {
          id: 3,
          content: "Comentari 3",
          issue: 10,
          adjunt: null,
          data_creacio: "2019-11-20",
          owner: "Marti Ramon" // posar aixi a la api, ara retorna un id only
        }
      ],
      comments: []
    };
  },
  methods: {
    getIssue: async function() {
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      // hauria de posar aqui les credencials i tal
      await axios
        .get(
          "https://asw-issue-tracker-2019.herokuapp.com/api/issues/" +
            this.$router.id
        )
        .then(response => {
          this.issue = response.data;
          return response.data;
        });
    },
    getComments: async function() {},
    postComment: async function() {},
    editComment: async function(/*cid*/) {},
    deleteComment: async function(/*cid*/) {}
  },
  mounted() {
    this.getIssue();
    this.getComments();
  }
};
</script>

