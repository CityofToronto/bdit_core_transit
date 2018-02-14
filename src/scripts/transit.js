var scdata = JSON.stringify(streetcar);
var scobj = JSON.parse(scdata);
var stbl = JSON.stringify(streetcarbl);
var stblobj = JSON.parse(stbl);
var scbldata = JSON.stringify(blgra_data);
var scblgra = JSON.parse(scbldata);

function avg (column) {
  var total = 0;
  for(var i = 0; i < column.length; i++) {
    total += column[i];
  }
  aver = total / column.length
  return aver.toFixed(1);
};


function before([segment, time, direction]){
  var bfvalue = 0;
  if (segment == "allroads") {
    var timelst = [];
    for (var i=0; i<stblobj.length; i++){
      if (stblobj[i].time_period == time && stblobj[i].dir == direction) {
        timelst.push(stblobj[i].travel_time);
      }
    }
    bfvalue = avg(timelst);
  } else {
    for(var i = 0; i < stblobj.length; i++){
      if (stblobj[i].segment == segment && stblobj[i].time_period == time && stblobj[i].dir == direction) {
        bfvalue = stblobj[i].travel_time;
      }
    }
  }
  return bfvalue;
};

function after([segment, time, direction]){
  var afvalue = 0;
  var timelst = [];
  if (segment == "allroads") {
    for (var i=0; i<scobj.length; i++){
      if (scobj[i].time_period == time && scobj[i].dir == direction) {
        timelst.push(scobj[i].travel_time);
      }
    }
    afvalue = avg(timelst);
  } else {
    for(var i = 0; i < scobj.length; i++){
      if (scobj[i].segment == segment && scobj[i].time_period == time && scobj[i].dir == direction) {
        timelst.push(scobj[i].travel_time);
      }
    }
    afvalue = avg(timelst);
  }
  return afvalue;
};

function different (bfvalue, afvalue) {
  diff = parseInt(afvalue - bfvalue);
  if (diff == 0) {
    diff = "< 1 min";
  }
  else if (diff > 0) {
    diff = diff.toString();
    diff = "+" + diff + " min";
  }
  else if (diff < 0) {
    diff = diff.toString();
    diff = diff + " min";
  }
  return diff;
}

var roadsIDs = ["allroads", "Bathurst-Spadina", "Spadina-University", "University-Yonge", "Yonge-Jarvis"];
var divIDs = ["AMEB", "AMWB", "PMEB", "PMWB"];
var segment_selected = document.getElementById("allroads").value;

function diffdata(){
  roadsIDs.forEach(function(selectID) {
			segment_selected = document.getElementById("roads").value;
	});
  var seg_lst = [[segment_selected, "AM", "EB"], [segment_selected, "AM", "WB"],
                 [segment_selected, "PM", "EB"], [segment_selected, "PM", "WB"]];
  var difflst = [];
  var arrowdiv = document.getElementsByClassName('arrow');
  for (i=0; i<seg_lst.length; i++){
    var segdiv = document.getElementById(divIDs[i]);
    var segindiv = document.getElementsByName(divIDs[i])[0];
    diffvalue = different(before(seg_lst[i]), after(seg_lst[i]));
    segindiv.innerHTML = diffvalue;
    if (diffvalue == "< 1 min"){
      segdiv.style.borderColor = "orange";
      arrowdiv[i].innerHTML = '&#10226';
      arrowdiv[i].style.color = "orange";
    } else if (diffvalue.includes("+") == true) {
      segdiv.style.borderColor = "red";
      arrowdiv[i].innerHTML = '&#9650';
      arrowdiv[i].style.color = "red";
    } else {
      segdiv.style.borderColor = "green";
      arrowdiv[i].innerHTML = '&#9660';
      arrowdiv[i].style.color = "green";
    }
  }
};

diffdata();

var weekdayb = document.getElementById('weekday');
var weekendb = document.getElementById('weekend');
var EBb = document.getElementById('EB');
var WBb = document.getElementById('WB');


function Wtoggleclasses() {
  if (weekdayb.className == "chosen") {
    weekdayb.className = 'daytime';
    weekendb.className = 'chosen';
  } else {
    weekendb.className = 'daytime';
    weekdayb.className = 'chosen';
  }
}

function Dtoggleclasses() {
  if (EBb.className== 'chosen') {
    EBb.className = 'daytime';
    WBb.className = 'chosen';
  } else {
    EBb.className = 'chosen';
    WBb.className = 'daytime';
  }
}

var monthsIDs = ['092017', '102017', '112017', '122017'];
var select3 = document.getElementById("month9").value;

function buttonchecker() {
  if (weekdayb.className == "chosen") {
    select1 = weekdayb.id;
  } else {
    select1 = weekendb.id;
  }
  if (EBb.className== 'chosen') {
    select2 = EBb.id;
  } else {
    select2 = WBb.id;
  }
  monthsIDs.forEach(function(selectID) {
    select3 = document.getElementById("months").value;
    select3 = parseInt(select3.substring(0, select3.length-4));
  });
  selector = [select1, select2, select3];
  return selector;
}

function blgraphdata() {
  var bl_centre = [];
  var bl_initial = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
  selector = buttonchecker();
  for (var i = 0; i < scblgra.length; i++){
    day = new Date(scblgra[i].mon).getDay();
    currmonth = new Date(scblgra[i].mon).getMonth();
    currhour = new Date(scblgra[i].mon).getHours();
    if (selector[0] =="weekday") {
      if (day!=6 && day!= 0 && selector[1]==scblgra[i].dir && selector[2] == currmonth+1){
        bl_initial[currhour].push(scblgra[i].travel_time);
      }
    } else {
      if ((day==6 && selector[1] == scblgra[i].dir && selector[2] == currmonth+1)|| (day==0 && selector[1] == scblgra[i].dir && selector[2] == currmonth+1)){
        bl_initial[currhour].push(scblgra[i].travel_time);
      }
    }
  }
  for(j=0;j<bl_initial.length;j++){
    bl_centre.push (parseFloat(avg(bl_initial[j])));
  }
  return bl_centre;
}


function blgraph() {
  var bl_centre = blgraphdata();
  nintyfive = bl_centre.map(x => x+1);
  five = bl_centre.map(x => x-0.8);
  outline = nintyfive.concat(five.reverse());
  five.reverse();


  var bltrace1 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    y: outline,
    fill: "tozerox",
    fillcolor: "rgba(198, 213, 255, 0.3)",
    line: {color: "transparent"},
    name: "area",
    showlegend: false,
    hoverinfo: 'none',
    type: "scatter"
  };

  var bltrace2 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    y: bl_centre,
    line: {color: "rgb(3, 44, 160)"},
    mode: "lines",
    name: "Average",
    type: "scatter"
  };

  var bltrace3 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    y: nintyfive,
    line: {color: "rgb(204, 216, 255)"},
    mode: "lines",
    name: "95%",
    type: "scatter"
  };

  var bltrace4 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    y: five,
    line: {color: "rgb(204, 216, 255)"},
    mode: "lines",
    name: "5%",
    type: "scatter"
  };

  var blgdata = [bltrace1, bltrace2, bltrace3, bltrace4];
  var blglayout = {
    title: "Baseline",
    paper_bgcolor: "rgb(255,255,255)",
    plot_bgcolor: "rgb(242, 242, 242)",
    xaxis: {
      title: "Hours of the day",
      gridcolor: "rgb(255,255,255)",
      range: [0, 23],
      showgrid: true,
      showline: false,
      showticklabels: true,
      tickcolor: "rgb(127,127,127)",
      ticks: "outside",
      zeroline: false
    },
    yaxis: {
      title: "Travel Time (min)",
      gridcolor: "rgb(255,255,255)",
      showgrid: true,
      showline: false,
      showticklabels: true,
      tickcolor: "rgb(127,127,127)",
      ticks: "outside",
      zeroline: false
    }
  };
    Plotly.newPlot('blgraph', blgdata, blglayout, {displayModeBar: false});
};

blgraph();

function mongraph() {
  var bl_centre = blgraphdata();
  nintyfive = bl_centre.map(x => x+1);
  five = bl_centre.map(x => x-0.8);
  outline = nintyfive.concat(five.reverse());
  five.reverse();


  var bltrace1 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    y: outline,
    fill: "tozerox",
    fillcolor: "rgba(198, 213, 255, 0.3)",
    line: {color: "transparent"},
    name: "area",
    showlegend: false,
    hoverinfo: 'none',
    type: "scatter"
  };

  var bltrace2 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    y: bl_centre,
    line: {color: "rgb(3, 44, 160)"},
    mode: "lines",
    name: "Average",
    type: "scatter"
  };

  var bltrace3 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    y: nintyfive,
    line: {color: "rgb(204, 216, 255)"},
    mode: "lines",
    name: "95%",
    type: "scatter"
  };

  var bltrace4 = {
    x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    y: five,
    line: {color: "rgb(204, 216, 255)"},
    mode: "lines",
    name: "5%",
    type: "scatter"
  };

  var blgdata = [bltrace1, bltrace2, bltrace3, bltrace4];
  var blglayout = {
    title: "Selected Month",
    paper_bgcolor: "rgb(255,255,255)",
    plot_bgcolor: "rgb(242, 242, 242)",
    xaxis: {
      title: "Hours of the day",
      gridcolor: "rgb(255,255,255)",
      range: [0, 23],
      showgrid: true,
      showline: false,
      showticklabels: true,
      tickcolor: "rgb(127,127,127)",
      ticks: "outside",
      zeroline: false
    },
    yaxis: {
      title: "Travel Time (min)",
      gridcolor: "rgb(255,255,255)",
      showgrid: true,
      showline: false,
      showticklabels: true,
      tickcolor: "rgb(127,127,127)",
      ticks: "outside",
      zeroline: false
    }
  };
    Plotly.newPlot('mongraph', blgdata, blglayout, {displayModeBar: false});
};

mongraph();


function cggraph() {
  var cgbllst = [["allroads","AM","EB"],["allroads","AM","WB"], ["allroads","PM","EB"],["allroads","PM","WB"]];
  var cgbldata = [];
  for(i=0;i<cgbllst.length;i++){
    cgbldata.push (before(cgbllst[i]));
  }

  console.log(cgbldata);

  var cgtrace1 = {
    x: ["Baseline", "September", "October", "November", "December"],
    y: [7.6, 6.5, 6.8, 7.5, 8.9],
    mode: 'lines+markers',
    line: {color: "rgb(89, 133, 255)"},
    name: 'AM EB'
  };

  var cgtrace2 = {
    x: ["Baseline", "September", "October", "November", "December"],
    y: [7.2, 6.3, 6.5, 7.1, 8.5],
    mode: 'lines+markers',
    line: {color: "rgb(255, 199, 89)"},
    name: 'AM WB'
  };

  var cgtrace3 = {
    x: ["Baseline", "September", "October", "November", "December"],
    y: [6.8, 5.8, 6.2, 6.4, 7.2],
    mode: 'lines+markers',
    line: {color: "rgb(252, 116, 179)"},
    name: 'PM EB'
  };

  var cgtrace4 = {
    x: ["Baseline", "September", "October", "November", "December"],
    y: [6.4, 5.5, 6.0, 6.2, 6.8],
    mode: 'lines+markers',
    line: {color: "rgb(184, 83, 252)"},
    name: 'PM WB'
  };

  var cgdata = [cgtrace1, cgtrace2, cgtrace3, cgtrace4];

  var cglayout = {
    title: 'Travel Time by Months',
    plot_bgcolor: "rgb(245, 245, 245)",
    xaxis: {
      gridcolor: "rgb(255,255,255)",
      range: ["Baseline", "September", "October", "November", "December"],
      showgrid: true,
      showline: false,
      showticklabels: true,
      tickcolor: "rgb(127,127,127)",
      ticks: "outside",
      zeroline: false
    },
    yaxis: {
      title: "Travel Time (min)",
      gridcolor: "rgb(255,255,255)",
      showgrid: true,
      showline: false,
      showticklabels: true,
      tickcolor: "rgb(127,127,127)",
      ticks: "outside",
      zeroline: false
    }
  };
  Plotly.newPlot('comparedgra', cgdata, cglayout, {displayModeBar: false});
};

cggraph();
