const graphData = {
    nodes: [
        {
            id: "startLabel",
            name: "YOU",
            profileImageURL: "",
        },
        {
            id: "1",
            name: "Node 1",
            profileImageURL:
                "https://img.freepik.com/free-photo/lovely-pet-portrait-isolated_23-2149192347.jpg?size=626&ext=jpg&ga=GA1.2.1594008844.1695381318&semt=sph",
        },
        {
            id: "2",
            name: "Node 2",
            profileImageURL:
                "https://img.freepik.com/free-psd/beautiful-cat-portrait-isolated_23-2150186184.jpg?size=626&ext=jpg&ga=GA1.2.1594008844.1695381318&semt=sph",
        },
        {
            id: "3",
            name: "Node 3",
            profileImageURL:
                "https://img.freepik.com/free-photo/the-red-or-white-cat-i-on-white-studio_155003-13189.jpg?size=626&ext=jpg&ga=GA1.2.1594008844.1695381318&semt=sph",
        },
        {
            id: "4",
            name: "Node 4",
            profileImageURL:
                "https://img.freepik.com/free-photo/cute-cat-and-food-bowl_23-2149078312.jpg?size=626&ext=jpg&ga=GA1.2.1594008844.1695381318&semt=sph",
        },
        {
            id: "5",
            name: "Node 5",
            profileImageURL:
                "https://img.freepik.com/free-photo/adorable-kitty-looking-like-it-want-to-hunt_23-2149167099.jpg?size=626&ext=jpg&ga=GA1.2.1594008844.1695381318&semt=sph",
        },
        {
            id: "6",
            name: "Node 6",
            profileImageURL:
                "https://img.freepik.com/free-photo/view-of-adorable-looking-kitten_23-2150886264.jpg?size=626&ext=jpg&ga=GA1.2.1594008844.1695381318&semt=sph",
        },
        {
            id: "7",
            name: "Node 7",
            profileImageURL:
                "https://img.freepik.com/free-photo/cute-cat-relaxing-in-studio_23-2150692717.jpg?size=626&ext=jpg&ga=GA1.2.1594008844.1695381318&semt=sph",
        },
        {
            id: "endLabel",
            name: "TargetMemberID",
            profileImageURL: "",
        },
    ],
    links: [
        { source: "startLabel", target: "1" },
        { source: "1", target: "2" },
        { source: "2", target: "3" },
        { source: "3", target: "4" },
        { source: "4", target: "5" },
        { source: "5", target: "6" },
        { source: "6", target: "7" },
        { source: "7", target: "endLabel" },
    ],
    startId: "1",
    endId: "7",
};

export default graphData;
