import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/Auth";
import CustomRoutes from "./components/CustomRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
