const csv = require('csvtojson');
const fs = require('fs');
const $ = require('./transformations');

const offersSCV = './input/offers-example.csv';
const UPCMapping = './input/mapping-example.csv';

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

let runProductsTransformation = async (OffersCSVUrlPath, UPCMappingPath) => {
    let catalogToJson = await csv().fromFile(OffersCSVUrlPath).then((jsonObj) => jsonObj);
    let UPCMappingToJson = await csv().fromFile(UPCMappingPath).then((jsonObj) => jsonObj);

    let withoutRows = $.removeRows(catalogToJson, unusedProps);
    let withRemanedKeys = $.renameKeys(withoutRows, categoriesMap);
    let withTransformedArrays = $.propsToArray(withRemanedKeys, ['сategories']);

    return $.UPCToProductCode(withTransformedArrays, UPCMappingToJson);
};

runProductsTransformation(offersSCV, UPCMapping).then((jsObj => {
    fs.writeFileSync(
        './output/offers-example.json',
        JSON.stringify(jsObj)
    );
}));