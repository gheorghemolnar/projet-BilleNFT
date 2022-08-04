import { EthProvider } from "./contexts/EthContext";
// import Demo from "./components/Demo";
import Navbar from "./components/Navbar";
import Listing from "./components/Listing";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <EthProvider>
          <Navbar />
          {/* <Demo /> */}
          <Listing />
          <hr />
          <hr />
          <Footer />
    </EthProvider>
  );
}

export default App;
