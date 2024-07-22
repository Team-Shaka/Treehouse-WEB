import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useParams } from "react-router-dom";
import.meta.env;
import treeData from "../exampleData/treeData";
import fetchGraphData from "../utils/fetchGraphData";
import {
  adjustViewOnSimulationEnd,
  bfs,
  createClipPath,
  createLink,
  createPattern,
  createSimulation,
  createSvg,
  handleResize,
  initializeDrag,
} from "../utils/graphUtils";
import { createNodeBase, resizeNodesOnClick } from "../utils/nodeUtils";
import { useMetaTag } from "../hooks/useMetaTag";
const defaultImageUrl = "/public/default_image.png";

const TreeBranchView = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { treeId } = useParams();
  const svgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const lastClickedNodeRef = useRef(null);
  useMetaTag("robots", "noindex, nofollow");

  useEffect(() => {
    fetchGraphData(
      apiUrl,
      `/treehouses/${treeId}/branches/complete`,
      treeData,
      setGraphData
    );
  }, [apiUrl, treeId]);

  useEffect(() => {
    if (graphData.nodes.length > 0) {
      renderSvg();
    }
  }, [graphData, dimensions]);

  useEffect(() => {
    const handleResizeEvent = () => handleResize(setDimensions);

    window.addEventListener("resize", handleResizeEvent);

    return () => {
      window.removeEventListener("resize", handleResizeEvent);
      document.body.style.overflow = "";
    };
  }, []);

  const renderSvg = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const { svg, container, zoom } = createSvg(svgRef, dimensions);
    const simulation = createSimulation(graphData, dimensions);
    const link = createLink(container, graphData);
    createPattern(svg, graphData, defaultImageUrl);
    createClipPath(svg, graphData);

    adjustViewOnSimulationEnd(simulation, svg, graphData, dimensions);

    const node = createNode(
      container,
      graphData,
      lastClickedNodeRef,
      bfs,
      svg,
      dimensions,
      zoom
    );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    node.call(initializeDrag(simulation));
  };

  return (
    <svg
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      ref={svgRef}
      style={{ width: "100vw", height: "100vh" }}
    ></svg>
  );
};

const createNode = (container, graphData, lastClickedNodeRef, bfs, svg) => {
  const node = createNodeBase(
    container,
    graphData,
    lastClickedNodeRef,
    svg,
    bfs
  );

  node.on("click", (event, d) =>
    resizeNodesOnClick(d, graphData, container, lastClickedNodeRef, bfs, svg)
  );

  return node;
};

export default TreeBranchView;
