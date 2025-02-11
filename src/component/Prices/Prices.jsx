import PricesUl from "./PricesUl/PricesUl";
import PricesCurse from "./PricesCurse/PricesCurse"
import { prices } from "@utils/pricesList";
import "@assets/blocks/Prices.css"

function Prices() {
    return (
        <div className="prices">
            <h2 className="prices__title">
                Precios, desde*
            </h2>
            <PricesUl item={prices} />
            <PricesCurse  />
        </div>
    )
}

export default Prices;