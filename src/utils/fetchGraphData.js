import axios from "axios";

const fetchGraphData = async (apiUrl, endpoint, exampleData, setGraphData) => {
  if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
    // Use example data
    const formattedNodes = exampleData.nodes.map((node) => ({
      ...node,
      id: `${node.id}`,
      profileImageUrl: node.profileImageUrl || node.profileImageUrl,
      name: node.name || node.memberName,
    }));
    const formattedLinks = exampleData.links.map((link) => ({
      source: `${link.source}`,
      target: `${link.target}`,
    }));
    setGraphData({
      nodes: formattedNodes,
      links: formattedLinks,
    });
  } else {
    // Fetch data from API
    try {
      // const token = import.meta.env.VITE_API_TOKEN;
      const response = await axios.get(
        apiUrl + endpoint
        //   , {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      if (response.data.isSuccess) {
        const data = response.data.data;
        const formattedNodes = data.nodes.map((node) => ({
          ...node,
          id: `${node.id}`,
          profileImageUrl: node.profileImageUrl || node.profileImageUrl,
          name: node.name || node.memberName,
        }));
        const formattedLinks = data.links.map((link) => ({
          source: `${link.sourceId || link.source}`,
          target: `${link.targetId || link.target}`,
        }));
        setGraphData({
          nodes: formattedNodes,
          links: formattedLinks,
        });
      }
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
    }
  }
};

export default fetchGraphData;
