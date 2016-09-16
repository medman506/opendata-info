//Could also be a JSON Array, but work with 3 objects makes whole code clearer
var austria = {
    "name": "Austria",
    "index": 0,
    "api": "https://www.data.gv.at/katalog/api/3/"
};
var germany = {
    "name": "Germany",
    "index": 1,
    "api": "https://www.govdata.de/ckan/api/"
};
var switzerland = {
    "name": "Switzerland",
    "index": 2,
    "api": "https://opendata.swiss/api/"
};

//Wrapper Function for AJAX request
//Params: address: Webadress, target: object of corresponding country
function callGet(address, target) {
    $.getJSON(address)
        .done(function (callResult) {
            //add result portion of returned object to target
            target.result = callResult.result;
            //callback
            updateBarChart(target);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
            return {
                "success": false
            };
        });
}

//Update datapoints of a country (obj) and redraw the chart
function updateBarChart(obj) {
    var chart = $(".barchartContainer").CanvasJSChart();
    chart.options.data[0].dataPoints[obj.index].y = obj.result.length;
    chart.render();
}

$(document).ready(function () {
    //Create Barchart
    $(".barchartContainer").CanvasJSChart({
        title: {
            text: "Datasets per country"
        },
        exportEnabled: true,
        exportFileName: "Open Data Barchart",
        data: [
            {
                type: "column",
                dataPoints: [
                    {
                        label: austria.name,
                        x: austria.index,
                        y: 0
                    },
                    {
                        label: germany.name,
                        x: germany.index,
                        y: 0
                    },
                    {
                        label: switzerland.name,
                        x: switzerland.index,
                        y: 0
                    }
					]
				}
        ]
    });

    //CKAN API Command to list all datasets
    var command = "action/package_list";

    //Trick to avoid "Access-Control-Allow-Origin" problems
    //Will return JSONP
    var param = "callback=?";

    //Load the data for the Barchart for each country
    callGet(austria.api + command + "?" + param, austria);
    callGet(germany.api + command + "?" + param, germany);
    callGet(switzerland.api + command + "?" + param, switzerland);
});