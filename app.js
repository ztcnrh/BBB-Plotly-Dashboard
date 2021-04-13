
selection = d3.select("#selDataset");
selection.on("change", updateBarChart());

// function optionChanged() {

// }


function updateBarChart() {

    d3.json("data/samples.json").then((data) => {

        // Populate the dropdown menu with IDs
        getData(data.samples);
        console.log(data.samples);
    
        // Filter to include only the data for the selected sample ID
        var filteredData = data.samples.filter(subject => subject.id === getId());


    // Trace1 --> Top 10 OTUs sample values: Horizontal Bar chart
    var trace1 = {
        x: filteredData[0].sample_values.slice(0, 10).map(value => value).reverse(),
        y: filteredData[0].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: filteredData[0].otu_labels.slice(0, 10).map(label => label).reverse(),
        type: "bar",
        orientation: "h"
    };

    var data = [trace1];

    var layout = {
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


// Function to return the currently selected test subject ID#
function getId() {
    var dropdownMenu = d3.selectAll("#selDataset");
    var selectedId = dropdownMenu.property("value");
    console.log(selectedId);
    return selectedId;
}

// Function to populate the dropdown menu with all sample IDs
function getData(arr) {
    // Target the <select> tag
    var dropdownMenu = d3.select("#selDataset");
    // Append <option> tags to contain all sample IDs
    arr.forEach((subject) => {
        var option = dropdownMenu.append("option");
        option.text(subject.id);
    })
}
  

