var fileNumber = 1;
var arrFileName = [];
var arrReviewer = [];
var GripDeptID = 3;

var stReviewer = "Reviewer";
var stApprover = "Approver";

var reviewerNumber = $("#ReviewerNumber").val();
var reviewerLength = 0;

$(function () {
    hideLoading();
    arrFileName = [];
    arrReviewer = [];
    
    $("#div_viewsign").hide();
    $("#div_alltask").show();

    $("#DivTargetDate").datetimepicker({
        locale: 'en',
        format: 'DD-MM-YYYY',
        daysOfWeekDisabled: [0, 6],
        useCurrent: false
    });

    $("#btnAddMore").prop("disabled", true);
    
    $("#btnSaveDraft").click(function () {
        $("#TaskStatus").val(30);
    });
    $("#btnSendReview").click(function () {
        $("#TaskStatus").val(7);
        $("#modal_emailmessage").modal();
    });
    $("#btnSendApprove").click(function () {
        $("#TaskStatus").val(8);
        $("#modal_emailmessage").modal();
    });


    ////$("#imgInp").change(function () {
    ////    makeImage(this);
    ////});

    ////function makeImage(input) {

    ////    if (input.files && input.files[0]) {
    ////        fileNumber += 1;
    ////        //alert("Files: " + fileNumber);
    ////        var alertMsg = '';

    ////        if (fileNumber > 5) {
    ////            alertMsg = 'Maximum files to Attach is 5 files.';
    ////            errorMessage(alertMsg);
    ////            fileNumber = fileNumber - 1;
    ////            return;
    ////        }

    ////        var fullPath = document.getElementById('imgInp').value;
    ////        var arrExt = fullPath.split('.');
    ////        var extension = arrExt[arrExt.length - 1];

    ////        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    ////        var filename = fullPath.substring(startIndex);
    ////        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
    ////            filename = filename.substring(1);
    ////        }

    ////        if (arrFileName.length > 0) {
    ////            if (arrFileName.includes(filename)) {
    ////                alert(filename + " already exist. Please add a new one.");
    ////                fileNumber = fileNumber - 1;
    ////                return;
    ////            }
    ////        }

    ////        arrFileName.push(filename);
    ////        console.log("arrFileName: " + arrFileName);

    ////        var src = "";
    ////        //image, jpg, jpeg, png etc
    ////        if (extension != "zip" && extension != "pdf") {
    ////            src = "/Icon/image-icon.jpg";
    ////        }
    ////        else {
    ////            if (extension == "zip")
    ////                src = "/Icon/zip-icon.png";
    ////            if (extension == "pdf")
    ////                src = "/Icon/pdf-icon.jpg";
    ////        }

    ////        var html = "<div class='col-md-2' id='divtach_" + fileNumber + "' style='width:19.98%'>";
    ////        html += "<button type='button' onclick='removeAttach(" + fileNumber + ")' class='close' style='opacity:unset;line-height:0.8'>";
    ////        html += "<span aria-hidden='true'><img src='/Icon/Close.ico' style='height:22px' /></span>";
    ////        html += "</button>";
    ////        html += "<div class='thumbnail'>";
    ////        html += "<img alt='100%x100' data-src='holder.js/100%x100' src='" + src + "' ";
    ////        html += "data-holder-rendered='true' style='height: 120px; width: 100%; display: block;'>";
    ////        html += "<div class='caption'>";
    ////        html += "<p>" + filename + "</p>";
    ////        html += "</div>";
    ////        html += "</div>";
    ////        html += "</div>";

    ////        $("#div_attach").append(html);

    ////    }
    ////}

    //var availableTags = [
    //      "ActionScript",
    //      "AppleScript",
    //      "Asp",
    //      "BASIC",
    //      "C",
    //      "C++",
    //      "Clojure",
    //      "COBOL",
    //      "ColdFusion",
    //      "Erlang",
    //      "Fortran",
    //      "Groovy",
    //      "Haskell",
    //      "Java",
    //      "JavaScript",
    //      "Lisp",
    //      "Perl",
    //      "PHP",
    //      "Python",
    //      "Ruby",
    //      "Scala",
    //      "Scheme"
    //];
    //$("#tags").autocomplete({
    //    source: availableTags
    //});

});

function disableSubmit()
{
    $("#btnSaveDraft").prop("disabled", true);
    $("#btnSendReview").prop("disabled", true);
}

function enableAdd(idx)
{    
    var input = document.getElementById('imgInp_' + idx);
    if (idx > 1)
    {
        var file = input.files[0];
        if (file.name.endsWith('zip'))
        {
            for (var i = 1; i < idx; i++)
            {
                removeAttach(i);
            }
            $("#btnRemove_" + idx).hide();
            $("#btnAddMore").prop("disabled", true);
            fileNumber = 1;
            errorMessage('Too many attachments. Only 1 file for zip type is allowed.');
            return;
        }
    }
    if (input.files && input.files[0]) {
        var file = input.files[0];
        var _size = file.size;
        var fileName = file.name;

        //alert("_size:" + _size / 1024 / 1024 + " mb");

        var start = 0;
        var isExist = 0;
        var allSize = 0;
        arrFileName = [];
        $('.file').each(function (i) {
            $.each(this.files, function (i, file) {
                allSize = file.size / 1024 / 1024;//mb
                arrFileName.push(file.name);
                //console.log("idx:" + idx + " start:" + start + " name:" + fileName + " next:" + nextName);

                start += 1;
            });
        });

        //console.log("arrfilename: " + arrFileName);
        var repeatFiles = find_duplicate_in_array(arrFileName);
        console.log("repeatFiles: " + repeatFiles);
        if (repeatFiles.length > 0)
        {
            $("#btnAddMore").prop("disabled", true);
            disableSubmit();
            errorMessage("Repeated file found. Please attach a correct one.");
            return;
        }

        if (allSize > 8)
        {
            input.value = '';
            allSize = allSize.toFixed(2);
            disableSubmit();
            errorMessage("All Files size is " + allSize + " mb. Size should not more than 8 mb.");
            return;
        }

        var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
        	i = 0; while (_size > 900) { _size /= 1024; i++; }
        var exactSize = (Math.round(_size * 100) / 100);// + ' ' + fSExt[i];
        
        if (fSExt[i] == 'GB')
        {
            input.value = '';
            disableSubmit();
        	errorMessage("File is too big. " + exactSize + ' ' + fSExt[i]);
        	return;
        }
        else
        {
        	if (fSExt[i] == 'MB')
        	{
        	    if (exactSize > 8)
        	    {
        	        input.value = '';
        	        disableSubmit();
        	        errorMessage("File size is " + exactSize + ' ' + fSExt[i] + ". Size should not more than 8 mb.");
        	        return;
        	    }        	    
        	}
        }
        
        $("#btnAddMore").prop("disabled", false);
        $("#btnSaveDraft").prop("disabled", false);
        $("#btnSendReview").prop("disabled", false);
        
        if (fileNumber > 4)
            $("#btnAddMore").prop("disabled", true);
    }

    //var fullPath = document.getElementById('imgInp_' + idx).value;
    //if (fullPath) {
    //    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    //    var filename = fullPath.substring(startIndex);
    //    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
    //        filename = filename.substring(1);
    //    }
    //    alert(filename);
    //}
}

function addMore()
{
    fileNumber += 1;
    var html = "<div id='divtach_" + fileNumber + "' class='col-md-12' style='padding-right:0px'>";
    html += "<input type='file' id='imgInp_" + fileNumber + "' name='files' onchange='enableAdd(" + fileNumber + ")' class='form-control text-width-100 file' accept='.pdf, .zip, image/*' />";
    html += "<a id='btnRemove_" + fileNumber + "' onclick='removeAttach(" + fileNumber + ")' class='close btn-rv-attach' aria-label='Close'><img src='/Icon/Close.ico' title='Remove' style='height:24px' /></a>";
    html += "</div>";

    $("#div_files").append(html);
}

function removeAttach(idx) {
    $("#divtach_" + idx).remove();
    fileNumber = fileNumber - 1;
    $("#btnAddMore").prop("disabled", false);

    $("#btnSaveDraft").prop("disabled", false);
    $("#btnSendReview").prop("disabled", false);
    //alert('after remove: ' + fileNumber);
}

function find_duplicate_in_array(array) {
    const count = {}
    const result = []

    array.forEach(item => {
        if (count[item]) {
            count[item] += 1
            return
        }
        count[item] = 1
    })

    for (let prop in count) {
        if (count[prop] > 1) {
            result.push(prop)
        }
    }

    console.log(count)
    return result;

}

function approvalKeyUp(element, idx) {
    //alert("idx: " + idx);
    var level = $("#ddlLevelApprover").val();

    console.log("reviewerLength: " + reviewerLength);
    console.log("reviewerNumber: " + reviewerNumber);
    if (reviewerLength == reviewerNumber)
    {
        //alert("Reviewer number has reached " + reviewerNumber);
        errorMessage("Reviewer number has reached " + reviewerNumber);
        $("#txt" + element + "_" + idx).val('');
        return;
    }

    var deptID = 0;

    ////remove as used for regional, reviewer can be everyone
    ////if (element == stReviewer)
    ////    deptID = $("#DepartmentID").val();

    ////CR_30092021
    ////if (level == idx && element == stApprover)
    ////    deptID = GripDeptID;

    $("#txt" + element + "_" + idx).autocomplete({
        source: function (request, response) {
            textLoadingShow("load" + element + "_" + idx);
            $.ajax({
                url: '/Home/AutoCompleteApproval',
                data: "{ 'prefix': '" + request.term + "', deptID: " + deptID + " }",
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    setTimeout(function () {
                        textLoadingHide("load" + element + "_" + idx);
                    }, 1000);
                    obj = JSON.parse(data.messages[0]);
                    console.log("auto:" + obj);
                    response($.map(obj, function (item) {
                        //console.log("item:" + item);
                        return {
                            label: item.StaffName,
                            val: item.StaffID
                        }
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });
        },
        select: function (e, i) {
            textLoadingHide("load" + element + "_" + idx);
            //alert(i.item.val);

            //arrFileName.push(i.item.label);
            //var repeatNames = find_duplicate_in_array(arrFileName);
            //console.log("repeatNames: " + repeatNames);
            //if (repeatNames.length > 0) {
            //    arrFileName = arrReviewer;
            //    console.log("arrFileName: " + arrFileName);
            //    errorMessage("Repeated name (" + i.item.label + ") found.<br>Please add a correct one.");
            //    return;
            //}

            $("#ddl" + element + "_" + idx).append("<option value='" + i.item.val + "'>" + i.item.label + "</option>");
            $("#txt" + element + "_" + idx).val('');

            var oldValue = $("#hid" + element + "ID_" + idx).val();
            $("#hid" + element + "ID_" + idx).val(oldValue + "," + i.item.val);

            idx += 1;
            $("#ddl" + element + "_" + idx).prop("disabled", false);
            $("#txt" + element + "_" + idx).prop("disabled", false);

            reviewerLength = document.getElementById("ddlReviewer_1").options.length;

            return false;
        },
    });
}

function removeApprover(element, idx) {
    var action_list = document.getElementById("ddl" + element + "_" + idx);

    var idSelected = $("#ddl" + element + "_" + idx).val();
    console.log("idSelected: " + idSelected);

    var hidValue = $("#hid" + element + "ID_" + idx).val();
    hidValue = hidValue.replace("," + idSelected, "");
    $("#hid" + element + "ID_" + idx).val(hidValue);

    // Remember selected items.
    var is_selected = [];
    for (var i = 0; i < action_list.options.length; ++i) {
        is_selected[i] = action_list.options[i].selected;
    }

    // Remove selected items.
    i = action_list.options.length;
    while (i--) {
        if (is_selected[i]) {
            action_list.remove(i);
        }
    }
}

//use for edit task

function listApprovalEditTask(taskID)
{
    
    $.post("/Home/ListApprovalEditTask/" + taskID, function (dmr) {
        var obj = JSON.parse(dmr.messages[0]);
        var idx = 1;
        for (var i = 0; i < obj.length; i++)
        {
            //console.log("Name: " + obj[i].ApproverName);

            idx += 1;
            editListApprover(obj[i].ApprovalType, obj[i].GroupID, obj[i].ApproverID, obj[i].ApproverName);
        }
    });
}

function editListApprover(element, idx, value, label)
{
    textLoadingHide("load" + element + "_" + idx);
    //alert(i.item.val);
    $("#ddl" + element + "_" + idx).append("<option value='" + value + "'>" + label + "</option>");
    $("#txt" + element + "_" + idx).val('');

    var oldValue = $("#hid" + element + "ID_" + idx).val();
    $("#hid" + element + "ID_" + idx).val(oldValue + "," + value);

    idx += 1;
    $("#ddl" + element + "_" + idx).prop("disabled", false);
    $("#txt" + element + "_" + idx).prop("disabled", false);
}

function removeEditFiles()
{
    $("#div_editfiles").empty();
    $("#imgInp_1").prop("disabled", false);
    $("#btnListFiles").hide();
}


//end use for edit task