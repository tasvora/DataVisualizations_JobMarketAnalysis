var indeedBtn = d3.select("#indeed");
var glassdoorBtn = d3.select("#glassdoor");
var byregionBtn = d3.select("#byregion");
var bystateBtn = d3.select("#bystate");
var btnclicked;
var by;



byregionBtn.on("click", function () {
  by='region' ;
  if (btnclicked == 'indeed') {  buildChartIndeed(); }
  else if (btnclicked == 'glassdoor') { buildChartGlassdoor(); }
  else { buildChart()}
});


bystateBtn.on("click", function () {
  by='state' ;
  if (btnclicked == 'indeed') {  buildChartIndeed(); }
  else if (btnclicked == 'glassdoor') {  buildChartGlassdoor(); }
  else { buildChart();}
});


indeedBtn.on("click", function () {
  btnclicked = 'indeed';
  buildChartIndeed()
});

glassdoorBtn.on("click", function () {
  btnclicked = 'glassdoor';
  buildChartGlassdoor()
});
function buildChartIndeed(){
  var indeed_url = "/api/histogram/indeed";
  if (by) {
    indeed_url += '/' + by;
  }
  
  d3.json(indeed_url).then(response => {
    var data = response;
    renderChart(data);
  })
}

function buildChartGlassdoor(){
  var glassdoor_url = "/api/histogram/glassdoor";
  if (by) {
    glassdoor_url += '/' + by;
  }
  d3.json(glassdoor_url).then(response => {
    var data = response;
    renderChart(data);
  })
}

function renderChart(data){
  trace = {
    histfunc: "count",
    type: 'histogram',
    x: data,
  };
  var data = [ trace];
  var layout = {
      hovermode:'closest',
      barmode: "overlay",
      title: "Histogram Chart" + by
    };
  Plotly.newPlot('hist', data, layout, {responsive: true})
}


function buildChart() {

  var glassdoor_url = "/api/histogram/glassdoor";
  var indeed_url = "/api/histogram/indeed";
  if (by) {
    glassdoor_url += '/' + by;
    indeed_url += '/' + by;
  }

  var promiseGlassdoor = d3.json(glassdoor_url)
  var promiseIndeed = d3.json(indeed_url)

  var traceGlassdoor, traceIndeed;
  Promise.all([promiseGlassdoor,promiseIndeed]).then( responses => {
    traceGlassdoor = {
      histfunc: "count",
      type: 'histogram',
      x: responses[0],
      opacity: 0.9,
      name: "Glassdoor"
    };

    
    traceIndeed = {
      histfunc: "count",
      type: 'histogram',
      x: responses[1],
      opacity: 0.4,
      name: "Indeed"
    };

    var data = [ traceGlassdoor, traceIndeed];
    var layout = {
        hovermode:'closest',
        barmode: "overlay",
        title: "Histogram Chart"
      };
    Plotly.newPlot('hist', data, layout, {responsive: true})


  });
}

buildChart() 







