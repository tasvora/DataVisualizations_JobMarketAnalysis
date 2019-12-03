function buildChart() {

  var url = "/api/histogram/glassdoor";
  d3.json(url).then(function(response) {
    console.log(response);
    var trace1 = {
    type: 'histogram',
    x: response.bins,
    y: response.jobs,
    marker: {
        color: '#C8A2C8',
        line: {
            width: 2.5
        }
    }
  };

  var data = [ trace1 ];
  var layout = {
      title: "Histogram Chart",
    };
  Plotly.newPlot('hist', data, layout, {responsive: true})
});
}

buildChart() 


