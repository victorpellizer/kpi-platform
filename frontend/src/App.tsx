import { useState } from "react";
import { Dashboard } from "./pages/Dashboard";
import { Search } from "./pages/Search";
import { Publish } from "./pages/Publish";

function Mode({ mode }: { mode: "dashboard" | "search" | "publish" }) {
  switch (mode) {
    case "publish":
      return <Publish />;
    case "dashboard":
      return <Dashboard />;
    case "search":
      return <Search />;
  }
}

export default function App() {
  const [mode, setMode] = useState<"dashboard" | "search" | "publish">(
    "dashboard",
  );

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16 }}>
        <button
          onClick={() => setMode("dashboard")}
          disabled={mode === "dashboard"}
        >
          Dashboard
        </button>
        <button
          onClick={() => setMode("search")}
          disabled={mode === "search"}
          style={{ marginLeft: 8 }}
        >
          Search
        </button>
        <button
          onClick={() => setMode("publish")}
          disabled={mode === "publish"}
          style={{ marginLeft: 8 }}
        >
          Publish
        </button>
      </nav>

      <Mode mode={mode} />
    </div>
  );
}
