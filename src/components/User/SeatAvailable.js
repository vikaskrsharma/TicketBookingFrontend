import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader";

const SeatAvailable = ({ }) => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const seatAvailableApi = `https://xwcotwaezwozognivffa4mmg2y0rbasv.lambda-url.us-east-1.on.aws/availability/${matchId}`;

    const [seatAvailable, setSeatAvailable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookedSeat, setBookedSeat] = useState([]);

    const handelDelete = async (id) => {
        console.log("id : -", id);
        setIsLoading(true);
        try {
            const response = await fetch(seatAvailableApi.concat("/") + id, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
            setSeatAvailable(seatAvailable.filter((item) => item.id !== id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookingConfirm = async () => {
        const payload = {
            match_id: Number(matchId),
            seat_ids: bookedSeat,
        }
        const response = await axios.post("https://xwcotwaezwozognivffa4mmg2y0rbasv.lambda-url.us-east-1.on.aws/book_seats", payload, { headers: { 'Content-Type': 'application/json' } });
        console.log(response);

        if (response.data === 'success' && response.status === 201) {
            navigate("/booked-seats");
        } else {
            console.log(`error: ${response.data}`);
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        axios
            .get(seatAvailableApi)
            .then((res) => {
                setSeatAvailable(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleAddClick = (seatId) => {
        if (bookedSeat.includes(seatId)) {
            const newBookedSeats = bookedSeat.filter(seat => seat !== seatId)
            setBookedSeat(newBookedSeats);
        } else {
            const newBookedSeats = bookedSeat.concat(seatId);
            setBookedSeat(newBookedSeats);
        }
    }


    if (seatAvailable.length < 0) {
        return <h1>no Matches found</h1>;
    } else {
        return (
            <div className="mt-5">
                {isLoading && <Loader />}
                {error && <p>Error: {error}</p>}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>SeatId</th>
                            <th>StadiumId</th>
                            <th>MatchId</th>
                            <th>Stand name</th>
                            <th>Seat Number</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seatAvailable?.map((item, i) => {
                            const { seat_id, stadium_id, match_id, stand_name, seat_number } = item;
                            return (
                                <tr key={i + 1}>
                                    <td>{seat_id}</td>
                                    <td>{stadium_id}</td>
                                    <td>{match_id}</td>
                                    <td>{stand_name}</td>
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
                                        <div role="button" onClick={() => handleAddClick(seat_id)}>
                                            {bookedSeat.includes(seat_id) ? <i className="fa fa-plus-square" aria-hidden="true"></i> : <i className="fa fa-plus-square-o" aria-hidden="true"></i>}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div>
                    <h2>Selected Seats</h2>
                    <div>
                        {bookedSeat.map(seat => <div>{seat}</div>)}
                    </div>
                    <button onClick={handleBookingConfirm}>Confirm Booking</button>
                </div>
            </div>
        );
    }
};

export default SeatAvailable;
