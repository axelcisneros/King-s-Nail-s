import Slider from "./Slider/Slaider"
import { sliderConfig } from "@utils/sliderConfig";
import "@assets/blocks/Dashboard.css"

function Dashboard () {
    return(
        <div className="dashboard">
            <h2 className="dashboard__title">
                👼CONCIENTE TUS UÑAS👼
            </h2>
            <div className="dashboard__slider">
                <ul className="dashboard__slider-list">
                    {sliderConfig.map((slider) => (
                        <Slider
                        key={slider.id}
                        slider={slider}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Dashboard;