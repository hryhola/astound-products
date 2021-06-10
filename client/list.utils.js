const masterProductTemplate = require("./components/masterProduct.handlebars");

export const buildTile = (masterProduct) => {
    const isSelectedIndex = masterProduct.variations.findIndex(v => v.isSelected);

    const templateData = { ...masterProduct, ...masterProduct.variations[isSelectedIndex] };
    templateData.variations = templateData.variations.map(v => ({...v, master: masterProduct.ID }));
    templateData.available = templateData.price !== undefined;
    return masterProductTemplate(templateData);
};

export const buildList = (masterProdutctList) => masterProdutctList.map((m) => buildTile(m)).join("");
