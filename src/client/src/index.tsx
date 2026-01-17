import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

async function setup() {
    const container = document.getElementById("container")!;
    const root = createRoot(container);
    root.render(<App />);
}

setup();
