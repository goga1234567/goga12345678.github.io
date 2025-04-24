import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set title
document.title = "Defense-O-Rama: The Satirical Accusations Platform";

createRoot(document.getElementById("root")!).render(<App />);
