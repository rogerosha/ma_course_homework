function filterGoods(goods, property, value) {
    return goods.filter((good) => good[property] === value);
    }
    
    module.exports = {
    filterGoods,
    }