import {
  Box,
  Button,
  TextField, Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

const schema = yup.object().shape({
  newPassword: yup.string().required("required"),
  confirmPassword: yup.string().required("required"),
});

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const ResetPasswordForm = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const token = window.location.pathname.split("/").pop();

  const handleFormSubmit = async (values, onSubmitProps) => {
    console.log(token);
    try {
      const loggedInResponse = await fetch(`http://localhost:3001/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: values.newPassword }),
      });
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
      if (loggedIn) {
        dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
            })
        );
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
      <Box>
        <Box
            width="100%"
            backgroundColor={theme.palette.background.alt}
            p="1rem 6%"
            textAlign="center"
        >
          <Typography fontWeight="bold" fontSize="32px" color="primary">
            The Sideline
          </Typography>
        </Box>

        <Box
            width={isNonMobileScreens ? "50%" : "93%"}
            p="2rem"
            m="2rem auto"
            borderRadius="1.5rem"
            backgroundColor={theme.palette.background.alt}
        >
          <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
            Where passionate football fans gather for the latest news and match analysis!
          </Typography>
          <Formik
              onSubmit={handleFormSubmit}
              initialValues={initialValues}
              validationSchema={schema}
          >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box
                      display="grid"
                      gap="30px"
                      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                      sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                      }}
                  >
                    <TextField
                        label="New password"
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.newPassword}
                        name="newPassword"
                        error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
                        helperText={touched.newPassword && errors.newPassword}
                        sx={{ gridColumn: "span 4" }}
                    />
                    <TextField
                        label="Confirm password"
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.confirmPassword}
                        name="confirmPassword"
                        error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        sx={{ gridColumn: "span 4" }}
                    />
                  </Box>

                  {/* BUTTONS */}
                  <Box>
                    <Button
                        fullWidth
                        type="submit"
                        sx={{
                          m: "2rem 0",
                          p: "1rem",
                          backgroundColor: palette.primary.main,
                          color: palette.background.alt,
                          "&:hover": { color: palette.primary.main },
                        }}
                        onClick={() => console.log("Submit")}
                    >
                      SUBMIT
                    </Button>
                  </Box>
                </form>
            )}
          </Formik>
        </Box>
      </Box>
  );
};

export default ResetPasswordForm;
