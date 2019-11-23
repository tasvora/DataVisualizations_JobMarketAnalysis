var svgWidth = 960;
var svgHeight = 500;
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// var svg = d3.select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);







d3.csv("./Glassdoor_data.csv").then(function(GDData) {

    console.log(GDData);
    var names = GDData.map(data => data.name);
    console.log("names", names);
  
    // Cast each hours value in tvData as a number using the unary + operator
    
  }).catch(function(error) {
    console.log(error);
  });
  // chart = {
    var svg = d3.select("map")
        .attr("viewBox", [0, 0, 975, 610]);
  
    svg.append("g")
        .attr("transform", "translate(610,20)")
        .append(() => legend({color, title: data.title, width: 260}));
  
    svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .join("path")
        .attr("fill", d => color(data.get(d.id)))
        .attr("d", path)
      .append("title")
        .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
  ${format(data.get(d.id))}`);
  
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
  
    // return svg.node();
  