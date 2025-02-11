function PricesLi(props) {
    const { name, prices } = props.price
    return(
        <li className="prices__list-item">
            🌟 {name} -- {prices}
        </li>
    )
}

export default PricesLi;