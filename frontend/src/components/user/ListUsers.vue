<template>
  <div>
    <div v-if="displayContent">
      <h4>Список пользователей</h4>
      <router-link class="btn btn-primary m-1" to="/addUser">Добавить пользователя</router-link>
      <router-link class="btn btn-primary m-1" to="/searchUsers">Поиск пользователя</router-link>
      <ul class="list-group mt-3">
        <li class="list-group-item" v-for="(user, index) in users" :key="index">
          <router-link :to="{
                        name: 'user-details',
                        params: { id: user.id }
                    }">
            {{ user.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      Контент доступен только авторизованным пользователям
    </div>
  </div>
</template>

<script>
import http from "../../http-common"; // подключение объекта, который позволяет отправлять запросы серверу
import UserService from '../../services/user.service';

export default {
  name: "ListUsers", // Имя шаблона
  data() { // данные компонента (определение переменных)
    return {
      users: [],
      displayContent: false // по умолчанию скрываем контент
    };
  },
  methods: { // методы компонента
    getUsers() {
      http
          .get("/users") // обращаемся к серверу для получения списка пользователей
          .then(response => { // запрос выполнен успешно
            this.users = response.data;
          })
          .catch(e => { // запрос выполнен с ошибкой
            console.log(e);
          });
    }
  },
  mounted() { // загружаем данные пользователей. Обработчик mounted() вызывается после монтирования экземпляра шаблона
    UserService.getUserBoard()
        .then(() => {
          this.displayContent = true;
        })
        .catch(e => {
              this.content =
                  (e.response && e.response.data) ||
                  e.message ||
                  e.toString();
            }
        );
    this.getUsers();
  }
}
</script>