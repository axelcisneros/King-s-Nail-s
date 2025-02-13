import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header/Header";
import PageNotFound from "./PageNotFound/PageNotFound";
import Dashboard from "./Dashboard/Dashboard"
import Reviews from "./Reviews/Reviews"
import Prices from "./Prices/Prices"
import AboutUs from "./AboutUs/AboutUs"
import Hours from "./AboutUs/Hours/Hours"
import Contact from "./AboutUs/Contact/Contact"
import Jobs from "./Jobs/Jobs";
import { imagesUrl } from "@utils/imagesUrl";
import "@assets/blocks/page.css"

function App() {
  const [popup, setPopup] = useState(null);

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="*" element={<PageNotFound />} />
         <Route path="/" element={<Dashboard />} />
         <Route
         path="/jobs"
         element={
         <Jobs
         onOpenPopup={handleOpenPopup}
         onClosePopup={handleClosePopup}
         images={imagesUrl}
         popup={popup}/>}
         />
         <Route path="/reviews" element={<Reviews />} />
         <Route path="/prices" element={<Prices />} />
         <Route path="/about-us" element={<AboutUs />} >
           <Route path="hours" element={<Hours />} />
           <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
