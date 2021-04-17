// Render default visuals
init();


// Function to render all visuals before anything is selected in the dropdown menu
function init() {

    // Load data
    d3.json("data/samples.json").then((data) => {

        // Append test subject IDs into the HTML <select> tag so we have a complete dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Append <option> tags with test subject IDs
        data.samples.forEach((subject) => {
            var option = dropdownMenu.append("option");
            option.text(subject.id).attr("value", `${subject.id}`);
        })

        // Select an initial ID for rendering all visuals
        selectedId = getId();
        
        // ----------------------------------------------
        // Panel: Demographic Info
        panel = d3.select("#sample-metadata");

        // Filter to include only the metadata for the selected subject ID
        filteredMetaData = data.metadata.filter(subject => subject.id == selectedId);

        // Append <p> tags with key-value paired metadata
        Object.entries(filteredMetaData[0]).forEach(([key, value]) => {
            var demInfo = panel.append("p");
            demInfo.text(`${key}: ${value}`);
        })
        
        // ----------------------------------------------
        // Plot 1: Horizontal Bar chart
        
        // Filter to include only the data for the selected subject ID
        var filteredData = data.samples.filter(subject => subject.id === selectedId);

        var traceBar = {
            x: filteredData[0].sample_values.slice(0, 10).map(value => value).reverse(),
            y: filteredData[0].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: filteredData[0].otu_labels.slice(0, 10).map(label => label).reverse(),
            type: "bar",
            orientation: "h"
        };

        var dataBar = [traceBar];

        var layoutBar = {
            title: `Test Subject ${selectedId}'s Top 10 OTUs`,
            xaxis: { title: "Sample Values"},
            width: 500,
            height: 470,
            margin: {
            l: 120,
            r: 150,
            b: 80,
            t: 50
            }
        };

        // Render the plot in the corresponding html element
        Plotly.newPlot("bar", dataBar, layoutBar, {displayModeBar: false});

        // ----------------------------------------------
        // Plot 2: Bubble chart for each test subject's sample data
        var traceBubble = {
            x: filteredData[0].otu_ids,
            y: filteredData[0].sample_values,
            text: filteredData[0].otu_labels,
            mode: 'markers',
            marker: {
              color: filteredData[0].otu_ids,
              size: filteredData[0].sample_values
            }
          };
        
        var dataBubble = [traceBubble];

        var layoutBubble = {
            title: `Test Subject ${selectedId}'s Sample Values by OTU ID`,
            xaxis: { title: "OTU ID"}
        };

        // Render the plot in the corresponding html element
        Plotly.newPlot("bubble", dataBubble, layoutBubble, {displaylogo: false});

        // ----------------------------------------------
        // Plot 3: Gauge chart for each test subject's belly button weekly washing frequency
        var wfreq = filteredMetaData[0].wfreq;
        
        var dataGauge = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: {range: [0, d3.max(data.metadata.map(subject => subject.wfreq))]},
                    bar: { color: "#db5773" },
                    borderwidth: 2,
                    bordercolor: "#f0f0f1",
                    steps: [
                    {range: [0, 1], color: "#f0f6fc"},
                    {range: [1, 2], color: "#c5d9ed"},
                    {range: [2, 3], color: "#9ec2e6"},
                    {range: [3, 4], color: "#72aee6"},
                    {range: [4, 5], color: "#4f94d4"},
                    {range: [5, 6], color: "#3582c4"},
                    {range: [6, 7], color: "#2271b1"},
                    {range: [7, 8], color: "#135e96"},
                    {range: [8, 9], color: "#0a4b78"}
                    ]
                }
            }
        ];

        // Render the plot in the corresponding html element
        Plotly.newPlot("gauge", dataGauge);

        // Adjust gauge chart title position...
        d3.selectAll("text>tspan.line").attr("y", "-20");
        // Customize the color of the gauge chart's number indicator
        d3.selectAll("g>text.number").style("fill", "#db5773");
    })
}


// Function to grab the first ID for rendering the default bar chart when page is loaded
function getId() {
    var dropdownMenu = d3.select("#selDataset");
    var selectedId = dropdownMenu.property("value");
    return selectedId;
}


// Function to re-render visuals when an option (ID) is selected (or changed)
function optionChanged(selectedId) {

    // Load data
    d3.json("data/samples.json").then((data) => {

        // ----------------------------------------------
        // Update panel
        panel = d3.select("#sample-metadata");
        // Clear the exisiting default children <p> tags from the <div>
        panel.html("")

        // Filter to include only the metadata for the selected subject ID
        filteredMetaData = data.metadata.filter(subject => subject.id == selectedId);

        // Append <p> tags with key-value paired metadata
        Object.entries(filteredMetaData[0]).forEach(([key, value]) => {
            var demInfo = panel.append("p");
            demInfo.text(`${key}: ${value}`);
        })

        // ----------------------------------------------
        // Update bar chart

        // Filter to include only the data for the selected subject ID
        var filteredData = data.samples.filter(subject => subject.id === selectedId);

        var xBar = filteredData[0].sample_values.slice(0, 10).map(value => value).reverse();
        var yBar = filteredData[0].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        var textBar = filteredData[0].otu_labels.slice(0, 10).map(label => label).reverse();
        
        var dataUpdateBar = {
            "x": [xBar],
            "y": [yBar],
            "text": [textBar]
        };

        var layoutUpdateBar = {
            title: `Test Subject ${selectedId}'s Top 10 OTUs`
        };

        // Update the bar chart with data plus title to reflect the selected ID
        Plotly.update("bar", dataUpdateBar, layoutUpdateBar);

        // ----------------------------------------------
        // Update bubble chart
        var xBubble = filteredData[0].otu_ids;
        var yBubble = filteredData[0].sample_values;
        var textBubble = filteredData[0].otu_labels;
        var colorBubble = filteredData[0].otu_ids;
        var sizeBubble = filteredData[0].sample_values;
        
        var dataUpdateBubble = {
            "x": [xBubble],
            "y": [yBubble],
            "text": [textBubble],
            "marker.color": [colorBubble],
            "marker.size": [sizeBubble]
        };

        var layoutUpdateBubble = {
            title: `Test Subject ${selectedId}'s Sample Values by OTU ID`
        };

        // Update the bubble chart with data plus title to reflect the selected ID
        Plotly.update("bubble", dataUpdateBubble, layoutUpdateBubble);

        // ----------------------------------------------
        // Update gauge chart
        var wfreq = filteredMetaData[0].wfreq;

        // Restyle gauge chart
        Plotly.restyle("gauge", "value", [wfreq]);

        // Re-adjust gauge chart title position...
        d3.selectAll("text>tspan.line").attr("y", "-20");
        // Customize the color of the gauge chart's number indicator
        d3.selectAll("g>text.number").style("fill", "#db5773");
    })
}

