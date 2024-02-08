import { Route, Routes } from "react-router-dom";
import TreeBranchView from "./pages/TreeBranchView";
import MemberBranchView from "./pages/MemberBranchView";

function App() {
    return (
        <Routes>
            <Route
                path="/branchView/tree/:treeId"
                element={<TreeBranchView />}
            />
            <Route
                path="/branchView/member/:memberId"
                element={<MemberBranchView />}
            />
        </Routes>
    );
}

export default App;
