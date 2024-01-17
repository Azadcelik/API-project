import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import CreateSpot from "./components/CreateSpot/CreateSpot";
import CurrentSpot from "./components/CurrentSpot/CurrentSpot";
import UpdateSpot from "./components/UpdateSpot/UpdateSpot";
import ListOfSpots from "./components/ListOfSpots/ListOfSpots";
import { Routes, Route } from 'react-router-dom'; // Ensure that Routes is imported

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Routes> {/* Define routes here */}
          <Route path="/" element={<ListOfSpots />} />
          <Route path="/spots/:spotId" element={<SpotDetails />} />
          <Route path="/spots/new" element={<CreateSpot />} />
          <Route path="/spots/current" element={<CurrentSpot />} />
          <Route path="/spots/:spotId/edit" element={<UpdateSpot />} />
        </Routes>
      )}
    </>
  );
}

export default App; // This line exports the App componen