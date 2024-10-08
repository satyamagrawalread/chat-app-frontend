// import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AuthProvider from "./authProvider/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/signup" element={<SignUp />}></Route>
              <Route path="/signin" element={<SignIn />}></Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
      </QueryClientProvider>
    </>
  );
}

export default App;
