export class NewResizer {
  static minimumLength = 24;

  constructor(table, type, sumsArray) {
    this.table = table;
    this.type = type;
    this.sumsArray = sumsArray;

    this.prepare();
  }

  prepare() {
    if (this.type === 'OX') {
      this.propsNames = {
        coordinateFromEvent: 'clientX',
        corr: 'column', // column or row :)
        Lort: 'Left', // Left or Top :)
      };
    } else {
      this.propsNames = {
        coordinateFromEvent: 'clientY',
        corr: 'row', // column or row :)
        Lort: 'Top', // Left or Top :)
      };
    }
    this.propsNames.lort = this.propsNames.Lort.toLowerCase();
  }

  init(nativeTable, nativeResizer) {
    this.nativeTable = nativeTable;
    this.nativeResizer = nativeResizer;

    this.spaceBeforeTable = this.nativeTable.getBoundingClientRect()[this.propsNames.lort];
  }

  calcLength(currentPosition, targetSpaceBefore) {
    return (currentPosition - this.spaceBeforeTable) +
      this.nativeTable[`scroll${this.propsNames.Lort}`] - targetSpaceBefore;
  }

  startViewConversion(target, targetIndex, targetSpaceBefore) {
    target.style.opacity = 1;
    this.nativeResizer.style.display = 'block';
    this.tryOnTargetResizer(target, targetSpaceBefore, this.sumsArray.state[targetIndex]);
  }

  endViewConversion(target) {
    target.style.removeProperty('opacity');
    target.style.removeProperty(this.propsNames.lort);
    this.nativeResizer.style.removeProperty('display');
  }

  tryOnTargetResizer(target, targetSpaceBefore, length) {
    target.style[this.propsNames.lort] = length + 'px';
    this.nativeResizer.style[this.propsNames.lort] = targetSpaceBefore + length + 'px';
  }

  /* applyNewStyle(index, length) {
    const selector = `[data-${this.propsNames.corr}-title="${index}"]`;
    this.table.cssRules.addRules({
      [selector]: {
        'flex-basis': length + 'px !important',
      },
    });
  } */

  registerNewSize(targetIndex, length) {
    this.sumsArray.state[targetIndex] = length;
    // this.applyNewStyle(targetIndex, length);
  }

  handler(event) {
    return new Promise((resolve, reject) => {
      const target = event.target; // TODO: Разобраться зачем тут target если есть this.nativeResizer
      const targetContainer = event.target.closest('[data-type=resizable]');
      const targetIndex = parseInt(targetContainer.dataset[`${this.propsNames.corr}Title`]);
      const targetSpaceBefore = this.sumsArray.sumBefore(targetIndex);
      console.log(targetSpaceBefore);

      this.startViewConversion(target, targetIndex, targetSpaceBefore);

      const onmousemove = (function(event) {
        const currentPosition = event[this.propsNames.coordinateFromEvent];
        const length = this.calcLength(currentPosition, targetSpaceBefore);
        if (length >= NewResizer.minimumLength) {
          this.tryOnTargetResizer(target, targetSpaceBefore, length);
        }
      }).bind(this);

      const onmouseup = (function(event) {
        console.log('onmouseup');
        const currentPosition = event[this.propsNames.coordinateFromEvent];
        let length = this.calcLength(currentPosition, targetSpaceBefore);
        if (length < NewResizer.minimumLength) {
          length = NewResizer.minimumLength;
        }
        this.registerNewSize(targetIndex, length);
        this.endViewConversion(target);

        this.table.eraseGlobalListener('mousemove');
        this.table.eraseGlobalListener('mouseup');

        resolve({[targetIndex]: length});
      }).bind(this);

      this.table.addGlobalListener('mousemove', onmousemove);
      this.table.addGlobalListener('mouseup', onmouseup);
    });
  }

  shouldResize($target) {
    return $target.dataset['resizer'] === this.propsNames.corr;
  }
}
