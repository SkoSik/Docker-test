<template>
  <div>
    <h4>Список расходов</h4>
    <router-link class="btn btn-primary m-1" to="/addUserSpending">Добавить расходы</router-link>
    <ul class="list-group mt-3">
      <li class="list-group-item spending" v-for="(spending, index) in spendings" :key="index">
        <router-link :to="{
                        name: 'user-spending-element',
                        params: { id: spending.id }
                    }">
          <span> {{ spending.description }}</span>
          <span> {{ spending.cost }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import http from "../../http-common";

export default {
  name: "ListUserSpending",
  data() {
    return {
      spendings: []
    };
  },
  methods: {
    getUserSpendings() {
      http
          .get('/spendingForUser/userId=' + this.$store.state.auth.user.id)
          .then(response => {
            this.spendings = response.data;
          })
          .catch(e => {
            console.log(e);
          });
    }
  },
  mounted() {
    this.getUserSpendings();
  }
}
</script>
<style>

.spending a {
  display: flex;
  justify-content: space-between;
}

</style>