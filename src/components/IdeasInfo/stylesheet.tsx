import cytoscape from "cytoscape";
import iconType0 from '../../assets/ideas/object-e.png';
import iconType1 from '../../assets/ideas/property.png';
import iconType2 from '../../assets/ideas/object2.png';
import iconType3 from '../../assets/ideas/qualityDim.png';
import iconType4 from '../../assets/ideas/codelet2.png';
import iconType5 from '../../assets/ideas/object.png';
import iconType6 from '../../assets/ideas/object2_agregate.png';
import iconType7 from '../../assets/ideas/configuration.png';
import iconType8 from '../../assets/ideas/time-machine.png';
import iconType9 from '../../assets/ideas/propertyCategory.png';
import iconType10 from '../../assets/ideas/objectCategory.png';
import iconType11 from '../../assets/ideas/episodeCategory.png';
import iconType12 from '../../assets/ideas/property-p.png';
import iconType13 from '../../assets/ideas/object-p.png';
import iconType14 from '../../assets/ideas/episode-p.png';
import iconType15 from '../../assets/ideas/action-p.png';
import iconType16 from '../../assets/ideas/action-e.png';
import iconType17 from '../../assets/ideas/action-l.png';
import iconType18 from '../../assets/ideas/goal.png';

const stylesheet: cytoscape.Stylesheet[] = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        height: "100",
        width: "100",
        "text-valign": "center",
        "text-halign": "center",
        "text-margin-y": -16,
        "background-color": "LightGray",
        "border-color": "black",
        "border-width": 2,
        "font-size": "14",
        "text-wrap": "wrap"
      }
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "target-arrow-shape": "triangle",
        "line-color": "green",
        "target-arrow-color": "green",
        "curve-style": "bezier"
      }
    },
    {
      selector: '.ellipse',
      style: {
          shape: 'ellipse'
      }
    },
    {
      selector: '.ellipse-double',
      style: {
          shape: 'ellipse',
          "border-color": "black",
          "border-width": 10,
          "border-style": 'double'
      }
    },
    {
      selector: '.type0',
      style: {
        'background-color': '#92d4aa',
        'background-image': iconType0,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type1',
      style: {
        'background-color': '#d8e9a1',
        'background-image': iconType1,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type2',
      style: {
        'background-color': '#ffa894',
        'background-image': iconType2,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type3',
      style: {
        'background-color': 'WhiteSmoke',
        'background-image': iconType3,
        'background-width': '30%',
        'background-height': '30%',
        'background-position-y': '85%'
      }
    },
    {
      selector: '.type4',
      style: {
        'background-color': '#e7f4dc',
        'background-image': iconType4,
        'background-width': '35%',
        'background-height': '35%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type5',
      style: {
        'background-color': '#ffafe1',
        'background-image': iconType5,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type6',
      style: {
        'background-color': '#ffb7a6',
        'background-image': iconType6,
        'background-width': '35%',
        'background-height': '35%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type7',
      style: {
        'background-color': '#ffffbe',
        'background-image': iconType7,
        'background-width': '30%',
        'background-height': '30%',
        'background-position-y': '85%'
      }
    },
    {
      selector: '.type8',
      style: {
        'background-color': '#d3edf8',
        'background-image': iconType8,
        'background-width': '35%',
        'background-height': '35%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type9',
      style: {
        'background-color': '#ffdbb9',
        'background-image': iconType9,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type10',
      style: {
        'background-color': '#e6bd86',
        'background-image': iconType10,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type11',
      style: {
        'background-color': '#fee3d0',
        'background-image': iconType11,
        'background-width': '35%',
        'background-height': '35%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type12',
      style: {
        'background-color': '#d6dbf1',
        'background-image': iconType12,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type13',
      style: {
        'background-color': '#9dd3f5',
        'background-image': iconType13,
        'background-width': '40%',
        'background-height': '40%',
        'background-position-y': '90%'      
      }
    },
    {
      selector: '.type14',
      style: {
        'background-color': '#e5eeff',
        'background-image': iconType14,
        'background-width': '35%',
        'background-height': '35%',
        'background-position-y': '90%'
      }
    },
    {
      selector: '.type15',
      style: {
        'background-color': '#89d5f0',
        'background-image': iconType15,
        'background-width': '30%',
        'background-height': '30%',
        'background-position-y': '85%'
      }
    },
    {
      selector: '.type16',
      style: {
        'background-color': '#cfe2cf',
        'background-image': iconType16,
        'background-width': '30%',
        'background-height': '30%',
        'background-position-y': '85%'
      }
    },
    {
      selector: '.type17',
      style: {
        'background-color': '#fcd7ca',
        'background-image': iconType17,
        'background-width': '30%',
        'background-height': '30%',
        'background-position-y': '85%'
      }
    },
    {
      selector: '.type18',
      style: {
        'background-color': '#99bae6',
        'background-image': iconType18,
        'background-width': '37%',
        'background-height': '37%',
        'background-position-y': '90%'
      }
    }
  ];


export default stylesheet;