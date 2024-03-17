<template>
  <div class="row">
    <div class="col-sm-5">
      <h4>Мои категории</h4>
      <ul class="list-group">
        <li class="list-group-item" v-for="(elem, index) in userCategories" :key="index">
          <router-link :to="{
                            name: 'category-details',
                            params: { id: elem.category.id }
                        }">
            {{elem.category.name}}
          </router-link>
          <button @click="deleteCategory(elem.id)" class="btn text-danger" title="Удалить категорию из своего списка">
            X
          </button>
        </li>
      </ul>
    </div>
    <div class="col-sm-5">
      <button v-show="!displayForm" @click="showConfigurationForm()" class="btn btn-primary mt-2">Добавить категории в список</button>
      <div v-show="displayForm">
        <button @click="addCategories" :disabled="selectedCategories.length === 0" class="btn btn-success">Добавить категории</button>
        <ul class="list-group mt-2">
          <label class="form-checkbox">
            <input type="checkbox" v-model="selectAll" @click="selectAllCategories">
            Выбрать все
          </label>
          <li v-for="(category, index) in categoriesNotUser" v-bind:key="index" class="list-group-item">
            <div class="row">
              <div class="col-xs">
                <input type="checkbox" v-model="selectedCategories" :value="category.id">
                {{category.name}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../http-common";
export default {
  name: "UserCategories",
  data() {
    return {
      userCategories: [],
      categoriesNotUser: [],
      selectedCategories: [],
      selectedCategoryId: "",
      displayForm: false,
      selectAll: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    getCategoriesForUser() {
      if (this.currentUser) {
        http
            .get("/categoriesForUser/userId=" + this.currentUser.id)
            .then(response => {
              this.userCategories = response.data;
            })
            .catch(e => {
              console.log(e);
            });
      }
    },
    getCategoriesNotUser() {
      if (this.currentUser) {
        http
            .get("/categoriesNotUser/userId=" + this.currentUser.id)
            .then(response => {
              this.categoriesNotUser = response.data;
            })
            .catch(e => {
              console.log(e);
            });
      }
    },
    showConfigurationForm(){
      this.displayForm = true;
      this.getCategoriesNotUser();
    },
    selectAllCategories(){
      this.selectedCategories = [];
      if (!this.selectAll) {
        for (var i in this.categoriesNotUser) {
          this.selectedCategories.push(this.categoriesNotUser[i].id);
        }
      }
    },
    addCategories() {
      var data = {
        categories: this.selectedCategories, // передаём массив выбранных категорий
        user_id: this.currentUser.id
      };
      http
          .post("/addCategories", data)
          .then(() => { // запрос выполнился успешно
            this.getCategoriesForUser();
            this.selectedCategories = [];
            this.displayForm = false;
            this.selectAll = false;

          })
          .catch(e => { // при выполнении запроса возникли ошибки
            console.log(e);
          });
    },
    deleteCategory(user_category_id) {
      http
          .post("/deleteCategoryForUser/userCategoryId=" + user_category_id)
          .then(() => {
            this.getCategoriesForUser();
          })
          .catch(e => {
            console.log(e);
          });
    },
  },
  mounted() {
    this.getCategoriesForUser();
  }
}
</script>