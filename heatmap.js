// const fs = require("fs");
// const csv = require("csv-parser");

// const objectsArray = [];

// // Helper function to calculate the daily proportion
// const calculateDailyProportion = (objects, dia, horario) => {
//   const totalByDay = objects.filter((obj) => obj.dia === dia).length;
//   const countByTimePeriod = objects.filter((obj) => obj.dia === dia && obj.horario === horario).length;
//   const proportion = (countByTimePeriod / totalByDay) * 100;
//   return proportion;
// };

// fs.createReadStream("frecuencia.csv")
//   .pipe(csv())
//   .on("data", (row) => {
//     const { dia, horario, name } = row;
//     objectsArray.push({ dia, horario, cancion: name });
//   })
//   .on("end", () => {
//     const diaHorarioCounts = {};

//     // Calculate the daily proportion for each row
//     objectsArray.forEach((obj) => {
//       const { dia, horario } = obj;
//       const count = diaHorarioCounts[`${dia}_${horario}`] || 0;
//       diaHorarioCounts[`${dia}_${horario}`] = count + 1;

//       const proportion = calculateDailyProportion(objectsArray, dia, horario);
//       obj.proporcion_diaria = proportion;
//     });

//     // Calculate proporcion_total for each dia and horario combination
//     const totalObjects = objectsArray.length;
//     const proporcionTotalArray = [];

//     Object.keys(diaHorarioCounts).forEach((key) => {
//       const count = diaHorarioCounts[key];
//       const [dia, horario] = key.split('_');
//       const proporcion = (count / totalObjects) * 100;
//       proporcionTotalArray.push({ dia, horario, proporcion_total: proporcion });
//     });

//     // Merge proporcion_total with objectsArray
//     objectsArray.forEach((obj) => {
//       const { dia, horario } = obj;
//       const proporcionObj = proporcionTotalArray.find((propObj) => propObj.dia === dia && propObj.horario === horario);
//       if (proporcionObj) {
//         obj.proporcion_total = proporcionObj.proporcion_total;
//       }
//     });

//     console.log('objectsArray', objectsArray);
//     // Further operations with the objectsArray
//   });

//   const csvData = new ObjectsToCsv(objectsArray);
// csvData.toDisk('frecuencias_actualizadas.csv');
// console.log('CSV file created: output.csv');




let wChart = 1120;
let hChart = wChart * 0.45;

d3.csv('../data/frecuencia.csv', d3.autoType).then(data => {
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
  