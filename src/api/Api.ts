import axios from "axios";

axios.defaults.withCredentials = true;

const socketUrl =
  import.meta.env.VITE_REACT_APP_SOCKET_URL || "http://localhost:3000";

export const baseURL = `${socketUrl}/api/`;

const getToken = (): string => {
  const user = localStorage.getItem("user");
  if (!user) return "";
  return JSON.parse(user).token || "";
};

const handleUnauthorized = async (error: any) => {
  if (error.response?.status === 401) {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      const newToken = (await login(parsedUser?.name, parsedUser?.password))
        .access_token;
      if (newToken) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...parsedUser, token: newToken })
        );
        const originalRequest = error.config;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } else {
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
    } else {
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
  } else if (error.response?.status === 403) {
    window.dispatchEvent(new CustomEvent("unauthorized"));
  }

  // navigate("/");
  console.error("Error fetching example data:", error);
  throw error;
};

const getData = async (currentUrl: string, isPublic?: boolean) => {
  try {
    const token = getToken();
    if (!isPublic && token.length === 0) return;
    const response = await axios.get(`${baseURL}${currentUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    handleUnauthorized(error);
  }
};

const postData = async (currentUrl: string, data: any, isPublic?: boolean) => {
  try {
    const token = getToken();
    if (!isPublic && token.length === 0) return;
    const response = await axios.post(`${baseURL}${currentUrl}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    handleUnauthorized(error);
  }
};

const putData = async (currentUrl: string, data: any, isPublic?: boolean) => {
  try {
    const token = getToken();
    if (!isPublic && token.length === 0) return;
    const response = await axios.put(`${baseURL}${currentUrl}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    handleUnauthorized(error);
  }
};

const deleteData = async (currentUrl: string, id: string) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${baseURL}${currentUrl}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    handleUnauthorized(error);
  }
};

const deleteDataWithBody = async (currentUrl: string, data: any) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${baseURL}${currentUrl}`, {
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    handleUnauthorized(error);
  }
};

export const discover = (group = "") =>
  getData(`device/discover?group=${group}`);
export const vulnerabilityScan = (data: any) =>
  postData(`device/vulnerability`, data);
export const getNetworks = () => getData("device/networks");
export const postHistory = (data: any) => postData("device/history", data);
export const deleteDashboard = (data: any) =>
  deleteDataWithBody("device/history", data);
export const getSettings = () => getData("settings/nodes");
export const getUserSettings = () => getData("settings/user");
export const updateEdges = (data: any) =>
  postData("settings/updateEdges", data);
export const killMachine = (data: any) =>
  postData("settings/killMachine", data);
export const generateToken = (data: any) =>
  postData("settings/generate-token", data);
export const updateSite = (data: any) =>
  putData("settings/nodes/updateSite", data);
export const getNcm = () => getData("dictionaries");
export const getConversationById = (id: string) =>
  getData(`conversations/${id}`);
export const deleteConversationById = (id: string) =>
  deleteData("conversations", id);
export const getConversationHistory = () => getData(`conversations/history`);
export const deleteDictionary = (id: string) => deleteData("dictionary", id);
export const postNewCommand = (file: any) =>
  postData("dictionary/command", file);
export const postCommands = (data: any) =>
  postData("dictionary/commands", data);
export const postNewDictionary = (data: any) => postData("dictionary", data);
export const deleteDictionaryCommand = (data: any) =>
  deleteDataWithBody("dictionary/command", data);
export const postFile = (file: any) => postData("file", file);
export const syncFile = (id: any) => postData(`file/${id}/sync`, {});
export const getFile = (id: any) => getData(`file/${id}/image`);
export const getFiles = () => getData("files");
export const getNodes = () => getData("auth/nodes");
export const deleteFile = (id: string) => deleteData("file", id);
export const deleteDevice = (id: string) => deleteData("device", id);
export const login = (username: string, password: string) =>
  postData("auth/login", { username, password }, true);
export const connectNodes = () => postData("auth/connectNodes", {});
export const connectNode = (data: any) => postData("auth/node/connect", data);
export const killNode = (data: any) => postData("auth/node/kill", data);
export const logout = (data: any) => postData("auth/logout", data);
export const admin = () => postData("auth/admin", {});
export const refresh_token = () => getData("auth/refresh", true);
export const connectJira = (email: string, apiToken: string) =>
  postData("login-jira", { email, apiToken });
export const listJira = (email: string, apiToken: string) =>
  postData("list-jira", { email, apiToken });
export const createJiraIssue = (
  email: string,
  apiToken: string,
  accountId: string,
  summary: string,
  description: string,
  type: string
) =>
  postData("create-jira-issue", {
    email,
    apiToken,
    accountId,
    summary,
    description,
    type,
  });
export const networkActiveScan = (network: string, id: string, group: string) =>
  postData("network/active-scan", { network, id, group });
export const addNewNetwork = (data: any) => postData("network/addNew", data);
export const deviceActiveScan = (
  ipAddress: string,
  id: string,
  group: string
) => postData("device/active-scan", { ipAddress, id, group });
export const deviceQuery = (data: any) => postData("device/query", data);
export const deleteAllData = () => postData("device/clear", {});
export const updateGroup = (data: any) => putData("device/group", data);
export const sendChat = (message: string, id?: string) =>
  postData("chat", { message, id });
export const chatKill = () => postData("chat/kill", {});
export const chatIo = () => postData("chat/chatio", {});
export const chatKagent = (data: any) => postData("chat/kagent", data);
export const investigate = (start: boolean) =>
  postData("device/investigate", { start });
export const postCommand = (command: any) => postData("command", command);
export const putCommand = (command: any) => putData("command", command);
export const getCommands = () => getData("commandModules");
export const deleteCommand = (data: any) => deleteDataWithBody("command", data);
export const sendCommand = (data: any) => postData("command/send", data);
export const killCommand = () => postData("command/kill", {});
export const createDevice = (data: any) => postData("device/addNew", data);
export const getAssesmentConfig = () => getData("configuration/assessment");
export const updateAssesmentConfig = (data: any) =>
  putData("configuration/assessment", data);
export const getProfileConfig = () => getData("configuration/profile");
export const updateProfileConfig = (data: any) =>
  putData("configuration/profile", data);
export const postAgent = (data: any) => postData("agent", data);
export const getAgents = () => getData("agent");
export const deleteAgent = (id: string) => deleteData("agent", id);
export const postWatch = (data: any) => postData("watch", data);
export const getWatches = () => getData("watch");
export const getMitigation = (id: string) =>
  getData(`vulnerability/${id}/mitigation`);
export const getOpenVASTasks = () => getData(`vulnerability/openvasTasks`);
export const deleteWatch = (id: string) => deleteData("watch", id);
export const getVulnerabilities = () => getData("vulnerabilities");
export const resolveVulnerability = (data: any) =>
  postData("vulnerability/resolve", data);
export const updateVulnerabilityStatus = (data: any, id: string) =>
  putData(`vulnerability/${id}`, data);
export const updateMitigationStatus = (data: any, id: string) =>
  putData(`vulnerability/${id}/mitigation`, data);
export const deleteVulnerability = (id: string) =>
  deleteData("vulnerability", id);
