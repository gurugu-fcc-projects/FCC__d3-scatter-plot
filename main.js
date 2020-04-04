const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const margin = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleTime().range([0, height]);

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

d3.json(dataUrl)
  .then((data) => {
    const parseYear = d3.timeParse("%Y");
    const timeFormat = d3.timeFormat("%M:%S");

    console.log(data);

    //--> X & Y scale domains
    xScale.domain([
      d3.min(data, (d) => parseYear(d["Year"] - 1)),
      d3.max(data, (d) => parseYear(d["Year"] + 1)),
    ]);
    yScale.domain([
      d3.min(data, (d) => d["Seconds"] * 1000 - 10000),
      d3.max(data, (d) => d["Seconds"] * 1000 + 10000),
    ]);

    //--> X axis
    svgContainer
      .append("g")
      .attr("id", "x-axis")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis.ticks(null).tickSize(10));

    //--> Y axis
    svgContainer
      .append("g")
      .attr("id", "y-axis")
      .attr("class", "axis")
      .call(yAxis.ticks(null).tickSize(10).tickFormat(timeFormat));

    svgContainer
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(parseYear(d["Year"])))
      .attr("cy", (d) => yScale(d["Seconds"] * 1000))
      .attr("r", 10)
      .attr("class", (d) =>
        d["Doping"].length > 0 ? "data-circle doping" : "data-circle"
      );
  })
  .catch((err) => console.log(err));
