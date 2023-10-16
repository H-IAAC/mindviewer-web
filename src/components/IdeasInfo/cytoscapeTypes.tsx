export const Node = (id: string, name: string, value: string, type: string, category: string, scope: string, label: string, classes: string, posX = 0, posY = 0) => ({
    data: {
        id,
        name,
        value,
        type,
        category,
        scope,
        label
    },
    position: {
        x: posX,
        y: posY
    },
    classes
});

export const Edge = (source: string, target: string, label = '') => ({
    data: { source, target, label }
});
