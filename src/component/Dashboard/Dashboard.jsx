import SliderContent from "./SliderContent/SliderContent"
import { sliderConfig } from "@utils/sliderConfig";
import { secondSlider } from "@utils/secondSlider"
import { Link } from "react-router-dom";
import "@assets/blocks/Dashboard.css"

function Dashboard () {
    return(
        <div className="dashboard">
            <h2 className="dashboard__title">
                👼CONSIENTE TUS UÑAS👼
                <Link
                className="dashboard__title-link"
                to="/jobs">
                    💅Ver galeria de trabajos💅
                </Link>
            </h2>
            <SliderContent config={sliderConfig}/>
            <SliderContent config={secondSlider}/>
        </div>
    )
}

export default Dashboard;