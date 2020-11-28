   var ctx = document.getElementById("chart");
   var initdata = [0];
   var initlabels = [''];
   var myChart = new Chart(ctx, {
    	type: 'line',
        data: {
           labels: initlabels,
           datasets: [
               {
               label: 'Topic1',
               data: initdata,
               pointRadius: 0,
               backgroundColor: "rgba(168, 19, 62, 0.3)",
               borderColor: "rgba(0,77,152,1)"
               },
               {
               label: 'Topic2',
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

var appState = "WAITING"; //possible states: WAITING, RUNNING, STOPPED

   var topic1 = '';
   var topic2 = '';
   var topic1Data = [];
   var topic2Data = [];
   var timeStamps= [];

$(document).ready(function(){
   setInterval(function(){
      switch (appState) {
        case "WAITING":
          $.getJSON('/getState', {
          }, function(data) {
              if (data["status"] == "Running") {
                  topic1 = data["topics"][0];
                  topic2 = data["topics"][1];
                  myChart.data.datasets[0].label = topic1;
                  myChart.data.datasets[1].label = topic2;
                  myChart.update();
                  appState = "RUNNING";
                  }
//              else {
  //                 break;
    //               }
              });
          break;
        case "RUNNING":
    	  $.getJSON('/refreshData', {
    	  }, function(data) {
        	topic1Data = data[topic1];
                //Store the second dataset as all negative
                pos2 = data[topic2];
        	topic2Data = [];
                pos2.forEach(item => topic2Data.push(-item));
                timeStamps = data["labels"];
    	  });
    	  myChart.data.labels = timeStamps;
    	  myChart.data.datasets[0].data = topic1Data;
    	  myChart.data.datasets[1].data = topic2Data;

          myChart.update();
          break;
   }},5000);
});
