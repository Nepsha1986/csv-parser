module.exports = {
    UPCToProductCode: function (json, mappingJson) {
        return json.map(productItem => {
            mappingJson.forEach(item => {
                if (productItem['UPCs'] === item['universalProductCode']) {
                    productItem['productCode'] = item['product_code'];
                    delete productItem['UPCs'];
                }
            });

            return productItem;
        });
    },

    removeRows: function (json, rows = []) {
        return json.map(item => {
            rows.forEach(row => {
                delete item[row];
            });

            return item;
        });
    },

    renameKeys: function (json, keyMap) {
        return json.map(item => {
            for (let key of keyMap.keys()) {
                item[keyMap.get(key)] = item[key];
                delete item[key];
            }
            return item;
        });
    },

    propsToArray: function (json, props = [], separator = ';\n') {
        return json.map(item => {
            props.forEach(i => {
                item[i] = item[i].split(separator);
            });
            return item;
        });
    },
};