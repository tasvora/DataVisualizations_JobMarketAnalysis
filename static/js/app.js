/*
//@Author tasneem: Adding code for button selection.
On click event will be handled and the required states will be retireved
from the database based on the routes.
*/

var indeedSite = d3.select("#indeed");
var glassdoorSite = d3.select("#glassdoor");

indeedSite.on("click", function () {
  // Select the current count
  getStatesList("indeedstates");
  
});

glassdoorSite.on("click", function () {
  // Select the current count

  getStatesList("glassdoorstates");
});


function buildJobs_panel(state,route) {

  var stateUrl = `/states/${route}/${state}/count`;
  console.log(stateUrl);
  d3.json(stateUrl).then((state) => {
    console.log(state);

    var panel = d3.select('#state-data');
    panel.html("");

    state.forEach((record) => {
      console.log(`${record}`)
      
      var row = panel.append("p");
      var title = (route=="glassdoorstates") ? record.position : record.title;
      row.text(`${title} : ${record.company}`);
    })
  //for glassdoorstates route need record.position
  })
};

function buildCharts(state, route) {
  // @TODO: Build a Pie Chart

  d3.json(`/states/${route}/${state}/count`).then((state) => {
    console.log(state);

    var count_title = state.map(function (row) {
      return row.company;
    });
    if(route == "glassdoorstates"){
      var title = state.map(function (row) {
        return row.position;
      });
    }else {
    var title = state.map(function (row) {
      return row.title;
    });
  }
    var display = state.map(function (row) {
      return row.state;
    });
   //@Author tasneem: changing the color scheme.
    colorscheme = ['#99000d', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee5d9'];
    var pie_chart = [{
      values: count_title,
      labels: title,
      hovertext: display,
      type: "pie",
      marker: {
        colors: colorscheme
      },
    }];
    Plotly.newPlot("pie", pie_chart);

  });

  // BUBBLE CHART
  var regionUrl = `/allregions`;
  d3.json(regionUrl).then(function (regionData) {
    console.log(regionData);

    var state = regionData.map(function (row) {
      return row.state;
    });
    var count_state_opening = regionData.map(function (row) {
      return row.count_state_opening;
    });
    var company = regionData.map(function (row) {
      return row.company;
    });
    var count_company = regionData.map(function (row) {
      return row.count_company_opening
    })
    console.log(state)
    console.log(count_state_opening)
    console.log(company)
    console.log(count_company)

    state = state.filter(function (row) {
      return row != null
    })
    console.log(state)

    count_state_opening = count_state_opening.filter(function (row) {
      return row != null
    })
    console.log(count_state_opening)

    company = company.filter(function (row) {
      return row != null
    })
    console.log(company)

    count_company = count_company.filter(function (row) {
      return row != null
    })
    console.log(count_company)

    count_state_opening = count_state_opening.filter(function (row) {
      return row != null
    })

    var trace1 = {
      x: state,
      y: count_state_opening,
      text: state,
      mode: 'markers',
      marker: {
        size: 40,
        color: count_state_opening,
        opacity: [0.8],
      }
    };

    var data = [trace1];
    var layout = {
      title: "Open Positions",
      xaxis: {
        showgrid: false,
        showline: true,
        linecolor: 'rgb(102, 102, 102)',
        hovermode: 'closest',
        titlefont: {
          font: {
            color: 'rgb(204, 204, 204)'
          }
        },
        hovermode: 'closest'
      }
    }
    Plotly.newPlot("bubble", data, layout);
  });

};

/*
//@Author tasneem: function getStatesList gets data based on selection (indeed/glassdoor).
//route = indeedstates or glassdoorstates which is the same as the defined route name.
*/
function getStatesList(route) {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json(`/states/${route}`).then((states) => {
    d3.select("#selDataset").selectAll("option").remove();
    states.forEach((state) => {
      selector
        .append("option")
        .text(state)
        .property("value", state)
        .attr("class", `${route}`);
    });

    // Use the first sample from the list to build the initial plots
    const firstState = states[0];
    //@Author tasneem : passing the route as well to create the charts from the right database table
    buildCharts(firstState, route);
    buildJobs_panel(firstState, route);
  });

}


//@Author tasneem: changing the init method to call 
//function getStatesList and defaults to indeed data.
function init() {
  getStatesList("indeedstates");
}

function optionChanged(newState) {
  // Fetch new data each time a new sample is selected
  
  //@Author Tasneem : passing the value and class name so that we can pass the request to 
  // the correct route.
  buildCharts(newState.value, d3.select(newState).select("option").attr("class"));
  buildJobs_panel(newState.value,d3.select(newState).select("option").attr("class"));
}

// Initialize the dashboard
init();

