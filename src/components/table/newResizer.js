export class NewResizer {
  static minimumLength = 24;

  constructor(table, type, nativeTable, nativeResizer, sumsArray) {
    this.table = table;
    this.type = type;
    this.nativeTable = nativeTable;
    this.nativeResizer = nativeResizer;
    this.sumsArray = sumsArray;

    if (type === 'OX') {
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

  endViewConversion(target, targetIndex, length) {
    target.style.removeProperty('opacity');
    target.style.removeProperty(this.propsNames.lort);
    this.nativeResizer.style.removeProperty('display');

    const selector = `[data-${this.propsNames.corr}-title="${targetIndex}"]`;
    this.table.cssRules.addRules({
      [selector]: {
        'flex-basis': length + 'px !important',
      },
    });
  }

  tryOnTargetResizer(target, targetSpaceBefore, length) {
    target.style[this.propsNames.lort] = length + 'px';
    this.nativeResizer.style[this.propsNames.lort] = targetSpaceBefore + length + 'px';
  }

  registerNewSize(target, targetIndex, length) {
    this.sumsArray.state[targetIndex] = length;
    this.endViewConversion(target, targetIndex, length);
  }

  handler(event) {
    const target = event.target;
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
      this.registerNewSize(target, targetIndex, length);

      this.table.eraseGlobalListener('mousemove');
      this.table.eraseGlobalListener('mouseup');
    }).bind(this);

    this.table.addGlobalListener('mousemove', onmousemove);
    this.table.addGlobalListener('mouseup', onmouseup);
  }

  shouldResize($target) {
    return $target.dataset['resizer'] === this.propsNames.corr;
  }
}
