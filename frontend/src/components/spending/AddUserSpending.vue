<template>
  <div>
    <h4>Добавление расходов</h4>
    <form @submit="addUserSpending" class="row g-2">
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
        <input type="submit" class="btn btn-success" value="Добавить">
      </div>
    </form>
  </div>
</template>

<script>
import http from "../../http-common";
import moment from 'moment'

moment.locale('ru');

export default {
  name: "AddUserSpending",
  data() {
    return {
      spending: {
        cost: 0,
        description: ""
      },
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
            if (this.categories.length > 0) this.selected = this.categories[0].id;
          })
          .catch(e => {
            console.log(e);
          });
    },
    addUserSpending(e) {
      e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
      var data = {
        spendings: {
          cost: this.spending.cost,
          description: this.spending.description,
          spending_date: moment(this.spending.spending_date).format("YYYY-MM-DD"),
          user_category_id: this.selected
        }
      };
      http
          .post("/addUserSpending", data)
          .then(() => { // запрос выполнился успешно
            this.$router.push('/listUserSpending'); // переходим к списку категорий
          })
          .catch(e => { // при выполнении запроса возникли ошибки
            console.log(e);
          });
    }
  },
  mounted() {
    this.getCategories();
  }
}
</script>