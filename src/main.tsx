
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";

// import "./index.css";
// import "swiper/swiper-bundle.css";
// import "flatpickr/dist/flatpickr.css";
// import { AdminProfileProvider } from "./context/AdminProfileContext";
// import App from "./App.tsx";
// import { Toaster } from "react-hot-toast";
// import { AppWrapper } from "./components/common/PageMeta.tsx";
// import { ThemeProvider } from "./context/ThemeContext.tsx";
// import { store } from "./redux/store";

// createRoot(document.getElementById("root")!).render(

//   <Provider store={store}>
//     <ThemeProvider>
//       <AppWrapper>
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: {
//               fontSize: "14px",
//             },
//           }}
//         />
//         <App />
//       </AppWrapper>
//     </ThemeProvider>
//   </Provider>

// );
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Suspense } from "react";

import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";

// Import i18n configuration
import "./i18n";

import App from "./App.tsx";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AdminProfileProvider } from "./context/AdminProfileContext";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <AdminProfileProvider> {/*  PROFILE API CALLED ONCE */}
        <Suspense fallback={<div>Loading...</div>}>
          <SocketProvider>
            <AppWrapper>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    fontSize: "14px",
                  },
                }}
              />
              <App />
            </AppWrapper>
          </SocketProvider>
        </Suspense>
      </AdminProfileProvider>
    </ThemeProvider>
  </Provider>
);
