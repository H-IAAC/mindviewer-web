import tippy from 'tippy.js';
import styles from './styles.module.css';

class cytoscapePopper {

    destroyPopper = (cyRef: any) => {
        cyRef.current!.elements().nodes().forEach(function(ele : any) {
            ele.tippy?.destroy();
            ele.tippy = undefined;
        });    
    };
      
    makePopper = (ele: cytoscape.NodeSingular | any, showInfo: boolean, fullScreen: boolean) => {
        const tippysDiv = document.getElementById('tippys');
        (fullScreen) ? tippysDiv!.className = styles.tippysFullscreen : tippysDiv!.className = styles.tippys;
        
        ele.tippy?.destroy();
        
        ele.tippy = tippy(document.createElement('div'), {
            content: () => {
            const content = document.createElement("div");
            content.style.padding = '4px 4px 4px 4px';
        
            if (showInfo) {
                content.innerHTML = ele.data('name'); /*+
                                    '<br>' +
                                    ele.data('value');*/
                content.style.fontSize = "12px";
                content.style.textAlign = "center"
            } else {
                content.innerHTML = "Name: " + ele.data('name') + '<br>' +
                                    "Value: " + ele.data('value') + '<br>' +
                                    "Type: " + ele.data('type') + '<br>' +
                                    "Category: " + ele.data('category') + '<br>' +
                                    "Scope: " + ele.data('scope');
                content.style.backgroundColor = "#e9e9e9";
                content.style.border = "1px solid black";
            }
            
            return content;
            },
            hideOnClick: (showInfo) ? false : true,
            placement: (showInfo) ? "bottom" : 'right',
            zIndex: 2,
            flip: true,
            appendTo: () =>  tippysDiv!,
            popperOptions: {
            modifiers: {
                flip: {
                boundariesElement: 'scrollParent',
                },
            }
            },
            onShow(instance) {
            instance.popperInstance!.reference = ele.popperRef();
            }
        });
        
        ele.tippy.showInfo = showInfo;
        ele.tippy.fullScreen = fullScreen;
        
        if (showInfo) ele.tippy?.show();
    };
}

export default cytoscapePopper;
