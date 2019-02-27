   var ctx = document.getElementById("chart");
   var initdata = [0];
   var initlabels = [''];
   var myChart = new Chart(ctx, {
    	type: 'line',
        data: {
           labels: initlabels,
           datasets: [
               {
               label: 'first category',
               data: initdata,
               pointRadius: 0
               },
               {
               label: 'second category',
               data: initdata,
               pointRadius: 0
               }
        ]},
        options:{
            scales: {
                xAxes: [{
                    type: 'category',
                    display: true
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                        }
               }]
            }
        }})


   var src_Labels = [];
   var src_Data = [];
   var topics = []
   var topic1 = '';
   var topic2 = '';
   /*sleep function*/
/*   function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }


   function getTopics(){
       /*Check for topics every 2 seconds until found
       while (topics.length == 0){
         await sleep(2000);
         /*check for data received:
         $.getJSON('/refreshData',{
         }, function(stateobj) {
             for (var key in stateobj){
               if (stateobj.hasOwnProperty(key) && key != 'labels'){
                    topics.push(key);
                    }
               }
          console.log(topics);
          }}
       topic1 = topics[0];
       topic2 = topics[1];
       console.log(topic1, topic2);
   };

*/
   var top1data = [];
   var top2data = [];
   var labels= [];
   setInterval(function(){
    	$.getJSON('/refreshData', {
    	}, function(data) {
        	top1data = data.trump;
        	top2data = data.cohen;
                labels = data.labels;
    	});
    	myChart.data.labels = labels;
    	myChart.data.datasets[0].data = top1data;
    	myChart.data.datasets[1].data = top2data;
        myChart.update();
   },5000);
