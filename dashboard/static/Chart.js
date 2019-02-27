   var ctx = document.getElementById("chart");
   var initdata = [0];
   var initlabels = [''];
   var myChart = new Chart(ctx, {
    	type: 'line',
        data: {
           labels: initlabels,
           datasets: [
               {
               label: 'Barcelona',
               data: initdata,
               pointRadius: 0,
               backgroundColor: "rgba(168, 19, 62, 0.3)",
               borderColor: "rgba(0,77,152,1)"
               },
               {
               label: 'Madrid',
               data: initdata,
               pointRadius: 0,
               backgroundColor: "rgba(0,82,159,0.3)",
               borderColor: "rgba(254,190,16,1)"
               }
        ]},
        options:{
            scales: {
                xAxes: [{
                    type: 'category',
                    display: true
                }]
//,
//                yAxes: [{
  //                  ticks: {
    //                    beginAtZero:true
      //                  }
        //       }]
            }
        }})


   var src_Labels = [];
   var src_Data = [];
   var topics = []
   var topic1 = '';
   var topic2 = '';
   //sleep function
/*   function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   }


   function getTopics(){
       //Check for topics every 2 seconds until found
       while (topics.length == 0){
         await sleep(2000);
         //check for data received:
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
   var DaysEnum = {"monday":1, "tuesday":2, "wednesday":3, ...}
   Object.freeze(DaysEnum)// possibles values for the enumerator can't be changed


   let day = DaysEnum.tuesday


*/

var appState = "STOPPED"; //possible states: RUNNING, STOPPED



   var top1data = [];
   var top2data = [];
   var timestamps= [];

$(document).ready(function(){
   setInterval(function(){
      switch (appState) {
        case "STOPPED":
          //getstate from python server
          //if 'running, receive the topics via post request, do the below, else break
          appState = "RUNNING"
          break;
        case "RUNNING":
    	  $.getJSON('/refreshData', {
    	  }, function(data) {
        	top1data = data["barcelona"];
                pos2 = data["madrid"];
        	top2data = [];
                pos2.forEach(item => top2data.push(-item));
                timestamps = data["labels"];
    	  });
    	  myChart.data.labels = timestamps;
    	  myChart.data.datasets[0].data = top1data;
    	  myChart.data.datasets[1].data = top2data;
          myChart.update();
          break;
   }},10000);

});
