let main = d3.select("main");
let scrolly = main.select("#scrolly");
let $figure = scrolly.select("figure");
let wChart = 1000;
let hChart = wChart * 0.6;
let dataChart = [];
let $step;

// initialize the scrollama
let scroller = scrollama();

// fetch data
d3.csv("combined.csv", d3.autoType).then(function (data) {
  dataChart = data;
  // kick things off
  init();
});

function handleStepExit(response) {
  console.count("classed");
  d3.select(response.element).classed("is-active", false);
}

// scrollama event handlers
function handleStepEnter(response) {
  $step = d3.select(response.element);
  $step.classed("is-active", true);
  console.count("classed")
  
  const col = $step.attr("data-color");

  d3.select("#scrolly")
  .style("transition", "background-color 1s ease-in-out") // Add transition property
  .style("background-color", col); // Change body background color

  // d3.select("#scrolly")
  //   .style("transition", "background-color 1s ease-in-out") // Add transition property
  //   .style("background-color", `${col}`); // Change scrolly element background color
  
  const key = $step.attr("data-step");
  createChart(key);
  const isFinalArticle = $step.node().classList.contains("final");

  if (isFinalArticle) {
    d3.select("#scrolly figure").classed("is-fixed", true); // Add class to fix the figure
  } else {
    d3.select("#scrolly figure").classed("is-fixed", false); // Remove class to allow figure to move
  }

  // $step.style.backgroundColor ="red";
}

function handleStepProgress(response) {
  $step.select(".progress").text(d3.format(".1%")(response.progress));
}

function init() {
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.7,
      //debug: true,
      //progress: true,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onStepProgress(handleStepProgress);
    window.addEventListener("resize", scroller.resize);
}


 function createChart (key)  {
    const morningData = dataChart.filter(d => d.horario === 'morning');
    const noonData = dataChart.filter(d => d.horario === 'noon');
    const nightData = dataChart.filter(d => d.horario === 'night');

  let chartData;
    // Assign the corresponding data based on the key
    if (key === "morning") {
      chartData = morningData;
    } else if (key === "noon") {
      chartData = noonData;
    } else if (key === "night") {
      chartData = nightData;
    }
    console.log(key);
    
    const loudnessValues = chartData.map(d => d.loudness);
    const meanLoudness = d3.mean(loudnessValues);

    console.log(meanLoudness);

    let chart = Plot.plot({
      width: wChart,
      height: hChart,
      // grid: {
      //   color:"white",
      // },
      marginTop: 50,
      marginBottom: 50,
      marginLeft: 50,
      marginRight: 5,
      style:{
        background: "transparent",
        color: "white",
      },
      x: {
        domain: [0, 3.0],
      },
      y: {
        domain: [0, 16],
      },
      marks: [
      Plot.dot(chartData,
        {
          x: d=>d.msPlayed /d.duration_ms,
          y:  d=>d.loudness+15,
          anchor: "middle",
          fill: "white",
          opacity:0.7,
          r:20,
        }
      ),
      Plot.tip(chartData,Plot.pointer(
        {
          x: d=>d.msPlayed /d.duration_ms,
          y: d=>d.loudness+15,
          //anchor: "middle",
          fill: "#625a7d",
          fontSize:15,
          title: (d) => [d.name, d.artist].join(", de ")
        })
      ),

      Plot.gridX({interval: 1, stroke: "white", strokeOpacity: 0.3}),
      Plot.gridY({interval: 2, stroke: "white", strokeOpacity: 0.3}),

      Plot.axisX({
        label: "Cantidad de reproducciones",
        //anchor: "top",
        //labelAnchor : left,
        labelArrow : false,
        fontSize: 15,
        //color :,
        ticks: [1,2,3],
        tickFormat: d3.format(".0f"),
        tickPadding: 10,
        tickSize: 0,
        lineWidth: 8, 
        marginBottom: 40}),

        Plot.axisY({
          label: "Nivel de ruido",
          //anchor: "top",
          //labelAnchor : left,
          labelArrow : false,
          fontSize: 15,
          //color :,
          ticks: [0,2,4,6,8,10,12,14,16],
          tickFormat: (d) => Math.abs(d),
          tickPadding: 20,
          tickSize: 0,
          lineWidth: 8, 
          marginBottom: 40}),

          

          Plot.ruleY([meanLoudness+14], {stroke: "red", strokeOpacity:0.5, strokeWidth:1}),
          //Plot.ruleX([1], {stroke: "red",strokeOpacity:0.3}),
    ],
    });

    d3.select("#scrolly figure svg").remove();
    d3.select("#scrolly figure").append(() => chart);

    d3.select(containerId).select("svg").remove();
 d3.select(containerId).append(() => chart);
  };


  $(document).ready(function() {
    $("#datepickerButton").click(function() {
      $("#datepickerContainer").fadeIn();
      $("#datepicker").datepicker();
    });
  });
  //commit