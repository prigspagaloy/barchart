const getBar = (dataset) => {
  const w = 800;
  const h = 400;
  const padding = 40;
  
  const svgContainer = d3.select(".data-stats")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h)
  
  const tooltip = d3.select(".data-stats")
                    .append("div")
                    .attr("id", "tooltip")
                    //.attr("transform", "translate(100, 50)")
                    .style("opacity", "0")
                    .style("width", "auto")
                    .style("height", "auto")
                    //.style("text-align", "center")
    
  
  svgContainer.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -200)
                .attr("y", 65)
                .text("Gross Domestic Product");

    svgContainer.append("text")
                //.attr("x", 420)
                //.attr("y", h - 10)
                .attr("transform", "translate("+ (w - 410) +", "+ (h - 3) +")")
                .text("More info: http://www.bea.gov/national/pdf/nipaguid.pdf")
                .attr("class", "info");
    
    const hScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, (d) => d[1])])
                     .range([0, h - (2 * padding)])
    
    const xScale = d3.scaleLinear()
                     .domain([0, dataset.length - 1])
                     .range([padding, w - padding])

    const datesArray = dataset.map((d) => new Date(d[0]));
    const xAxisScale = d3.scaleTime()
                         .domain([d3.min(datesArray), d3.max(datesArray)])
                         .range([padding, w - padding])
    const yAxisScale = d3.scaleLinear()
                         .domain([0, d3.max(dataset, (d) => d[1])])
                         .range([h - padding, padding])
    const xAxis = d3.axisBottom(xAxisScale);
    const yAxis = d3.axisLeft(yAxisScale);
    svgContainer.append("g")
                .call(xAxis)
                .attr("id", "x-axis")
                .attr("transform", "translate(0, "+ (h - padding) +")")
    svgContainer.append("g")
                .call(yAxis)
                .attr("id", "y-axis")
                .attr("transform", "translate("+ padding +", 0)")

  svgContainer.selectAll("rect")
              .data(dataset)
              .enter()
              .append("rect")
              .attr("class", "bar")
              .attr("data-date", (d) => d[0])
              .attr("data-gdp", (d) => d[1])
              .attr("width", (w - (2*padding)) / dataset.length)
              .attr("height", (d) => hScale(d[1]))
              .attr("x", (d, i) => xScale(i))
              .attr("y", (d) => (h - padding) - hScale(d[1]))
              .attr("fill", "orange")
              .on("mouseover", (data, i) => {
                  tooltip.transition()
                         .style("opacity", "1")
                         .style("duration", "0")
                        
                  tooltip.text(i[0])
                         .attr("data-date", i[0])
              })
              .on("mouseout", () => {
                tooltip.transition()
                .style("opacity", "0")
                .style("duration", "0")
               
              })
  
    
  }

  d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(data => {
    const dataset = data.data;
    getBar(dataset);
    console.log(dataset);
  });