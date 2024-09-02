import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useLocation, useParams } from "react-router-dom";
import.meta.env;
import fetchGraphData from "../utils/fetchGraphData";
import memberData from "../exampleData/memberData";
import {
  adjustViewOnSimulationEnd,
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

window.receiveToken = function (receivedToken) {
  console.log("Token received from iOS");
  window.tokenReceived = receivedToken;
  window.dispatchEvent(
    new CustomEvent("tokenReceived", { detail: receivedToken })
  );
};

const MemberBranchView = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { memberId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treeId = queryParams.get("treeId");
  const svgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [token, setToken] = useState(window.tokenReceived || null);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const lastClickedNodeRef = useRef(null);

  useEffect(() => {
    console.log("Setting up token received event listener");
    const handleTokenReceived = (event) => {
      console.log("Token received event triggered:", event.detail);
      setToken(event.detail);
    };

    window.addEventListener("tokenReceived", handleTokenReceived);

    return () => {
      console.log("Cleaning up token received event listener");
      window.removeEventListener("tokenReceived", handleTokenReceived);
    };
  }, []);

  useEffect(() => {
    if (token) {
      console.log("Token is available. Preparing to fetch data...");
      fetchGraphData(
        apiUrl,
        `/treehouses/${treeId}/branches?targetMemberId=${memberId}`,
        memberData,
        setGraphData,
        token
      );
    } else {
      console.log("Waiting for token. Data fetch delayed.");
    }
  }, [apiUrl, treeId, memberId, token]);

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

    adjustViewOnSimulationEnd(simulation, svg, graphData, dimensions);

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
      style={{ width: "100vw", height: "100vh" }}
    ></svg>
  );
};

export default MemberBranchView;
