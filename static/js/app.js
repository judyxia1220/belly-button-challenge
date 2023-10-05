// Read JSON data from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON data and create charts
function init() {
    // Fetch JSON data only once
    d3.json(url).then(function(data) {
        // Create variable to hold list of names
        let name = data.names;

        // Select dataset for button
        let dropdownMenu = d3.select('#selDataset');

        // Loop through names list and create options for the dropdown
        name.forEach(nameID => {
            dropdownMenu.append('option').text(nameID).property('value', nameID);
        });

        // Add event listener to the dropdown to handle changes
        dropdownMenu.on('change', function() {
            optionChanged(this.value);
        });

        // Initial view for the charts
        let initialID = data.names[0];
        optionChanged(initialID);
    });
}

// Function to create charts
function createCharts(initialID) {
    d3.json(url).then(function(data) {
        // Get the samples data for the selected ID
        let samples = data.samples.find(item => item.id === initialID);

        // Sort to find top 10 values in descending order
        let x_axis = samples.sample_values.slice(0, 10).reverse();
        let y_axis = samples.otu_ids.slice(0, 10).reverse();
        let valueLabels = samples.otu_labels.slice(0, 10).reverse();

        let title = 'Top 10 OTUs';

        // Create Bar Chart
        let barChartData = {
            x: x_axis,
            y: y_axis.map(otuID => `OTU ${otuID}`),
            text: valueLabels,
            type: 'bar',
            orientation: 'h'
        };

        // Create data array
        let barData = [barChartData];

        // Create layout
        let barLayout = {
            title: title
        };

        // Plot bar chart
        Plotly.newPlot('bar', barData, barLayout);

        ///////////////////////////////////////////////////////////////
        // Bubble Chart
        ///////////////////////////////////////////////////////////////
        
        // Create Bubble Chart Data
        let bubbleChartData = {
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
            mode: 'markers',
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids,
                colorscale: 'Viridis'
            }
        };

        // Create data array
        let bubbleData = [bubbleChartData];

        // Create layout
        let bubbleLayout = {
            title: 'Bubble Chart for Bacteria Results',
            xaxis: { title: 'OTU ID' }
        };

        // Plot bubble chart
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

// Display metaData 
function metadataDisplay(initialID) {
    d3.json(url).then(function(data) {

        // Get metadata for dropdown selection
        let meta = data.metadata.find(item => item.id === parseInt(initialID));

        // Select the container for metadata
        let metaContainer = d3.select('#sample-metadata');

        // Clear previous metadata
        metaContainer.html('');

        // Create a new <ul> element
        let metaList = metaContainer.append("ul");

        // Iterate through the metadata object
        for (const [key, value] of Object.entries(meta)) {

            // Create a new <li> element and append the item
            let item = metaList.append("li");
            item.html(`<strong>${key}:</strong> ${value}`);
        }
    });
}

// Handle dropdown change
function optionChanged(option) {
    // Call all functions to run on the new selection
    createCharts(option);
    metadataDisplay(option);
    // Include calls to barChart and gauge functions if needed
    gauge(option);
}

//////////////////////////////////////////////////////////////
// BONUS 
//////////////////////////////////////////////////////////////
function gauge(initialID) {
    d3.json(url).then(function(data) {
        // Get the metadata for the selected ID
        let metadata = data.metadata.find(item => item.id === parseInt(initialID));

        // Extract the washing frequency (wfreq)
        let wfreq = metadata.wfreq;

        // Create a gauge chart with a needle (ticker)
        let trace = {
            type: 'indicator',
            mode: 'gauge+number',
            value: wfreq,
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>",
            },
            gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "red" },
                steps: [
                    { range: [0, 1], color: 'edf2fb' },
                    { range: [1, 2], color: 'e2eafc' },
                    { range: [2, 3], color: 'd7e3fc' },
                    { range: [3, 4], color: 'ccdbfd' },
                    { range: [4, 5], color: 'c1d3fe' },
                    { range: [5, 6], color: 'b6ccfe' },
                    { range: [6, 7], color: 'b8b8ff' },
                    { range: [7, 8], color: '8093f1' },
                    { range: [8, 9], color: '004C99' } 
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: wfreq
                }
            }
        };

        // Create data array
        let gaugeData = [trace];

        // Plot gauge chart
        Plotly.newPlot('gauge', gaugeData);
    });
}

//////////////////////////////////////////////////////////////
// BONUS 
//////////////////////////////////////////////////////////////

// Call the init function to initialize the page
init();
