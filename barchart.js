// Parse the Data
d3.csv("https://raw.githubusercontent.com/sherbert-lemon/public-data/master/cannaresearch/cannabis-MFN.csv", function(data) {
  //print parsed data
  console.log(data)

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 30, bottom: 20, left: 50},
      width = 350 - margin.left - margin.right,
      height = 310 - margin.top - margin.bottom;

  // identifying div to place fig
  var div = d3.select("#fig")

  // append the svg object to the assigned dic
  var svg = div.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(responsivefy)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // List of subgroups = male, female usage as y axis
    var subgroups = data.columns.slice(2)

    // List of groups = studies as x axis
    var groups = d3.map(data, function(d){return(d.study)}).keys()

    // Add xscale
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.25])

    // Add Yscale
    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0 ])

    // scale for subgroup position
    var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.2])

    // color palette
    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#97d5e0','#beaecc'])

    // create bar plot
    svg.append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .enter()
      //chart data, top layer with groups
      .append("g")
        .attr("transform", function(d) { return "translate(" + x(d.study) + ",0)"; })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
      // chart data, nested subgroup layer
      .enter().append("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth()+3)
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); })
        .attr("stroke", "#282828")
        .attr("stroke-width", "0.5")
        .on('mouseover', function(d){
          //line hover effects
          window.val = d.value // global var for % val
          line = d3.select('#fig')
            svg.append('line')
              .attr('id', 'dLine')
              .attr('stroke', '#f98419')
              .attr('stroke-width', '1.5')
              .attr('stroke-dasharray', '5,5')
              .attr('x1', 0)
              .attr('y1', y(val))
              .attr('x2', width)
              .attr('y2', y(val))
      // opacity hover effects
          d3.select(this)
            .transition()
            .duration(300)
            .attr('opacity', 0.6)})
        // removing mouseover events
        .on('mouseout', function(d) {
            d3.select("#dLine").remove();
            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)});

    //tooltip and related mouse functions
    var tooltip = d3.select('#fig').append('div')
          .attr('class', 'tooltip')

    function mouseover(){
          tooltip.style('opacity', 1)
                 .style('display', 'inline');
      }
    function mousemove(){
          var d = d3.select(this).data()[0]
          sSize = d.n

          tooltip.html("users = " + window.val + "%"
                + "<br>" + "n = " + sSize)
            .style('left', (d3.event.pageX - 20) + 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('opacity',1);
      }
    function mouseout(){
          tooltip.style('opacity', '0');
      }

  //calling x-axis
    svg.append("g")
      .attr('class','axis')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(3))
  // X-axis label
    svg.append('text')
        .attr('class','label')
        .attr('y', height+20)
        .attr('x', 0.5*width)
        .attr("dy", ".5em")
        .style('font-size','10px')
        .style("text-anchor", "middle")
        .text('Samples Organized by Ascending "n"');

  //calling y-axis
    svg.append("g")
      .attr('class','axis')
      .call(d3.axisLeft(y))
  //y-axis label
    svg.append('text')
        .attr('class','label')
        .attr('transform','rotate(-90)')
        .attr('x', -0.5*height)
        .attr('y', -30)
        .attr("dy", ".5em")
        .style('font-size','10px')
        .style("text-anchor", "middle")
        .text('Percent Users');

  // figure title
    var titleX = width/2 - 50;
    var titleY = 0;

    title = svg.append('text')
      .attr('class','title')
      .style('font-size','12px')
      .attr('transform','translate('+ titleX + ',' + titleY + ')')
      .text('Population Cannabis Usage')

    // legend
    svg.append("circle").attr("cx",260).attr("cy",20).attr("r", 5).style("fill", "#97d5e0")
    svg.append("circle").attr("cx",260).attr("cy",40).attr("r", 5).style("fill", "#beaecc")
    svg.append("text").attr("x", 270).attr("y", 20).text("Male Users").style("font-size", "10px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 270).attr("y", 40).text("Female Users").style("font-size", "10px").attr("alignment-baseline","middle")



  })
