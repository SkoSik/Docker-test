<template>
  <div>
    <h4>Добавление пользователя</h4>
    <div v-if="!submitted">
      <form @submit="addUser">
        <div class="form-group mb-3">
          <input class="form-control" type="text" name="name" id="name" placeholder="ФИО" required v-model="user.name">
        </div>
        <div v-if="currentUser.admin">
          <div class="form-check mb-3">
            <input class="form-check-input" id="isAdmin" type="checkbox" v-model="user.admin" :value="user.admin">
            <label class="form-check-label" for="isAdmin">Администратор</label>
          </div>
        </div>
        <div class="form-group mb-3">
          <input class="btn btn-success" type="submit" value="Добавить">
        </div>
      </form>
    </div>
    <div v-else>
      <h5>Вы успешно добавили запись</h5>
      <div>
        <button class="btn btn-primary mv" v-on:click="newUser">Добавить нового пользователя</button>
      </div>
      <div>
        <router-link to="/listUsers">Вернуться к списку пользователей</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../http-common";

export default {
  name: "AddUser",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  data() {
    return {
      user: {
        name: "",
        username: "username", // пока указываем значения по умолчанию. После реализации регистрации будем отправлять на сторону сервера "нормальные" логин и пароль
        password: "password",
        admin: false
      },
      submitted: false
    };
  },
  methods: {
    addUser(e) {
      e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
      var data = {
        name: this.user.name,
        username: this.user.username,
        password: this.user.password,
        admin: this.user.admin
      };
      // Либо var data = this.user;
      http
          .post("/addUser", data)
          .then(response => { // запрос выполнился успешно
            this.user.id = response.data.id;
          })
          .catch(e => { // при выполнении запроса возникли ошибки
            console.log(e);
          });

      this.submitted = true;
    },
    newUser() {
      this.submitted = false;
      this.user = {
        name: "",
        username: "username",
        password: "password",
        admin: false
      };
    }
  }
}
</script>

<style>

.mv {
  margin: 10px 0;
}

</style>