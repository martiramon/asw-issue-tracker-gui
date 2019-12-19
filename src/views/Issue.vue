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
          <!-- <div v-if="comment.adjunt !== null">
                {{ getAdjunt(comment.adjunt) }}
                <div v-if="comment.adjunt === adjunt.id">
                  {{adjunt.data}}
                </div>
          </div> -->
          <b-row>
            <!-- user-only visible content-->
            <button
              v-if="getUserId() == comment.owner"
              v-b-modal.modalDelete
              @click="confirmDelete(comment.id)"
              type="button"
              class="btn btn-link"
            >Esborra</button>
            <button
              v-if="getUserId() == comment.owner"
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
            <b-dropdown v-if="getUserId() == issue.creator" text="Status">
              <b-dropdown-item
                v-for="option in status"
                :key="option"
                :value="option"
                @click="commentStatus(option)"
              >{{ option }}</b-dropdown-item>
            </b-dropdown>
            <b-dropdown text="Més">
              <b-dropdown-item v-b-modal="'my-modal'">Adjunteu fitxer</b-dropdown-item>
              <b-dropdown-item v-if="getUserId() == issue.creator" @click="editIssue">Edita</b-dropdown-item>
              <b-dropdown-item v-if="getUserId() == issue.creator" @click="deleteIssue">Esborra</b-dropdown-item>
            </b-dropdown>
            <b-button href="#/issues" variant="primary">Inici</b-button>
          </b-button-group>
        </b-row>
        <b-row ref="test" class="mx-auto">
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
                <b-button variant="secondary" v-if="isVoted() < 0" v-on:click="vote()">Vote</b-button>
                <b-button variant="secondary" v-else v-on:click="unvote()">Unvote</b-button>                
              <br />
              <b>Watchers:</b>
                {{ issue.watch_set.length }} 
                <b-button variant="secondary" v-if="isWatched() < 0" v-on:click="watch()">Watch</b-button>
                <b-button variant="secondary" v-else v-on:click="unwatch()">Unwatch</b-button>
              <br />
            </b-card-text>
          </b-card>
        </b-row>
        <b-modal id="my-modal" title="Adjunteu un fitxer">
          <div class="large-12 medium-12 small-12 cell">
             <form>
                  <div class="form-group">
                       <input type="file" class="form-control-file" id="attachmentUploadIssue">
                  </div>
              </form>
          </div>
          <template v-slot:modal-footer>
                    <b-button variant="primary" data-dismiss="modal" v-on:click="postAdjunt">Adjunteu fitxer</b-button>
              </template>
          </b-modal>
        
        
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode';
let token = localStorage.getItem('vue-authenticate.vueauth_token');
import 'jquery';
import $ from 'jquery';

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
      componentKey: 0,
      users: [],
      mytoken: localStorage.getItem('vue-authenticate.vueauth_token'),
      commentcontentaux: "",
      selectedDelete: 0,
      changeStatus: {
        selectedStatus: "",
        statusComment: ""
      },
      file: null,
      comentari: "", //camp per guardar el comentari quan toqui
      issue: {},
      adjunts: [],
      // issue per testejar la gui, la que s'ha de fer servir es la que es diu 'issue' que s'obte amb request
      comments: []
    };
  },
  methods: {
    vote: async function() {
      await axios
        .post(
          "http://asw-issue-tracker-2019.herokuapp.com/api/vote/",
          {
            issue: this.$route.params.id,
          },
          {
            headers: {
              "content-type": "application/json",
              authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
            }
          }
        )
        .then(response => {
          this.issue = this.getIssue();
          this.$$refs.test.refresh();
          return response.data;
        });
    },
    unvote: async function() {
      let test_id = this.isVoted();
      await axios
        .delete(
          "http://asw-issue-tracker-2019.herokuapp.com/api/vote/" + test_id + "/",
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
            }
          }
        )
        .then(response => {
          this.issue = this.getIssue();
          this.$$refs.test.refresh();
          return response.data;
        });
    },
    watch: async function() {
      await axios
        .post(
          "http://asw-issue-tracker-2019.herokuapp.com/api/watch/",
          {
            issue: this.$route.params.id,
          },
          {
            headers: {
              "content-type": "application/json",
              authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
            }
          }
        )
        .then(response => {
          this.issue = this.getIssue();
          this.$$refs.test.refresh();
          return response.data;
        });
    },
    unwatch: async function() {
      let test_id = this.isWatched();
      await axios
        .delete(
          "http://asw-issue-tracker-2019.herokuapp.com/api/watch/" + test_id + "/",
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
            }
          }
        )
        .then(response => {
          this.issue = this.getIssue();
          this.$$refs.test.refresh();
          return response.data;
        });
    },
    isVoted(){
      let test = -1;
      this.issue.vote_set.forEach(function(item){ 
        if (token != null && item.voter === VueJwtDecode.decode(token).user_id){
          test = item.id
        }
      });
      return test;
    },
    isWatched(){
      let test = -1;
      this.issue.watch_set.forEach(function(item){ 
        if (token != null && item.watcher === VueJwtDecode.decode(token).user_id){
          test = item.id
        }
      });

      return test;
    },
    getUserId(){
      let id = -1;
      if (this.mytoken != null) {
        id = VueJwtDecode.decode(this.mytoken).user_id
      } 
      return id;
    },
    handleFileUpload(){
        this.file = this.$refs.file.files[0];
      },
    getIssue: async function() {
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
    getAdjunt: async function(id) {
      await axios
        .get(
          "http://asw-issue-tracker-2019.herokuapp.com/api/adjunts/" +
            id
        )
        .then(response => {
          this.adjunts.push({id: response.data.id, data: response.data.data});
          return response.data;
        });
      return this.adjunts;
    },
    getComments: async function() {
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
      this.$bvModal.hide("my-modal");
      token = localStorage.getItem('vue-authenticate.vueauth_token');
      var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'-');
      var creacio = currentDateWithFormat;
      let formData = new FormData();
      var issueAttachment = $('#attachmentUploadIssue').prop('files')[0];
      formData.append('issue', this.$route.params.id);
      formData.append('data_creacio', creacio);
      if (token != null) {
        formData.append('owner', VueJwtDecode.decode(token).user_id);
      }
      //formData.append('file', this.file);
      formData.append('data', issueAttachment);
      await axios
        .post(
          "http://asw-issue-tracker-2019.herokuapp.com/api/adjunts/",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
            }
          }
        )
        .then(response => {
          this.file = response.data;
          return response.data;
        });


        let comentari =
        "S'ha adjuntat un nou fitxer:"
      // push comment
      await axios.post(
        "http://asw-issue-tracker-2019.herokuapp.com/api/comment/",
        {
          issue: this.$route.params.id,
          content: comentari,
          adjunt: this.file.id
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
          }
        }
      );
      this.resetStatusComment();
      this.getIssue();
      this.getComments();
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
              authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
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
              authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
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
            authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
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
            authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
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
            authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
          }
        }
      ).then(response => {
          this.getComments();
          return response.data;
        });
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
            authorization: "Bearer " + localStorage.getItem('vue-authenticate.vueauth_token')
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
