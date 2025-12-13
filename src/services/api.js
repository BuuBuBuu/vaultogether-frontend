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
    // Takes in @RequestBody UserRegisterDTO (String email, String password)
    data: userData,
  });
  // Return only the JSON data payload
  // Responds with UserResponseDTO (Long userId, String email, LocalDateTime createdAt)
  return response.data;
};

// Define async wrapper function to log in an existing user
export const loginUser = async (userData) => {
  // Make a POST request to the /login endpoint and get the full response data
  const response = await api({
    url: "/api/users/login",
    method: "post",
    // Takes in @RequestBody UserLoginDTO (String email, String password)
    data: userData,
  });
  // Return only the JSON data payload
  // Responds with UserResponseDTO (Long userId, String email, LocalDateTime createdAt)
  return response.data;
};

// Define async wrapper function to get vaults by user
export const getVaultsByUser = async (userId) => {
  // Make a GET request to the /api/vaults/ endpoint and get the full response data
  const response = await api({
    url: "/api/vaults",
    method: "get",
    // Takes in @RequestParam Long userId
    params: { userId: userId },
  });
  // Return only the JSON data payload
  // Responds with VaultResponseDTO (Long vaultId, String name, LocalDateTime createdAt, String encVaultKey)
  return response.data;
}

// Define async wrapper function to create vault
export const createVault = async (vaultData, userId) => {
  // Make a POST request to the /api/vaults/create endpoint and get the full response data
  const response = await api({
    url: "/api/vaults/create",
    method: "post",
    // vaultData maps to VaultCreateDTO which takes in String name, String encryptedStringKey
    data: vaultData,
    params: { userId },
  });
  // Responds with VaultResponseDTO (Long vaultId, String name, LocalDateTime createdAt, String encVaultKey)
  return response.data;
}

// Define async wrapper function to delete vault
export const deleteVault = async (userId, vaultId) => {
  // Make a DELETE request to the /api/vaults/delete endpoint
  const response = await api({
    url: "/api/vaults/delete",
    method: "delete",
    params: { userId, vaultId },
  })
  // Response with just a No content
  return response.data;
}

// Define async Wrapper function to create vault item
export const createVaultItem = async (requestorId, vaultId, vaultItemCreateData) => {
  // Make a POST request to the /api/vaults/{vaultId}/items/ endpoint and get the full response data
  const response = await api({
    url: `/api/vaults/${vaultId}/items`,
    method: "post",
    // vaultItemData maps to VaultItemCreateDTO
    // (String title, String type, String username, String password, String notes)
    data: vaultItemCreateData,
    params: { requestorId },
  });
  // Response with VaultItemResponseDTO
  // (Long itemId, String title, String type, String username, String password, String notes)
  return response.data;
}

// Define async Wrapper function to get vault item
export const getItemByVault = async (requestorId, vaultId) => {
  // Make a GET request to the /api/vaults/{vaultId}/items/ endpoint and get the full response data
  const response = await api({
    url: `/api/vaults/${vaultId}/items`,
    method: 'get',
    params: { requestorId },
  });
  // Response with List of VaultItemResponseDTO
  // (Long itemId, String title, String type, String username, String password, String notes)
  return response.data;
}

// Define async warpper function to delete vault item
export const deleteVaultItem = async (requestorId, vaultId, itemId) => {
  // Make a DELETE request to the /api/vaults/{vaultId}/items/{itemId} endpoint
  const response = await api({
    url: `/api/vaults/${vaultId}/items/${itemId}`,
    method: 'delete',
    params: { requestorId },
  })
  // Response with nothing much just No content
  return response.data;
}

// Define async wrapper function to update vault item
export const updateVaultItem = async (requestorId, vaultId, itemId, vaultItemUpdateData) => {
  // Make a PUT request to the /api/vaults/{vaultId}/items/{itemId} endpoint
  const response = await api({
    url: `/api/vaults/${vaultId}/items/${itemId}`,
    method: 'put',
    // data maps to VaultMemberAddDTO in springboot and the fields are
    // (String email, Role role, String encryptedVaultKey)
    data: vaultItemUpdateData,
    params: { requestorId },
  })
  // Response with VaultItemResponseDTO
  // (Long itemId, String title, String type, String username, String password, String notes)
  return response.data;
}

// Define async wrapper function to add Vault member
export const addVaultMember = async (requestorId, vaultId, vaultMemberAddData) => {
  // Make a POST request to the /api/vaultmembers/add endpoint
  const response = await api({
    url: "/api/vaultmembers/add",
    method: 'post',
    data: vaultMemberAddData,
    params: { requestorId: requestorId, vaultId: vaultId },
  })
  // Response with Httpstatus ok
  return response.data;
}

// Define async wrapper function to delete Vault Member
export const deleteVaultMember = async (requestorId, vaultId, email) => {
  // Make a DELETE request to the /api/vaultmembers/{email} endpoint
  const response = await api({
    url: `/api/vaultmembers/${email}`,
    method: 'delete',
    params: { requestorId, vaultId },
  })
  // Response with no content if everything is ok
  return response.data;
}

// Define async wrapper function to get a single vault by id
export const getVaultById = async (userId, vaultId) => {
  // Make a GET request to the /api/vaults/{vaultId} endpoint
  const response = await api({
    url: `/api/vaults/${vaultId}`,
    method: 'get',
    params: { userId },
  });
  // Response with VaultResponseDTO
  // (Long vaultId, String name, String description, LocalDateTime createdAt, String encVaultKey, Role role, long itemCount, long memberCount)
  return response.data;
}

// Define async wrapper function to get members by vault
export const getVaultMembers = async (requestorId, vaultId) => {
  const response = await api({
    url: "/api/vaultmembers",
    method: "get",
    params: { requestorId, vaultId },
  });
  // Responds with List<VaultMemberResponseDTO>
  // (Long userId, String email, Role role, LocalDateTime addedAt)
  return response.data;
}

// Define async wrapper function to update member role
export const updateVaultMemberRole = async (requestorId, vaultId, email, newRole) => {
  const response = await api({
    url: `/api/vaultmembers/${email}/role`,
    method: 'put',
    params: { requestorId, vaultId, newRole },
  });
  // Nothing much returnd just return ok or badrequest
  return response.data;
}

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
