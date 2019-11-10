// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  
console.log(`left : ${margin.left}, top : ${margin.top}`);
var chartGroup = svg.append("g")    
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv")
    .then(homeworkdata =>{
        //picking up my fields
        homeworkdata.forEach(data => {
            data.age = +data.age
            data.income = +data.income;
            data.obesity= +data.obesity;
        });

        // create sacle functions
        
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(homeworkdata, d=>d.age)-2,d3.max(homeworkdata,d=>d.age)])
            .range([0,width]);
        
        var yLinearScale = d3.scaleLinear()
            .domain([d3.max(homeworkdata, d=>d.income)+5000,d3.min(homeworkdata,d=>d.income)-5000])
            .range([0,height]);

        // var rLinearScale = d3.scaleLinear()
        //     .domain([d3.min(homeworkdata, d=>d.obesity),d3.max(homeworkdata,d=>d.obesity)])
        //     .range([10,40]);

        // create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis= d3.axisLeft(yLinearScale);

        //append axis to the chart
        console.log(`${height}`);
        chartGroup.append('g')
            .attr("transform", `translate(0,${height})`)
            .call(bottomAxis);
        chartGroup.append('g')
            .call(leftAxis);
        

        // create markers
        var markers = chartGroup.selectAll("circle")
            .data(homeworkdata)
            .enter()
            .append("circle")            
            .attr("cx", d => xLinearScale(d.age))
            .attr("cy", d => yLinearScale(d.income))
            .attr("r",  15)
            //.attr("r",  d => rLinearScale(d.obesity))
           .attr("class","stateCircle")
           .on("mouseover",function() {d3.select(this).attr('class','active')})
           .on("mouseout",function() {d3.select(this).attr('class','inactive')});
          
        var circleLabels = chartGroup.selectAll(null)
              .data(homeworkdata)
              .enter()
              .append("text");

        circleLabels
              .attr("x", d => xLinearScale(d.age))
              .attr("y", d => yLinearScale(d.income))
              .text(d => d.abbr)
              .attr("class","stateText")
              
        //tool tip time
        var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>State: </strong> ${d.abbr} <strong>Age: </strong> ${d.age}<br><strong> Income: </strong> ${d.income}<br> <strong> Obesity: </strong> ${d.obesity}`);
        });

        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        markers.on("click", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout event
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
            d3.select(this).attr('class','inactive')
          });
    
        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "aText")
          .text("Income");
    
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "aText")
          .text("Age");

    })

