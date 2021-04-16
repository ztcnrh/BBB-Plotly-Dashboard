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
        // Plot 1: Trace1 --> Horizontal Bar chart
        
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

        var layout = {
            title: "Selected Test Subject's Top 10 OTU Sample Values",
            xaxis: { title: "Sample Values"},
            width: 550,
            height: 500,
            margin: {
            l: 150,
            r: 150,
            b: 50,
            t: 50
            }
        };

        // Render the plot in the corresponding html element
        Plotly.newPlot("bar", dataBar, layout, {displayModeBar: false});

        // ----------------------------------------------
        // Plot 2: Trace2 --> Bubble chart for each test subject's sample data
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

        var layout = {
            title: "Selected Test Subject's Sample Values by OTU ID",
            xaxis: { title: "OTU ID"}
        };

        // Render the plot in the corresponding html element
        Plotly.newPlot("bubble", dataBubble, layout, {displaylogo: false});
    })
}


// Function to grab the first ID for rendering the default bar chart when page is loaded
function getId() {
    var dropdownMenu = d3.select("#selDataset");
    var selectedId = dropdownMenu.property("value");
    return selectedId;
}


// Function to re-render visuals when an option (ID) is selected (or changed)
function updateVisuals(selectedId) {

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
        
        var updateBar = {
            "x": [xBar],
            "y": [yBar],
            "text": [textBar]
        };

        // Restyle bar chart
        Plotly.restyle("bar", updateBar, 0);

        // ----------------------------------------------
        // Update bubble chart
        var xBubble = filteredData[0].otu_ids;
        var yBubble = filteredData[0].sample_values;
        var textBubble = filteredData[0].otu_labels;
        var colorBubble = filteredData[0].otu_ids;
        var sizeBubble = filteredData[0].sample_values;
        
        var updateBubble = {
            "x": [xBubble],
            "y": [yBubble],
            "text": [textBubble],
            "marker.color": [colorBubble],
            "marker.size": [sizeBubble]
        };

        // Restyle bubble chart
        Plotly.restyle("bubble", updateBubble);
    })
}

// Function to run when HTML <select onchange=""> is called upon
function optionChanged(idValue) {
    updateVisuals(idValue);
}


