const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = './input/offers.csv';

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

csv().fromFile(csvFilePath).then((jsonObj) => {
    fs.writeFileSync(
        './output/offers.json',
        JSON.stringify(propsToArray(renameKeys(removeRows(jsonObj, unusedProps), categoriesMap), ['сategories']))
    );
});

