<template>
  <div class="container">
    <header>
      <h3>
        Профиль <strong>{{currentUser.name}}</strong>
      </h3>
    </header>
    <p>
      <strong>Id:</strong>
      {{currentUser.id}}
    </p>
    <p>
      <strong>Логин:</strong>
      {{currentUser.username}}
    </p>
    <p>
      <strong>ФИО:</strong>
      {{currentUser.name}}
    </p>
  </div>
</template>
<script>
export default {
  name: 'ProfileUser',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>