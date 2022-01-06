

export default async function GetAmazonWishlists(url) {
    try {
        fetch('https://www.amazon.com/hz/wishlist/ls/2DBZG6DZGIYXS', {
            method: "POST"
        })
            .then(response => response.json())
            .then(data => console.log(data))
    } catch (e) {

    }


    return "test"
}

