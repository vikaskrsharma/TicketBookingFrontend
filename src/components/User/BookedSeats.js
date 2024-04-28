import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader";
import { MyContext } from '../../MyContext';

const BookedSeats = ({ }) => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { loggedInuser, setLoggedInUser } = useContext(MyContext);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const seatAvailableApi = `https://o7mhxjfsxywgbwf7wkxhsrjg7m0ociul.lambda-url.us-east-1.on.aws/get_bookings?user_id=${loggedInuser}`;
    const loginApi = "https://o7mhxjfsxywgbwf7wkxhsrjg7m0ociul.lambda-url.us-east-1.on.aws/login_user";

    useEffect(() => {
        getBookedSeats();
    }, []);

    const handleLoginClick = () => {
        axios
            .get(loginApi)
            .then((res) => {
                if (res.data.user_id) {
                    setLoggedInUser(res.data.user_id);
                    setIsLoggedIn(true)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getBookedSeats = () => {
        if (loggedInuser) {
            axios
                .get(seatAvailableApi)
                .then((res) => {
                    setBookedSeats(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    };

    if (!loggedInuser) {
        return <div className="loginBlock" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            <h1>Please Login to View Your Bookings</h1>
            <button onClick={handleLoginClick} style={{ padding: '5px 15px', color: 'white', borderRadius: '10px', background: '#2980b9' }}>Login</button>
        </div>
    }

    if (bookedSeats.length < 0) {
        return <h1>no Matches found</h1>;
    } else {
        return (
            <div className="mt-5">
                {isLoading && <Loader />}
                {error && <p>Error: {error}</p>}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Booking Id</th>
                            <th>Match Data</th>
                            <th>Match Time</th>
                            <th>Match Name</th>
                            <th>Stadium Name</th>
                            <th>Stand And Seat</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookedSeats?.map((item, i) => {
                            const { booking_number, match_date, match_time, match_name, stadium_name, stand_name, seat_number } = item;
                            return (
                                <tr key={i + 1}>
                                    <td>{booking_number}</td>
                                    <td>{match_date}</td>
                                    <td>{match_time}</td>
                                    <td>{match_name}</td>
                                    <td>{stadium_name}</td>
                                    <td>{`${stand_name} (${seat_number})`}</td>
                                    <td>{seat_number}</td>
                                    <td>
                                        {/* <Link to={`/edit-user/${item.id}`}>
                                            <i className="fa fa-pencil" aria-hidden="true"></i>
                                        </Link> */}
                                        {/* <Link to={`/user/${item.id}`}>
                                            <i className="fa fa-eye" aria-hidden="true"></i>
                                        </Link> */}

                                        {/* <i
                                            className="fa fa-trash-o"
                                            aria-hidden="true"
                                            onClick={() => handelDelete(item.id)}
                                        ></i> */}
                                        {/* <div role="button" onClick={() => handleAddClick(seat_id)}>
                                            {bookedSeat.includes(seat_id) ? <i className="fa fa-plus-square" aria-hidden="true"></i> : <i className="fa fa-plus-square-o" aria-hidden="true"></i>}
                                        </div> */}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default BookedSeats;
