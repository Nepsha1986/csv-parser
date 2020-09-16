module.exports = {
    /*
     * Changes UPC's code to productCode of json Object according to mapping json.
     */
    // TODO: Update this code according to new requirements ( We have array of UPCs, but productCode is unique )
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

    /*
     * Removes unneeded keys and properties from json Object
     */
    removeRows: function (json, rows = []) {
        return json.map(item => {
            rows.forEach(row => {
                delete item[row];
            });

            return item;
        });
    },

    /*
    * Transforms properties in json Object from string to array.
    */
    renameKeys: function (json, keyMap) {
        return json.map(item => {
            for (let key of keyMap.keys()) {
                item[keyMap.get(key)] = item[key];
                delete item[key];
            }
            return item;
        });
    },

    /*
     * Transforms properties in json Object from string to array.
     */
    propsToArray: function (json, props = [], separator = ';\n') {
        return json.map(item => {
            props.forEach(i => {
                item[i] = item[i].split(separator);
            });
            return item;
        });
    },
};