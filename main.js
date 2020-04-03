const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const margin = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// const xScale = d3.scaleTime().rangeRound([0, width]);
const xScale = d3.scaleTime().rangeRound([0, width]);
const yScale = d3.scaleTime().range([height, 0]);

const xAxis = d3.axisBottom().scale(xScale);
const yAxis = d3.axisLeft().scale(yScale);

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
  .attr("x", width / 2)
  .attr("y", height)
  .text("Year");
//--> Y axis label
svgContainer
  .append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -130)
  .attr("y", 10)
  .text("Time in minutes");

d3.json(dataUrl).then(data => {
  console.log(data);
  xScale.domain(d3.extent(data, d => d["Year"]));

  //--> X axis
  svgContainer
    .append("g")
    .attr("id", "x-axis")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis.ticks(null).tickSize(10, 10, 0));
  //--> Y axis
  svgContainer
    .append("g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .call(yAxis.ticks(null).tickSize(10, 10, 0));
});
