   var ctx = document.getElementById("chart");
   var sampledata = [5,6,3,7];
   var sampledata2 = [3,10,8,6];
   var samplelabels = ['','','',''];
   var myChart = new Chart(ctx, {
    	type: 'line',
        data: {
           labels: samplelabels,
           datasets: [
               {
               label: 'first category',
               data: sampledata
               },
               {
               label: 'second category',
               data: sampledata2
               }
        ]},
        options:{
            scales: {
                xAxes: [{
                    type: 'category',
                    display: true
                }]
            }
        }})


/*    	data: {
        	labels: [{% for item in tags %}
                  	"{{item}}",
                 	{% endfor %}],
        	datasets: [{
            	label: '# of Mentions',
            	data: [{% for item in times %}
     	                 {{item}},
                    	{% endfor %}]
        	}]
    	}

   });
   var src_Labels = [];
   var src_Data = [];
   setInterval(function(){
    	$.getJSON('/refreshData', {
    	}, function(data) {
        	src_Labels = data.sLabel;
        	src_Data = data.sData;
    	});
    	myChart.data.labels = src_Labels;
    	myChart.data.datasets[0].data = src_Data;
    	myChart.update();
   },5000);
*/
   var counter = 1;
   var gdata = {};
   setInterval(function(){
        $.getJSON('/refreshData', {
        }, function(data) {
                sampledata.push(counter+1);
                sampledata2.push(counter);
                samplelabels.push('');
                counter++;
        });
        myChart.data.labels = samplelabels;
        myChart.data.datasets[0].data = sampledata;
        myChart.data.datasets[1].data = sampledata2;
        myChart.update();
   },2000);


