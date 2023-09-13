// CHART START
// 1. aquí hay que poner el código que genera la gráfica

// Declaración de variables
let years; // Array para almacenar los años
let winners; // Array para almacenar los países ganadores
let originalData; // Variable para almacenar los datos originales

// Carga de datos desde un archivo CSV
d3.csv("WorldCup.csv")
    .then(data => {
        originalData = data;
        // Preparar los datos para el gráfico
        // data = data.filter(d => d.Year < 1955) // Filtrar datos si es necesario
        years = data.map(d => +d.Year);
        winners = data.map(d => d.Winner);
        // Actualizar el gráfico inicial
        update(winners);
        slider(); // Inicializar el control deslizante
});

// Función para actualizar el gráfico de barras
function update(data) {
    // 3. función que actualiza el gráfico
    const chartDiv = d3.select("#chart_p1");
    chartDiv.selectAll("*").remove(); // Eliminar el gráfico anterior
    const uniqueTickValues = Array.from(new Set(data.map(d => data.filter(val => val === d).length)));

    // Definir dimensiones y márgenes del gráfico
    const margin = { 
        top: 30, 
        right: 30, 
        bottom: 70, 
        left: 60 
    };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Crear el lienzo SVG
    const svg = chartDiv
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escalas para los ejes x e y
    const x = d3
        .scaleBand()
        .domain(winners)
        .range([0, width])
        .padding(0.2);

    const y = d3
        .scaleLinear()
        .domain([0, Math.round(d3.max(data, d => data.filter(val => val === d).length))])
        .range([height, 0]);

    // Crear ejes x e y
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
        .tickFormat(d3.format(".0f"))
        .tickValues(uniqueTickValues);

    // Agregar ejes al lienzo SVG
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Crear las barras del gráfico
    const bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d))
        .attr("y", d => y(data.filter(val => val === d).length))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(data.filter(val => val === d).length));
}

// Función para filtrar datos por año
function filterDataByYear(year) {
    // 4. función que filtra los datos dependiendo del año que le pasemos (year)
    return originalData
        .filter((d) => d.Year <= String(year))
        .map((d) => d.Winner);
}
// CHART END

// Función para crear el control deslizante
function slider() {
    // Esta función genera un control deslizante
    var sliderTime = d3.sliderHorizontal()
        .min(d3.min(years)) // Rango mínimo de años
        .max(d3.max(years)) // Rango máximo de años
        .step(4) // Incremento del control (4 años por cada cambio)
        .width(580) // Ancho del control en píxeles
        .ticks(years.length)
        .default(years[years.length - 1]) // Valor inicial del marcador
        .on('onchange', val => {
            // Acción a realizar al cambiar el valor del control

            console.log(val);

            // Filtrar los datos por el año seleccionado
            const filteredData = filterDataByYear(val);
            update(filteredData); // Actualizar el gráfico con los datos filtrados
            
            d3.select('p#value-time')
                .text(val); // Actualizar el año que se muestra
        });

    // Contenedor del control deslizante
    var gTime = d3.select('div#slider-time') // Div donde se inserta
        .append('svg')
        .attr('width', 800)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gTime.call(sliderTime); // Inicializar el control deslizante en el contenedor

    d3.select('p#value-time')
        .text(sliderTime.value()); // Mostrar el año inicial
}
