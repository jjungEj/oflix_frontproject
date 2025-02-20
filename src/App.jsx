
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Join from "./pages/Join";
import User from "./pages/User";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Reservation from './pages/Reservation';
import PaymentSuccess from './pages/PaymentSuccess';
import Header from './components/Header/Header';
import "./components/css/global.css";
import "./components/font/gfont.css";
import "./components/css/reservation.css"
import "./components/css/paymentSuccess.css"

import MovieDetailForm from './components/Movie/MovieDetailForm';
import LoginContextProvider from "./contexts/LoginContextProvider";

function App() {
  return (
    <Router>
      <LoginContextProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/movie/:movieId" element={<MovieDetailForm />} />

          <Route path="/user" element={<User />}>
            <Route path="mypage" element={<User />} /> {/* 상대 경로 사용 */}
          </Route>

          <Route path="/admin" element={<Admin />}>
            <Route path="adminpage" element={<Admin />} /> {/* 상대 경로 사용 */}
          </Route>
        </Routes>
      </LoginContextProvider>
    </Router>
  );
}

export default App;
