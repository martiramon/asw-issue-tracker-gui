<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-8">
        <h4>
          Issue {{ issue.id }}
          <b-badge>{{ issue.tipus }}</b-badge>
        </h4>
        <h1>{{ issue.titol }}</h1>
        <p>
          <b>{{ getUsername(issue.creator) }}</b>
          created an issue on {{ issue.data_creacio }}
        </p>
        <p>{{ issue.descripcio }}</p>
        <hr />
        <!-- Comentaris -->
        <h5>Comentaris ({{ comments.length }})</h5>
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
              v-model="changeStatus.statusComment"
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
        <b-col class="mx-auto" v-for="comment in comments" :key="comment.id" :id="comment.id">
          <b-row>
            <p>
              <b>{{ getUsername(comment.owner) }}</b>
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
                @click="editComment(comment.id)"
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
              <b-dropdown-item v-b-modal="'my-modal'">Adjunteu fitxer</b-dropdown-item>
              <b-dropdown-item @click="editIssue">Edita</b-dropdown-item>
              <b-dropdown-item @click="deleteIssue">Esborra</b-dropdown-item>
            </b-dropdown>
            <b-button href="#/issues" variant="primary">Inici</b-button>
          </b-button-group>
        </b-row>
        <b-row class="mx-auto">
          <b-card>
            <b-card-text>
              <b>Assignat:</b>
              {{ getUsername(issue.assignee) }}
              <br />
              <b>Tipus:</b>
              {{ issue.tipus }}
              <br />
              <b>Prioritat:</b>
              {{ issue.prioritat }}
              <br />
              <b>Estat:</b>
              {{ issue.status }}
              <br />
              <b>Vots:</b>
              {{ issue.vote_set.length }}
              <br />
              <b>Watchers:</b>
              {{ issue.watch_set.lenght }}
              <br />
            </b-card-text>
          </b-card>
        </b-row>
        <b-modal id="my-modal" title="Adjunteu un fitxer">
          <div class="large-12 medium-12 small-12 cell">
            <label>Fixer: 
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
              <button v-on:click="postAdjunt()">Submit</button>
          </div>

            <!-- <b-form-file
              v-model="file"
              :state="Boolean(file)"
              placeholder="Tria un fitxer..."
              drop-placeholder="Arrossega'l fins aquí..."
            ></b-form-file>
            <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
            <template v-slot:modal-footer>
              <div class="w-100">
              <b-button type="submit" class="float-right" size="sm" variant="primary"  @click="postAdjunt">Pugeu el fitxer</b-button>
              <b-button type="reset" class="float-right" size="sm" variant="secondary"  @click="show=false">Descartar</b-button>
             </div>
            </template> -->
          
        </b-modal>
        
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
      users: [],
      commentcontentaux: "",
      selectedDelete: 0,
      changeStatus: {
        selectedStatus: "",
        statusComment: ""
      },
      file: null,
      comentari: "", //camp per guardar el comentari quan toqui
      issue: {},
      // issue per testejar la gui, la que s'ha de fer servir es la que es diu 'issue' que s'obte amb request
      comments: []
    };
  },
  methods: {
    handleFileUpload(){
        this.file = this.$refs.file.files[0];
      },
    getIssue: async function() {
      // hauria de posar aqui les credencials i tal
      await axios
        .get(
          "http://asw-issue-tracker-2019.herokuapp.com/api/issues/" +
            this.$route.params.id
        )
        .then(response => {
          this.issue = response.data;
          return response.data;
        });
    },
    getComments: async function() {
      // hauria de posar aqui les credencials i tal
      await axios
        .get(
          "http://asw-issue-tracker-2019.herokuapp.com/api/comment?issue=" +
            this.$route.params.id
        )
        .then(response => {
          this.comments = response.data;
          return response.data;
        });
    },
    postAdjunt: async function() {
      // hauria de posar aqui les credencials i tal
      let formData = new FormData();
      formData.append('file', this.file);
      var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'-');
      var creacio = currentDateWithFormat;
      await axios
        .post(
          "http://asw-issue-tracker-2019.herokuapp.com/api/adjunts/",
          {
            issue: this.$route.params.id,
            data_creacio: creacio,
            owner: 6,
            data: formData
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: "Token 05a9b35f3fc99505ad75a9a6eb236771a301f613"
            }
          }
        )
        .then(response => {
          this.getComments();
          return response.data;
        });
    },
    postComment: async function() {
      // hauria de posar aqui les credencials i tal
      await axios
        .post(
          "http://asw-issue-tracker-2019.herokuapp.com/api/comment/",
          {
            issue: this.$route.params.id,
            content: this.comentari,
            adjunt: null
          },
          {
            headers: {
              "content-type": "application/json",
              authorization: "Token 05a9b35f3fc99505ad75a9a6eb236771a301f613"
            }
          }
        )
        .then(response => {
          this.getComments();
          return response.data;
        });
    },
    editComment: async function(commentid) {
      var comment = this.comments.find(x => x.id === commentid);
      comment.content = this.commentcontentaux;
      await axios
        .put(
          "http://asw-issue-tracker-2019.herokuapp.com/api/comment/" +
            commentid +
            "/",
          {
            content: comment.content,
            issue: this.$route.params.id,
            adjunt: null,
            data_creacio: comment.data_creacio,
            owner: 6
          },
          {
            headers: {
              "content-type": "application/json",
              authorization: "Token 05a9b35f3fc99505ad75a9a6eb236771a301f613"
            }
          }
        )
        .then(response => {
          this.getComments();
          this.hideEditComment(commentid);
          return response.data;
        });
    },
    deleteComment: async function() {
      /*API CALL HERE*/
      await axios.delete(
        "http://asw-issue-tracker-2019.herokuapp.com/api/comment/" +
          this.selectedDelete,
        {
          headers: {
            authorization: "Token 05a9b35f3fc99505ad75a9a6eb236771a301f613"
          }
        }
      );
      this.getComments();
      this.$bvModal.hide("modalDelete");
      this.selectedDelete = 0;
    },
    updateStatus: async function() {
      // change status
      await axios.put(
        "http://asw-issue-tracker-2019.herokuapp.com/api/issues/" +
          this.$route.params.id +
          "/",
        {
          titol: this.issue.titol,
          descripcio: this.issue.descripcio,
          data_creacio: this.issue.data_creacio,
          assignee: this.issue.assignee,
          tipus: this.issue.tipus,
          prioritat: this.issue.prioritat,
          status: this.changeStatus.selectedStatus
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: "Token 05a9b35f3fc99505ad75a9a6eb236771a301f613"
          }
        }
      );

      let comentari =
        "Estat canviat a " +
        this.changeStatus.selectedStatus +
        ".\n" +
        this.changeStatus.statusComment;
      // push comment
      await axios.post(
        "http://asw-issue-tracker-2019.herokuapp.com/api/comment/",
        {
          issue: this.$route.params.id,
          content: comentari,
          adjunt: null
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: "Token 05a9b35f3fc99505ad75a9a6eb236771a301f613"
          }
        }
      );
      this.resetStatusComment();
      this.getIssue();
      this.getComments();
    },
    getUsers: async function() {
      await axios
        .get("http://asw-issue-tracker-2019.herokuapp.com/api/user/")
        .then(response => {
          this.users = response.data;
          return response.data;
        });
    },
    deleteIssue: async function() {
      await axios.delete(
        "http://asw-issue-tracker-2019.herokuapp.com/api/issues/" +
          this.$route.params.id,
        {
          headers: {
            authorization: "Token 05a9b35f3fc99505ad75a9a6eb236771a301f613"
          }
        }
      );
      this.$router.push("/issues/");
    },
    editIssue: function() {
      this.$router.push("/issues/" + this.$route.params.id + "/edit/");
    },
    /*  MODAL TOGGLE  */
    confirmDelete: function(cid) {
      this.selectedDelete = cid;
    },
    commentStatus: function(option) {
      this.changeStatus.selectedStatus = option;
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
    hideEditComment: function(commentid) {
      document.getElementById("elem" + commentid).style.display = "none";
      this.commentcontentaux = "";
    },
    getUsername: function(uid) {
      var user = this.users.find(x => x.id === uid);
      return user.username;
    }
  },
  mounted() {
    this.getIssue();
    this.getComments();
    this.getUsers();
  }
};
</script>
