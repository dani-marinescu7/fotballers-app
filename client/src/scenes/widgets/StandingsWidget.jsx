import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from "react-redux";

const StandingsWidget = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [league, setLeague] = useState(null);
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

        const leaguesResponse = await axios({
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
          params: { season: '2023', team: teamResponse.data.response[0].team.id },
          headers: {
            'X-RapidAPI-Key': 'c26b60939emsha8730bbbc802d93p1a2236jsn570bcc9e4713',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        });
        const leagueId = leaguesResponse.data.response.filter(league => league.league.country === teamResponse.data.response[0].team.country)[0].league.id;

        const leagueResponse = await axios({
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
          params: { season: '2023', league: leagueId },
          headers: {
            'X-RapidAPI-Key': 'c26b60939emsha8730bbbc802d93p1a2236jsn570bcc9e4713',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        });
        setLeague(leagueResponse.data.response);

      } catch (error) {
        console.error("Error in data fetching chain:", error);
      }
    };

    fetchData();
  }, [userId]);

  console.log(league);


  if (!user) {
    return null;
  }

  return (
      <div className="standings-widget">
        {league && (
            <table>
              <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Points</th>
              </tr>
              </thead>
              <tbody>
              {league[0].league.standings[0].map((teamData) => (
                  <tr key={teamData.team.id}>
                    <td>{teamData.rank}</td>
                    <td>{teamData.team.name}</td>
                    <td>{teamData.points}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}
      </div>
  );
};

export default StandingsWidget;
