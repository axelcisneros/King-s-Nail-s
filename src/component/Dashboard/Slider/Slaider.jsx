function Slider(props) {
    const { link } = props.slider
    return ( 
        <li className="dashboard__slider-item">
          <img
          className="dashboard__slider-image"
          src={link} alt=""
          />
        </li>
    )
}

export default Slider;