
let wChart = 1120;
let hChart = wChart * 0.45;

d3.csv('https://github.com/c-bernardez/munoz_bernardez_final_vd/data/frecuencia.csv', d3.autoType).then(data => {
    console.log(data)
    const orderedDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
    data.sort((a, b) => orderedDays.indexOf(a.dia) - orderedDays.indexOf(b.dia));
    const orderedHorarios = ["mañana", "tarde", "noche"];
   
    let chart = Plot.plot({
        width: wChart,
        height: hChart,
        grid: false,
        marginTop: 50,
        marginBottom: 50,
        marginLeft: 150,
        marginRight: 50,
        style:{
          background: "transparent",
          color: "white",
        },
        color: {
          range: ["#FFE2B6","#FFC36B","#FFD28D","#FFB546","#FF9900"],
          type:"sequential"
          },
        x: {
            domain:orderedDays,
        },
        y: {
          domain: orderedHorarios,
        },
        marks: [
        Plot.cell(data,
          {
            x: 'dia',
            y: 'horario',
            fill: "proporcion_diaria",
          }
        ),
        Plot.tip(data,Plot.pointer(
          {
            x: 'dia',
            y: 'horario',
            //anchor: "middle",
            fill: "#625a7d",
            fontsize:15,
            title: (d) => [[Math.round(d.proporcion_diaria), d.dia].join("% de tus reproducciones de los "), d.horario].join(" fueron a la ")
          })
        ),
        

        Plot.axisX({
            label: null,
            //anchor: "top",
            //labelAnchor : left,
            labelArrow : false,
            fontSize: 15,
            color : "white",
            //ticks: [1,2,3],
            tickPadding: 10,
            tickFormat: (d) => orderedDays.indexOf(d) >= 0 ? d.slice(0, 3).toUpperCase() : "",
            tickSize: 0,
            lineWidth: 8, 
            marginBottom: 40}),
            

        Plot.axisY({
            label: null,
            //anchor: "top",
            //labelAnchor : left,
            labelArrow : false,
            fontSize: 15,
            color :"white",
            tickPadding: 10,
            tickSize: 0,
            tickFormat: (d) => d.toUpperCase(),
            lineWidth: 8, 
            marginBottom: 40}),

      ],
      });
  
      d3.select("#dias-chart").append(() => chart);
    })
  