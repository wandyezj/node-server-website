import React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

/**
 * The top level application component.
 */
export function App() {
    return (
        <FluentProvider theme={webLightTheme}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <h1>Welcome to the Node Server Website</h1>
                
            </div>
        </FluentProvider>
    );
}
