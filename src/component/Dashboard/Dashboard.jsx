import SliderContent from "./SliderContent/SliderContent"
import { sliderConfig } from "@utils/sliderConfig";
import { secondSlider } from "@utils/secondSlider"
import "@assets/blocks/Dashboard.css"

function Dashboard () {
    return(
        <div className="dashboard">
            <h2 className="dashboard__title">
                👼CONCIENTE TUS UÑAS👼
            </h2>
            <SliderContent config={sliderConfig}/>
            <SliderContent config={secondSlider}/>
        </div>
    )
}

export default Dashboard;