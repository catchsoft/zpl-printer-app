const serializeOrDeserialize = {
    serialize: JSON.stringify,
    deserialize: JSON.parse
};

export function getItem(key) {
    try {
        let item = window.localStorage.getItem(key);
        item = serializeOrDeserialize.deserialize(item)[key];
        return item;
    } catch (e) {
        return null;
    }
}

export function setItem(key, item) {
    window.localStorage.setItem(key, serializeOrDeserialize.serialize({[key]: item}));

    window.dispatchEvent(
        new CustomEvent('local-storage', {
            detail: {
                key,
                value: item
            }
        })
    );
}
