<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <h4>
          Issue {{ issue2.id }}
          <b-badge>{{ issue2.tipus }}</b-badge>
        </h4>
        <h1>{{ issue2.titol }}</h1>
        <p>
          <b>{{ issue2.creator }}</b>
          created an issue on {{ issue2.data_creacio }}
        </p>
        <p>{{ issue2.descripcio }}</p>
        <hr />
        <!-- Comentaris -->
        <h5>Comentaris ({{ comments2.length }})</h5>
        <b-row>
          <b-col>
            <b-form class="mx-auto" @submit="postComment">
              <b-form-textarea placeholder="Escriu aquí el teu comentari" v-model="comentari" />
              <div class="mt-3 float-right">
                <button
                  class="btn btn-primary mb-3"
                  type="primary"
                  native-type="submit"
                >Save changes</button>
              </div>
            </b-form>
          </b-col>
        </b-row>

        <!-- Afegir comentari al canvi de status -->
        <b-modal id="modalStatus" hide-footer hide-header>
          <div>
            <b-form-textarea
              id="textarea"
              v-model="changeStatus.comentari"
              placeholder="Afegeix un comentari"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </div>

          <div class="mt-3">
            <button type="button" class="btn btn-primary mr-3" @click="resetStatusComment()">Cancela</button>
            <button type="button" class="btn btn-success" @click="updateStatus()">Guarda</button>
          </div>
        </b-modal>
        <!-- Confirmacio del delete -->
        <b-modal id="modalDelete" hide-footer hide-header>
          Estas segur que vols esborrar el comentari?
          <br />
          <div class="mt-3">
            <button
              type="button"
              class="btn btn-primary mr-3"
              @click="$bvModal.hide('modalDelete')"
            >Cancela</button>
            <button type="button" class="btn btn-danger" @click="deleteComment()">Esborra</button>
          </div>
        </b-modal>
        <b-col class="mx-auto" v-for="comment in comments2" :key="comment.id" :id="comment.id">
          <b-row>
            <p>
              <b>{{ comment.owner }}</b>
              <br />
              {{ comment.content }}
            </p>
          </b-row>

          <b-row>
            <!-- user-only visible content-->
            <button
              v-b-modal.modalDelete
              @click="confirmDelete(comment.id)"
              type="button"
              class="btn btn-link"
            >Esborra</button>
            <button
              type="button"
              class="btn btn-link"
              :id="comment.id"
              @click="displayEditComment(comment.content)"
            >Edita</button>
            <!-- public content-->
            <button type="button" class="btn btn-text">{{ comment.data_creacio }}</button>
          </b-row>

          <div :id="'elem'+comment.id" style="display: none;">
            <b-form-textarea id="textarea" v-model="commentcontentaux" rows="3" max-rows="6"></b-form-textarea>
            <div class="mt-3">
              <b-button
                type="button"
                class="btn btn-primary mr-3"
                :id="comment.id"
                @click="hideEditComment()"
              >Cancela</b-button>
              <b-button
                type="button"
                class="btn btn-success"
                @click="editComment(comment.id, comment.content)"
              >Guarda</b-button>
            </div>
          </div>

          <hr />
        </b-col>
      </div>
      <div class="col-lg-4">
        <b-row class="mb-3 mx-auto">
          <b-button-group>
            <b-dropdown text="Status">
              <b-dropdown-item
                v-for="option in status"
                :key="option"
                :value="option"
                @click="commentStatus(option)"
              >{{ option }}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown text="Més">
              <b-dropdown-item>Adjunteu fitxer</b-dropdown-item>
            </b-dropdown>
            <b-button variant="primary">Inici</b-button>
          </b-button-group>
        </b-row>
        <b-row class="mx-auto">
          <b-card>
            <b-card-text>
              <b>Assignat:</b>
              {{ issue2.assignee }}
              <br />
              <b>Tipus:</b>
              {{ issue2.tipus }}
              <br />
              <b>Prioritat:</b>
              {{ issue2.prioritat }}
              <br />
              <b>Estat:</b>
              {{ issue2.status }}
              <br />
              <b>Vots:</b>
              {{ issue2.vote_set }}
              <br />
              <b>Watchers:</b>
              {{ issue2.watch_set }}
              <br />
            </b-card-text>
          </b-card>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      status: [
        "Nou",
        "Obert",
        "Resolt",
        "Espera",
        "Invalit",
        "Duplicat",
        "NoFix",
        "Tancat"
      ],
      commentcontentaux: "",
      selectedDelete: 0,
      changeStatus: {
        selectedStatus: "",
        statusComment: ""
      },
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
    /*  API CALLS  */
    getComments: async function() {},
    postComment: async function() {},
    editComment: async function(/*commentid, commentcontent*/) {},
    deleteComment: async function() {
      /*API CALL HERE*/
      this.$bvModal.hide("modalDelete");
      this.selectedDelete = 0;
    },
    updateStatus: async function() {
      /*API CALL*/
      this.resetStatusComment();
      this.getIssue();
    },
    /*  MODAL TOGGLE  */
    confirmDelete: function(cid) {
      this.selectedDelete = cid;
    },
    commentStatus: function(option) {
      this.changeStatus.status = option;
      this.$bvModal.show("modalStatus");
    },
    resetStatusComment: function() {
      this.$bvModal.hide("modalStatus");
      this.changeStatus.comentari = "";
    },
    displayEditComment: function(c) {
      var commentid = event.currentTarget.getAttribute("id");
      document.getElementById("elem" + commentid).style.display = "block";
      this.commentcontentaux = c;
    },
    hideEditComment: function() {
      var commentid = event.currentTarget.getAttribute("id");
      document.getElementById("elem" + commentid).style.display = "none";
      this.commentcontentaux = "";
    }
  },
  mounted() {
    this.getIssue();
    this.getComments();
  }
};
</script>
