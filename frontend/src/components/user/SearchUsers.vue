<template>
    <div>
        <h4>Поиск пользователей по имени</h4>
        <form @submit="searchUsersByName">
            <div class="form-group mb-3">
                <input class="form-control" type="text" name="name" id="name" placeholder="ФИО" required v-model="name">
            </div>
            <div class="form-group mb-3">
                <input class="btn btn-success" type="submit" value="Поиск">
            </div>
        </form>

        <ul class="search-result list-group mt-3">
            <li class="list-group-item" v-for="(user, index) in users" :key="index">
                <router-link :to="{
                        name: 'user-details',
                        params: { id: user.id }
                    }">
                    {{user.name}}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import http from "../../http-common";
    export default {
        name: "SearchUsers.vue",
        data() {
            return {
                name: "",
                users: []
            };
        },
        methods: {
            searchUsersByName(e) {
                e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
                http
                    .get("/user/name/" + this.name)
                    .then(response => {
                        this.users = response.data;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        }
    };
</script>