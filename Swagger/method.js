function getDetailedSpecimenData(id) {
    var url = "http://81.2.241.234:8080/species/" + id;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener('load', reqDetailedSpecimenListener);
    request.send();

    function reqDetailedSpecimenListener() {
        if (request.status == 200) {
            showDetailerSpecimenData(JSON.parse(request.responseText));
        } else {}
    }
}

function postSpecimen() {
    var url = "http://81.2.241.234:8080/species";

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
            successText.innerHTML = "Specimen creation succesful with " + request.responseText + " as response.";
        } else {
            successText.innerHTML = "";
            failureText.innerHTML = "Failed to create specimen!";
        }
        document.getElementById("txtNameCreateHero").value = "";
        document.getElementById("txtDescriptionCreateHero").value = "";
        getSpecies();
    }
}

function putSpecimen(id, name, description) {

    var url = "http://81.2.241.234:8080/species/" + id;
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
            successText.innerHTML = "Specimen update succesful with " + request.responseText + " as response.";
            getSpecies();
        } else {
            successText.innerHTML = "";
            failureText.innerHTML = "Failed to update specimen!";
        }
    }
}

function getSpecies() {
    var url = "http://81.2.241.234:8080/species?start=0&count=100&orderfield=id&orderdirection=ASC";

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
                            return '<button id="linkButton" class="edit-button btn btn-lg btn-block" onclick="getDetailedSpecimen(this)">' + data + '</a>'
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

function getSpecimenData(button) {
    var data = $('#speciesListTable').DataTable().row($(button).parents('tr')).data();
    return data;
};


function onDeletionAccepted(button, failureText, successText) {
    var data = $('#speciesListTable').DataTable().row($(button).parents('tr')).data();
    startDeletion(data[0], failureText, successText);
};

function startDeletion(id, failureText, successText) {
    var url = "http://81.2.241.234:8080/species/" + id;

    var request = new XMLHttpRequest();
    request.open('DELETE', url, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener('load', reqDeleteListener);
    request.send();

    failureText.innerHTML = "";
    successText.innerHTML = "";

    function reqDeleteListener() {
        if (request.status == 200) {
            failureText.innerHTML = "";
            successText.innerHTML = "Specimen deleted succesfully.";
        } else {
            successText.innerHTML = "";
            failureText.innerHTML = "Failed to delete specimen!";
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
        var data = getSpecimenData(button);
        var txtSpecimenIDModification = document.getElementById("txtIDModifySpecimen");
        txtSpecimenIDModification.value = data[0];
        document.getElementById("txtNameModifySpecimen").value = "";
        document.getElementById("txtDescriptionModifySpecimen").value = "";
        var btnModifySpecimen = document.getElementById("btnModifySpecimen");
        btnModifySpecimen.onclick = function() {
            var name = document.getElementById("txtNameModifySpecimen").value;
            var description = document.getElementById("txtDescriptionModifySpecimen").value;
            putSpecimen(data[0], name, description);
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
    var successText = document.getElementById("txtSuccessDeletion");
    var failureText = document.getElementById("txtFailureCreation");
    var btnCancel = document.getElementById("btnCancelSpecimenRemoval");
    var btnOk = document.getElementById("btnAcceptSpecimenRemoval");

    btnOk.onclick = function() {
        onDeletionAccepted(button, failureText, successText);
    }
    btnCancel.onclick = function() {
        $("#deletionDialog").dialog("close");
    }
}

async function getDetailedSpecimen(button) {
    var data = getSpecimenData(button);
    getDetailedSpecimenData(data[0]);
}

function showDetailerSpecimenData(specimen) {
    var txtIDViewSpecimen = document.getElementById("txtIDViewSpecimen");
    var txtNameViewSpecimen = document.getElementById("txtNameViewSpecimen");
    var txtDescriptionViewSpecimen = document.getElementById("txtDescriptionViewSpecimen");
    var txtLinksViewSpecimen = document.getElementById("txtLinksViewSpecimen");
    var txtUriViewSpecimen = document.getElementById("txtUriViewSpecimen");
    var txtTitleViewSpecimen = document.getElementById("txtTitleViewSpecimen");
    var txtPortViewSpecimen = document.getElementById("txtPortViewSpecimen");
    var txtRelViewSpecimen = document.getElementById("txtRelViewSpecimen");
    var txtTypeViewSpecimen = document.getElementById("txtTypeViewSpecimen");
    var txtHostViewSpecimen = document.getElementById("txtHostViewSpecimen");
    var txtSchemeViewSpecimen = document.getElementById("txtSchemeViewSpecimen");
    var txtUserInfoViewSpecimen = document.getElementById("txtUserInfoViewSpecimen");
    var txtQueryViewSpecimen = document.getElementById("txtQueryViewSpecimen");
    var txtFragmentViewSpecimen = document.getElementById("txtFragmentViewSpecimen");

    txtIDViewSpecimen.value = specimen.id;
    txtNameViewSpecimen.value = specimen.name;
    txtDescriptionViewSpecimen.value = specimen.description;
    txtLinksViewSpecimen.value = specimen.links[0];
    txtUriViewSpecimen.value = specimen.links[0].uri;
    txtTitleViewSpecimen.value = specimen.links[0].title;
    txtPortViewSpecimen.value = specimen.links[0].uriBuilder.port;
    txtHostViewSpecimen.value = specimen.links[0].uriBuilder.host;
    txtSchemeViewSpecimen.value = specimen.links[0].uriBuilder.scheme;
    txtUserInfoViewSpecimen.value = specimen.links[0].uriBuilder.userInfo;
    txtQueryViewSpecimen.value = specimen.links[0].uriBuilder.query;
    txtFragmentViewSpecimen.value = specimen.links[0].uriBuilder.fragment;
    txtRelViewSpecimen.value = specimen.links[0].rel;
    txtTypeViewSpecimen.value = specimen.links[0].type;

    $("#specimenDataDialog").dialog({
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
    $("#specimenDataDialog").dialog("open");
}
