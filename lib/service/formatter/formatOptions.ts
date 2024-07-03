export const formatOptionsChildren = (items, res = []) => {
    items.forEach((item) => {
        const formattedItem = {
            value: item.id,
            label: item.name,
            identifier: item.identifier,
            children: formatOptionsChildren(item.children),
        };
        res.push(formattedItem);
    });

    return res;
};

export const formatOptions = (items, t = undefined) => {
    return items.map((item) => ({
        value: item.id,
        label: typeof t !== 'undefined' ? t(item.name) : item.name,
        identifier: item.identifier,
    }));
};

export const formatMultiOptionsValue = (
    items: string[] | number[],
    options: { value: string | number }[]
) => {
    return items?.map((item) => options.find((op) => op.value === item));
};

export const handleMultiOptionsOnChange = (event, onChange) => {
    onChange(event.map((item: { value: number }) => item.value));
};
