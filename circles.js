var width = 1000;
var height = 1000;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

var c_x = 300, c_y = 300;
var angle = 0;
var cx, cy, d = 50, r = 10;  
var n = 13;  
var d_an = 360 / n;

var r_d_array = [[10, 100],
            [10, 150],
            [10, 200],
            [20, 100],
            [20, 150],
            [20, 200],
            [30, 100],
            [30, 150],
            [30, 200]]

var r_d = [...r_d_array];

var index = getRandomInt(r_d.length - 1)
var d = r_d[index][1]
var r = r_d[index][0]
r_d.splice(index, 1)

for (var i=0; i<n; i++){

    cy = c_y + d * Math.sin(angle * Math.PI / 180)
    cx = c_x + d * Math.cos(angle * Math.PI / 180)
    var circle = g.append("circle")
    .attr("id", ("circle_" + i))
    .attr("fill", "blue")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", r)

    angle += d_an;
}   

function change_params(){

    index = getRandomInt(r_d.length - 1)
    d = r_d[index][1]
    r = r_d[index][0]
    r_d.splice(index, 1)

    angle = 0;

    for (var i=0; i<n; i++){

        cy = c_y + d * Math.sin(angle * Math.PI / 180)
        cx = c_x + d * Math.cos(angle * Math.PI / 180)
        d3.select("#circle_" + i)
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r)
    
        angle += d_an;
    }
    
}

var rect = g.append("rect")
.attr("id", ("start"))
.attr("fill", "green")
.attr("x", c_x + 50)
.attr("y", 35)
.attr('width', 20)
.attr('height', 20)

var curr_ind = getRandomInt(n);
d3.select("#circle_" + curr_ind).attr("fill", "red");

var num_click = 0;
var num_missclick = 0;
var num_round = 0;
var user_id = 2;

var start_t = 0;
var overall_time = (new Date()).getTime();

var data = [];
var data_entry = [];
var data_header = ["user id", "radius", "diameter", "completion time", "missclicks"];

data.push(data_header)

var n_ = 9;

var myText =  svg.append("text")
.attr("y", 50)
.attr("x", c_x)
.attr('text-anchor', 'middle')
.text("Let's start ->>");

d3.selectAll("html").on("click", function(){
    num_missclick += 1;
});

d3.select("#start").on("click", function(){
    console.log("start")
    d3.select("#start").attr("fill", "red")
    start_t = (new Date()).getTime(); 
});

d3.selectAll("circle").on("click", function(){

    if (d3.select(this).attr("id") == d3.select("#circle_" + curr_ind).attr("id")){
 
        d3.select("#circle_" + curr_ind).attr("fill", "blue");
        curr_ind = (curr_ind + Math.round(n/2)) % n;
        d3.select("#circle_" + curr_ind).attr("fill", "red");
    
        num_click += 1;
        if (num_missclick > 0) num_missclick -= 1;
    
        data_entry.push(user_id);
        data_entry.push(r);
        data_entry.push(d);
    
        var end_t = (new Date()).getTime();
        data_entry.push(end_t - start_t);
        start_t = end_t;
    
        data_entry.push(num_missclick);

        data.push(data_entry);
        data_entry = [];
    
        d3.select("text").text("round " + num_round + "/" + n_)
    }
        
    if (num_click == n){

        write_csv(data, "'" + "user_" + user_id + "_round_" + (num_round + 1) + "_r_" + r + "_d_" + d + "'");
        data = [];
        num_click = 0;
        num_missclick = 0;

        num_round += 1;

        d3.select("text").text("round " + num_round + "/" + n_)

        if (r_d.length != 0)
            change_params();

        }

    if (num_round == n_){

        d3.select("text").text("Let's start")

        console.log("new user");
        user_id += 1;
        num_round = 0;
        r_d = [...r_d_array];
        d3.select("#start").attr("fill", "green")
    }

});

function write_csv(data, filename){
    console.log("write csv file");
    const rows = data;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename+ ".csv");
    document.body.appendChild(link); 
    link.click();   
}
