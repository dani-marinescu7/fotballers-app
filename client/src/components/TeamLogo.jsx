import { Box } from "@mui/material";

const TeamLogo = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="logo"
        src={image}
      />
    </Box>
  );
};

export default TeamLogo;
