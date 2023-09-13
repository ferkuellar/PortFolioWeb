// Constantes Globales y Configuración
const diCaprioBirthYear = 1974, today = new Date().getFullYear(), AGE_THRESHOLD = 25;
const width = 900, height = 400, margin = { top: 40, right: 40, bottom: 40, left: 40 };

// Funciones Auxiliares
const calculateAge = year => year - diCaprioBirthYear;

// Inicialización de SVG y Grupos
const svg = d3
    .select('#chart_p2')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
const elementGroup = svg
    .append('g')
    .attr('class', 'elementGroup')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
const axisGroup = svg
    .append('g')
    .attr('class', 'axisGroup');
const xAxisGroup = axisGroup
    .append("g")
    .attr("class", "xAxisGroup")
    .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`);
const yAxisGroup = axisGroup
    .append("g")
    .attr("class", "yAxisGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Escalas y Ejes
const x = d3
    .scaleBand()
    .range([0, width - margin.left - margin.right])
    .padding(0.1);
const y0 = d3
    .scaleLinear()
    .range([height - margin.top - margin.bottom, 0])
    .domain([15, 45]);
const y1 = d3
    .scaleLinear()
    .range([height - margin.top - margin.bottom, 0])
    .domain([15, 45]);
const xAxis = d3
    .axisBottom()
    .scale(x);
const yAxis = d3
    .axisLeft()
    .scale(y0);

// Carga de Datos y Creación de Visualización
d3.csv('data(2).csv').then(data => {
    // Preprocesamiento de Datos
    data.forEach(d => {
        d.name = d.name.replace(' ', '-');
        d.year = +d.year;
        d.age = +d.age;
    });

    // Configuración de Dominios y Ejes
    x.domain(data.map(d => d.year));
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // Creación de Barras
    const bars = elementGroup.selectAll('rect').data(data).enter().append('rect')
        .attr('class', d => `${d.name} bar`)
        .attr('x', d => x(d.year))
        .attr('y', d => y0(d.age))
        .attr('height', d => height - margin.top - margin.bottom - y0(d.age))
        .attr('width', x.bandwidth());

    // Líneas y Otros Elementos
    const line = d3.line().x(d => x(d.year)).y(d => y1(calculateAge(d.year)));
    elementGroup
        .datum(data)
        .append("path")
        .attr("id", "linea")
        .attr("d", line);
    elementGroup
        .append("line")
        .attr("x1", 0)
        .attr("x2", width - margin.left - margin.right)
        .attr("y1", y1(AGE_THRESHOLD))
        .attr("y2", y1(AGE_THRESHOLD))
        .attr('stroke', 'red')
        .attr('stroke-width', 2);
});
