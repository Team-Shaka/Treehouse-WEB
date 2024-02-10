import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import graphData from "../data/memberData";

const handleResize = (setDimensions) => {
    setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
    });
};

const createSvg = (svgRef, dimensions) => {
    const svg = d3
        .select(svgRef.current)
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);
    const container = svg.append("g");

    svg.call(
        d3
            .zoom()
            .scaleExtent([0.5, 1.5]) // 확대/축소 비율
            .on("zoom", (event) => {
                container.attr("transform", event.transform);
            })
    );

    return { svg, container };
};

const createSimulation = (graphData, dimensions) => {
    return d3
        .forceSimulation(graphData.nodes)
        .alphaDecay(0.05) // alpha 값이 줄어드는 속도
        .force(
            "link",
            d3
                .forceLink(graphData.links)
                .id((d) => d.id)
                .distance((link) => {
                    const sourceGroup =
                        typeof link.source === "object"
                            ? link.source.group
                            : graphData.nodes.find(
                                  (node) => node.id === link.source
                              ).group;
                    const targetGroup =
                        typeof link.target === "object"
                            ? link.target.group
                            : graphData.nodes.find(
                                  (node) => node.id === link.target
                              ).group;
                    return sourceGroup === targetGroup ? 10 : 20; // 같은 그룹이면 50, 다르면 100
                })
        )
        .force("charge", d3.forceManyBody().strength(-30)) // 노드 간의 전하
        .force(
            "center",
            d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
        )
        .force("collide", d3.forceCollide(70))
        .force("x", d3.forceX(dimensions.height / 2).strength(0.7));
};

const createLink = (container, graphData) => {
    return container
        .selectAll(".link")
        .data(graphData.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#AEAEAE")
        .style("stroke-width", 1);
};

const createNode = (container, graphData, lastClickedNodeRef, svg, bfs) => {
    const node = container
        .selectAll(".node")
        .data(graphData.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .on("click", (event, d) => {
            if (d === lastClickedNodeRef.current) {
                node.select("circle").transition().duration(300).attr("r", 25);
                svg.selectAll(`clipPath circle`)
                    .transition()
                    .duration(300)
                    .attr("r", 25);
                lastClickedNodeRef.current = null;
            } else {
                const distances = bfs(d);

                node.select("circle")
                    .transition()
                    .duration(500)
                    .attr("r", (nodeData) => {
                        const distance = distances.get(nodeData);
                        let radius;
                        switch (distance) {
                            case 0:
                                radius = 90;
                                break;
                            case 1:
                                radius = 70;
                                break;
                            case 2:
                                radius = 50;
                                break;
                            case 3:
                                radius = 30;
                                break;
                            default:
                                radius = 10;
                                break;
                        }
                        svg.select(`#clip-${nodeData.id} circle`)
                            .transition()
                            .duration(300)
                            .attr("r", radius);
                        return radius;
                    });

                lastClickedNodeRef.current = d;
            }
        });

    // 일반 노드를 위한 원 추가
    node.filter((d) => d.id !== "startLabel" && d.id !== "endLabel")
        .append("circle")
        .attr("r", 25)
        .style("fill", (d) => `url(#pattern-${d.id})`)
        .attr("clip-path", (d) => `url(#clip-${d.id})`);

    // 특정 노드(startLabel, endLabel)를 위한 사각형 추가
    node.filter((d) => d.id === "startLabel" || d.id === "endLabel")
        .append("rect")
        .attr("width", (d) => (d.id === "startLabel" ? 60 : 120)) // 조건에 따른 가로 길이 설정
        .attr("height", 30)
        .attr("x", -30)
        .attr("y", -15)
        .attr("rx", 15)
        .attr("ry", 15)
        .style("fill", "green");

    // 특정 노드에 텍스트 추가
    node.each(function (d) {
        if (d.id === "startLabel" || d.id === "endLabel") {
            d3.select(this)
                .append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("dx", d.id === "startLabel" ? "0em" : "2.5em")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .text(function (d) {
                    if (d.id === "startLabel") return "YOU";
                    if (d.id === "endLabel") {
                        const endLabelNode = graphData.nodes.find(
                            (node) => node.id === "endLabel"
                        );
                        return endLabelNode
                            ? endLabelNode.name
                            : "TargetMemberID";
                    }
                })
                .style("font-size", "12px");
        }
    });

    return node;
};

const createPattern = (svg, graphData) => {
    // 패턴을 위한 defs 정의
    svg.append("defs")
        .selectAll("pattern")
        .data(graphData.nodes)
        .enter()
        .append("pattern")
        .attr("id", (d) => `pattern-${d.id}`)
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("xlink:href", (d) => d.profileImageURL)
        .attr("width", 1)
        .attr("height", 1)
        .attr("preserveAspectRatio", "xMidYMid slice");
};

const createClipPath = (svg, graphData) => {
    // 클립 패스를 위한 defs 정의
    svg.append("defs")
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

const MemberBranchView = () => {
    const svgRef = useRef();
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // 이전에 클릭한 노드를 추적
    const lastClickedNodeRef = useRef(null);

    useEffect(() => {
        const handleLoad = () => {
            renderSvg();
        };

        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
    }, []);

    const renderSvg = () => {
        if (!svgRef.current) return;

        d3.select(svgRef.current).selectAll("*").remove();

        const { svg, container } = createSvg(svgRef, dimensions);
        const simulation = createSimulation(graphData, dimensions);
        const link = createLink(container, graphData);
        const node = createNode(
            container,
            graphData,
            lastClickedNodeRef,
            svg,
            bfs
        );
        createPattern(svg, graphData);
        createClipPath(svg, graphData);

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

        // 인접 리스트
        const adjacencyList = new Map();
        graphData.nodes.forEach((node) => adjacencyList.set(node, []));
        graphData.links.forEach((link) => {
            adjacencyList.get(link.source).push(link.target);
            adjacencyList.get(link.target).push(link.source);
        });

        // 너비 우선 탐색(BFS) 알고리즘 정의
        function bfs(start) {
            const distances = new Map(
                graphData.nodes.map((node) => [node, Infinity])
            );
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
        }

        simulation.on("tick", () => {
            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
        });

        function drag(simulation) {
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
        }

        node.call(drag(simulation));
    };

    useEffect(() => {
        renderSvg();
        document.body.style.overflow = "hidden";

        window.addEventListener("resize", () => handleResize(setDimensions));
        return () =>
            window.removeEventListener("resize", () =>
                handleResize(setDimensions)
            );
    }, [dimensions.width, dimensions.height]);

    return (
        <svg
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} // 동적으로 viewBox 설정
            ref={svgRef}
            style={{ width: "100vw", height: "100vh" }}
        ></svg>
    );
};

export default MemberBranchView;
