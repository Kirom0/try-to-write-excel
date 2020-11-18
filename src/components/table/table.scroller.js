export function shouldScroll(event, $target) {
  return ($target.dataset['type'] === 'scroller');
}

export function scrollHandler(table, event, $target) {
  const parentDOMRect = $target.parent.getBoundingClientRect();
  const nativeTable = document.querySelector('.table');

  const {
    width: tableWidth,
    height: tableHeight,
  } = nativeTable.getBoundingClientRect();
  console.log('!!', tableWidth, tableHeight);
  const {
    scrollWidth: tableScrollWidth,
    scrollHeight: tableScrollHeight,
  } = nativeTable;
  console.log('!!!!', tableScrollWidth, tableScrollHeight);
  const {width: trackWidth, height: trackHeight} = parentDOMRect;
  const {
    width: scrollerWidth,
    height: scrollerHeight,
  } = $target.getBoundingClientRect();

  const isHorizontal = $target.dataset['scroller'] === 'horizontal';
  const nativeHeadline =
    isHorizontal ?
      document.querySelector('[data-type=columnsHeadline]') :
      document.querySelector('[data-type=rowsHeadline]');
  const getCoordinate = (event) => {
    return isHorizontal ? event.clientX : event.clientY;
  };
  const getTableScrollLength = () => {
    return isHorizontal ? tableScrollWidth : tableScrollHeight;
  };
  const getTableLength = () => {
    return isHorizontal ? tableWidth : tableHeight;
  };
  const getScrollerLength = () => {
    return isHorizontal ? scrollerWidth : scrollerHeight;
  };
  const getTrackLength = () => {
    return isHorizontal ? trackWidth : trackHeight;
  };
  const getTableScroll = () => {
    return isHorizontal ? nativeTable.scrollLeft : nativeTable.scrollTop;
  };
  const setIndent = (value) => {
    if (isHorizontal) {
      $target.style.left = value + 'px';
    } else {
      $target.style.top = value + 'px';
    }
  };
  const scrollTo = (indent) => {
    if (isHorizontal) {
      console.log(`scrollTo(${indent},${nativeTable.scrollTop})`);
      nativeTable.scrollTo(indent, nativeTable.scrollTop);
      nativeHeadline.scrollTo(indent, 0);
    } else {
      console.log(`scrollTo(${nativeTable.scrollLeft},${indent})`);
      nativeTable.scrollTo(nativeTable.scrollLeft, indent);
      nativeHeadline.scrollTo(0, indent);
    }
  };

  let startCoordinate = isHorizontal ? event.clientX : event.clientY;
  let startIndent =
    parseInt(isHorizontal ? $target.style.left : $target.style.top) || 0;


  console.log(startCoordinate, startIndent);

  const onmousemove = (event) => {
    const currentCoordinate = getCoordinate(event);
    let indent = startIndent + (currentCoordinate - startCoordinate);
    if (indent < 0) {
      console.log(indent, startIndent, currentCoordinate, startCoordinate);
      indent = 0;
      startCoordinate = currentCoordinate;
      startIndent = indent;
    } else if (indent + getScrollerLength() > getTrackLength()) {
      indent = getTrackLength() - getScrollerLength();
      startCoordinate = currentCoordinate;
      startIndent = indent;
    }
    console.log(indent, currentCoordinate, indent + getScrollerLength());
    setIndent(indent);
    const t =
      Math.round(indent * (getTableScrollLength() - getTableLength()) /
        (getTrackLength() - getScrollerLength()));
    console.log('t', t);
    let accum = 0;
    const array = isHorizontal ? table.columnSizes : table.rowSizes;
    for (let i = 0; i < array.length; i++) {
      accum += array[i];
      if (accum > t) {
        accum -= array[i];
        if (getTableScroll() !== accum) {
          scrollTo(accum);
        }
        break;
      }
    }
  };

  const onmouseup = (event) => {
    console.log('onmouseup');
    table.eraseGlobalListener('mousemove', onmousemove);
    table.eraseGlobalListener('mouseup', onmouseup);
  };

  table.addGlobalListener('mousemove', onmousemove);
  table.addGlobalListener('mouseup', onmouseup);
}

export function initScroll(table) {
  const nativeTable = document.querySelector('.table');
  const nativeHScroller = // Horizontal Scroller
    document.querySelector('[data-scroller=horizontal]');
  const nativeRScroller = // Vertival Scroller
    document.querySelector('[data-scroller=vertical]');
  const trackWidth = nativeHScroller.parentElement.scrollWidth;
  const trackHeight = nativeRScroller.parentElement.scrollHeight;
  const {
    width: tableWidth,
    height: tableHeight,
  } = nativeTable.getBoundingClientRect();

  const getTableLength = (isHorizontal) => {
    return isHorizontal ? tableWidth : tableHeight;
  };

  const getFillerLength = (isHorizontal) => {
    let accum = 0;
    const tableLength = getTableLength(isHorizontal);
    const array = isHorizontal ? table.columnSizes : table.rowSizes;
    for (let i = array.length - 1; i >= 0; i--) {
      accum += array[i];
      if (accum >= tableLength) {
        accum -= array[i];
        break;
      }
    }
    return tableLength - accum;
  };

  // eslint-disable-next-line no-debugger
  // debugger;
  table.cssRules.addRules({
    '.filler[data-filler=horizontal]': {
      'flex': `0 0 ${getFillerLength(true)}px`,
    },
    '.filler[data-filler=vertical]': {
      'flex': `0 0 ${getFillerLength(false)}px`,
    },
  });

  const {
    scrollWidth: tableScrollWidth,
    scrollHeight: tableScrollHeight,
  } = nativeTable;
  nativeHScroller.style.width =
    Math.floor(trackWidth * 100 / tableScrollWidth) + '%';
  nativeRScroller.style.height =
    Math.floor(trackHeight * 100 / tableScrollHeight) + '%';
}
