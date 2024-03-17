<template>
  <div v-if="category">
    <h4>Категория</h4>
    <form @submit="updateCategory" class="row g-2">
      <div class="col-auto">
        <input type="text" name="name" id="name" class="form-control" placeholder="Наименование категории" required v-model="category.name">
      </div>
      <div class="col-auto">
        <input type="submit" class="btn btn-success" value="Обновить">
      </div>
      <div class="col-auto">
        <button v-on:click="deleteCategory()" class="btn btn-danger">Удалить</button>
      </div>
    </form>

  </div>
  <div v-else>
    <br>
    <p>Выберите категорию</p>
  </div>
</template>

<script>
import http from "../../http-common";
export default {
  name: "category-details",
  props: ['id'],
  data() {
    return {
      category: null
    };
  },
  methods: {
    getCategory() {
      http
          .get("/category/"+ this.id)
          .then(response => {
            this.category = response.data;
          })
          .catch(e => {
            console.log(e);
          });
    },
    updateCategory(e) {
      e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
      var data = {
        name: this.category.name,
      };
      http
          .post("/updateCategory/" + this.category.id, data)
          .then(() => { // запрос выполнился успешно
            this.$router.push('/listCategories'); // переходим к списку категорий
          })
          .catch(e => { // при выполнении запроса возникли ошибки
            console.log(e);
          });
    },
    deleteCategory() {
      http
          .post("/deleteCategory/" + this.category.id)
          .then(() => {
            this.$router.push('/listCategories'); // переходим к списку категорий
          })
          .catch(e => {
            console.log(e);
          });
    }
  },
  mounted() { // загружаем данные категории
    this.getCategory();
  }
}
</script>