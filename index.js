const csv = require('csvtojson');
const fs = require('fs');
const $ = require('./transformations');

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

let runTransformation = async () => {
    let catalogToJson = await csv().fromFile(offersSCV).then((jsonObj) => jsonObj);
    let UPCMappingToJson = await csv().fromFile(UPCMapping).then((jsonObj) => jsonObj);

    return $.UPCToProductCode(
        $.propsToArray(
            $.renameKeys(
                $.removeRows(catalogToJson, unusedProps),
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