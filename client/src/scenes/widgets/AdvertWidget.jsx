import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import axios from "axios";
import { useState } from "react";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

const getLatestNews = async () => {
    try {
        const options = {
            method: 'GET',
            url: 'https://newsapi.org/v2/top-headlines?country=gb&category=sports&apiKey=f36dc5f6261f4d6cb00e0d83964a9192',
        };

        const response = await axios(options);

        setPublisher(response.data.articles[0].author);
        setTitle(response.data.articles[0].title);
        setUrl(response.data.articles[0].url);
        return response.data.response;
    } catch (error) {
        console.error(error);
        return [];
    }
};
getLatestNews();

const [publisher, setPublisher] = useState(null);
const [title, setTitle] = useState(null);
const [url, setUrl] = useState(null);

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
            Latest News
        </Typography>
        <Typography color={medium}>{publisher}</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/football1.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
        <FlexBetween>
            <a target='_blank'
               rel='noopener noreferrer'
               href={url}
            >
                Go to story
            </a>
        </FlexBetween>
        <Typography color={medium} m="0.5rem 0">
            {title}
        </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
