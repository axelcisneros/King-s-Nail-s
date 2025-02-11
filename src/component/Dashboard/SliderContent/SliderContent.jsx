import Slider from "../Slider/Slaider"

function SliderContent(props) {
    const { config } = props;
    return (
        <div className="dashboard__slider">
            <ul className="dashboard__slider-list">
                {config.map((slider) => (
                    <Slider
                    key={slider.id}
                    slider={slider}
                    />
                ))}
            </ul>
        </div>
    )
}

export default SliderContent;
