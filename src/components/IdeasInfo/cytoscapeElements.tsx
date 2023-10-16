import Elements from "../../@types/IdeasGraphElements";
import IDataTree from "../../interfaces/IDataTree";
import * as graph from './cytoscapeTypes';

class cytoscapeElements {

    jsonElements : Elements = {
        nodes: new Map<string, cytoscape.ElementDefinition>(),
        edges: new Map<string, cytoscape.ElementDefinition>()
    };

    clear = () => {
        this.jsonElements.nodes = new Map<string, cytoscape.ElementDefinition>();
        this.jsonElements.edges = new Map<string, cytoscape.ElementDefinition>();
    };

    extractValue = (value: any) : any => {
      if (Array.isArray(value))
        return('Array');

      if (typeof value === 'object')
        return ('Object');

      if (isNaN(value))
          return value;
      
      return value ? parseFloat(value).toFixed(2).toString() : '';
    };
    
    extractCompleteValue = (value: any) : any => {
      if (Array.isArray(value))
        return value.map( (e) => (e.info ? e.info : 'invalid array') ).join(', ');

      if (typeof value === 'object')
        return JSON.stringify(value);

      if (isNaN(value))
          return value;
      
      return value ? value : '';
    };

    getLabelFormat = (value: any) : any => {
        if (value.length > 7)
            return value.substring(0,8) + '...';
        
        return value;
    };

    removeNodeDataElements = (ids: Set<string>, parsedElements: Elements) => {

        parsedElements.nodes.forEach(function (value: any, key: string) {
            if (!ids.has(key)) {
            parsedElements.nodes.delete(key);
            }
        });
        
        parsedElements.edges.forEach(function (value: any, key: string) {
            if (!ids.has(value.data.source) || !ids.has(value.data.target)) {
            parsedElements.edges.delete(key);
            }
        });
    
    };
      
    parseNodeDataSubElement = (values: any, edgeId: string, ids: Set<string>, parsedElements: Elements) => {
        values.info.forEach(function (value: any) {      
            const type = (value.info[4] == null || value.info[4].info == null) ? '' : 'type' + value.info[4].info;
            ids.add(value.info[0].info);
            // Get sub nodes
            parsedElements.nodes.set(value.info[0].info, graph.Node(value.info[0].info, // id
                                                                    value.info[1].info, // name
                                                                    this.extractCompleteValue(value.info[2].info), // value
                                                                    value.info[4].info, // type
                                                                    value.info[5].info, // category
                                                                    value.info[6].info, // scope
                                                                    value.info[0].info + '\n\n' + this.getLabelFormat(this.extractValue(value.info[2].info)),
                                                                    "ellipse " + type));
            // Get node edge
            parsedElements.edges.set(edgeId + '_' + value.info[0].info, graph.Edge(edgeId, value.info[0].info, ''));
        
            if (value.info[3].info.length > 0 ) {
                this.parseNodeDataSubElement(value.info[3], value.info[0].info, ids, parsedElements);
            }
        }.bind(this));
    };
    
    parseNodeData = (nodeData: IDataTree | undefined, index: number) : Elements => {
    
        const ids = new Set<string>();
        const parsedElements: Elements = {
            nodes: new Map<string, cytoscape.ElementDefinition>(this.jsonElements.nodes),
            edges: new Map<string, cytoscape.ElementDefinition>(this.jsonElements.edges)
        }
        
        if (nodeData && nodeData.values && nodeData.values[index] && nodeData.values[index].y && nodeData.values[index].y.info) {
            const node = nodeData.values[index];
            
            node.y.info.forEach(function (value: any) {
                
                if (value.hasChildren) {
                    // This children node refers to the root node.
                    const type = (node.y.info[4] == null || node.y.info[4].info == null) ? '' : 'type' + node.y.info[4].info;
                    ids.add(node.y.info[0].info);
                    parsedElements.nodes.set(node.y.info[0].info, graph.Node(node.y.info[0].info, // id
                                            node.y.info[1].info, // name
                                            this.extractCompleteValue(node.y.info[2].info),
                                            node.y.info[4].info, // type
                                            node.y.info[5].info, // category
                                            node.y.info[6].info, // scope
                                            node.y.info[0].info + '\n\n' + this.extractValue(node.y.info[2].info),
                                            "ellipse-double " + type));
            
                    // Every other node related to this root is identified by the function below
                    this.parseNodeDataSubElement(value, node.y.info[0].info, ids, parsedElements);
                }
            }.bind(this));
        }
        
        this.removeNodeDataElements(ids, parsedElements);
        
        return parsedElements;
    };

    compareNodeData = (cyRef: any, currentElements: Elements, latestElements: Elements) : boolean => {

        let hasChanged = false;
    
        if (currentElements.nodes.size === 0) {
          currentElements.nodes = latestElements.nodes;
          currentElements.edges = latestElements.edges;
        } else {
          // Remove nodes that are not present in the new nodeData
          currentElements.nodes.forEach (function(value, key) {
            if (!latestElements.nodes.has(key)) {
              cyRef.current?.$id(key).remove();
              currentElements.nodes.delete(key);
              (cyRef.current?.elements().$id(key) as any).tippy?.destroy();
              (cyRef.current?.elements().$id(key) as any).tippy = undefined;
              hasChanged = true;
            }
          })
    
          // Remove edges that are not present in the new nodeData
          currentElements.edges.forEach (function(value, key) {
            if (!latestElements.edges.has(key)) {
              cyRef.current?.$id(key).remove();
              currentElements.edges.delete(key);
              hasChanged = true;
            }
          })
    
          // Add nodes that are not present in the current graph
          latestElements.nodes.forEach (function(value, key) {  
            if (!currentElements.nodes.has(key)) {
              cyRef.current?.add(value);
              currentElements.nodes.set(key, value);
              hasChanged = true;
            }
          })
    
          // Add edges that are not present in the current graph
          latestElements.edges.forEach (function(value, key) {  
            if (!currentElements.edges.has(key)) {
              cyRef.current?.add(value);
              currentElements.edges.set(key, value);
              hasChanged = true;
            }
          })
        }
    
        return hasChanged;
      };

}

export default cytoscapeElements;