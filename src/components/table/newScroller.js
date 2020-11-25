export class NewScroller {
  constructor(
      table,
      scrollerType,
      nativeTable,
      nativeHeadline,
      nativeScroller,
      sumsArray
  ) {
    this.table = table;
    this.nativeTable = nativeTable;
    this.nativeHeadline = nativeHeadline;
    this.nativeScroller = nativeScroller;
    this.sumsArray = sumsArray;
    this.indexOfCurrent = 0;
    this.indexOfLastInView = 0;

    this.scrollerType = scrollerType;
    if (scrollerType === 'OX') {
      this.propNames = {
        indent: 'left',
        coordinateFromEvent: 'clientX',
        rectLength: 'width',
        fillerType: 'horizontal',
      };
    } else {
      this.propNames = {
        indent: 'top',
        coordinateFromEvent: 'clientY',
        rectLength: 'height',
        fillerType: 'vertical',
      };
    }

    this._currentIndent = 0;
    this._currentIndex = 0;

    Object.defineProperties(this, {
      currentIndent: {
        set(value) {
          let index = this._currentIndex;
          const tableScroll = this.trackPxToTablePx(value);

          if (value < this._currentIndent) {
            while (this.sumsArray.sumBefore(index) > tableScroll) {
              index--;
            }
          } else {
            while (this.sumsArray.sumBefore(index) <= tableScroll) {
              index++;
            }
            index--;
          }
          this._currentIndex = index;
          this.setViewIndex(index);

          this._currentIndent = value;
          this.setViewIndent(value);
        },
        get() {
          return this._currentIndent;
        },
      },
      currentIndex: {
        set(value) {
          if (value > this.indexOfLastInView) {
            value = this.indexOfLastInView;
          }
          if (0 <= value) {
            this._currentIndex = value;
            this.setViewIndex(value);

            this._currentIndent = this.tablePxToTrackPx(this.sumsArray.sumBefore(value));
            this.setViewIndent(this._currentIndent);
          }
        },
        get() {
          return this._currentIndex;
        },
      },
    });

    this.refresh = this.refresh.bind(this);
  }

  setViewIndent(indent) {
    // this.nativeScroller.style.left = indent + 'px';
    this.nativeScroller.style[this.propNames.indent] = indent + 'px';
  }

  setViewIndex(index) {
    if (this.scrollerType === 'OX') {
      this.nativeTable.scrollTo(this.sumsArray.sumBefore(index), this.nativeTable.scrollTop);
      this.nativeHeadline.scrollTo(this.sumsArray.sumBefore(index), 0);
    } else {
      this.nativeTable.scrollTo(this.nativeTable.scrollLeft, this.sumsArray.sumBefore(index));
      this.nativeHeadline.scrollTo(0, this.sumsArray.sumBefore(index));
    }
  }

  changeCurrent(differ) {
    console.log('changeCurrent');
    if (0 <= this.currentIndex + differ && this.currentIndex + differ <= this.indexOfLastInView) {
      console.log('changeCurrent');
      this.currentIndex += differ;
    }
  }

  /**
   * Функция используемая для соответсвия количества
   * пикселей на скроллбаре и таблице.
   * @param x пиксели на скроллбаре.
   * @returns {number} соответсвующее числу x количество пикселей на таблице.
   */
  trackPxToTablePx(x) {
    return x * this.tableLength / this.trackLength;
  }

  /**
   * Функция используемая для соответсвия количества
   * пикселей на скроллбаре и таблице.
   * @param x пиксели на таблице.
   * @returns {number} соответсвующее числу x количество пикселей на скроллбаре.
   */
  tablePxToTrackPx(x) {
    return x * this.trackLength / this.tableLength;
  }

  handler(event) {
    // const startMousePosition = event.clientX;
    const startMousePosition = event[this.propNames.coordinateFromEvent];
    const startIndent = this.currentIndent;
    // const rightBorder =
    //  this.trackLength - this.nativeScroller.getBoundingClientRect().width;
    const rightBorder =
      this.trackLength - this.nativeScroller.getBoundingClientRect()[this.propNames.rectLength];

    const onmousemove = (function(event) {
      const differ = event[this.propNames.coordinateFromEvent] - startMousePosition;
      if (0 <= startIndent + differ) {
        if (startIndent + differ <= rightBorder) {
          this.currentIndent = startIndent + differ;
        } else {
          this.currentIndex = this.indexOfLastInView;
        }
      }
    }).bind(this);

    const onmouseup = (function(event) {
      console.log('onmouseup');
      this.table.eraseGlobalListener('mousemove');
      this.table.eraseGlobalListener('mouseup');
    }).bind(this);

    this.table.addGlobalListener('mousemove', onmousemove);
    this.table.addGlobalListener('mouseup', onmouseup);
  }


  refresh() {
    console.log('refresh');
    // const tableViewWidth = this.nativeTable.getBoundingClientRect().width;
    const tableViewLength = this.nativeTable.getBoundingClientRect()[this.propNames.rectLength];
    // this.trackLength =
    //  this.nativeScroller.parentNode.getBoundingClientRect().width;
    this.trackLength =
      this.nativeScroller.parentNode.getBoundingClientRect()[this.propNames.rectLength];

    this.tableLength = this.sumsArray.getTotalSum();
    this.indexOfLastInView = this.sumsArray.length - 1;

    if (this.tableLength <= tableViewLength) {
      this.indexOfLastInView = 0;
    } else {
      while (this.tableLength - this.sumsArray.sumBefore(this.indexOfLastInView) < tableViewLength) {
        this.indexOfLastInView--;
      }
      this.indexOfLastInView++;
    }
    const fillLength =
      tableViewLength - (this.tableLength - this.sumsArray.sumBefore(this.indexOfLastInView));
    this.tableLength += fillLength;

    this._refreshViewing(tableViewLength, fillLength);
  }

  _refreshViewing(tableViewLength, fillLength) {
    const selector = `.filler[data-filler=${this.propNames.fillerType}]`;
    this.table.cssRules.addRules({
      [selector]: {
        'flex': `0 0 ${fillLength}px`,
      },
    });

    this.nativeScroller.style[this.propNames.rectLength] =
      tableViewLength * 100 / this.tableLength + '%';

    this.currentIndex = this._currentIndex;
  }
}
