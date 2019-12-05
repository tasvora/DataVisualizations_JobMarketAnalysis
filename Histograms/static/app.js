function buildChart() {
  var traceGlassdoor, traceIndeed;
  var url = "/api/histogram/glassdoor";
  bins=
  d3.json(url).then(function(response) {
    traceGlassdoor = {
    type: 'histogram',
    x: bins,
    y: response.jobs,
    marker: {
        color: '#C8A2C8',
        line: {
            width: 2.5
        }
    }
  };
});

url = "/api/histogram/indeed";
  d3.json(url).then(function(response) {
    console.log(response);
    traceIndeed = {
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
});

var data = [ traceGlassdoor,traceIndeed ];
  var layout = {
      title: "Histogram Chart",
    };
  Plotly.newPlot('hist', data, layout, {responsive: true})
}

buildChart() 


