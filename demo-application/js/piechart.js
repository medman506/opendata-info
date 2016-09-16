//contains objects for both pie charts
var piecharts = {
    germany: {
        "name": "Germany",
        "api": "https://www.govdata.de/ckan/api/"
    },
    switzerland: {
        "name": "Switzerland",
        "api": "https://opendata.swiss/api/"
    }
}

//Wrapper for get call
function callPieGet(address, target) {
    $.getJSON(address)
        .done(function (callResult) {
            //set data
            target.result = callResult.result;
            //callback function
            updatePieChart(target);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
            return {
                "success": false
            };
        });
}

//Update Datapoints and redraw the charts
function updatePieChart(obj) {
    var chart;
    switch (obj.name) {
        case "Germany":
            chart = $(".piechartGermanyContainer").CanvasJSChart();
            break;
        case "Switzerland":
            chart = $(".piechartSwissContainer").CanvasJSChart();
            break;
    }

    var i;
    for (i = 0; i < obj.result.length; i++) {
        var categoryCount = obj.result[i].package_count;
        var categoryName = obj.result[i].display_name.de;
        //Because different Portals return different results (Germany has just a display name, Swiss returns an object containing display names in french, german, english)
        if (typeof categoryName === 'undefined') {
            categoryName = obj.result[i].display_name;
        }
        //Add datapoints
        chart.options.data[0].dataPoints.push({
            y: categoryCount,
            name: categoryName,
            legendText: categoryName,
            indexLabel: categoryName
        })
    }

    //Redraw
    chart.render();
}

$(document).ready(function () {
    //Create Charts
    $(".piechartGermanyContainer").CanvasJSChart({
        title: {
            text: "Germany: Datasets per Category"
        },
        exportEnabled: true,
        exportFileName: "Open Data Categories Germany",
        data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{name}: <strong>{y}%</strong>",
                indexLabel: "{name} {y}%",
                dataPoints: []
        }]
    });
    
    $(".piechartSwissContainer").CanvasJSChart({
        title: {
            text: "Switzerland: Datasets per Category"
        },
        exportEnabled: true,
        exportFileName: "Open Data Categories Switzerland",
        legend: {
            verticalAlign: "bottom",
            horizontalAlign: "center"
        },
        data: [{
                type: "pie",
                showInLegend: true,
                toolTipContent: "{y} - <strong>#percent%</strong>",
                indexLabel: "{name} {y}%",
                dataPoints: []
        }]
    });

    //CKAN API Command to list all datasets
    var command = "action/group_list?all_fields=true";

    //Trick to avoid "Access-Control-Allow-Origin" problems
    //Will return JSONP instead of plain JSON
    var param = "callback=?";

    //Get the data for the charts
    callPieGet(germany.api + command + "&" + param, germany);
    callPieGet(switzerland.api + command + "&" + param, switzerland);

});