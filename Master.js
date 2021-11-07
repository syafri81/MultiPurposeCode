var signFormat = [];
var signWebsite = [];

function showLoading() {
    $("#div_loading").show();
}
function hideLoading() {
    $("#div_loading").hide();
}

function pageURL(menuName) {
    document.getElementById('lblPageUrl').innerHTML = menuName;
}

function showDivError(arrError, divError) {
    $("#" + divError).empty();

    for (var i = 0; i < arrError.length; i++) {
        $("#" + divError).append("<h5 class='error_font'><img src='/Icon/no.png' style='height:18px;margin-top:-2px' />  " + arrError[i] + "</h5>");
    }

    document.getElementById(divError).style.marginBottom = "15px";

    $("#" + divError).show();
}
function errorMessage(dmr) {
    $("#btnModalOK").show();
    var divName = "div_alert";
    document.getElementById("MdlDeleteTitle").textContent = "Error";
    
    showDivError(dmr.messages, divName);
    document.getElementById(divName).style.marginTop = "10px";
    document.getElementById(divName).style.marginBottom = "25px";

    $("#btnModalOK").show();
    $("#modal_error").modal();
}
function successMessage(dmr) {
    var divName = "div_alert";
    $("#" + divName).empty();

    $("#btnModalOK").hide();
    document.getElementById("MdlDeleteTitle").textContent = "Result";

    $("#" + divName).append("<h5 class='saved_font'><img src='/Icon/yes.png' style='height:22px;margin-top:-8px' />  " + dmr.messages[0] + "</h5>");
    document.getElementById(divName).style.textAlign = "center";

    $("#" + divName).show();
    $("#modal_error").modal();
}

function errorJS(msg) {
    $("#btnModalOK").show();
    document.getElementById("MdlDeleteTitle").textContent = "Error";

    var errMsg = [];
    errMsg.push(msg);
    showDivError(errMsg, "div_alert");
    document.getElementById("div_alert").style.marginTop = "10px";
    document.getElementById("div_alert").style.marginBottom = "30px";

    $("#btnModalOK").show();
    $("#modal_error").modal();
}

function loadFirstEmail()
{
    $("#div_emailtitle").hide();
    $("#div_read").hide();
    $("#div_newemail").hide();
    $("#div_outbox").hide();
    $("#div_inbox").show();
    $("#div_newsearch").show('slow');
    $("#div_emailempty").show('slow');

    $("#emailpartial").show();
    $("#settingpartial").hide();
    $("#approvalpartial").hide();
    $("#reportpartial").hide();

    document.body.style.paddingTop = "63px";
    document.getElementById("div_inbox").style.height = "631px";
    document.getElementById("div_emaillist").style.height = "631px";
    document.getElementById("div_workingemail").style.height = "631px";
}

function viewEmail()
{
    $("#div_emailtitle").show('slow');
    $("#div_read").show('slow');
    $("#div_btnreply").show();
    $("#div_btnreplyend").show();
    $("#div_newemail").hide();
    $("#div_emailempty").hide();

    $("#div_newsearch").show('slow');
    document.body.style.paddingTop = "63px";
    document.getElementById("div_inbox").style.height = "631px";
    document.getElementById("div_emaillist").style.height = "631px";
    document.getElementById("div_workingemail").style.height = "631px";

    emailFullHeight();
}

function viewOutbox() {
    $("#div_emailtitle").hide();
    $("#div_read").hide();
    $("#div_newemail").hide();
    $("#div_outbox").hide();
    $("#div_emailempty").hide();
    $("#div_outbox").show('slow');
}

function viewLoadApproval() {
    $("#div_newsearch").hide('slow');
    $("#emailpartial").hide();
    $("#approvalpartial").show();
    $("#settingpartial").hide();
    $("#reportpartial").hide();
}

function viewSetting()
{
    $("#div_newsearch").hide('slow');
    $("#emailpartial").hide();
    $("#approvalpartial").hide();
    $("#settingpartial").show();
    $("#reportpartial").hide();
}

function viewReport() {
    $("#div_newsearch").hide('slow');
    $("#emailpartial").hide();
    $("#approvalpartial").hide();
    $("#settingpartial").hide();
    $("#reportpartial").show();
}

function InitTinyMCE(idx) {
    //alert('InitTinyMCE');
    var mceHeight = 200;
    //if (idx == 0)
    //    mceHeight = 320;

    console.log("idx: " + idx + ";mceHeight: " + mceHeight);

    tinyMCE.init({
        selector: 'textarea#BodyText', plugins: 'link image',
        height: 364,
        //height: 424,
        //autoresize_min_height: 220,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor textcolor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table contextmenu paste code help wordcount'
        ],
        //toolbar: 'undo redo | fontsizeselect |  formatselect | bold italic forecolor backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        toolbar: 'undo redo | fontselect | fontsizeselect |  formatselect | bold italic forecolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Calibri=calibri; Century Gothic=century gothic; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings",
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 24pt 36pt",
        block_formats: 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;',
        //init_instance_callback: "makeSignature",
    });
}

//function makeSignature(inst) {
    
//    inst.setContent(html);
//}

function emailFullHeight()
{
    document.getElementById("div_read").style.height = "631px";
    document.getElementById("div_readbody").style.height = "575px";
}

function newEmail(idx)
{
    $("#div_emailtitle").hide();
    $("#div_read").hide();
    $("#div_newsearch").hide();
    $("#div_newemail").show('slow');
    $("#div_emailempty").hide();

    InitTinyMCE(idx);

    $("#li_cc").show('slow');
    $("#li_subject").show('slow');
    $("#txtTo").val('');
    document.body.style.paddingTop = "50px";
    document.getElementById("div_inbox").style.height = "690px";
    document.getElementById("div_emaillist").style.height = "690px";
    document.getElementById("div_workingemail").style.height = "690px";
}

function getSignatureTemplate(file) {
    //return fetch("/EmailTemplate/EmptyTemplate.txt").then((r) => { r.text().then((d) => { let CONTENT = d }) });
    var result = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                //alert(allText);
                result = allText;
            }
        }
    }
    rawFile.send(null);
    return result;
}

function setSignature() {
    //var editor = tinyMCE.get('BodyText');
    ////var content = editor.getContent();
    ////content = content.replace(/{\$baseurl}/g, 'http://mydomain.com');
    //var content = "<p>Hello world!</p>";
    //editor.setContent(content);

    var country = $("#ddlCountry").val();
    console.log("country: " + country);

    ////var html = "<p></p><br>";
    ////html += "Best regards,";
    ////html += "<br><br>";
    ////html += "<img src='https://drive.google.com/uc?id=1EIPWUGuXOdFDP4pNFor3EeAgeZjyt7vP' style='height:auto;max-width:200px;'>";
    ////html += "<br>";
    ////html += "<b style='color:#005FA0; font-size:15px; font-family:Calibri;'>(CSR Name)</b>";
    ////html += "<br>";
    ////html += "<img src='https://drive.google.com/uc?id=14Y6vGVCax6BQBYDB6ghvmLQy3yztsgo6' width='200px'>";
    ////html += "<br>";
    ////html += "Sales G.O";
    ////html += "<br>";
    ////html += "Please visit us at <a href='https://www.clubmed.com.sg' target='_blank'>www.clubmed.com.sg " + country + "</a>";
    ////html += "<br><br>";
    ////html += "<table border='0'>";
    ////html += "<tr>";
    ////html += "<td><a href='http://www.clubmed.com/cm/jsp/clubmed_welcome.jsp' target='_blank'><img src='https://drive.google.com/uc?id=1rc4zAhjRcqp7QlP6m-dXQz_B6CLfFaW-' img width='25px' height='25px'></a></td>";
    ////html += "<td><a href='https://www.youtube.com/clubmed' target='_blank'><img src='https://drive.google.com/uc?id=1eQVQuGavnzUYMNIrEaELPnOM4uixwlJp' img width='25px' height='25px'></a></td>";
    ////html += "<td><a href='https://www.facebook.com/ClubMed' target='_blank'><img src='https://drive.google.com/uc?id=1eX4JMUmfaNLfsa0BphTeTZ_7ZjNoNrI4' img width='25px' height='25px'></a></td>";
    ////html += "<td><a href='https://twitter.com/clubmed' target='_blank'><img src='https://drive.google.com/uc?id=1Bb72XVHpoGDMXpTY-PYG0PpuKcoE5-ui' img width='25px' height='25px'></a></td>";
    ////html += "<td><a href='http://instagram.com/clubmed' target='_blank'><img src='https://drive.google.com/uc?id=1TaCHEgElHeCEDbqi688nLtWymCeJhcwn' img width='25px' height='25px'></a></td>";
    ////html += "<td><a href='http://www.pinterest.com/clubmed/' target='_blank'><img src='https://drive.google.com/uc?id=1GaYPrmNs6nMe9EwZabwoeA0RVX95Ma9v' img width='25px' height='25px'></a></td>";
    ////html += "</tr>";
    ////html += "</table>";

    ////var html = getSignatureTemplate("/EmailTemplate/EmptyTemplate.txt");

    var html = '';

    var templateChoose = $("#ddlEmailTemplate").val();
    if (templateChoose != '')
    {
        html = getSignatureTemplate("/EmailTemplate/" + templateChoose + ".txt");
        console.log("html: " + html);
    }

    //signFormat is made from Home.js
    html += signFormat[0].Regards;
    var salesGo = signFormat[0].SalesGO;

    var obj = $.grep(signWebsite, function (e) {
        return (e.ComboID == country);
    });

    try
    {
        var websiteAt = obj[0].Website;
        websiteAt = websiteAt.replace("https://", "");
        salesGo = salesGo.replace("{1}", obj[0].Website);
        salesGo = salesGo.replace("{2}", websiteAt);
        html += salesGo;
    }
    catch (err)
    {
        html += "";
    }    

    tinymce.get("BodyText").setContent(html);
}

function addFirstAttach() {
     var fileNumber = 1;
    var html = "<div id='divtach_" + fileNumber + "' class='col-md-12'>";
    html += "<input type='file' id='imgInp_" + fileNumber + "' name='files' onchange='enableAdd(" + fileNumber + ")' class='form-control width_100 file' accept='.pdf, .zip, image/*' />";
    ////html += "<a id='btnRemove_" + fileNumber + "' onclick='removeAttach(" + fileNumber + ")' class='close btn-rv-attach' aria-label='Close'><img src='/Icon/Close.ico' title='Remove' style='height:24px' /></a>";
    html += "</div>";

    $("#div_files").append(html);
}

//function doAttach() {
//    alert("do attach");
//    $("#formAttach").submit(function () {
//    });
//}

function attachDownload(filePath)
{
    window.location.href = filePath;
}

function showFilter()
{
    $("#modal_filter").modal();
}

function emptyDate(obj) {
    $("#" + obj).val('');
}