const w = 1200;
const h = 600;
const padding = 60;

const dataLegend = [
   {color: 'steelblue', label: 'No doping allegations'},
   {color: 'orange', label: 'Riders with doping allegations'}
]

const svg = d3.select('#chart')
              .append('svg')
              .attr('width', w)
              .attr('height', h)
              .style('background-color', 'white')

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
   .then(res => res.json())
   .then(data => {
      const dataset = data;
      
      dataset.forEach(d => {
         const [m, s] = d.Time.split(':').map(Number);
         d.parsedTime = new Date(1970, 0, 1, 0, m, s)
      })
   
   const xScale = d3.scaleLinear().domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1)]).range([padding, w - padding]);
   const yScale = d3.scaleTime().domain(d3.extent(dataset, d => d.parsedTime)).range([padding, h - padding]);
   const tooltip = d3.select('body')
                     .append('g')
                     .attr('id', 'tooltip')
   svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.parsedTime))
      .attr('r', 5)
      .attr('fill', d => d.Doping ? 'steelblue' : 'orange')
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => d.parsedTime)
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
         tooltip.transition().style('opacity', 1)
         tooltip.html(
            `
            <p>${d.Name}: ${d.Nationality}</p>
            <p>Year: ${d.Year}, Time: ${d.Time}</p>
            <p>${d.Doping}</p>
            `
         )
         .style("left", event.pageX + 10 + 'px')
         .style('top', event.pageY - 28 + 'px') 
         .style('background-color', d.Doping ? 'steelblue' : 'orange')
         .attr('data-year', d.Year)
      })
      .on('mouseout', () => {
         tooltip.transition().style('opacity', 0)
      })



   const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
      svg.append('g')
         .attr('transform', `translate(0, ${h - padding})`)
         .call(xAxis)
         .attr('id', 'x-axis')

   const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
      svg.append('g')
         .attr('transform', `translate(${padding}, 0)`)
         .call(yAxis)    
         .attr('id', 'y-axis')

    const legend = svg.selectAll('.legend')
         .data(dataLegend)
         .enter()
         .append('g')
         .attr('id', 'legend')
         .attr('transform', (d, i) => `translate(950, ${100 + i * 30})`);
        
      
        legend.append('rect')
          .attr('width', 25)
          .attr('height', 25)
          .attr('fill', d => d.color);
        
        
        legend.append('text')
          .attr('x', 35) // 
          .attr('y', 17) // 
          .text(d => d.label)
          .attr('font-size', '15px')
          .attr('fill', 'black');
   
    svg.append('text')
       .attr('transform', `rotate(-90)`)
       .attr('x', -h / 3)
       .attr('y', 15)
       .text('Time in Minutes')
       .attr('font-size', 'px')
         
      
   })              