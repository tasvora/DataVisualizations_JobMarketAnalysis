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

  d3.json(stateUrl).then((state) => {
    console.log(state);

    var panel = d3.select('#state-data');
    panel.html("");

    state.forEach((record) => {
      console.log(`${record}`)
      var row = panel.append("p");
      row.text(`${record.title} : ${record.company}`);
    })

  })
};

function buildCharts(state, route) {
  // @TODO: Build a Pie Chart

  d3.json(`/states/${route}/${state}/count`).then((state) => {
    console.log(state);

    var count_title = state.map(function (row) {
      return row.company;
    });
    var title = state.map(function (row) {
      return row.title;
    });
    var display = state.map(function (row) {
      return row.state;
    });

    var pie_chart = [{
      values: count_title,
      labels: title,
      hovertext: display,
      type: "pie"
    }];
    Plotly.newPlot("pie", pie_chart);

  });

  // var countUrl = `/allstates`;
  // d3.json(countUrl).then((data) =>{
  //   console.log(data);

  //   var x_axis = data.map(function(row){
  //     return row.state;
  //   });
  //   var y_axis = data.map(function(row){
  //     return row.company;
  //   });
  //   var size = data.map(function(row){
  //     return row.company;
  //   });
  //   var color = data.map(function(row){
  //     return row.company;
  //   });
  //   var text = data.map(function(row){
  //     return row.title;
  //   });

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
    buildCharts(firstState, route);
    buildJobs_panel(firstState, route);
  });

}



function init() {
  getStatesList("indeedstates");
}

function optionChanged(newState) {
  // Fetch new data each time a new sample is selected
  buildCharts(newState, newState.class);
  buildJobs_panel(newState,newState.class);
}

// Initialize the dashboard
init();


function buildJobs_panel2(region) {

  var regionUrl = `/regions/${region}`;

  d3.json(regionUrl).then((region) => {
    console.log(region);

    var panel = d3.select('#region-data');
    panel.html("");

    region.forEach((record) => {
      console.log(`${record}`)
      var row = panel.append("p");
      row.text(`${record.title} : ${record.company}`);
    })

  })
}

// Pie Chart - by Region
function buildCharts2(region) {
  var regionUrl = `/regions/${region}`;

  d3.json(regionUrl).then((region) => {
    console.log(region);

    var count_title = region.map(function (row) {
      return row.company;
    });
    var title = region.map(function (row) {
      return row.title;
    });
    var display = region.map(function (row) {
      return row.region;
    });

    var pie_chart2 = [{
      values: count_title,
      labels: title,
      hovertext: display,
      type: "pie"
    }];
    Plotly.newPlot("pie2", pie_chart2);

  });
}

function init2() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset2");

  // Use the list of regions to populate the select options
  d3.json("/regions").then((regions) => {
    regions.forEach((region) => {
      selector
        .append("option")
        .text(region)
        .property("value", region);
    });

    // Use the first region from the list to build the initial plots
    const firstRegion = regions[0];
    buildCharts2(firstRegion);
    buildJobs_panel2(firstRegion);
  });
}

function optionChanged2(newRegion) {
  // Fetch new data each time a new sample is selected
  buildCharts2(newRegion);
  buildJobs_panel2(newRegion);
}

// Initialize the dashboard
init2();



// //////////////////////////////////////
// //////////////////////////////////////
// // another interactive D3 chart

// var svgWidth = 960;
// var svgHeight = 500;

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 60,
//   left: 100
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// var svg = d3.select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   // Import Data
// var regionUrl = `/allregions`;
// d3.json(regionUrl).then(function(regionData) {
//   console.log(regionData);
//   // parse data

//   var state = regionData.map(function(row){
//     return row.state;
//   });
//   var count_state_opening = regionData.map(function(row){
//     return row.count_state_opening;
//   });  
//   var company = regionData.map(function(row){
//     return row.company;
//   });
//   var count_company = regionData.map(function(row){
//     return row.count_company_opening
//   })
//   state = state.filter(function(row){
//     return row != null
//   })
//   console.log(state)

//   count_state_opening = count_state_opening.filter(function(row){
//     return row != null
//   })
//   console.log(count_state_opening)

//   company = company.filter(function(row){
//     return row != null
//   })
//   console.log(company)

//   count_company= count_company.filter(function(row){
//     return row != null
//   })
//   console.log(count_company)

//   count_state_opening = count_state_opening.filter(function(row){
//     return row != null
//   })

//   // regionData.forEach(function(data) {

//   //   data.region = +data.region;
//   //   data.company = +data.company;

//   //   data.state = +data.state;
//   //   data.title = +data.title;
//   // });


//     // Step 2: Create scale functions
//     // ==============================
//     var xLinearScale = d3.scaleLinear()
//         .domain([8, d3.max(regionData, d => d.count_state_opening)])
//         .range([0, width*0.8]);

//     var yLinearScale = d3.scaleLinear()
//         .domain([0, d3.max(regionData, d => d.company)])
//         .range([height, 0]);

//     // Step 3: Create axis functions
//     // ==============================
//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);

//     // Step 4: Append Axes to the chart
//     // ==============================
//     chartGroup.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(bottomAxis);

//     chartGroup.append("g")
//       .call(leftAxis);

//     // Step 5: Create Circles
//     // ==============================
//     var circlesGroup = chartGroup.selectAll("circle")
//     .data(regionData)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d.state))
//     .attr("cy", d => yLinearScale(d.company))
//     .attr("r", "15")
//     .attr("fill", "teal")
//     .attr("opacity", ".5");

//     var text = chartGroup.selectAll()
//    .data(regionData)
//    .enter()
//    .append("text")
//    .attr("x", d => xLinearScale(d.state))
//    .attr("y", d => yLinearScale(d.company))
//    .text(function (d) { return d.state; })
//    .attr("font-family",  "Arial")
//    .attr("fill", "white")
//    .attr("font-size", "10px")
//    .attr("text-anchor", "middle"); 

//     // Create axes labels
//     chartGroup.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left + 40)
//       .attr("x", 0 - (height *1.3 / 2))
//       .attr("dy", "1em")
//       .attr("class", "axisText")
//       .attr("font-weight", "bold")
//       .text("Number of Open Positions");

//     chartGroup.append("text")
//       .attr("transform", `translate(${width*0.7/ 2}, ${height + margin.top + 30})`)
//       .attr("class", "axisText")
//       .attr("font-weight", "bold")
//       .text("State");
//   }).catch(function(error) {
//     console.log(error);
//   });

// function makeResponsive() {
// 	// if the SVG area isn't empty when the browser loads,
//   // remove it and replace it with a resized version of the chart
//     var svgArea = d3.select("body").select("svg");

//     if (!svgArea.empty()) {
//       svgArea.remove();
//     }

// var svgWidth = window.innerWidth*0.8;
// var svgHeight = svgWidth*0.65;

// // circle and text size are changed based on window resizing
// var circleR = svgWidth*0.012; 
// var textsize = parseInt(svgWidth*0.009);

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 100,
//   left: 80
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// var svg = d3
//   .select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// // Append an SVG group
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);
// // Initial Params
// var chosenXAxis = "state";

// var chosenYAxis ="number of openings";

// // function used for updating x-scale var upon click on axis label
// function xScale(regionData, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(regionData, d => d[chosenXAxis]) * 1.8,
//       d3.max(regionData, d => d[chosenXAxis]) * 1.2])
//     .range([0, width]);

//   return xLinearScale;
// }

// // function used for updating y-scale var upon click on axis label
// function yScale(regionData, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(regionData, d => d[chosenYAxis]) * 1.8,
//       d3.max(regionData, d => d[chosenYAxis]) * 1.2])
//     .range([height, 0]);

//   return yLinearScale;
// }
// // function used for updating xAxis var upon click on axis label
// function renderXAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }


// // function used for updating yAxis var upon click on axis label
// function renderYAxes(newYScale, yAxis) {
//   var leftAxis = d3.axisLeft(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(leftAxis);

//   return yAxis;
// }
// // function used for updating circles group and text group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]))
//     .attr("cy", d => newYScale(d[chosenYAxis]));
//   return circlesGroup;
// }


// function renderText(textGroup, newXScale, newYScale,chosenXAxis,chosenYAxis) {

//   textGroup.transition()
//     .duration(1000)
//     .attr("x", d => newXScale(d[chosenXAxis]))
//     .attr("y", d => newYScale(d[chosenYAxis]));

//   return textGroup;
// }

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis,circlesGroup) {

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       if (chosenXAxis === "company"){
//         return (`${d.company},${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`); 

//       } else if (chosenXAxis === "state"){
//         return (`${d.state},${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}%`); 
//       }    
//       else {
//         return (`${d.title},${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}%<br>${chosenYAxis}: ${d[chosenYAxis]}%`); 
//       }
//       });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(d) {
//     toolTip.show(d,this);
//     })
//     .on("mouseout", function(d, index) {
//       toolTip.hide(d);
//     });
//   return circlesGroup;
// }

// ////////////////////////////////////////////////////////////////
// // Retrieve data from the CSV file and execute everything below

// var regionUrl = `/allregions`;
// d3.json(regionUrl).then(function(regionData) {
//       console.log(regionData);
//       // parse data

//       var state = regionData.map(function(row){
//         return row.state;
//       });
//       var count_state_opening= regionData.map(function(row){
//         return row.count_state_opening;
//       });  
//       var company = regionData.map(function(row){
//         return row.company;
//       });
//       var count_company = regionData.map(function(row){
//         return row.count_company_opening
//       })
//       console.log(state)
//       console.log(count_state_opening)
//       console.log(company)
//       console.log(count_company)

//       state = state.filter(function(row){
//         return row != null
//       })
//       console.log(state)

//       count_state_opening = count_state_opening.filter(function(row){
//         return row != null
//       })
//       console.log(count_state_opening)

//       company = company.filter(function(row){
//         return row != null
//       })
//       console.log(company)

//       count_company= count_company.filter(function(row){
//         return row != null
//       })
//       console.log(count_company)

//   // xLinearScale function above csv import
//     var xLinearScale = xScale(regionData, chosenXAxis);

//   // Create y scale function
//     var yLinearScale = yScale(regionData, chosenYAxis);

//   // Create initial axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
//   var xAxis = chartGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);

//   // append y axis
//   var yAxis = chartGroup.append("g")
//     .classed("y-axis", true)
//     .call(leftAxis);

//   // append initial circles and text
//   var circlesGroup = chartGroup.selectAll("circle")
//     .data(regionData)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenXAxis]))
//     .attr("cy", d => yLinearScale(d[chosenYAxis]))
//     .attr("r", circleR)
//     .attr("fill", "teal");

//   var textGroup = chartGroup.selectAll("text")
//     .exit() //because enter() before, clear cache
//     .data(regionData)
//     .enter()
//     .append("text")
//     .text(d => d.state)
//     .attr("x", d => xLinearScale(d[chosenXAxis]))
//     .attr("y", d => yLinearScale(d[chosenYAxis]))
//     .attr("font-size", textsize+"px")
//     .attr("text-anchor", "middle")
//     .attr("class","stateText");

//   circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

//   // Create group for x-axis labels
//   var labelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//     var stateLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("class","axis-text-x")
//     .attr("value", "state") // value to grab for event listener
//     .classed("active", true)
//     .text("State");

//   var companyLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("class","axis-text-x")
//     .attr("value", "company") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Company");


//   // var stateLabel = labelsGroup.append("text")
//   //   .attr("x", 0)
//   //   .attr("y", 60)
//   //   .attr("class","axis-text-x")
//   //   .attr("value", "income") // value to grab for event listener
//   //   .classed("inactive", true)
//   //   .text("Income (Median)");


//  // Create group for y-axis labels

//   var ylabelsGroup = chartGroup.append("g");

//   var companyLabel = ylabelsGroup.append("text")
//     .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
//     .attr("dy", "1em")
//     .attr("class","axis-text-y")
//     .classed("axis-text", true)
//     .attr("value", "title") // value to grab for event listener
//     .classed("active", true)
//     .text("Number of Jobs");

//   // x axis labels event listener
//   labelsGroup.selectAll(".axis-text-x")
//     .on("click", function() {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {

//         // replaces chosenXAxis with value
//         chosenXAxis = value;

//         console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(regionData, chosenXAxis);
//         // updates y scale for new data
//         yLinearScale = yScale(regionData, chosenYAxis);

//         // updates x axis with transition
//         xAxis = renderXAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

//         textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "company") {
//           companyLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           stateLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           // companyLabel
//           //   .classed("active", false)
//           //   .classed("inactive", true);

//         }
//         else if (chosenXAxis === "state")
//          {
//           companyLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           stateLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           // companyLabel
//           //   .classed("active", false)
//           //   .classed("inactive", true);

//         }else {
//           regionLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           stateLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           companyLabel
//             .classed("active", true)
//             .classed("inactive", false);

//         }


//       }
//     });

//   // y axis labels event listener
//   ylabelsGroup.selectAll(".axis-text-y")
//     .on("click", function() {
//       var value = d3.select(this).attr("value");
//       if (value !== chosenYAxis) {

//      // replaces chosenYAxis with value
//       chosenYAxis = value;

//       console.log(chosenYAxis)

//      // functions here found above csv import
//      // updates x scale for new data
//      xLinearScale = xScale(regionData, chosenXAxis);
//      // updates y scale for new data
//      yLinearScale = yScale(regionData, chosenYAxis);
//      // updates Y axis with transition
//      yAxis = renderYAxes(yLinearScale, yAxis);


//      // updates circles with new x values
//      circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

//      textGroup = renderText(textGroup, xLinearScale,yLinearScale,chosenXAxis,chosenYAxis);

//      // updates tooltips with new info
//      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

//      if (chosenYAxis === "company") {
//       companyLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       stateLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       // regionLabel
//       //   .classed("active", false)
//       //   .classed("inactive", true);

//       }
//     //   else if (chosenYAxis === "smokes")
//     //  {
//     //   healthcareLabel
//     //     .classed("active", false)
//     //     .classed("inactive", true);
//     //   smokesLabel
//     //     .classed("active", true)
//     //     .classed("inactive", false);
//     //   obesityLabel
//     //     .classed("active", false)
//     //     .classed("inactive", true);}
//        else {
//       companyLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       stateLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       regionLabel
//         .classed("active", true)
//         .classed("inactive", false);   
//        }
//     }
//   });
// });
// }
// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);


// // //  D3  BUBBLE CHAR ////
// // create_chart() = {
// //   const root = pack(data);

// //   const svg = d3.create("svg")
// //       .attr("viewBox", [0, 0, width, height])
// //       .attr("font-size", 10)
// //       .attr("font-family", "sans-serif")
// //       .attr("text-anchor", "middle");

// //   const leaf = svg.selectAll("g")
// //     .data(root.leaves())
// //     .join("g")
// //       .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

// //   leaf.append("circle")
// //       .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
// //       .attr("r", d => d.r)
// //       .attr("fill-opacity", 0.7)
// //       .attr("fill", d => color(d.data.group));

// //   leaf.append("clipPath")
// //       .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
// //     .append("use")
// //       .attr("xlink:href", d => d.leafUid.href);

// //   leaf.append("text")
// //       .attr("clip-path", d => d.clipUid)
// //     .selectAll("tspan")
// //     .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
// //     .join("tspan")
// //       .attr("x", 0)
// //       .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
// //       .text(d => d);

// //   leaf.append("title")
// //       .text(d => `${d.data.title}\n${format(d.value)}`);

// //   return svg.node();
// // };