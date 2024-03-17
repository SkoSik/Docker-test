<template>
  <div v-if="spending">
    <h4>Расход</h4>
    <form @submit="updateUserSpending" class="row g-2">
      <div class="col-auto">
        <input type="number" name="cost" id="cost" min="0" class="form-control" placeholder="Цена" required
               v-model="spending.cost">
      </div>
      <div class="col-auto">
        <input type="text" name="description" id="description" class="form-control" placeholder="Описание" required
               v-model="spending.description">
      </div>
      <div class="col-auto">
        <input type="date" required v-model="spending.spending_date" class="form-control">
      </div>
      <div class="col-auto">
        <select v-model="selected" required class="form-select">
          <option v-for="option in categories" :key="option.id" :value="option.id">
            {{ option.category.name }}
          </option>
        </select>
      </div>
      <div class="col-auto">
        <input type="submit" class="btn btn-success" value="Обновить">
      </div>
      <div class="col-auto">
        <button v-on:click="deleteUserSpending()" class="btn btn-danger">Удалить</button>
      </div>
    </form>
  </div>
  <div v-else>
    <br>
    <p>Выберите расход</p>
  </div>
</template>

<script>
import http from "../../http-common";
import moment from "moment";

export default {
  name: "SpendingElement",
  props: ['id'],
  data() {
    return {
      spending: null,
      categories: null,
      selected: null
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    getCategories() {
      http
          .get("/categoriesForUser/userId=" + this.currentUser.id)
          .then(response => {
            console.log(response.data);
            this.categories = response.data;
          })
          .catch(e => {
            console.log(e);
          });
    },
    getSpending() {
      http
          .get("/spendingByID/" + this.id)
          .then(response => {
            this.spending = response.data[0];
            this.selected = this.spending.user_category_id;
          })
          .catch(e => {
            console.log(e);
          });
    },
    updateUserSpending(e) {
      e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
      var data = {
        cost: this.spending.cost,
        description: this.spending.description,
        spending_date: moment(this.spending.spending_date).format("YYYY-MM-DD"),
        user_category_id: this.selected
      };
      http
          .post("/updateUserSpending/" + this.spending.id, data)
          .then(() => { // запрос выполнился успешно
            this.$router.push('/listUserSpending'); // переходим к списку категорий
          })
          .catch(e => { // при выполнении запроса возникли ошибки
            console.log(e);
          });
    },
    deleteUserSpending() {
      http
          .post("/deleteUserSpending/" + this.spending.id)
          .then(() => {
            this.$router.push('/listUserSpending'); // переходим к списку категорий
          })
          .catch(e => {
            console.log(e);
          });
    }
  },
  mounted() { // загружаем данные категории
    this.getSpending();
    this.getCategories();
  }
}
</script>