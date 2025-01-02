import axios from "axios";
import User from "@/types/userInterface";
import ActivityLog from "@/types/activityLogInterface";
import { jwtDecode, JwtPayload } from "jwt-decode";

const API_BASE_URL = "http://127.0.0.1:8000"; // Update with your API base URL

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
interface CustomJwtPayload {
  id: number; // Define other fields in the token as needed
  username: string;
  email: string;
  exp: number; // Token expiration timestamp
}

// Retrieve tokens from localStorage
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

// Set Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh_token: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", response.data.refresh);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          throw refreshError;
        }
      }
    }

    return Promise.reject(error);
  }
);

export const userService = {
  /**
   * Fetch a list of all users
   * @returns Promise<User[]>
   */
  async listUsers(): Promise<User[]> {
    try {
      const response = await axiosInstance.get("/users/");

      console.log(response.status + "mafe");
      return response.data.map(
        (user: any): User => ({
          id: user.id,
          username: user.username,
          email: user.email,
          profile_image: user.profile_image || "",
          role: user.role,
          password: "", // Exclude sensitive data
          confirm_password: "", // Exclude sensitive data
          created_at: new Date(user.created_at),
          updated_at: new Date(user.updated_at),
          created_tickets: user.created_tickets || [],
          assigned_tickets: user.assigned_tickets || [],
        })
      );
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  async getCurrentUser(email: string): Promise<User | null> {
    try {
      const response = await axiosInstance.get("/users/");

      const users: User[] = response.data.map(
        (user: any): User => ({
          id: user.id,
          username: user.username,
          email: user.email,
          profile_image: user.profile_image || "",
          role: user.role,
          password: "", // Exclude sensitive data
          confirm_password: "", // Exclude sensitive data
          created_at: new Date(user.created_at),
          updated_at: new Date(user.updated_at),
          created_tickets: user.created_tickets || [],
          assigned_tickets: user.assigned_tickets || [],
        })
      );

      // Find the user with the matching email
      const currentUser = users.find((user) => user.email === email);

      return currentUser || null; // Return the user if found, otherwise return null
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getActivityLogs(): Promise<ActivityLog[]> {
    try {
      const response = await axiosInstance.get("/activity-logs/");

      console.log(response.status + "mafe");
      return response.data.map(
        (data: any): ActivityLog => ({
          id: data.id,
          username: data.username,
          action: data.action,
          timestamp: data.timestamp,
          ip_address: data.ip_address,
        })
      );
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Fetch details of a specific user by ID
   * @param id User ID
   * @returns Promise<User>
   */
  async getUserDetails(id: number): Promise<User> {
    try {
      const response = await axiosInstance.get(`/users/${id}/`);
      const user = response.data;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image || "",
        role: user.role,
        password: "", // Exclude sensitive data
        confirm_password: "", // Exclude sensitive data
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
        created_tickets: user.created_tickets || [],
        assigned_tickets: user.assigned_tickets || [],
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create a new user
   * @param userData Partial<User>
   * @returns Promise<User>
   */
  async createUser(userData: Partial<User>): Promise<string> {
    try {
      const response = await axiosInstance.post("/users/", userData);
      if (response.status == 201) {
        return "User created successfully";
      }
      return "User created successfully";
    } catch (error) {
      return "Error creating user";
    }
  },

  /**
   * Update user details
   * @param id User ID
   * @param userData Partial<User>
   * @returns Promise<User>
   */
  async updateUser(id: number, userData: Partial<User>): Promise<string> {
    try {
      await axiosInstance.put(`/users/${id}/`, userData);
      return "password updated successfully";
    } catch (error) {
      return "error updating password";
    }
  },

  /**
   * Delete a user
   * @param id User ID
   * @returns Promise<void>
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${id}/`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
