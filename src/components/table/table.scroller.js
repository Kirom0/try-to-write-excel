export function shouldScroll(event, $target) {
  return ($target.dataset['type'] === 'scroller');
}

export class ScrollController {
  constructor(tableComponent) {
    this.table = tableComponent;
  }

  init() {
    this.nativeTable = document.querySelector('.table');
    this.nativeHScroller = // Horizontal Scroller
      document.querySelector('[data-scroller=horizontal]');
    this.nativeRScroller = // Vertival Scroller
      document.querySelector('[data-scroller=vertical]');
    this.refresh();
  }

  scrollHandler(event, $target) {
    const isHorizontal = $target.dataset['scroller'] === 'horizontal';
    const nativeHeadline =
      isHorizontal ?
        document.querySelector('[data-type=columnsHeadline]') :
        document.querySelector('[data-type=rowsHeadline]');
    // eslint-disable-next-line no-debugger
    // debugger;
    const getCoordinate = (event) => {
      return isHorizontal ? event.clientX : event.clientY;
    };
    const getTableScrollLength = () => {
      return isHorizontal ? this.tableScrollWidth : this.tableScrollHeight;
    };
    const getTableLength = () => {
      return isHorizontal ? this.tableWidth : this.tableHeight;
    };
    const getScrollerLength = () => {
      return isHorizontal ? this.scrollerWidth : this.scrollerHeight;
    };
    const getTrackLength = () => {
      return isHorizontal ? this.trackWidth : this.trackHeight;
    };
    const getTableScroll = () => {
      return isHorizontal ?
        this.nativeTable.scrollLeft :
        this.nativeTable.scrollTop;
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
        console.log(`scrollTo(${indent},${this.nativeTable.scrollTop})`);
        this.nativeTable.scrollTo(indent, this.nativeTable.scrollTop);
        nativeHeadline.scrollTo(indent, 0);
      } else {
        console.log(`scrollTo(${this.nativeTable.scrollLeft},${indent})`);
        this.nativeTable.scrollTo(this.nativeTable.scrollLeft, indent);
        nativeHeadline.scrollTo(0, indent);
      }
    };

    let startCoordinate = isHorizontal ? event.clientX : event.clientY;
    let startIndent =
      parseInt(isHorizontal ? $target.style.left : $target.style.top) || 0;


    console.log(startCoordinate, startIndent);

    const onmousemove = (function(event) {
      // eslint-disable-next-line no-debugger
      // debugger;
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
      const array = isHorizontal ? this.table.columnSizes : this.table.rowSizes;
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
    }).bind(this);

    const onmouseup = (event) => {
      console.log('onmouseup');
      this.table.eraseGlobalListener('mousemove', onmousemove);
      this.table.eraseGlobalListener('mouseup', onmouseup);
    };

    this.table.addGlobalListener('mousemove', onmousemove);
    this.table.addGlobalListener('mouseup', onmouseup);
  }

  refresh() {
    const getTableLength = (isHorizontal) => {
      return isHorizontal ? this.tableWidth : this.tableHeight;
    };

    const getFillerLength = (isHorizontal) => {
      let accum = 0;
      const tableLength = getTableLength(isHorizontal);
      const array = isHorizontal ? this.table.columnSizes : this.table.rowSizes;
      for (let i = array.length - 1; i >= 0; i--) {
        accum += array[i];
        if (accum >= tableLength) {
          accum -= array[i];
          break;
        }
      }
      return tableLength - accum;
    };

    this.table.cssRules.addRules({
      '.filler[data-filler=horizontal]': {
        'flex': `0 0 ${getFillerLength(true)}px`,
      },
      '.filler[data-filler=vertical]': {
        'flex': `0 0 ${getFillerLength(false)}px`,
      },
    });

    this.trackWidth = this.nativeHScroller.parentElement.scrollWidth;
    this.trackHeight = this.nativeRScroller.parentElement.scrollHeight;

    ({
      width: this.tableWidth,
      height: this.tableHeight,
    } = this.nativeTable.getBoundingClientRect());

    ({
      scrollWidth: this.tableScrollWidth,
      scrollHeight: this.tableScrollHeight,
    } = this.nativeTable);

    this.leftBorderTrackWidth = (this.tableScrollWidth - this.tableWidth);
    this.topBorderTrackHeight = (this.tableScrollHeight - this.tableHeight);

    this.nativeHScroller.style.width =
      Math.floor(this.trackWidth * 100 / this.tableScrollWidth) + '%';
    this.nativeRScroller.style.height =
      Math.floor(this.trackHeight * 100 / this.tableScrollHeight) + '%';
  }
}

/* export function scrollHandler(table, event, $target) {
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
*/
