import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port : 3000,
    proxy : {
      "/api":{
        target :  "https://chat-mern-app-1lgm.onrender.com" //  "http://localhost:5000" //  
      }
    }
  }
})
