<template>
  <div v-if="this.user">
    <h4>Пользователь</h4>
    <div v-if="!submitted">
      <form @submit="updateUser">
        <div class="form-group mb-3">
          <input class="form-control" type="text" name="name" id="name" placeholder="ФИО" required v-model="user.name">
        </div>
        <div v-if="currentUser.admin && currentUser.id !== user.id">
          <div class="form-check mb-3">
            <input class="form-check-input" id="isAdmin" type="checkbox" v-model="user.admin" :value="user.admin">
            <label class="form-check-label" for="isAdmin">Администратор</label>
          </div>
        </div>
        <div class="form-group mb-3">
          <input type="submit" value="Обновить" class="btn btn-success">
        </div>
      </form>
      <div v-if="currentUser.id !== user.id">
        <button class="btn btn-danger" v-on:click="deleteUser()">Удалить</button>
      </div>
    </div>
    <div v-else>
      <h4>Вы успешно обновили запись</h4>
      <router-link to="/listUsers">Вернуться к списку пользователей</router-link>
    </div>
  </div>
  <div v-else>
    <br>
    <p>Выберите пользователя</p>
  </div>
</template>

<script>
import http from "../../http-common";

export default {
  name: "user-details",
  props: ['id'],
  data() {
    return {
      user: null,
      submitted: false
    };
  },
  methods: {
    getUser() {
      http
          .get("/user/" + this.id) // обращаемся к серверу для получения списка пользователей, id взят из входных параметров (props)
          .then(response => { // запрос выполнен успешно
            this.user = response.data;
          })
          .catch(e => { // запрос выполнен с ошибкой
            console.log(e);
          });
    },
    updateUser(e) {
      e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
      var data = {
        name: this.user.name,
        username: this.user.username,
        password: this.user.password,
        admin: this.user.admin
      };

      http.post("/updateUser/" + this.user.id, data)
          .then(() => {
            this.$router.push('/listUsers'); // переходим к списку пользователей
          })
          .catch(e => {
            console.log(e);
          });
      this.submitted = true;
    },
    deleteUser() {
      http
          .post("/deleteUser/" + this.user.id)
          .then(() => {
            // переходим к списку пользователей (переход по ссылкам программно)
            this.$router.push('/listUsers');
          })
          .catch(e => {
            console.log(e);
          });
    }
  },
  mounted() { // загружаем данные пользователя
    this.getUser();
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  }
}
</script>