const csv = require('csvtojson');
const fs = require('fs');

const offersSCV = './input/offers.csv';
const UPCMapping = './input/KROGERMAL_SEMI_product_code-UPC_mapping.csv';

const unusedProps = [
    'Created On',
    'Status',
    'Qty Sold',
    'Qty Avl',
    'Sales',
    'Price',
    'Type',
    'Cities',
    'Merchant Name',
    'IIDs',
    'Offer ID'
];

const categoriesMap = new Map([
    ['Categories', 'сategories'],
    ['Offer Name', 'productName']
]);

const UPCToProductCode = (json, mappingJson) => {
    return json.map(productItem => {
        mappingJson.forEach(item => {
            if( productItem['UPCs'] === item['universalProductCode'] ) {
                productItem['productCode'] = item['product_code'];
                delete productItem['UPCs'];
            }
        });

        return productItem;
    });
};

const removeRows = (json, rows = []) => {
    return json.map(item => {
        rows.forEach(row => {
            delete item[row];
        });

        return item;
    });
};

const renameKeys = (json, keyMap) => {
    return json.map(item => {
        for (let key of keyMap.keys()) {
            item[keyMap.get(key)] = item[key];
            delete item[key];
        }
        return item;
    });
};

const propsToArray = (json, props = [], separator = ';\n') => {
    return json.map(item => {
        props.forEach(i => {
            item[i] = item[i].split(separator);
        });
        return item;
    });
};

let runTransformation = async () => {
    let catalogToJson = await csv().fromFile(offersSCV).then((jsonObj) => jsonObj);
    let UPCMappingToJson = await csv().fromFile(UPCMapping).then((jsonObj) => jsonObj);

    return UPCToProductCode(
        propsToArray(
            renameKeys(
                removeRows(catalogToJson, unusedProps),
                categoriesMap
            ),
            ['сategories']
        )
        , UPCMappingToJson);
};

runTransformation().then((jsObj => {
    fs.writeFileSync(
        './output/offers.json',
        JSON.stringify(jsObj)
    );
}));