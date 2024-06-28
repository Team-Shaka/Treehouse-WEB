export const createNodeBase = (container, graphData) => {
  const node = container
    .selectAll(".node")
    .data(graphData.nodes)
    .enter()
    .append("g")
    .attr("class", "node");

  node
    .append("circle")
    .attr("r", 25)
    .style("fill", (d) => `url(#pattern-${d.id})`)
    .attr("clip-path", (d) => `url(#clip-${d.id})`);

  return node;
};

export const createNodeWithLabels = (
  container,
  graphData,
  lastClickedNodeRef,
  svg,
  bfs
) => {
  const node = createNodeBase(
    container,
    graphData,
    lastClickedNodeRef,
    svg,
    bfs
  );

  // 문자열의 가로 길이를 측정하는 함수
  const getTextWidth = (text, font) => {
    // 임시로 텍스트 요소를 만들어 가로 길이를 측정
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  };

  // name 길이에 따라 사각형의 가로 길이를 결정하는 함수
  const calculateRectWidth = (name) => {
    const font = "12px Inter"; // 측정에 사용할 글꼴 설정
    const textWidth = getTextWidth(name, font); // 문자열의 실제 가로 길이 측정
    return textWidth + 30;
  };

  // 첫 번째 노드와 마지막 노드에 이름표 텍스트 추가
  if (graphData.nodes.length > 0) {
    const startNodeId = graphData.nodes[0].id;
    const endNodeId = graphData.nodes[graphData.nodes.length - 1].id;

    const labels = node
      .filter((d) => d.id === startNodeId || d.id === endNodeId)
      .append("g")
      .attr("class", "label")
      .attr("transform", "translate(0, 50)"); // 이름표 위치 조정

    labels
      .append("rect")
      .attr(
        "x",
        (d) => -calculateRectWidth(d.id === startNodeId ? "YOU" : d.name) / 2
      )
      .attr("y", -15)
      .attr("width", (d) =>
        calculateRectWidth(d.id === startNodeId ? "YOU" : d.name)
      )
      .attr("height", 30)
      .attr("rx", 15)
      .attr("ry", 15)
      .style("fill", (d) => (d.id === startNodeId ? "black" : "green"));

    labels
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .text((d) => {
        if (d.id === startNodeId) {
          return "YOU";
        }
        if (d.id === endNodeId) {
          const endNode = graphData.nodes.find((node) => node.id === endNodeId);
          return endNode ? endNode.name : "TargetMemberID";
        }
      })
      .style("font-size", "12px");
  }

  return node;
};

export const resizeNodesOnClick = (
  d,
  graphData,
  container,
  lastClickedNodeRef,
  bfs,
  svg
) => {
  // 클릭한 노드가 이전에 클릭한 노드와 같은 경우
  if (d === lastClickedNodeRef.current) {
    // 모든 노드의 크기를 초기화
    resetNodeSizes(container);
    lastClickedNodeRef.current = null;
  } else {
    const distances = bfs(graphData, d);
    // 클릭한 노드로부터의 거리에 따라 노드의 크기를 변경
    updateNodeSizes(d, graphData, container, svg, bfs);
    lastClickedNodeRef.current = d;
  }
};

const resetNodeSizes = (container) => {
  container.selectAll(".node circle").transition().duration(300).attr("r", 25);
};

const updateNodeSizes = (d, graphData, container, svg, bfs) => {
  const distances = bfs(graphData, d);

  container
    .selectAll(".node")
    .select("circle")
    .transition()
    .duration(500)
    .attr("r", (nodeData) => {
      const distance = distances.get(nodeData) ?? Infinity;
      let radius = 25;
      if (distance <= 3) {
        radius = [50, 40, 25, 25][distance];
      }
      svg
        .select(`#clip-${nodeData.id} circle`)
        .transition()
        .duration(300)
        .attr("r", radius);
      return radius;
    });
};
