import PricesLi from "../PricesLi/PricesLi";

function PricesUl(props) {
    const { item } = props;

    // Transformar los elementos a mayúsculas
    const uppercasedItems = item.map(price => {
        return {
            ...price,
            name: price.name.toUpperCase()
        };
    });

    return (
        <div className="prices__contents">
            <ul className="prices__list">
                {uppercasedItems.map(price => (
                    <PricesLi key={price.id} price={price} />
                ))}
            </ul>
        </div>
    );
}

export default PricesUl;
