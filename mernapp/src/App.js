import "./App.css";
import Home from "../src/components/Home";
import Footer from "../src/components/Footer";
import Navbar from "../src/components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Payment from "./components/Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./components/Orders";

const promise = loadStripe(
  "pk_test_51OpsB4SBT28mnxWh64EL7LxxPbb5KIylTn5PoG0AT9FUfR9mPL7Jd6WeyarDXVCpE08itdvThSP9rrWMprcmuahj00pX9nmLWq"
);
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/payment"
            element={
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            }
          />
          <Route path="/orders" element={<Orders />}/>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
