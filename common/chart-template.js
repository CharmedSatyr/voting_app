'use strict';

//Declaring basic chart specs
let ctx = document.getElementById('myChart');

let myChart = new Chart(ctx, {
   type: 'bar',
   data: {
      labels: [],
      datasets: [{
         label: '# of Votes',
         data: [],
         backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
         ],
         borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
         ],
         borderWidth: 1
      }]
   },
   options: {
      legend: {
         display: false
      },
      scales: {
         yAxes: [{
            ticks: {
               beginAtZero: true,
               maxTicksLimit: 10,
               callback: (tick, index, ticks) => {
                  if (tick.toString()
                     .indexOf('.') !== -1)
                     return null;
                  return tick.toLocaleString();
               }
            }
         }]
      }
   }
});

//Update chart to current values
const updateChart = () => {
   ajaxFunctions.ajaxRequest('GET', candidatesApiUrl, (data) => {
      let labelList = [];
      let dataList = [];

      JSON.parse(data)
         .map((item) => {
            labelList.push(item.name);
            dataList.push(item.votes);
         });
      myChart.data.labels = labelList;
      myChart.data.datasets[0].data = dataList;

      myChart.update();
   });
}
//Run once on load
updateChart();
