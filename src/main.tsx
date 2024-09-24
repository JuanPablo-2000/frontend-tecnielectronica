import ReactDOM from "react-dom/client";

// import { BrowserRouter } from "react-router-dom";
import Main from "./routes/Main";

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <Main />
);

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <Main />
// )
