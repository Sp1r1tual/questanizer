import { localizeKeys } from "./localize-keys.js";

const getLocalized = async (userId, itemName) => {
    if (!itemName) return "";

    return localizeKeys(userId, `shared.items.${itemName}`);
};

const localizeNestedItems = async (userId, items) => {
    return Promise.all(
        items.map(async (entry) => {
            const localizedName = await getLocalized(userId, entry.item.name);

            return {
                ...(entry.toObject?.() ?? entry),
                item: {
                    ...(entry.item.toObject?.() ?? entry.item),
                    name: localizedName,
                },
            };
        })
    );
};

const localizeSimpleItems = async (userId, items) => {
    return Promise.all(
        items.map(async (item) => {
            const localizedName = await getLocalized(userId, item.name);

            return {
                ...(item.toObject?.() ?? item),
                name: localizedName,
            };
        })
    );
};

export { localizeNestedItems, localizeSimpleItems };
