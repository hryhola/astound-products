import listTemplate from "./list.handlebars";

export const getMasterProductData = (masterProduct) => {
    const isSelectedIndex = masterProduct.variations.findIndex((v) => v.isSelected);

    const templateData = { ...masterProduct, ...masterProduct.variations[isSelectedIndex] };
    templateData.variations = templateData.variations.map((v) => ({ ...v, master: masterProduct.ID }));
    templateData.available = templateData.price !== undefined;
    return templateData;
};

export const buildList = (masterProdutctList, pagination) => {
    const list = listTemplate({
        item: masterProdutctList.map(i => getMasterProductData(i)),
        pagination,
    });
    return list;
};
