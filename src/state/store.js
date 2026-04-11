// import { createContext, useContext, useState } from "react";
// const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [page, setPage] = useState("dashboard");
//   const [chatHistory, setChatHistory] = useState([]);

//   return (
//     <AppContext.Provider
//       value={{
//         user,
//         setUser,
//         page,
//         setPage,
//         chatHistory,
//         setChatHistory,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useApp = () => useContext(AppContext);
