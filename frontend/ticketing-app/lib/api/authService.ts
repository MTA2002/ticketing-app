import axios from "axios";
const API_URL = "http://localhost:8000/auth"; // Replace with your Django API URL

export const loginUser = async (email: string, password: string) => {
  try {
    console.log("mahfouz");
    const response = await axios.post(`${API_URL}/login/`, {
      email,
      password,
    });

    console.log(response);

    // This endpoint does not return tokens yet, it only sends OTP to user's email
    // Success response example: { "message": "OTP sent to your email" }
    console.log(response.data.message); // "OTP sent to your email"

    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw new Error("Invalid login credentials");
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp/`, {
      email,
      otp,
    });

    const { access, refresh } = response.data;

    // Save tokens securely (e.g., access token in localStorage and refresh token in HttpOnly cookies)
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    console.log("OTP verified, tokens received:", response.data);

    return response.data; // Access and refresh tokens
  } catch (error) {
    console.error("OTP verification failed", error);
    return "Invalid or expired refresh token";
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/resend-otp/`, {
      email,
    });

    return response.data; // Return message about OTP being sent
  } catch (error) {
    console.error("Resend OTP failed", error);
    return "Error sending OTP";
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  try {
    const response = await axios.post(`${API_URL}/refresh-token/`, {
      refresh_token: refreshToken,
    });

    const { access, refresh } = response.data;

    // Update access token and refresh token
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return "Authenticated"; // New access and refresh tokens
  } catch (error) {
    console.error("Failed to refresh token", error);
    return "Invalid or expired refresh token";
  }
};

// Utility function to decode JWT access token
// export const decodeAccessToken = (token: string) => {
//   try {
//     return jwt_decode(token);
//   } catch (error) {
//     throw new Error("Failed to decode token");
//   }
// };

// export const getLoggedInUser = () => {
//   const accessToken = localStorage.getItem("access_token");
//   if (accessToken) {
//     return decodeAccessToken(accessToken);
//   }
//   return null;
// };
