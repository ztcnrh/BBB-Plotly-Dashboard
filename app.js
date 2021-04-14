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

        // Select an initial ID for rendering the default bar chart
        selectedId = getId();

        // Filter to include only the data for the selected sample ID
        var filteredData = data.samples.filter(subject => subject.id === selectedId);

        
        // ----------------------------------------------
        // Panel: Demographic Info
        panel = d3.select("#sample-metadata");

        // Filter to include only the metadata for the selected sample ID
        filteredMetaData = data.metadata.filter(subject => subject.id == selectedId);

        // Append <p> tags with key-value paired metadata
        Object.entries(filteredMetaData[0]).forEach(([key, value]) => {
            var demInfo = panel.append("p");
            demInfo.text(`${key}: ${value}`);
        })
        
        // ----------------------------------------------
        // Plot 1: Trace1 --> Horizontal Bar chart for "Top 10 OTUs Sample Values"
        var trace1 = {
            x: filteredData[0].sample_values.slice(0, 10).map(value => value).reverse(),
            y: filteredData[0].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: filteredData[0].otu_labels.slice(0, 10).map(label => label).reverse(),
            type: "bar",
            orientation: "h"
        };

        var data = [trace1];

        var layout = {
            title: "Top 10 OTUs Sample Values",
            xaxis: { title: "Sample Values"},
            width: 550,
            height: 500,
            margin: {
            l: 150,
            r: 150,
            b: 50,
            t: 50
            }
        }

        // Render the plot in the corresponding html element
        Plotly.newPlot("bar", data, layout, {displayModeBar: false});
    })
}

// Function to grab the first ID for rendering the default bar chart when page is loaded
function getId() {
    var dropdownMenu = d3.select("#selDataset");
    var selectedId = dropdownMenu.property("value");
    return selectedId;
}

// Function to re-render visuals when an option is selected (or changed)
function updateVisuals(selectedId) {

    // Load data
    d3.json("data/samples.json").then((data) => {

        // Filter to include only the data for the selected sample ID
        var filteredData = data.samples.filter(subject => subject.id === selectedId);


        // ----------------------------------------------
        // Update panel
        panel = d3.select("#sample-metadata");
        // Clear the exisiting default children <p> tags from an the <div>
        panel.html("")

        // Filter to include only the metadata for the selected sample ID
        filteredMetaData = data.metadata.filter(subject => subject.id == selectedId);

        // Append <p> tags with key-value paired metadata
        Object.entries(filteredMetaData[0]).forEach(([key, value]) => {
            var demInfo = panel.append("p");
            demInfo.text(`${key}: ${value}`);
        })

        // ----------------------------------------------
        // Update bar chart
        var x = filteredData[0].sample_values.slice(0, 10).map(value => value).reverse();
        var y = filteredData[0].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        var text = filteredData[0].otu_labels.slice(0, 10).map(label => label).reverse();
        
        // Restyle bar chart
        Plotly.restyle("bar", "x", [x]);
        Plotly.restyle("bar", "y", [y]);
        Plotly.restyle("bar", "text", [text]);
    })
}

// Function to run when HTML <select onchange=""> is called upon
function optionChanged(idValue) {
    updateVisuals(idValue);
    // updateMetaData(id);
}


