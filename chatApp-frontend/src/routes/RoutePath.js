const base = "/";
const baseApiRoot = "https://chat-mern-app-1lgm.onrender.com" // "http://localhost:5000" // 
const baseApi = baseApiRoot + "/api";
const app = "/app";

export const routePath = {
  home: base,
  // auth: auth_base,
  auth: {
    login: base + "auth/login",
    register: base + "auth/register",

  },
  app: {
    mainPage: app,
    messages: app + "messages"
  }
}



export const routesApi = {
  root: baseApiRoot,
  auth: {
    signin: baseApi + "/auth/login",
    register: baseApi + "/auth/signup",
    logout : baseApi + "/auth/logout"
  },
  app: {
   users : baseApi + "/users",
   getMessages : baseApi + "/messages",
   sendMessage : baseApi + "/messages/send",
   uploadFile : baseApi + "/messages/upload_file",
   getLastMessageTime : baseApi + "/messages/lastseen"
  }
};