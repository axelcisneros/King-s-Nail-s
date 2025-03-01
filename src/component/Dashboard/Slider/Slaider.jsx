function Slider(props) {
  const { link, id } = props.slider
  return (
      <li className="dashboard__slider-item">
        <img
        className="dashboard__slider-image"
        src={link} alt={`slider${id}`}
        />
      </li>
  )
}

export default Slider;