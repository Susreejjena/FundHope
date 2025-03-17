import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from "./App";
import "./index.css";

// Get PayPal client ID from environment variable
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb";

// Error boundaries for React 18
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React error boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: '#f8d7da', 
          color: '#721c24',
          borderRadius: '5px',
          margin: '20px',
          fontFamily: 'sans-serif'
        }}>
          <h1>Something went wrong</h1>
          <p>The application encountered an error. Please refresh the page.</p>
          <button 
            style={{ 
              padding: '8px 16px', 
              background: '#721c24', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }} 
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
          <details style={{ marginTop: '15px' }}>
            <summary>Error details</summary>
            <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Make sure the root element exists
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
  document.body.innerHTML = '<div id="root"></div>';
}

try {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
            <App />
          </PayPalScriptProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log("Application successfully mounted");
} catch (error) {
  console.error("Failed to render React application:", error);
  document.getElementById("root").innerHTML = `
    <div style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 5px; margin: 20px; font-family: sans-serif">
      <h1>Failed to start application</h1>
      <p>There was a problem starting the application. Please try refreshing the page.</p>
      <button 
        style="padding: 8px 16px; background: #721c24; color: white; border: none; border-radius: 4px; cursor: pointer" 
        onclick="window.location.reload()"
      >
        Refresh
      </button>
      <details style="margin-top: 15px">
        <summary>Error details</summary>
        <pre style="overflow: auto; max-height: 200px">${error.message}</pre>
      </details>
    </div>
  `;
}
