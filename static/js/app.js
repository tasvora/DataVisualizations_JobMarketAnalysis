function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metadataUrl = `/metadata/${sample}`;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadataUrl).then((sample) => { 
    console.log(sample);

    var panel= d3.select('#sample-metadata')
    panel.html("");
    Object.entries(sample).forEach(([key,value]) => {
      console.log(`${key},${value}`)
      var row = panel.append("p");
      row.text(`${key} : ${value}`);
  });
  
  var fraction= (sample.WFREQ)/9;
  
  // Trig to calc meter point
  var level = fraction *180;
  var degrees = 180 - level, radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  
  Plotly.newPlot("gauge", data, layout);
});
}



    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {
  var sampleUrl = `/samples/${sample}`
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(sampleUrl).then((sample) => {
    console.log(sample);

    var x_axis = sample.otu_ids;
    var y_axis = sample.sample_values;
    var size = sample.sample_values;
    var color = sample.otu_ids;
    var text = sample.otu_labels;

    var trace1 = {
      x: x_axis,
      y: y_axis,
      text: text,
      mode: 'markers',
      marker: {
        size: size,
        color: color
      }
    };

    var data = [trace1];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"}
    };

    Plotly.newPlot("bubble", data, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(sampleUrl).then((sample) => {
      var values = sample.sample_values.slice(0,10);
      var labels = sample.otu_ids.slice(0,10);
      var display = sample.otu_labels.slice(0,10);

      var pie_chart = [{
        values: values,
        labels: labels,
        hovertext: display,
        type: "pie"
      }];
      Plotly.newPlot("pie", pie_chart);
    });

  });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/states").then((states) => {
    states.forEach((state) => {
      selector
        .append("option")
        .text(state)
        .property("value", state);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

