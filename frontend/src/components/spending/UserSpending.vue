<template>
  <div class="row g-2">
    <div class="col-sm-12">
      <div class="row g-2">
        <div class="col-auto">
          <label>Дата начала</label>
          <input type="date" required v-model="begin_date" class="form-control">
        </div>
        <div class="col-auto">
          <label>Дата окончания</label>
          <input type="date" required v-model="end_date" class="form-control">
        </div>
        <div class="col-auto">
          <button v-on:click="generateReport()" class="btn btn-info mt-4">Сформировать отчёт</button>
        </div>
        <div class="col-auto offset-md-4">
          <router-link class="btn btn-primary m-1" to="/addUserSpending">Добавить расход</router-link>
        </div>
        <div class="col-auto">
          <router-link class="btn btn-primary m-1" to="/listUserSpending">Список расходов</router-link>
        </div>
      </div>
    </div>

  </div>
  <div class="row mt-4">
    <div class="col-sm-4">
      <ul class="list-group">
        <li class="list-group-item" v-for="(category, index) in spendingByCategory" :key="index">
          {{category.name}}
          <ul class="list-group">
            <li class="list-group-item" v-for="(spending, index) in category.user_categories[0].spendings" :key="index">
              {{spending.description}}: {{spending.cost}} р.
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="col-sm-4">
      <!--Диаграмма-->
      <Doughnut
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
      />
    </div>
  </div>
</template>

<script>
import http from "../../http-common";
import randomColor from 'randomcolor';
import moment from 'moment'
moment.locale('ru');

// Подключаем диаграмму
import { Doughnut } from 'vue-chartjs'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

// подключаем метки для диаграмм
import DataLabels from 'chartjs-plugin-datalabels'

// Подключаем возможность добавлять надпись по центру кольцевой диаграммы
import DoughnutLabel from 'chartjs-plugin-doughnutlabel-v3'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, DoughnutLabel, DataLabels);

export default {
  name: "UserSpending",
  // параметры указываем в другом формате
  // ранее указывали в виде обычного массива
  // текущий формат необходим из-за использования диаграмм
  props: {
    chartId: {
      type: String,
      default: 'pie-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {
      }
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },

  // регистрируем компонент
  components: {
    Doughnut
  },
  data() {
    return {
      userCategories: [],
      categories: [],
      categoriesNotUser: [],
      selectedCategories: [],
      spendingByCategory: [],
      chartData: { // данные диаграммы (заполняются при получении расходов по катеогориям пользователя)
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      },
      chartOptions: {
        maintainAspectRatio: false, // устанавливаем false, чтобы высота диаграммы соответствовала назначенному значению в props
        plugins: {
          datalabels: {
            color: 'black',
            display: true,
            backgroundColor: '#ccc',
            borderRadius: 3,
            font: {
              size: 14,
              weight: 'bold'
            },
          },
          doughnutLabel: {
            labels: [
              {
                text: '',
                font: {
                  size: 20,
                  weight: 'bold',
                }
              },
              {
                text: '',
              }
            ],
          }
        }
      },
      begin_date: new Date(),
      end_date: new Date()
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    getCategoriesForUser() {
      var begin_date = moment(this.begin_date).format("YYYY-MM-DD");
      var end_date = moment(this.end_date).format("YYYY-MM-DD");
      http
          .get("/spendingByCategory/userId=" + this.currentUser.id + "/beginDate=" + begin_date + "/endDate=" + end_date)
          .then(response => {
            this.categories = response.data;
            if (this.categories.length === 0){
              // обработать предупреждение можно другими способами
              alert("За выбранный период информации о расходах не найдено");
              return; // прерываем выполнение метода
            }
            // получаем наименования категорий
            this.chartData.labels =  this.categories.map(item => item.name);
            // получаем расходы
            // можно на диаграмме выводить не сумму расходов по категории, а проценты (рассчёты в таком случае нужно сделать самостоятельно)
            this.chartData.datasets[0].data =  this.categories.map(item => item.amount);

            // генерируем цвета для диаграммы
            this.chartData.datasets[0].backgroundColor = [];
            this.categories.forEach(() => { // кол-во цветов = кол-во категорий
              this.chartData.datasets[0].backgroundColor.push(randomColor());
            });

            // считаем общую сумму, чтобы отобразить её в середине
            this.chartOptions.plugins.doughnutLabel.labels[0].text = this.chartData.datasets[0].data.reduce((a, b) => a + b, 0);

            // надпись выводим после отрисовки диаграммы, поскольку, если указать надпись сразу в настройках, она будет отображаться до отрисовки диаграммы (можете проверить)
            this.chartOptions.plugins.doughnutLabel.labels[1].text = "Общая сумма";
          })
          .catch(e => {
            console.log(e);
          });
    },
    getSpendingForPeriod() {
      var begin_date = moment(this.begin_date).format("YYYY-MM-DD");
      var end_date = moment(this.end_date).format("YYYY-MM-DD");
      http
          .get("/dataSpendingByCategory/userId=" + this.currentUser.id + "/beginDate=" + begin_date + "/endDate=" + end_date)
          .then(response => {
            this.spendingByCategory = response.data;
          })
          .catch(e => {
            console.log(e);
          });
    },
    generateReport(){
      this.getCategoriesForUser();
      this.getSpendingForPeriod();
    }
  }
}
</script>