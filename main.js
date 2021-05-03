const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const margin = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const parseYear = d3.timeParse("%Y");
const formatDate = d3.timeFormat("%M:%S");

const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleTime().range([0, height]);

const xAxis = d3.axisBottom(xScale).ticks(null).tickSize(10);
const yAxis = d3
  .axisLeft(yScale)
  .ticks(null)
  .tickSize(10)
  .tickFormat(formatDate);

const svg = d3
  .select(".content")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const svgContainer = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//--> X axis label
svgContainer
  .append("text")
  .attr("class", "axis-label")
  .attr("x", width / 2 - 30)
  .attr("y", height + 70)
  .text("Year");

//--> Y axis label
svgContainer
  .append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -60 - height / 2)
  .attr("y", -60)
  .text("Race time in minutes");

//--> Add legend
const legend = svgContainer
  .append("g")
  .attr("id", "legend")
  .attr("transform", `translate(700, 100)`);

legend
  .append("rect")
  .attr("class", "legend-doping")
  .attr("y", 10)
  .attr("width", 20)
  .attr("height", 20);

legend
  .append("rect")
  .attr("class", "legend-no-doping")
  .attr("y", 40)
  .attr("width", 20)
  .attr("height", 20);

legend
  .append("text")
  .attr("class", "legend-text")
  .attr("x", 30)
  .attr("y", 21)
  .attr("alignment-baseline", "middle")
  .text("Doping allegations");

legend
  .append("text")
  .attr("class", "legend-text")
  .attr("x", 30)
  .attr("y", 51)
  .attr("alignment-baseline", "middle")
  .text("No doping allegations");

//--> Add tooltip
const tooltip = d3
  .select(".content")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

//--> Show tooltip
const showTooltip = d => {
  const content = `<div>${d["Name"]} (${d["Nationality"]})</div><div>Place: ${d["Place"]}</div><div>${d["Doping"]}</div>`;

  tooltip
    .html(content)
    .style("left", `${d3.event.pageX + 15}px`)
    .style("top", `${d3.event.pageY - 28}px`)
    .attr("data-year", d["Year"])
    .transition()
    .duration(200)
    .style("opacity", 0.9);
};

//--> Hide tooltip
const hideTooltip = () => {
  tooltip.transition().duration(200).style("opacity", 0);
};

d3.json(dataUrl)
  .then(data => {
    //--> X & Y scale domains
    xScale.domain([
      d3.min(data, d => parseYear(d["Year"] - 1)),
      d3.max(data, d => parseYear(d["Year"] + 1)),
    ]);
    yScale.domain([
      d3.min(data, d => d["Seconds"] * 1000 - 5000),
      d3.max(data, d => d["Seconds"] * 1000 + 10000),
    ]);

    //--> X axis
    svgContainer
      .append("g")
      .attr("id", "x-axis")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    //--> Y axis
    svgContainer
      .append("g")
      .attr("id", "y-axis")
      .attr("class", "axis")
      .call(yAxis);

    svgContainer
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(parseYear(d["Year"])))
      .attr("cy", d => yScale(d["Seconds"] * 1000))
      .attr("r", 10)
      .attr("class", d => (d["Doping"].length > 0 ? "dot doping" : "dot"))
      .attr("data-xvalue", d => d["Year"])
      .attr("data-yvalue", d => {
        const date = new Date(`August 19, 1975 23:${d["Time"]} GMT+00:00`);
        return date.toISOString();
      })
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip);
    // .on("mouseenter", function (actual, idx) {
    //   console.log(this);
    //   d3.select(this).style("opacity", 0.5);
    // })
    // .on("mouseleave", function (actual, idx) {
    //   d3.select(this).style("opacity", 1);
    // });
  })
  .catch(err => console.log(err));
