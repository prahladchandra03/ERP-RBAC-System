// Environment-specific API URL for flexible deployment configuration
export const server_url = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
console.log("API SERVER URL:", server_url);

export const fetchOptions = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
};

// Mock Data for manual insertion/fallback
const mockUsers = [
  { _id: "1", name: "Admin User", email: "admin@test.com", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?img=1" },
  { _id: "2", name: "John Doe", email: "john@test.com", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?img=2" },
];

const mockRoles = [
  { _id: "1", name: "Admin", permissions: ["read", "write", "delete"] },
  { _id: "2", name: "User", permissions: ["read"] },
];

const mockPermissions = [
  { _id: "1", name: "read" },
  { _id: "2", name: "write" },
  { _id: "3", name: "delete" },
];

const mockLogs = [
  { _id: "1", user: "Admin User", action: "Logged In", date: new Date().toISOString() },
  { _id: "2", user: "John Doe", action: "Updated Profile", date: new Date().toISOString() },
];


/**
 * get the user list from server
 */
export const getUserList = async () => {
    try {
      const response = await fetch(`${server_url}/api/user/all`, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return (data && data.length > 0) ? data : mockUsers;
      } catch {
        console.error("Non-JSON response in getUserList:", text);
        return mockUsers;
      }
    } catch (error) {
      console.error("Error in getUserList:", error);
      return mockUsers;
    }
};

/**
 * get the permission list from server
 */
export const getPermissionsList = async () => {
    try {
      const response = await fetch(`${server_url}/api/permission`, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return (data && data.length > 0) ? data : mockPermissions;
      } catch {
        console.error("Non-JSON response in getPermissionsList:", text);
        return mockPermissions;
      }
    } catch (error) {
      console.error("Error in getPermissionsList:", error);
      return mockPermissions;
    }
};

/**
 * get the role list from server
 */
export const getRolesList = async () => {
    try {
      const response = await fetch(`${server_url}/api/role`, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return (data && data.length > 0) ? data : mockRoles;
      } catch {
        console.error("Non-JSON response in getRolesList:", text);
        return mockRoles;
      }
    } catch (error) {
      console.error("Error in getRolesList:", error);
      return mockRoles;
    }
};


/**
 * get the log list from server
 */
export const getLogList = async () => {
    try {
      const response = await fetch(`${server_url}/api/log`, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return (data && data.length > 0) ? data : mockLogs;
      } catch {
        console.error("Non-JSON response in getLogList:", text);
        return mockLogs;
      }
    } catch (error) {
      console.error("Error in getLogList:", error);
      return mockLogs;
    }
};

/**
 * This method get logged user from server
 */
export const getUser = async () => {
    try {
      const response = await fetch(`${server_url}/api/user`, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log("body", data);
        return data || mockUsers[0];
      } catch {
        console.error("Non-JSON response in getUser:", text);
        return mockUsers[0];
      }
    } catch (error) {
      console.error("Error in getUser:", error);
      return mockUsers[0];
    }
}

export const getCount = async () => {
    //fetch count of each list
    const users  = await getUserList();
    const role = await getRolesList();
    const permission = await getPermissionsList();
    console.log({users,role,permission})
    const userCount = users.length;
    
    const roleCount = role.length;
    
    const permissionCount = permission.length;
    console.log({userCount,roleCount,permissionCount});
    const count = {userCount,roleCount,permissionCount};

    return count;
};

/**
 * Login user
 */
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${server_url}/api/login`, {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
};

/**
 * Register user
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${server_url}/api/signup`, {
      ...fetchOptions,
      method: "POST",
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
};
