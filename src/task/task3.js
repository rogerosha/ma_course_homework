function remapGoods(goods) {
    return goods.map((good) => {
    return {
    type: good.type || '',
    color: good.color || '',
    quantity: good.quantity || 0,
    price: good.price || good.priceForPair || '',
    }
    })
    }
    
    module.exports = {
    remapGoods,
    }