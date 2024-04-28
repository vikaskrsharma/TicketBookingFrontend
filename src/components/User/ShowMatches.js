import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../Common/Loader";
import { MyContext } from '../../MyContext';

const ShowMatches = () => {
  const showMatchesApi = "https://xwcotwaezwozognivffa4mmg2y0rbasv.lambda-url.us-east-1.on.aws/matches";
  const { loggedInuser, setLoggedInUser } = useContext(MyContext);
  console.log(loggedInuser);

  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handelDelete = async (id) => {
    console.log("id : -", id);
    setIsLoading(true);
    try {
      const response = await fetch(showMatchesApi.concat("/") + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      setUser(user.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    axios
      .get(showMatchesApi)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (user.length < 0) {
    return <h1>no Matches found</h1>;
  } else {
    return (
      <div className="mt-5">
        {isLoading && <Loader />}
        {error && <p>Error: {error}</p>}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>MatchId</th>
              <th>Match Date</th>
              <th>Match Time</th>
              <th>Match Name</th>
              <th>Stadium Id</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {user?.map((item, i) => {
              const { match_id, match_date, match_time, match_name, stadium_id } = item;
              return (
                <tr key={i + 1}>
                  <td>{match_id}</td>
                  <td>{match_date}</td>
                  <td>{match_time}</td>
                  <td>{match_name}</td>
                  <td>{stadium_id}</td>
                  <td>
                    {/* <Link to={`/edit-user/${item.id}`}>
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Link> */}
                    <Link to={`/seat-available/${match_id}`}>
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </Link>

                    {/* <i
                      className="fa fa-trash-o"
                      aria-hidden="true"
                      onClick={() => handelDelete(item.id)}
                    ></i> */}
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

export default ShowMatches;
