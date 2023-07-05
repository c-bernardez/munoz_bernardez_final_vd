

d3.csv('../data/pop_analisis.csv', d3.autoType).then(data => {

  console.log(data)

  const cantPopulares = new Map();
  data.forEach(row => {
    const category = row.category;
    if (cantPopulares.has(category)) {
      cantPopulares.set(category, cantPopulares.get(category) + 1);
    } else {
      cantPopulares.set(category, 1);
    }
  });
  if (cantPopulares.has('popular') && cantPopulares.has('desconocida')) {
    const popularesCount = cantPopulares.get('popular');
    const desconocidaCount = cantPopulares.get('desconocida');
    cantPopulares.delete('popular');
    cantPopulares.delete('desconocida');
    cantPopulares.set('popular', popularesCount);
    cantPopulares.set('desconocida', desconocidaCount);
  }
  
  
    console.log(cantPopulares);

  compareRadialChart(cantPopulares, 'chart4');
});

function compareRadialChart(data, id) {
  const datos = {
    labels: Array.from(data.keys()),
    
    datasets: [
      {data: Array.from(data.values()),
        backgroundColor: ['#FFFF','#3C374C'],
        hoverBackgroundColor: ['#FFFF','#3C374C'],
        hoverBorderColor:['#FFFF','#3C374C'],
      }
    ]
  };

  const options = {
    
    plugins: {

        responsive:true,
        legend: {
          display: false
        },
        tooltip: {
            enabled: false,
        },
        hover: {
            mode: null,
        },
        events:[],
      },
    elements: {
    arc: {
        borderWidth: 1,
        borderColor: '#3C374C'
    }
    },
    options: {
        elements: {
          center: {
            text: 'Red is 2/3 the total numbers',
            color: '#FF6384', // Default is #000000
            fontStyle: 'Arial', // Default is Arial
            sidePadding: 20, // Default is 20 (as a percentage)
            minFontSize: 20, // Default is 20 (in px), set to false and text will not wrap.
            lineHeight: 25 // Default is 25 (in px), used for when text wraps
          }
        }
      },
    
  };

  const ctx = document.getElementById(id).getContext('2d');
  new Chart(ctx, { type: 'doughnut', data: datos, options });
}
