import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import.meta.env

const MemberBranchView = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { memberId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const treeId = queryParams.get("treeId");
    const svgRef = useRef();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // 이전에 클릭한 노드를 추적
    const lastClickedNodeRef = useRef(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const url = `${apiUrl}/trees/${treeId}/branchView?memberId=${memberId}`;
                const response = await axios.get(url);
                if (response.data.isSuccess) {
                    const data = response.data.data;
                    const formattedNodes = [
                        {
                            id: "startLabel",
                            name: "YOU",
                            profileImageURL: "",
                            group: 0,
                        },
                        ...data.nodes.map((node) => ({
                            ...node,
                            id: `${node.id}`,
                            profileImageURL: node.profileImageUrl,
                            name: node.memberName,
                            group: 1,
                        })),
                        {
                            id: "endLabel",
                            name: memberId,
                            profileImageURL: "",
                            group: 2,
                        },
                    ];
                    const formattedLinks = [
                        { source: "startLabel", target: `${data.startId}` },
                        ...data.links.map((link) => ({
                            source: `${link.sourceId}`,
                            target: `${link.targetId}`,
                        })),
                        { source: `${data.endId}`, target: "endLabel" },
                    ];
                    setGraphData({
                        nodes: formattedNodes,
                        links: formattedLinks,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch graph data:", error);
            }
        };

        fetchGraphData();
    }, []); 

    useEffect(() => {
        renderSvg();
    }, [graphData]); 
    
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [dimensions.width, dimensions.height]);
    

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
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} 
            ref={svgRef}
            style={{ width: "100vw", height: "100vh" }}
        ></svg>
    );
};

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
            .scaleExtent([1.0, 1.0]) // 확대/축소 비율
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
    // name 길이에 따라 사각형의 가로 길이를 결정하는 함수
    const calculateRectWidth = (name) => {
        const baseWidth = 30; // 기본 가로 길이
        const charWidth = 8; // 각 글자당 추가 가로 길이
        return baseWidth + name.length * charWidth;
    };

    const node = container
        .selectAll(".node")
        .data(graphData.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .on("click", (event, d) => {
            // 클릭한 노드가 이전에 클릭한 노드와 같은 경우
            if (d === lastClickedNodeRef.current) {
                // 모든 노드의 크기를 초기화
                container
                    .selectAll(".node circle")
                    .transition()
                    .duration(300)
                    .attr("r", 25);

                lastClickedNodeRef.current = null;
            } else {
                const distances = bfs(d);

                container
                    .selectAll(".node")
                    .select("circle")
                    .transition()
                    .duration(500)
                    .attr("r", (nodeData) => {
                        const distance = distances.get(nodeData) ?? Infinity;
                        let radius = 25; // 기본 크기 설정
                        if (distance <= 3) {
                            radius = [50, 40, 25, 25][distance];
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
        .attr("width", (d) => {
            // endLabel의 경우 name에 따라 가로 길이 동적 계산
            if (d.id === "endLabel") {
                return calculateRectWidth(d.name);
            }
            // startLabel 또는 기타 경우에는 고정된 길이 사용
            return d.id === "startLabel" ? 60 : 120;
        })
        .attr("height", 30)
        .attr("x", (d) => {
            // 가로 길이에 따라 x 위치 동적 조정 (가로 길이의 반만큼 x를 이동시켜 중앙 정렬)
            if (d.id === "endLabel") {
                return -calculateRectWidth(d.name) / 2;
            }
            return d.id === "startLabel" ? -30 : -60; // 예시값, 실제에 맞게 조정 필요
        })
        .attr("y", -15)
        .attr("rx", 15)
        .attr("ry", 15)
        .style("fill", "green");

    // 특정 노드에 텍스트 추가
node.each(function (d) {
    if (d.id === "startLabel" || d.id === "endLabel") {
        d3.select(this)
            .append("text")
            .attr("x", 0) // x 위치는 항상 중앙
            .attr("y", 0)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle") // 중앙 정렬
            .style("fill", "white")
            .text(function (d) {
                if (d.id === "startLabel") return "YOU";
                if (d.id === "endLabel") {
                    const endLabelNode = graphData.nodes.find(
                        (node) => node.id === "endLabel"
                    );
                    return endLabelNode ? endLabelNode.name : "TargetMemberID";
                }
            })
            .style("font-size", "12px");
    }
});


    return node;
};

const createPattern = (svg, graphData) => {
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

export default MemberBranchView;
