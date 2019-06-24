function getDetailedHeroData(id) {
    var url = "http://81.2.241.234:8080/hero/" + id;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener('load', reqDetailedHeroListener);
    request.send();

    function reqDetailedHeroListener() {
        if (request.status == 200) {
            showDetailerHeroData(JSON.parse(request.responseText));
        } else {}
    }
}

function postHero() {
    var url = "http://81.2.241.234:8080/hero";

    var name = document.getElementById("txtNameCreateHero").value;
    var description = document.getElementById("txtDescriptionCreateHero").value;
    var params = 'name=' + name + '&desc=' + description;

    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener('load', reqPostListener);
    request.send(params);
    var successText = document.getElementById("txtSuccessCreation");
    var failureText = document.getElementById("txtFailureCreation");
    failureText.innerHTML = "";
    successText.innerHTML = "";

    function reqPostListener() {
        if (request.status == 200) {
            failureText.innerHTML = "";
            successText.innerHTML = "Hero creation succesful with " + request.responseText + " as response.";
        } else {
            successText.innerHTML = "";
            failureText.innerHTML = "Failed to create hero!";
        }
        document.getElementById("txtNameCreateHero").value = "";
        document.getElementById("txtDescriptionCreateHero").value = "";
        getSpecies();
    }
}

function putHero(id, name, description) {

    var url = "http://81.2.241.234:8080/hero/" + id;
    params = 'name=' + name + '&desc=' + description;
    var request = new XMLHttpRequest();
    request.open('PUT', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener('load', reqPutListener);
    request.send(params);
    var successText = document.getElementById("txtSuccessModification");
    var failureText = document.getElementById("txtFailureModification");
    failureText.innerHTML = "";
    successText.innerHTML = "";

    function reqPutListener() {
        if (request.status == 200) {
            failureText.innerHTML = "";
            successText.innerHTML = "Hero update succesful with " + request.responseText + " as response.";
            getSpecies();
        } else {
            successText.innerHTML = "";
            failureText.innerHTML = "Failed to update hero!";
        }
    }
}

function getSpecies() {
    var url = "http://81.2.241.234:8080/hero?start=0&count=100&orderfield=id&orderdirection=ASC";

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener('load', reqGetListener);
    request.send();

    function reqGetListener() {
        var jsonArray = JSON.parse(request.responseText);
        var dataSet = [];
        for (var i = 0; i < jsonArray.length; i++) {
            var data = [];
            data.push(jsonArray[i].id, jsonArray[i].name, jsonArray[i].description);
            dataSet.push(data);
        }

        table = $('#speciesListTable').DataTable();
        table.destroy();
        $(document).ready(function() {
            $('#speciesListTable').DataTable({
                data: dataSet,
                columns: [
                    { "dataSet": "id" },
                    { "dataSet": "name" },
                    { "dataSet": "description" },
                ],
                "columnDefs": [{
                        "targets": 0,
                        "dataSet": "id",
                        "render": function(data, type, row, meta) {
                            return '<button id="linkButton" class="edit-button btn btn-lg btn-block" onclick="getDetailedHero(this)">' + data + '</a>'
                        }
                    },
                    {
                        "targets": 3,
                        "data": null,
                        "defaultContent": '<button id="modificationOpener" onClick="onModificationClick(this)" class="edit-button btn btn-lg btn-block">Edit</button>'
                    },
                    {
                        "targets": 4,
                        "data": null,
                        "defaultContent": '<button id="deletionOpener" onClick="onRemovalDialog(this)" class="btn btn-lg btn-block">Remove</button>'
                    }
                ]
            });
        });
    }
}

function getHeroData(button) {
    var data = $('#speciesListTable').DataTable().row($(button).parents('tr')).data();
    return data;
};


function onDeletionAccepted(button) {
    var data = $('#speciesListTable').DataTable().row($(button).parents('tr')).data();
    startDeletion(data[0]);
};

function startDeletion(id) {
    var url = "http://81.2.241.234:8080/hero/" + id;

    var request = new XMLHttpRequest();
    request.open('DELETE', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener('load', reqDeleteListener);
    request.send();

    var successText = document.getElementById("txtSuccessDeletion");
    var failureText = document.getElementById("txtFailureDeletion");
    failureText.innerHTML = "";
    successText.innerHTML = "";

    function reqDeleteListener() {
        if (request.status == 200) {
            failureText.innerHTML = "";
            successText.innerHTML = "Hero deleted succesfully.";
        } else {
            successText.innerHTML = "";
            failureText.innerHTML = "Failed to delete hero!";
        }
        getSpecies();
    }
}

function onCreate() {
    $(function() {
        $("#creationDialog").dialog({
            autoOpen: false,
            resizable: false,
            closeText: "",
            modal: true,
            show: {
                effect: "scale",
                duration: 250
            },
            hide: {
                effect: "clip",
                duration: 250
            }
        }).prev(".ui-dialog-titlebar").css("background", getComputedStyle(document.documentElement)
            .getPropertyValue('--alternative-accent-color-dark-sky-blue'));

        $("#creationDialog").dialog({
            minWidth: 500
        });

        $("#btnAddSpecimen").on("click", function() {
            $("#creationDialog").dialog("open");
        });
    });
    getSpecies();
}

function onModificationClick(button) {
    $(function() {
        $("#modificationDialog").dialog({
            autoOpen: false,
            resizable: false,
            closeText: "",
            modal: true,
            show: {
                effect: "scale",
                duration: 250
            },
            hide: {
                effect: "clip",
                duration: 250
            }
        }).prev(".ui-dialog-titlebar").css("background", getComputedStyle(document.documentElement)
            .getPropertyValue('--alternative-accent-color-dark-sky-blue'));

        $("#modificationDialog").dialog({
            minWidth: 500
        });
        $("#modificationDialog").dialog("open");
        var data = getHeroData(button);
        var txtHeroIDModification = document.getElementById("txtIDModifyHero");
        txtHeroIDModification.value = data[0];
        document.getElementById("txtNameModifyHero").value = "";
        document.getElementById("txtDescriptionModifyHero").value = "";
        var btnModifyHero = document.getElementById("btnModifyHero");
        btnModifyHero.onclick = function() {
            var name = document.getElementById("txtNameModifyHero").value;
            var description = document.getElementById("txtDescriptionModifyHero").value;
            putHero(data[0], name, description);
        }
    });
}

function onRemovalDialog(button) {
    $(function() {
        $("#deletionDialog").dialog({
            autoOpen: false,
            resizable: false,
            closeText: "",
            modal: true,
            show: {
                effect: "scale",
                duration: 250
            },
            hide: {
                effect: "clip",
                duration: 250
            }
        }).prev(".ui-dialog-titlebar").css("background", getComputedStyle(document.documentElement)
            .getPropertyValue('--alternative-accent-color-dark-sky-blue'));

        $("#deletionDialog").dialog("open");
    });
    var btnCancel = document.getElementById("btnCancelSpecimenRemoval");
    var btnOk = document.getElementById("btnAcceptSpecimenRemoval");
    btnOk.onclick = function() {
        onDeletionAccepted(button);
    }
    btnCancel.onclick = function() {
        $("#deletionDialog").dialog("close");
    }
}

async function getDetailedHero(button) {
    var data = getHeroData(button);
    getDetailedHeroData(data[0]);
}

function showDetailerHeroData(hero) {
    var txtIDViewHero = document.getElementById("txtIDViewHero");
    var txtNameViewHero = document.getElementById("txtNameViewHero");
    var txtDescriptionViewHero = document.getElementById("txtDescriptionViewHero");
    var txtHrefViewHero = document.getElementById("txtHrefViewHero");
    var txtRelViewHero = document.getElementById("txtRelViewHero");

    txtIDViewHero.value = hero.id;
    txtNameViewHero.value = hero.name;
    txtDescriptionViewHero.value = hero.description;
    txtHrefViewHero.value = hero.links[0].href;
    txtRelViewHero.value = hero.links[0].rel;

    $("#heroDataDialog").dialog({
        autoOpen: false,
        resizable: false,
        closeText: "",
        minWidth: 500,
        modal: true,
        show: {
            effect: "scale",
            duration: 300
        },
        hide: {
            effect: "clip",
            duration: 300
        }
    }).prev(".ui-dialog-titlebar").css("background", getComputedStyle(document.documentElement)
        .getPropertyValue('--alternative-accent-color-dark-sky-blue'));
    $("#heroDataDialog").dialog("open");
}