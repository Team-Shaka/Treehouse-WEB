import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useLocation, useParams } from "react-router-dom";
import.meta.env;
import fetchGraphData from "../utils/fetchGraphData";
import memberData from "../exampleData/memberData";
import {
  createClipPath,
  createLink,
  createPattern,
  createSimulation,
  createSvg,
  handleResize,
  initializeDrag,
} from "../utils/graphUtils";
import { createNodeWithLabels } from "../utils/nodeUtils";

const defaultImageUrl = "/default_image.png";

const MemberBranchView = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { treeId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sourceMemberId = queryParams.get("sourceMemberId");
  const targetMemberId = queryParams.get("targetMemberId");
  const token = queryParams.get("token");
  const svgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const lastClickedNodeRef = useRef(null);

  useEffect(() => {
    fetchGraphData(
      token,
      apiUrl,
      `/treehouses/${treeId}/branches?sourceMemberId=${sourceMemberId}&targetMemberId=${targetMemberId}`,
      memberData,
      setGraphData,
      token
    );
  }, [apiUrl, treeId, token, sourceMemberId, targetMemberId]);

  useEffect(() => {
    if (graphData.nodes.length > 0) {
      renderSvg();
    }
  }, [graphData, dimensions]);

  const renderSvg = () => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const { svg, container } = createSvg(svgRef, dimensions);
    const simulation = createSimulation(graphData, dimensions);
    const link = createLink(container, graphData);
    const node = createNodeWithLabels(
      container,
      graphData,
      lastClickedNodeRef,
      svg
    );
    createPattern(svg, graphData, defaultImageUrl);
    createClipPath(svg, graphData);

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

  useEffect(() => {
    const handleResizeEvent = () => handleResize(setDimensions);

    window.addEventListener("resize", handleResizeEvent);

    return () => {
      window.removeEventListener("resize", handleResizeEvent);
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <svg
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      ref={svgRef}
      style={{ width: "100vw", height: "100vh", backgroundColor: "#FDFDFD" }}
    ></svg>
  );
};

export default MemberBranchView;
