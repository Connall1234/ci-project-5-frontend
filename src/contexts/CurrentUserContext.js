import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";

// Create context for managing the current user state across the application
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// Custom hooks to use the current user and the function to set the current user
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Provider component to wrap around parts of the app that need access to current user data
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // State to hold the current user information
  const history = useHistory(); // Hook to navigate programmatically

  // Function to fetch the current user's data upon mounting the component
  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/"); // Fetch current user data from the API
      setCurrentUser(data); // Set the current user state with the fetched data
    } catch (err) {
      console.log(err); // Log any errors encountered during the API call
    }
  };

  // useEffect to run the handleMount function when the component mounts
  useEffect(() => {
    handleMount(); // Fetch current user data when the component is mounted
  }, []);

  // useMemo hook to set up Axios interceptors for handling authentication
  useMemo(() => {
    // Request interceptor to refresh the token before making requests
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axios.post("/dj-rest-auth/token/refresh/"); // Attempt to refresh the authentication token
        } catch (err) {
          // If token refresh fails, log the user out by setting currentUser to null and redirect to signin
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              history.push("/signin"); // Redirect to the signin page if the user was previously logged in
            }
            return null;
          });
          return config; // Return the original request config
        }
        return config; // Proceed with the request
      },
      (err) => {
        return Promise.reject(err); // Reject the promise if an error occurs in the request interceptor
      }
    );

    // Response interceptor to handle 401 errors (unauthorized access)
    axiosRes.interceptors.response.use(
      (response) => response, // Return the response if successful
      async (err) => {
        if (err.response?.status === 401) { // Check if the error status is 401 (unauthorized)
          try {
            await axios.post("/dj-rest-auth/token/refresh/"); // Attempt to refresh the token
          } catch (err) {
            // If token refresh fails, log the user out by setting currentUser to null and redirect to signin
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin"); // Redirect to the signin page if the user was previously logged in
              }
              return null;
            });
          }
          return axios(err.config); // Retry the original request with the refreshed token
        }
        return Promise.reject(err); // Reject the promise if an error occurs in the response interceptor
      }
    );
  }, [history]); // useMemo dependency on history to ensure it runs only when history changes

  return (
    // Provide currentUser and setCurrentUser to all children components wrapped by this provider
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
