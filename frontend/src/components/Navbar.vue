<template>
  <div id="app">
    <nav class="navbar navbar-light px-4" style="background-color: #ABEBC6;">
      <router-link class="nav-item" to="/listUsers">
        <font-awesome-icon icon="fa-solid fa-user"/>
        Пользователи
      </router-link>
      <router-link to="/listCategories">
        <font-awesome-icon icon="fa-solid fa-icons"/>
        Все категории
      </router-link>
      <router-link v-if="currentUser" class="nav-item" :to="{
            name: 'user-categories'
        }">
        <font-awesome-icon icon="fa-solid fa-clipboard-user"/>
        Категории пользователя
      </router-link>
      <router-link v-if="currentUser" class="nav-item" :to="{
            name: 'user-spending'
        }">
        <font-awesome-icon icon="fa-solid fa-chart-line"/>
        Учёт расходов
      </router-link>
      <div v-if="currentUser">
        <router-link to="/profile" class="navbar-brand text-primary">
          <div class="enter-font" size="4">
            {{ currentUser.name }}
          </div>
        </router-link>
        <a href @click.prevent="logOut" class="navbar-brand text-primary">
          Выйти
        </a>
      </div>
      <div v-else>
        <router-link to="/login" class="navbar-brand text-primary">
          Войти
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};

  },
  computed: { // вычисляемые свойства
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout'); // обращаемся к методу logout, который определён в auth.service.js
      window.location.href = '/login'; // // Используем такую конструкцию, а не this.$router.push, так как требуется перезагрузить страницу для обновления локального хранилища
    }
  }
};
</script>