import axios from "axios";
import { FETCH_USER } from "./types";
import type { AppDispatch } from "../store/store"; // adjust path to your store file

// If you know the shape of the user, define an interface:
interface User {
  id: string;
  name: string;
  email: string;
  // add other user fields here
}

export const fetchUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const res = await axios.get<User>("/api/current_user");
      dispatch({ type: FETCH_USER, payload: res.data });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Optionally dispatch an error action here
    }
  };
};
