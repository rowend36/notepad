import { Router } from "preact-router";
import styles from "./app.module.css";
import Header from "./app_header";
import { AppProvider } from "../logic/app_data";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
const App = () => (
  <AppProvider>
    <div id={styles.app}>
      <Header />
      <main>
        <Router>
          <Home path="/" />
        </Router>
      </main>
    </div>
  </AppProvider>
);

export default App;
