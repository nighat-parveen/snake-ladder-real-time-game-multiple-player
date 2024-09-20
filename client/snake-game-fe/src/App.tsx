import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SnakeLadderGame from "./components/SnakeLadderGame";
import Register from "./components/Register";
import Login from "./components/Login";
import GameAuthenticate from "./components/GameAuthenticate";

function App() {


  const route = createBrowserRouter([
    {
      path: "/",
      element: <Register />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/game',
      element: <GameAuthenticate />,
    },
    {
      path: '/start-game',
      element: <SnakeLadderGame />,
    }
  ]);
  
  return (
    <>
      <RouterProvider router={route} />
    </>
  )
}

export default App
