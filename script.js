// Load CSV data
d3.csv('boston_311_2023_by_reason.csv').then(data => {
    // Process the data
    data.forEach(d => {
        d.Count = +d.Count; // Convert Count to a number
    });

    // Sort the data by Count in descending order
    data.sort((a, b) => b.Count - a.Count);

    // Take only the top 10 types
    const top10Data = data.slice(0, 10);

    // Set up SVG container
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 80, right: 40, bottom: 120, left: 200 }; // Adjusted bottom margin for footnotes
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('#chart_311')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add headline
    d3.select('#chart_311')
        .insert('h1', ':first-child')
        .text('Top 10 Reasons for 311 Calls in Boston (2023)')
        .style('text-align', 'center')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '24px')
        .style('color', '#333');

    // Add subheadline
    d3.select('#chart_311')
        .insert('p', ':nth-child(2)')
        .text('A breakdown of the most common issues reported by residents')
        .style('text-align', 'center')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '16px')
        .style('color', '#666');

    // Create scales
    const yScale = d3.scaleBand()
        .domain(top10Data.map(d => d.reason))
        .range([0, height])
        .padding(0.2);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(top10Data, d => d.Count)])
        .range([0, width]);

    // Create bars
    svg.selectAll('rect')
        .data(top10Data)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', d => yScale(d.reason))
        .attr('width', d => xScale(d.Count))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#4CAF50') // Custom color for bars
        .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', '#FF5722'); // Change color on hover
        })
        .on('mouseout', function () {
            d3.select(this).attr('fill', '#4CAF50'); // Revert color on mouseout
        });

    // Add axes
    svg.append('g')
        .call(d3.axisLeft(yScale).tickSize(0).tickPadding(10))
        .selectAll('text')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '14px')
        .style('color', '#333');

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).ticks(5).tickSize(0).tickPadding(10))
        .selectAll('text')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '14px')
        .style('color', '#333');

    // Add axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 40)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '16px')
        .style('color', '#333')
        .text('Number of Calls');

    svg.append('text')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 20)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '16px')
        .style('color', '#333')
        .text('Reason for Call');

    // Add footnotes
    d3.select('#chart_311')
        .append('p')
        .text('Data Source: City of Boston 311 Service Requests')
        .style('text-align', 'center')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '12px')
        .style('color', '#999')
        .style('margin-top', '20px');

    d3.select('#chart_311')
        .append('p')
        .text('Chart by GitHub Copilot')
        .style('text-align', 'center')
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '12px')
        .style('color', '#999');
});