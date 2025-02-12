import "@assets/blocks/Hours.css"

function Hours() {
    return (
        <div className="hours">
            <div className="hours__content">
            <h3 className="hours__title">
                Horarios de servicio
            </h3>
            <ul className="hours__list">
                <li className="hours__list-item">
                    De sabado a jueves
                </li>
                <li className="hours__list-item">
                    De 10:00 a 18:00 h
                </li>
            </ul>
            </div>
            <div className="hours__content">
            <h3 className="hours__title">
                Horarios del curso
            </h3>
            <ul className="hours__list">
                <li className="hours__list-item">
                    De lunes a jueves
                </li>
                <li className="hours__list-item">
                    De 10:00 a 12:00 h
                </li>
            </ul>
            </div>
        </div>
    )
}

export default Hours;