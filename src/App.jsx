import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const TreeBranchView = lazy(() => import("./pages/TreeBranchView"));
const MemberBranchView = lazy(() => import("./pages/MemberBranchView"));
const LandingPage = lazy(() => import("./pages/LandingPage"));

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-tree_green"></div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route
        path="/branchView/tree/:treeId"
        element={
          <Suspense fallback={<Loading />}>
            <TreeBranchView />
          </Suspense>
        }
      />
      <Route
        path="/branchView/member/:treeId"
        element={
          <Suspense fallback={<Loading />}>
            <MemberBranchView />
          </Suspense>
        }
      />
      <Route
        path="/"
        element={
          <Suspense fallback={<Loading />}>
            <LandingPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
