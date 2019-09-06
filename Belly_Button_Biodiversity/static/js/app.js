function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    console.log("Inside the buildMetaData: ",sample)
  // Use `d3.json` to fetch the metadata for a sample
    var sampleDict =d3.json(`/metadata/${sample}`).then(function(sample){
    var sampleData = d3.select(`#sample-metadata`);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    sampleData.html("");
    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function([key,value]){
      var row = sampleData.append("p");
      row.text(`${key}:${value}`)
    })
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var plotData = `/samples/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(plotData).then(function(data){
      var xAxis = data.otu_ids;
      console.log(data.otu_ids)
      var yAxis = data.sample_values;
      var size = data.sample_values;
      var color = data.otu_ids;
      var texts = data.otu_labels;
      var bubble = {
        x: xAxis,
        y: yAxis,
        text: texts,
        mode: `markers`,
        marker: {
          size: size,
          color: color
        }
      };
      var data = [bubble];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);
    })
    // @TODO: Build a Pie Chart
    d3.json(plotData).then(function(data){
      console.log("pie1")
      
      var dataPoints = data.sample_values.slice(0,10);
      var labels = data.otu_ids.slice(0,10);
      var  displayText = data.otu_labels.slice(0,10);
      var pieChart = [{
        values : dataPoints,
        labels : labels,
        hovertext : displayText,
        
        type : "pie"
      }];
      Plotly.newPlot('pie',pieChart);
    })

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
 
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    
    sampleNames.forEach((sample) => {
      sample = "BB_"+sample
      
      selector
        .append("option")
        .text(sample)
        .property("value",sample);
    });

    // Use the first sample from the list to build the initial plots
    var currentSampleData = d3.select("#selDataset").property("value")
    
    
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample)
  //var currentSampleData = d3.select("#selDataset").property("value")
  var sample = newSample.split("_")[1]
  console.log("-----",sample)
  buildCharts(sample);
  buildMetadata(sample);
}

// Initialize the dashboard
init();
