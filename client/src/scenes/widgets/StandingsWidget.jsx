import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useSelector } from "react-redux";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import {Box, Divider, Typography, useTheme} from "@mui/material";
import TeamLogo from "../../components/TeamLogo";

const StandingsWidget = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [league, setLeague] = useState(null);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

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


  if (!user) {
    return null;
  }

  return (
      <WidgetWrapper>
        {/* FIRST ROW */}
        { league && (
        <FlexBetween
            gap="0.5rem"
            pb="1.1rem"
        >
          <FlexBetween gap="1rem">
            <TeamLogo image={league[0].league.logo}  alt='logo'/>
            <Box>
              <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.primary.light,
                      cursor: "pointer",
                    },
                  }}
              >
                {league[0].league.name}
              </Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>
        )}

        <Divider />

        {league && (
            <Box p="1rem 0">
              <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                <Typography color={medium}>Team</Typography>
                <Typography color={medium} ml="auto">Points</Typography>
              </Box>
              {league[0].league.standings[0].map(team => (
                  <Box key={team.rank} display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                    <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                      <Typography color={medium}>{team.rank}</Typography>
                      <Typography color={medium}>{team.team.name}</Typography>
                    </Box>
                    <Typography color={medium} ml="auto">{team.points}</Typography>
                  </Box>
              ))}
            </Box>
        )}
      </WidgetWrapper>
  );
};

export default StandingsWidget;
