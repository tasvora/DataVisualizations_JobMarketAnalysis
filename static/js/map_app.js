
// Initialize the dashboard
init();
//Defines the codes for Various states
var stateCodes = {
    OR: "41", AZ: "2", UT: "49", WA: "53", KY: "21", FL: "12", SC: "45", MA: "25",
    CO: "8", NV: "32", GA: "13", CA: "6", TN: "47", LA: "22", TX: "48", NC: "37", MT: "30", ID: "16", NY: "36", OH: "39", OK: "40"
}

// Creating map object
var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(map);

var jobsMarker = [];

//Function to return a size for the circle based on job Count.
function markerSize(cnt) {
    console.log("Marker Size" + cnt * 250);
    return cnt * 200;
}

//Function to return a color for circle based on job Count.
function markerColor(cnt) {
    colorCode = "white";
    if (cnt <= 100) {
        colorCode = "#99000d";
    } else if (cnt > 100 && cnt <= 200) {
        colorCode = "#cb181d";
    } else if (cnt > 200 && cnt <= 300) {
        colorCode = "#ef3b2c";
    } else if (cnt > 300 && cnt <= 400) {
        colorCode = "#fb6a4a";
    } else if (cnt > 400 && cnt <= 500) {
        colorCode = "#fc9272";
    } else if (cnt > 500 && cnt <= 600) {
        colorCode = "#fcbba1";
    } else if (cnt > 600) {
        colorCode = "#fee5d9"
    }
    console.log("Color is " + colorCode);
    return colorCode;
}

var indeedSite = d3.select("#indeed");
var glassdoorSite = d3.select("#glassdoor");

indeedSite.on("click", function() {
    // Select the current count
    getData("indeed_jobs");
  });

  glassdoorSite.on("click", function() {
    // Select the current count
    getData("glassdoor_jobs");
  });

// Get new data whenever the dropdown selection changes
function getData(route) {
    console.log(route);
    d3.json(`/${route}`).then(function (data) {
        console.log("newdata", data);
       
        for(i=0; i < jobsMarker.length; i++)
        {
            map.removeLayer(jobsMarker[i]);
        }
        // }
        buildGeoMap(data);
        // createLegend();


    });
}


    function init() {
        // @TODO: Complete the following function that builds the metadata panel
        var metaDataUrl = "/indeed_jobs";
        console.log(metaDataUrl);
        d3.json(metaDataUrl).then(function (jobMarketData) {
            console.log(jobMarketData);
            buildGeoMap(jobMarketData);
            createLegend();
        });
    }



    function buildGeoMap(jobData) {
        var link = "static/data/map.geojson";
        var link2 = "static/data/map_2.geojson";
        var geoData;
        d3.json(link).then(function (data) {
            console.log(data);
            console.log(data.features);
            geoData = data;
            //Iterating through the jobData obtained as a parameter and picking each location
            //And checking with the geoData we have obtained.
            for (var i = 0; i < jobData.length; i++) {
                // Set the data location property to a variable
                var location = jobData[i].state;
                var countJob = jobData[i].count_1;
                createFeatures(geoData.features, location, countJob);
            }
            // createLegend();
        });
    }


    function createFeatures(geoData, location, countJob) {
        // Define a function we want to run once for each feature in the features array
        // OnEach Feature checking if the location in jobMarket match with the location in feature and if it does
        //plot the same.
        function onEachFeature(feature, layer) {

            if (feature.properties.State == location) {
                layer.bindPopup("<h5>" + location +
                    "</h5><hr><p><strong>Data Analysis Jobs : " + countJob + "</strong></p>");
                console.log("In State " + location + " Job Count is : " + countJob);
            }
        }

        function pointToLayer(feature, latlng) {

            if (feature.properties.State == location) {
                return new L.circle(latlng,
                    {
                        radius: markerSize(countJob),
                        fillColor: markerColor(countJob),
                        fillOpacity: 0.75,
                        stroke: false,
                    })
            }
        }
        
        var jobs = L.geoJSON(geoData, {
            onEachFeature: onEachFeature,
            pointToLayer: pointToLayer
        });
        jobs.addTo(map);
        jobsMarker.push(jobs);
        
    }

    function createLegend() {
        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                jobCount = [0, 100, 200, 300, 400, 500, 600],
                colors = ['#99000d', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee5d9'],
                labels = [];
            //setting html for div we just  created above.
            div.innerHTML = '<div class="labels">'
            jobCount.forEach(function (jobCount, index) {
                if (index < 6) {
                    range = jobCount + 100;
                    div.innerHTML += '<div class="place">' + jobCount + '-' + range + '</div>'
                } else {
                    div.innerHTML += '<div class="place">' + jobCount + '+</div>'
                }
                console.log(colors[index]);
                labels.push('<li style="background-color: ' + colors[index] + '"></li>')
            })

            div.innerHTML += '</div><ul>' + labels.join('') + '</ul>'
            return div;//this is very important 
        };
        legend.addTo(map);
    }





    