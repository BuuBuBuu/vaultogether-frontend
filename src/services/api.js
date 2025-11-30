/**
Step 1: Create the Communication Layer
You need to create the file that handles talking to the backend.
Hint: Create the file src/services/api.js.
Guiding Question: To prepare for the POST /api/users/register and POST /api/users/login endpoints, how should you structure your api.js file to export functions that take user data and send the request, using your chosen HTTP client (Axios or Fetch)?
Step 2: Create the Pages and Components for Authentication
You need the structures where the user interacts.
 */
/**
 1. Structuring the API Service (src/services/api.js)
You are asking for the best practice on how to structure the API client—this is the professional approach to connecting the two parts of your application: the React frontend (running on http://localhost:3000) and the Spring Boot backend (running on http://localhost:8080).
Concept: Centralized API Client
The src/services/api.js file acts as a wrapper around your HTTP client (Axios or Fetch). Its main purpose is to:
1. Set the Base URL: It tells the client exactly where the backend lives (e.g., http://localhost:8080).
2. Define Clean Functions: It provides simple, asynchronous functions (like registerUser) that hide the messy details of HTTP requests (POST verb, specific path, JSON conversion).
Guiding Questions and High-Level Pseudo-Code:
How to structure api.js for the POST /api/users/register and POST /api/users/login endpoints?
1. Base Configuration: Since your application is required to run locally, you must configure the client with the backend address:
2. Wrapper Functions: You need exported functions that map directly to the required endpoints:
 */

// Import React and Axios and dependencies
import axios from "axios";

// Create a base axios instance with common settings
// https://axios-http.com/docs/instance for more information
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// Define async wrapper function to register a new user
export const registerUser = async (userData) => {
  // Make a POST request to the /register endpoint and get the full response data
  const response = await api({
    url: "/api/users/register",
    method: "post",
    data: userData,
  });
  // Return only the JSON data payload
  return response.data;
};

// Define async wrapper function to log in an existing user
export const loginUser = async (userData) => {
  // Make a POST request to the /login endpoint and get the full response data
  const response = await api({
    url: "/api/users/login",
    method: "post",
    data: userData,
  });
  // Return only the JSON data payload
  return response.data;
};


// // Use fetch to test (Just learning how to use fetch)
// export const loginUserFetch = async (userData) => {
//   const response = await fetch(
//     "http://localhost:8080",
//     {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//     }
//   );
//   const data = await response.json();
//   const dataOnly = await data.data;
//   return dataOnly;
// }

// // Define async wrapper function to get the current user
// export const getCurrentUser = async() => {
//     // Make a GET request to the /
// }
