import * as d3 from "d3";

export const handleResize = (setDimensions) => {
  setDimensions({
    width: window.innerWidth,
    height: window.innerHeight,
  });
};

export const createSvg = (svgRef, dimensions) => {
  const svg = d3
    .select(svgRef.current)
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);
  const container = svg.append("g");

  const zoom = d3
    .zoom()
    .scaleExtent([1.0, 1.0])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    });

  svg.call(zoom);

  return { svg, container, zoom };
};

export const createSimulation = (graphData, dimensions) => {
  return d3
    .forceSimulation(graphData.nodes)
    .alphaDecay(0.05)
    .force(
      "link",
      d3
        .forceLink(graphData.links)
        .id((d) => d.id)
        .distance(20)
    )
    .force("charge", d3.forceManyBody().strength(-30))
    .force(
      "center",
      d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
    )
    .force("collide", d3.forceCollide(70));
};

export const createLink = (container, graphData) => {
  return container
    .selectAll(".link")
    .data(graphData.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "#AEAEAE")
    .style("stroke-width", 1);
};

export const createPattern = (svg, graphData, defaultImageUrl) => {
  svg
    .append("defs")
    .selectAll("pattern")
    .data(graphData.nodes)
    .enter()
    .append("pattern")
    .attr("id", (d) => `pattern-${d.id}`)
    .attr("width", 1)
    .attr("height", 1)
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("xlink:href", (d) => d.profileImageUrl || defaultImageUrl)
    .attr("width", 1)
    .attr("height", 1)
    .attr("preserveAspectRatio", "xMidYMid slice");
};

export const createClipPath = (svg, graphData) => {
  svg
    .append("defs")
    .selectAll("clipPath")
    .data(graphData.nodes)
    .enter()
    .append("clipPath")
    .attr("id", (d) => `clip-${d.id}`)
    .append("circle")
    .attr("r", 25)
    .attr("cx", 0)
    .attr("cy", 0);
};

export const bfs = (graphData, start) => {
  const adjacencyList = new Map();
  graphData.nodes.forEach((node) => adjacencyList.set(node, []));
  graphData.links.forEach((link) => {
    adjacencyList.get(link.source).push(link.target);
    adjacencyList.get(link.target).push(link.source);
  });

  const distances = new Map(graphData.nodes.map((node) => [node, Infinity]));
  distances.set(start, 0);

  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift();
    const distance = distances.get(node);

    adjacencyList.get(node).forEach((neighbor) => {
      if (distances.get(neighbor) === Infinity) {
        distances.set(neighbor, distance + 1);
        queue.push(neighbor);
      }
    });
  }

  return distances;
};

export const initializeDrag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

export const adjustViewOnSimulationEnd = (
  simulation,
  svg,
  graphData,
  dimensions
) => {
  simulation.on("end", () => {
    const xValues = graphData.nodes.map((node) => node.x);
    const yValues = graphData.nodes.map((node) => node.y);
    const [xMin, xMax] = d3.extent(xValues);
    const [yMin, yMax] = d3.extent(yValues);

    const xRatio = dimensions.width / (xMax - xMin);
    const yRatio = dimensions.height / (yMax - yMin);
    const zoomRatio = Math.min(xRatio, yRatio) * 0.9;

    const centerX = (xMax + xMin) / 2;
    const centerY = (yMax + yMin) / 2;

    const transform = d3.zoomIdentity
      .translate(dimensions.width / 2, dimensions.height / 2)
      .scale(zoomRatio)
      .translate(-centerX, -centerY);

    svg.call(d3.zoom().transform, transform);
  });
};
