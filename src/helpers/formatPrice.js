const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});



export default function formatPrice(price) {
    price = parseInt(price)
    if(isNaN(price)) {
        return undefined
    }
    return formatter.format(price);
}

