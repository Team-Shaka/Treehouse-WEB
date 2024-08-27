import axios from "axios";

axios.interceptors.request.use((request) => {
  console.log("Starting Request", JSON.stringify(request, null, 2));
  console.log("Request Headers:", JSON.stringify(request.headers, null, 2));
  return request;
});

axios.interceptors.response.use((response) => {
  console.log("Response:", JSON.stringify(response, null, 2));
  return response;
});

const fetchGraphData = async (
  apiUrl,
  endpoint,
  exampleData,
  setGraphData,
  token
) => {
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
      if (!token) {
        throw new Error(
          "Token not provided. Please ensure token is passed when calling fetchGraphData."
        );
      }

      console.log("Proceeding with API call");
      const response = await axios.get(apiUrl + endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log(
        "Response Headers:",
        JSON.stringify(response.headers, null, 2)
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
      if (error.response) {
        console.log("Error Response Status:", error.response.status);
        console.log(
          "Error Response Data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.log(
          "Error Response Headers:",
          JSON.stringify(error.response.headers, null, 2)
        );
        if (error.response.status === 401) {
          alert("인증 토큰이 유효하지 않습니다. 다시 로그인해 주세요.");
        }
      }
    }
  }
};

export default fetchGraphData;
