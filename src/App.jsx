
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Join from "./pages/Join";
import User from "./pages/User";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Reservation from './pages/Reservation';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';
import PaymentFail from './pages/payment/PaymentFail';
import Movies from './pages/Movies';
import MovieAdmin from "./pages/MovieAdmin";
import "./components/css/global.css";
import "./components/font/gfont.css";
import "./components/css/reservation.css"
import "./components/css/paymentSuccess.css"
import CreateMovie from './pages/CreateMovie';
import UpdateMovie from './pages/UpdateMovie';

import "./components/css/movies.css";
import "./components/css/MovieAdmin.css";

import MovieDetailForm from './components/Movie/MovieDetailForm';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:movieId" element={<MovieDetailForm />} />
          <Route path="/movies/create" element={<CreateMovie />} />
          <Route path="/movies/update/:movieId" element={<UpdateMovie />} />
          <Route path="/movieAdmin" element={<MovieAdmin />} />

          <Route path="/mypage" element={<User />} /> 

          <Route path="/adminpage" element={<Admin />} /> 
        </Routes>
    </Router>
  );
}

export default App;
