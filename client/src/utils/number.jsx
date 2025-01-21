import numeral from "numeral";

export const formatPrice = (price) => {
    return numeral(price).format("0,0");
};