//Load CSV DATA
$.get("/data/ogd_ideensammlung.csv")
    .done(function (result) {
        //Convert CSV to JSON Array        
        var options = {
            "separator": ";"
        };
        var ideas = $.csv.toObjects(result, options);
        //Callback, Generate the Panels
        createPanels(ideas);

    })
    .fail(function () {
        alert("error");
    })

//Generate HTML Structure out of JSON Array (ideas)
function createPanels(ideas) {

    //Variables for Iteration
    var i;
    var currentId = 0;
    var currentSubId1 = 0;
    var currentSubId2 = 0;
    var currentTitle = "";
    var currentContent = "";
    var newPanel = "<div class=\"panel panel-info\"><div class=\"panel-heading\">{$TITLE}</div><div class=\"panel-body\">{$CONTENT}</div></div>";


    var container = $(".panelContainer");
    for (i = 0; i < ideas.length; i++) {

        //set currentIDea
        var currentIdea = ideas[i];

        //if ID of current idea is bigger than the last used, and both sub_IDs are 0-> append previous panel, reset and store currentIdea's text as new title
        if (parseInt(currentIdea.ID) > currentId && parseInt(currentIdea.Sub_ID1) == 0 && parseInt(currentIdea.Sub_ID2) == 0) {

            //append old panel only if currentId >0, avoid empty panel at the fron
            if (currentId > 0) {
                //Replace Placeholders with text
                newPanel = newPanel.replace("{$TITLE}", currentId+") "+currentTitle);
                newPanel = newPanel.replace("{$CONTENT}", currentContent);
                //Append panel to structure
                container.append(newPanel);
            }

            //reset variables
            newPanel = "<div class=\"panel panel-info\"><div class=\"panel-heading\">{$TITLE}</div><div class=\"panel-body\">{$CONTENT}</div></div>";
            currentTitle = currentIdea.Text
            currentSubId1 = 0;
            currentSubId2 = 0;
            currentContent = "";
            //increase current id
            currentId++;
            continue;
        }

        //if subid1 > currentSubID1 -> new comment for an idea, append text to content
        if (parseInt(currentIdea.Sub_ID1) > currentSubId1) {
            currentContent = currentContent.concat("> " + currentIdea.Text + "<br/>");
            currentSubId1++;
            continue;
        }
         //if subid2 > currentSubID2 -> new comment for an comment, append text to content
        if (parseInt(currentIdea.Sub_ID2) > currentSubId2) {
            currentContent = currentContent.concat(">>>" + currentIdea.Text + "<br/>");
            currentSubId2++;
            continue;
        }
    }
}