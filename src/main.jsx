// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// const queryClient = new QueryClient();

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AuthProvider>
//       <QueryClientProvider client={queryClient}>
//       <App />
//       </QueryClientProvider>
//     </AuthProvider>
//   </StrictMode>
// );

// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {" "}
        {/* App ကို QueryClientProvider နဲ့ wrap လုပ်ထားကြောင်း သေချာပါစေ */}
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
