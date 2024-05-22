const base = "/";
const baseApiRoot = "http://localhost:5000" // local_host
// const baseApiRoot = "https://webwhatsapp.1clx.com" // domain_server_host
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
   sendMessage : baseApi + "/messages/send"

  }
};