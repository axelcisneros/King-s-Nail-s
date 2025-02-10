import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header/Header";
import PageNotFound from "./PageNotFound/PageNotFound";
import Dashboard from "./Dashboard/Dashboard"
import "@assets/blocks/page.css"

function App() {

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="*" element={<PageNotFound />} />
         <Route path="/" element={<Dashboard />} />
{/*         <Route path="/reviews" element={<Reviews />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/about-us" element={<AboutUs />} >
          <Route path="contact" element={<Constact />} />
        </Route> */}
      </Routes>
    </div>
  )
}

export default App
