import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from "react-redux";

const StandingsWidget = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [leagues, setLeagues] = useState(null);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResponse.json();
        setUser(userData);

        const teamResponse = await axios({
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/teams',
          params: { name: userData.favoriteTeam },
          headers: {
            'X-RapidAPI-Key': 'c26b60939emsha8730bbbc802d93p1a2236jsn570bcc9e4713',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        });
        setTeam(teamResponse.data.response);

        const leagueResponse = await axios({
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
          params: { season: '2023', team: teamResponse.data.response[0].team.id },
          headers: {
            'X-RapidAPI-Key': 'c26b60939emsha8730bbbc802d93p1a2236jsn570bcc9e4713',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        });
        setLeagues(leagueResponse.data.response);

      } catch (error) {
        console.error("Error in data fetching chain:", error);
      }
    };

    fetchData();
  }, [userId]);


  if (!user) {
    return null;
  }

  return (
      <div className="standings-widget">
        {/* Display loading, error, or standings */}
      </div>
  );
};

export default StandingsWidget;
