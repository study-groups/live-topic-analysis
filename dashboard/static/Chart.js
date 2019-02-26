   var ctx = document.getElementById("chart");
   var myChart = new Chart(ctx, {
    	type: 'line',
    	data: {
        	labels: [{% for item in tags %}
                  	"{{item}}",
                 	{% endfor %}],
        	datasets: [{
            	label: '# of Mentions',
            	data: [{% for item in times %}
     	                 {{item}},
                    	{% endfor %}],
            	borderWidth: 1
        	}]
    	},
    	options: {
        	scales: {
	            yAxes: [{
                	ticks: {
                    	beginAtZero:true
                	}
            	}]
        	}
    	}
   });
   var src_Labels = [];
   var src_Data = [];
   console.log('chart object created');
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
/*   var counter = 1;
   var gdata = {};
   setInterval(function(){
        $.getJSON('/refreshData', {
        }, function(data) {
                $('#content').html(JSON.stringify(data));
                gdata = data;
                counter++;
        });
   },1000);
*/
