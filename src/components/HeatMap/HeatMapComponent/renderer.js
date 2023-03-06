const hasPositionChanged = ({ pos, prevPos }) => pos !== prevPos;

const valueInRange = ({ minScale, maxScale, scale }) => scale <= maxScale && scale >= minScale;

const getTranslate = ({ minScale, maxScale, scale }) => ({ pos, prevPos, translate }) =>
  valueInRange({ minScale, maxScale, scale }) && hasPositionChanged({ pos, prevPos })
    ? translate + (pos - prevPos * scale) * (1 - 1 / scale)
    : translate;

const getScale = ({ scale, minScale, maxScale, scaleSensitivity, deltaScale }) => {
  let newScale = scale + (deltaScale / (scaleSensitivity / scale));
  newScale = Math.max(minScale, Math.min(newScale, maxScale));
  return [scale, newScale];
};

const getMatrix = ({ scale, translateX, translateY }) => `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;

const pan = ({ state, originX, originY }) => {
  const { left, top, right, bottom } = state.element.getBoundingClientRect();
  //console.log(`${left} ${top} ${right} ${bottom}`);

  if (left + originX <= state.initialPosition.left && right + originX >= state.initialPosition.right) {
    state.transformation.translateX += originX;
  }
  
  if (top + originY <= state.initialPosition.top && bottom + originY >= state.initialPosition.bottom) {
    state.transformation.translateY += originY;
  }
  
  state.element.style.transform =
    getMatrix({ scale: state.transformation.scale, translateX: state.transformation.translateX, translateY: state.transformation.translateY });
};

const makePan = (state) => ({
  panBy: ({ originX, originY }) => pan({ state, originX, originY }),
  panTo: ({ originX, originY, scale }) => {
    state.transformation.scale = scale;
    pan({ state, originX: originX - state.transformation.translateX, originY: originY - state.transformation.translateY });
  },
});

const makeZoom = (state) => ({
  zoom: ({ x, y, deltaScale }) => {
    const { left, top, right, bottom } = state.element.getBoundingClientRect();
    //console.log(`${state.initialPosition.left} ${left}`);

    const { minScale, maxScale, scaleSensitivity } = state;
    const [ scale, newScale ] = getScale({ scale: state.transformation.scale, deltaScale, minScale, maxScale, scaleSensitivity });
    const originX = x - left;
    const originY = y - top;
    let newOriginX = originX / scale;
    let newOriginY = originY / scale;
    const translate = getTranslate({ scale, minScale, maxScale });
    let newTranslateX = translate({ pos: originX, prevPos: state.transformation.originX, translate: state.transformation.translateX });
    let newTranslateY = translate({ pos: originY, prevPos: state.transformation.originY, translate: state.transformation.translateY });

    //console.log(state.transformation.translateX)
    if (left + newTranslateX - state.transformation.translateX > state.initialPosition.left ) {
      newTranslateX = 0;
      newOriginX = state.initialPosition.left;
    }
    if (right + newTranslateX - state.transformation.translateX < state.initialPosition.right) {
      newTranslateX = 0;
      newOriginX = state.initialPosition.right;
    }
    if (top + newTranslateY - state.transformation.translateY > state.initialPosition.top) {
      newTranslateY = 0;
      newOriginY = state.initialPosition.top;
    }
    if (bottom + newTranslateY - state.transformation.translateY < state.initialPosition.bottom) {
      newTranslateY = 0;
      newOriginY = state.initialPosition.bottom;
    }

    state.element.style.transformOrigin = `${newOriginX}px ${newOriginY}px`;
    state.element.style.transform = getMatrix({ scale: newScale, translateX: newTranslateX, translateY: newTranslateY });
    state.transformation = { originX: newOriginX, originY: newOriginY, translateX: newTranslateX, translateY: newTranslateY, scale: newScale };
  }
});

const renderer = ({ minScale, maxScale, element, scaleSensitivity = 50 }) => {
  const { left, top, right, bottom } = element.getBoundingClientRect();

  const state = {
    element,
    minScale,
    maxScale,
    scaleSensitivity,
    transformation: {
      originX: 0,
      originY: 0,
      translateX: 0,
      translateY: 0,
      scale: 1
    },
    initialPosition: {
      left,
      top,
      right,
      bottom
    }
  };
  return Object.assign({}, makeZoom(state), makePan(state));
};

export {renderer};