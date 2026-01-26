import "./index.css";

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { CubeProvider } from "@cubejs-client/react"
import { cubeApi } from "./lib/cube.ts"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CubeProvider cubeApi={cubeApi}>
			<App />
		</CubeProvider>
	</StrictMode>,
)
