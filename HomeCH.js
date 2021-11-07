var arrByCamp = [];
var arrAudit = [];
var arrAgent = [];
var arrElement = [];

var sourceByCamp = [];
var sourceAudit = [];
var dbName = '';
var campName = '';
var startDate = '';
var endDate = '';
var url = '';

var lblDisplay = document.getElementById("lblTime");
var hour = 0;
var mins = 10;
var secAdd = 0;
var fromDate = new Date().setMinutes(mins);

function refreshTimeLabel() {
    //var dateString = new Date().toLocaleTimeString("en-US", { timeZone: "America/Sao_Paulo" });
    //var dateString = new Date().toLocaleTimeString();
    //var dateString = new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });


    //var addS = new Date(fromDate).getSeconds();
    //if (addS == 59)
    //    mins += 1;

    //mins = (hour * 60) + mins;

    if (secAdd == 59)
        secAdd = 0;

    secAdd += 1;
    fromDate = new Date(fromDate).getTime() + (secAdd * 60);
    //var fromDate = new Date().setHours(hour);


    //fromDate = new Date(fromDate).getTime() + (mins * 60000);
    //console.log("fromDate: " + fromDate);
    var dateString = new Date(fromDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    var formattedString = dateString;

    //if (hour == 0)
    //    formattedString = dateString.replace("12:", "");

    formattedString = formattedString.replace(" AM", "").replace(" PM", "");  //dateString.replace(", ", " - ");
    lblDisplay.innerHTML = formattedString;
}
setInterval(refreshTimeLabel, 1000);

var add_hours = function (dt, value) {
    dt = new Date(dt.getTime() - dt.getHours() * 60 * 60 * 1000);
    return new Date(dt.getTime() + (value * 60 * 60 * 1000));
}
var add_minutes = function (dt, minutes) {
    dt = new Date(dt.getTime() - dt.getMinutes() * 60000);
    return new Date(dt.getTime() + minutes * 60000);
}

var add_seconds = function(dt, hours, minutes)
{
    var value = hours * 60 * 60 * 1000 * 60000;
    value += minutes * 60000;
    return new Date(dt.setSeconds(value * 60));
}

//var timeIncrease = NaN;
var timeDisplay = document.getElementById("txtTime");
var minMustAdd = 0;
function refreshTime() {
    //console.log("timespan: " + $("#txtTimeSpan").val());

    var timeSpan = $("#hidTimeSpan").val();
    //console.log("timeSpan: " + timeSpan);
    var arrTime = timeSpan.split(":");
    //console.log("arrTime: " + arrTime);
    var addH = parseInt(arrTime[0]);
    var addM = parseInt(arrTime[1]);
    //var addS = parseInt(arrTime[2]);
    
    var fromDate = new Date().setHours(addH);
    var addS = new Date(fromDate).getSeconds();

    if (minMustAdd > 0)
        addM += minMustAdd;

    if (addS == 59)
    {
        //timeIncrease = 0;
        minMustAdd += 1;
    }

    if (minMustAdd == 59)
    {
        addH += 1;
        minMustAdd = 0;
        addM = 0;
    }

    //console.log("addS: " + addS);
    //if (addS != NaN)
    //{
    //    if (isNaN(timeIncrease)) {
    //        timeIncrease = addS;
    //    }
    //    else
    //    {
    //        timeIncrease += 1;
    //    }
    //}

    //console.log("timeIncrease: " + timeIncrease);
    console.log("addM: " + addM);

    fromDate = new Date(fromDate).setMinutes(addM);
    var dateString = new Date(fromDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    var formattedString = dateString.replace(" AM", "").replace(" PM", "");
    if (addH == 0)
        formattedString = formattedString.replace("12:", "");

    timeDisplay.value = formattedString;
}

setInterval(refreshTime, 1000);

google.charts.load('current', { 'packages': ['corechart', 'bar'] });
hideAgentChart();
loadChart();
////loadAgentChart();

//every 2 mins
var interval = 1000 * 60 * 2;
setInterval(loadChart, interval);

function refreshHome()
{
    alert("refresh");
}

function hideAgentChart()
{
    document.getElementById("div_qsiagent").classList.remove("col-md-7");
    $("#div_qsiagent").hide();
    document.getElementById("div_qsiaudit").classList.remove("col-md-5");
    document.getElementById("div_qsiaudit").classList.add("col-md-12");
}

function loadChart()
{
    showLoading();

    url = "/Home/ChartCampaign";
    if (startDate != '' || endDate != '')
    {
        if (endDate == '')
            endDate = startDate;

        url += "?DBName=" + dbName + "&&SDate=" + startDate + "&&EDate=" + endDate;
    }

    $.post(url, function (dmr) {
        var obj = JSON.parse(dmr.messages[0]);
        arrByCamp = obj;
        sourceByCamp = obj;

        if (dbName == '')
            google.charts.setOnLoadCallback(drawQSIByCamp);

        obj = JSON.parse(dmr.messages[1]);
        arrAudit = obj;
        sourceAudit = obj;
        google.charts.setOnLoadCallback(drawAuditTrack);

        hideLoading();

    });
}

function loadAgentChart() {
    showLoading();

    url = "/Home/ChartAgent?DBName=" + dbName;
    if (startDate != '' || endDate != '') {
        if (endDate == '')
            endDate = startDate;

        url += "&&SDate=" + startDate + "&&EDate=" + endDate;
    }

    $.post(url, function (dmr) {
        var obj = JSON.parse(dmr.messages[0]);
        arrAgent = obj;
        //sourcePie = obj;
        //console.log("arrAgent: " + arrAgent.length);
        google.charts.setOnLoadCallback(drawQSIByAgent);
        //google.charts.setOnLoadCallback(drawQSIByElement(''));

        hideLoading();

    });
}

function loadAgentElement(elName) {
    showLoading();
    url = "/Home/ChartElement?DBName=" + dbName;
    if (startDate != '' || endDate != '') {
        if (endDate == '')
            endDate = startDate;

        url += "&&SDate=" + startDate + "&&EDate=" + endDate;
    }

    $.post(url, function (dmr) {
        var obj = JSON.parse(dmr.messages[0]);
        arrElement = obj;        
        google.charts.setOnLoadCallback(drawQSIByElement(elName));

        hideLoading();

    });
}

//google.charts.setOnLoadCallback(drawQSIByCamp);
//google.charts.setOnLoadCallback(drawAuditTrack);
//google.charts.setOnLoadCallback(drawQSIByAgent);
//google.charts.setOnLoadCallback(drawQSIByElement);

function drawQSIByCamp() {
    //var data = google.visualization.arrayToDataTable([
    //  ['Year', 'QSI', 'Recovery', 'Fatal'],
    //  ['2014', 1000, 400, 200],
    //  ['2015', 1170, 460, 250],
    //  ['2016', 660, 1120, 300],
    //  ['2017', 1030, 540, 350]
    //]);

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Campaign Name');
    data.addColumn('number', 'QSI');
    data.addColumn('number', 'Recovery');
    data.addColumn('number', 'Fatal');

    for (var i = 0; i < arrByCamp.length; i++) {
        var campaign = arrByCamp[i].CampaignName;
        var QSI = arrByCamp[i].QSI;
        var recovery = arrByCamp[i].RecoveryPercent;
        var fatal = arrByCamp[i].FatalPercent;

        var arr = [];
        arr.push(campaign);
        arr.push(QSI);
        arr.push(recovery);
        arr.push(fatal);

        data.addRow(arr);
    }

    //var options = {
    //    chart: {
    //        title: 'Company Performance',
    //        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    //    },
    //    axes: {
    //        x: {
    //            textStyle: {
    //                fontSize: 11, fontName: 'Century Gothic'
    //            }
    //        }
    //    },
    //    colors: ["#55555A", "#f58410", "#d9534f"],
    //    //chartArea: {
    //    //    backgroundColor: {
    //    //        fill: '#F6F6F6',
    //    //        fillOpacity: 0.1
    //    //    },
    //    //},
    //    //backgroundColor: {
    //    //    fill: '#F6F6F6',
    //    //    fillOpacity: 0.8
    //    //},
    //};

    //var chart = new google.charts.Bar(document.getElementById('div_QSIByCamp'));
    //chart.draw(data, google.charts.Bar.convertOptions(options));

    var chTitle = "QSI";

    if (campName.startsWith('--All'))
    {
        campName = '';
        hideAgentChart();
    }        

    if (campName != '')
        chTitle += ": " + campName;

    var options = {
        chartArea: { width: "85%" },
        legend: { position: 'bottom' },
        title: chTitle,
        titleTextStyle: { fontSize: 16, fontName: 'Century Gothic' },
        vAxis: {
            viewWindow: { max: 100, min: 0 }
        },
        seriesType: 'bars',
        colors: ["#55555A", "#f58410", "#d9534f"]//,
        //bar: { groupWidth: "20%" }
    };

    var chart = new google.visualization.ComboChart(document.getElementById('div_QSIByCamp'));
    chart.draw(data, options);
}

function drawAuditTrack() {
    //var data = google.visualization.arrayToDataTable([
    //  ['Year', 'Sales', 'Expenses', 'Profit'],
    //  ['2014', 1000, 400, 200],
    //  ['2015', 1170, 460, 250],
    //  ['2016', 660, 1120, 300],
    //  ['2017', 1030, 540, 350]
    //]);

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Campaign Name');
    data.addColumn('number', 'Balance');
    data.addColumn('number', 'Audit');
    data.addColumn('number', 'Total Record');

    var maxAudit = 50;

    for (var i = 0; i < arrAudit.length; i++) {
        var campaign = arrAudit[i].CampaignName;
        var balance = arrAudit[i].TotalBalance;
        var audit = arrAudit[i].TotalAudit;
        var sales = arrAudit[i].TotalSales;

        var arr = [];
        arr.push(campaign);
        arr.push(balance);
        arr.push(audit);
        arr.push(sales);

        data.addRow(arr);

        if (sales > 50)
        {
            maxAudit = 100;
        }
    }

    //var options = {
    //    chart: {
    //        title: 'Company Performance',
    //        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    //    },
    //    colors: ["#d9534f", "#55555A", "#f58410"],
    //    bars: 'horizontal' // Required for Material Bar Charts.
    //};

    //var chart = new google.charts.Bar(document.getElementById('div_AuditTrack'));
    //chart.draw(data, google.charts.Bar.convertOptions(options));
        
    //console.log("auditTrackDate: " + arrAudit[0].AuditDate);
    var chartTitle = "Audit Track " + arrAudit[0].AuditDate;

    //var options = {
    //    chartArea: { width: "85%" },
    //    legend: { position: 'bottom' },
    //    title: chartTitle,
    //    titleTextStyle: { fontSize: 16, fontName: 'Century Gothic' },
    //    hAxis: {
    //        viewWindow: { max: 100, min: 0 },
    //        format: '#'
    //    },
    //    seriesType: 'bars',
    //    colors: ["#55555A", "#f58410", "#d9534f"],
    //    //bars: 'horizontal'
    //    bar: { groupWidth: "85%" }
    //};

    var options = {
        chartArea: { width: "85%" },
        legend: { position: 'bottom' },
        title: chartTitle,
        titleTextStyle: { fontSize: 16, fontName: 'Century Gothic' },
        vAxis: {
            viewWindow: { max: maxAudit, min: 0 }
        },
        seriesType: 'bars',
        colors: ["#55555A", "#f58410", "#d9534f"]//,
        //bar: { groupWidth: "20%" }
    };

    //var chart = new google.visualization.BarChart(document.getElementById('div_AuditTrack'));
    var chart = new google.visualization.ComboChart(document.getElementById('div_AuditTrack'));
    chart.draw(data, options);
}

function drawQSIByAgent() {
    //var data = google.visualization.arrayToDataTable([
    //  ['Year', 'Sales'],
    //  ['2014', 100],
    //  ['2015', 70],
    //  ['2016', 90],
    //  ['2017', 65]
    //]);

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Agent Name');
    data.addColumn('number', 'QSI');

    for (var i = 0; i < arrAgent.length; i++) {
        var agentName = arrAgent[i].AgentName;
        var QSI = arrAgent[i].QSI;
        //console.log(i + ":" + QSI);

        var arr = [];
        arr.push(agentName);
        arr.push(QSI);

        data.addRow(arr);
    }
    
    //console.log("length: " + data.getNumberOfRows());

    var chTitle = "QSI By ME";
    if (campName != '')
        chTitle += ": " + campName;
    
    var options = {
        //width: 640,
        //chartArea:{left:0,top:0,width:"90%",height:"50%"},
        chartArea: { width: "90%" },
        legend: { position: 'none' },
        title: chTitle,
        titleTextStyle: { fontSize: 16, fontName: 'Century Gothic' },
        //axes: {
        //    x: {
        //        0: { side: 'bottom', label: 'Agent Name', direction:-1, slantedText:true, slantedTextAngle:90 } // bottom x-axis.
        //    }
        //},
        hAxis: {
            direction: -1, slantedText: true, slantedTextAngle: 90, textStyle: {
                fontSize: 10, fontName: 'Century Gothic', color: '#757575'
            }
        },
        vAxis: {
            viewWindow: { max: 100, min: 0 }
        },
        seriesType: 'bars',
        colors: ["#f58410"],
        bar: { groupWidth: "70%" }
    };

    var chart = new google.visualization.ComboChart(document.getElementById('div_QSIByAgent'));
    chart.draw(data, options);
    //var chart = new google.charts.Bar(document.getElementById('div_QSIByAgent'));
    //chart.draw(data, google.charts.Bar.convertOptions(options));

}


function drawQSIByElement(elName) {
    // Some raw data (not necessarily accurate)
    //var data = google.visualization.arrayToDataTable([
    //  ['Year', 'Sales'],
    //  ['2014', 100],
    //  ['2015', 70],
    //  ['2016', 90],
    //  ['2017', 65]
    //]);

    //console.log("1.elName: " + elName);

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Agent Name');

    if (elName == '')
    {
        data.addColumn('number', 'Element A');
        data.addColumn('number', 'Element B');
        data.addColumn('number', 'Element C');
        data.addColumn('number', 'Element D');
        data.addColumn('number', 'Element E');
    }
    else
    {
        data.addColumn('number', 'Element ' + elName);
    }
    

    for (var i = 0; i < arrElement.length; i++) {
        var agentName = arrElement[i].AgentName;
        var elmntA = arrElement[i].ElementA;
        var elmntB = arrElement[i].ElementB;
        var elmntC = arrElement[i].ElementC;
        var elmntD = arrElement[i].ElementD;
        var elmntE = arrElement[i].ElementE;

        var arr = [];
        arr.push(agentName);

        if (elName == '')
        {
            arr.push(elmntA);
            arr.push(elmntB);
            arr.push(elmntC);
            arr.push(elmntD);
            arr.push(elmntE);
        }
        else
        {
            if (elName == 'A')
                arr.push(elmntA);
            if (elName == 'B')
                arr.push(elmntB);
            if (elName == 'C')
                arr.push(elmntC);
            if (elName == 'D')
                arr.push(elmntD);
            if (elName == 'E')
                arr.push(elmntE);
        }

        data.addRow(arr);
    }

    var chTitle = "QSI By Element";
    if (campName != '')
        chTitle += ": " + campName;

    ////if (elName != '')
    ////    chTitle += " - Element " + elName;

    //console.log("data element: " + data.length);

    var barWidth = "80%";
    if (elName != '')
        barWidth = "70%";

    var barColor = ["#55555A", "#f58410", "#d9534f", "#e4af03", "grey"];
    if (elName != '')
        barColor = ["#f58410"];

    var options = {
        //width: 640,
        //chartArea:{left:0,top:0,width:"90%",height:"50%"},
        chartArea: { width: "90%" },
        legend: { position: 'top' },
        title: chTitle,
        titleTextStyle: { fontSize: 16, fontName: 'Century Gothic' },
        //axes: {
        //    x: {
        //        0: { side: 'bottom', label: 'Agent Name', direction:-1, slantedText:true, slantedTextAngle:90 } // bottom x-axis.
        //    }
        //},
        hAxis: {
            direction: -1, slantedText: true, slantedTextAngle: 90, textStyle: {
                fontSize: 10, fontName: 'Century Gothic', color: '#757575'
            }
        },
        vAxis: {
            viewWindow: { max: 100, min: 0 }
        },
        seriesType: 'bars',
        colors: barColor,
        bar: { groupWidth: barWidth }
    };

    var chart = new google.visualization.ComboChart(document.getElementById('div_QSIByElement'));
    chart.draw(data, options);
}

function showFilter()
{
    ////var eDate = $("#HidEDate").val();
    ////$("#StartDate").val(eDate);
    $("#modal_chartfilter").modal();
}

function doFilter()
{
    var divError = "div_error_chart";
    dbName = $("#ddlCampaign").val();

    var sel = document.getElementById("ddlCampaign");
    campName = sel.options[sel.selectedIndex].text;
    //console.log("dbName: " + dbName);
    ////if (dbName == '')
    ////{
    ////    errorShowInModal('Invalid selected campaign name.', divError);
    ////    return;
    ////}


    $("#div_qsiagent").show();
    document.getElementById("div_qsiagent").classList.add("col-md-7");
    document.getElementById("div_qsiaudit").classList.remove("col-md-12");
    document.getElementById("div_qsiaudit").classList.add("col-md-5");

    startDate = $("#StartDate").val();
    endDate = $("#EndDate").val();
    if (startDate != '' || endDate != '') {
        loadChart();
        console.log('1. loadChart');
    }

    if (dbName != '')
        loadAgentChart();

    filterChart(dbName);

    $("#modal_chartfilter").modal('hide');
}

function filterChart(dbName)
{
    var campInitial = "CCP";
    if (dbName == 'HLBB_C_ILLNESS')
        campInitial = "CIP";
    if (dbName == 'HLBB_CSP')
        campInitial = "CSP";
    if (dbName == 'HLBB_MOTOR')
        campInitial = "Motor";

    var obj = sourceByCamp;
    console.log('dbName: ' + dbName);

    if (dbName.length > 0) {
        obj = $.grep(obj, function (e) {
            return (e.CampaignName == campInitial);
        });

        console.log('2. filter');
        arrByCamp = obj;
        google.charts.setOnLoadCallback(drawQSIByCamp);

        obj = sourceAudit;
        obj = $.grep(obj, function (e) {
            return (e.CampaignName == campInitial);
        });
        arrAudit = obj;
        google.charts.setOnLoadCallback(drawAuditTrack);
    }
    else {
        arrByCamp = sourceByCamp;
        google.charts.setOnLoadCallback(drawQSIByCamp);
        arrAudit = sourceAudit;
        google.charts.setOnLoadCallback(drawAuditTrack);
    }

    var elmName = $("#ddlElement").val();
    console.log('2.elmName: ' + elmName);

    if (dbName != '')
        loadAgentElement(elmName);
    //if (elmName.length > 0)
    //{
    //    console.log('2.elmName: ' + elmName);
    //    console.log('2.arrElement: ' + arrElement.length);
    //    google.charts.setOnLoadCallback(drawQSIByElement(elmName));
    //}
}
