import kit from '/Kit-inicio.jpg';

function PricesCurse() {
    return (
      <div className="prices__curse">
      <p className="prices__paragraph">
        Cursos en línea**
      </p>
      <p className="prices__paragraph">
        $150.00
      </p>
      <img
      className="prices__image"
      src={kit}
      alt=""
      />
      </div>
    )
}

export default PricesCurse;