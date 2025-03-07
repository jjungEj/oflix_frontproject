
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Home from "./pages/Home";
import Admin from "./components/Admin/UsermanagementForm";
import Reservation from './pages/Reservation';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import PaymentFail from './pages/PaymentFail';
import Movies from './pages/Movies';

import "./components/css/global.css";
import "./components/font/gfont.css";
import "./components/css/reservation.css"
import "./components/css/paymentSuccess.css"
import "./components/css/MyReservation.css"
import CreateMovie from './pages/CreateMovie';
import UpdateMovie from './pages/UpdateMovie';

import "./components/css/movies.css";
import "./components/css/MovieAdmin.css";

import MovieDetailForm from './components/Movie/MovieDetailForm';
import Usermanagement from "./pages/Usermanagement";
import Moviemanagement from "./pages/Moviemanagement";
import FindId from "./pages/FindId";
import ResetPassword from "./pages/ResetPassword";
import UserMyPage from "./pages/UserMyPage";
import MovieTicketApp from "./pages/MovieTicketApp";

import CreateMovieSchedule from "./pages/CreateMovieSchedule.jsx";
import MovieScheduleManagement from "./pages/MovieScheduleManagement.jsx";


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
          <Route path="/admin/moviemanagement" element={<Moviemanagement />} />
          <Route path="/admin/usermanagement" element={<Usermanagement />} />
          <Route path="/find/find-username" element={<FindId />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/mypage" element={<UserMyPage />} /> 

          <Route path="/adminpage" element={<Admin />} />

          <Route path="/createMovieSchedule" element={<CreateMovieSchedule />} /> 
          <Route path="/admin/theaters" element={<MovieScheduleManagement />} /> 

          <Route path="/theaters" element={<MovieTicketApp />} />
        </Routes>
    </Router>
  );
}

export default App;
