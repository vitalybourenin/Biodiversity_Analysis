function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var data_samples = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samp_resultArray = data_samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var chart_result = samp_resultArray[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    var otu_ids = chart_result.otu_ids
    var otu_labels = chart_result.otu_labels
    var sample_values = chart_result.sample_values


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    

    top_ten_otu_ids = otu_ids.slice(0,10)
    console.log(top_ten_otu_ids);


    var yticks = top_ten_otu_ids.map(function(num){return "OTU " + num});
    console.log(yticks);
    var xticks = sample_values.slice(0,10)
   console.log(xticks);
    

    // 8. Create the trace for the bar chart. 
    
    var trace = {
      x: xticks.reverse(),
      y: yticks.reverse(),
      orientation: "h",
      type: "bar" 
    };
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures" };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
 

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------


    // 1. Create the trace for the bubble chart.
    
   
    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: 'Portland'
      }
    };

    var bubbleData = [bubble_trace]

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Per Sample Bacteria',
      xaxis: {title: "OTU ID"},
      showlegend: false,
      width: 600,
      height: 600
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    //-------------------------------------------------------------------
    //---------------------------------------------------------------------


    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta = data.metadata;
    filtered_meta=meta.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
  

    // 2. Create a variable that holds the first sample in the metadata array.
    
    var meta_result = filtered_meta[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
   var washing_freq = meta_result.wfreq.toFixed(1);
   console.log(washing_freq);

 
   
    
    // 4. Create the trace for the gauge chart.
    var trace_gauge = {
      domain: {x: [0,1], y: [0,1]},
      value: washing_freq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "Washing Frequency"},
      gauge: {
        axis: { range: [0.0, 10.0] },
        bar: {color:"black"},
      steps: [
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "cyan"},
        {range: [6,8], color: "pink"},
        {range: [8,10], color: "olive"},
      ]  
      }
    };
     gaugeData = [trace_gauge];
     
    
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 400, height: 400};

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    
    

  });
}
