const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const margins = { top: 20, right: 20, bottom: 70, left: 70 };
const width = 1000 - margins.left - margins.right;
const height = 800 - margins.top - margins.bottom;

d3.json(dataUrl).then(data => {
  console.log(data);
});
