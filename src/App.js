import "./App.css";
import CreateUser from "./components/User/CreateUser";
import ShowMatches from "./components/User/ShowMatches";
import { Route, Routes } from "react-router-dom";
import EditUser from "./components/User/EditUser";
import User from "./components/User/User";
import Header from "./components/Common/Header";
import Home from "./components/Layout/Home";
import SeatAvailable from "./components/User/SeatAvailable";
import BookedSeats from "./components/User/BookedSeats";
import { useState } from 'react';
import { MyContext } from './MyContext';
function App() {
  const [loggedInuser, setLoggedInUser] = useState("");
  return (
    <div className="App">
      <MyContext.Provider value={{ loggedInuser, setLoggedInUser }}>
        <header className="container">
          <div className="">
            <Header />
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              <Route path="/user/:id" element={<User />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/matches" element={<ShowMatches />} />
              <Route path="/seat-available/:matchId" element={<SeatAvailable />} />
              <Route path="/booked-seats" element={<BookedSeats />} />
            </Routes>

          </div>
        </header>
      </MyContext.Provider>
    </div>
  );
}

export default App;
