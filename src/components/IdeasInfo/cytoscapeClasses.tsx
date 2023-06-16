export namespace cytoscapeClasses {
    export const Node = (id: string, name: string, value: string, type: string, category: string, scope: string, classes: string, posX = 0, posY = 0) => ({
        data: {
            id,
            name,
            value,
            type,
            category,
            scope
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
}

export default cytoscapeClasses;