import {ExcelComponent} from '@core/ExcelComponent';
import {getTemplate} from '@/components/table/table.template';
import {$} from '@core/dom';
import {CSSRules} from '@core/css';

export class TableComponent extends ExcelComponent {
  static className = 'excel__table';
  constructor($root) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown'],
    });

    this.resizeState = {
      resizing: false,
      type: 'row' || 'column',
      startPosition: 0,
      $element: undefined,
    };

    this.css = new CSSRules();
  }

  onMousemove(event) {
    console.log('mousemove', event.pageX, event.pageY);
    if (this.resizeState.resizing) {
      const {type} = this.resizeState;
      const cssSelector =
        `[data-resizer="${type}s"]`;
      if (type === 'column') {
        this.css.addRules({
          [cssSelector]: {
            left: event.pageX + 'px !important',
            display: 'block !important',
          },
        });
      } else {
        this.css.addRules({
          [cssSelector]: {
            top: event.pageY -
              this.$root.getBoundingClientRect().top +
              'px !important',
            display: 'block !important',
          },
        });
      }
    }
  }

  onMousedown(event) {
    const $target = $(event.target);
    if (this.resizeState.resizing) {
      return;
    }
    console.log('mousedown', event);
    if (
      event.target.dataset['resizer'] === 'column' ||
      event.target.dataset['resizer'] === 'row'
    ) {
      this.addGlobalListener('mousemove');
      this.addGlobalListener('mouseup');

      this.resizeState = {
        resizing: true,
        type: event.target.dataset['resizer'],
        $element: $target.closest('[data-type=resizable]'),
        startPosition:
          event.target.dataset['resizer'] === 'column' ?
            event.pageX :
            event.pageY,
      };
    }
  }

  onMouseup(event) {
    console.log('mouseup', event);
    if (this.resizeState.resizing) {
      this.resizeState.resizing = false;

      this.eraseGlobalListener('mousemove');
      this.eraseGlobalListener('mouseup');

      const {type, $element, startPosition} = this.resizeState;
      const delta =
        type === 'column' ?
          event.pageX - startPosition :
          event.pageY - startPosition;
      const DOMRect = $element.getBoundingClientRect();
      console.log(delta);
      console.log($element);

      const cssSelector =
        `[data-${type}-title="${
          $element.getAttribute(`data-${type}-title`)
        }"]`;
      if (type === 'column') {
        this.css.addRules({
          [cssSelector]: {
            width: (DOMRect.width + delta) + 'px !important',
          },
        });
      } else {
        this.css.addRules({
          [cssSelector]: {
            height: (DOMRect.height + delta) + 'px !important',
          },
        });
      }
      this.css.deleteSelectorsRules(`[data-resizer="${type}s"]`);
    }
  }

  toHtml() {
    return getTemplate(3, 3);
  }
}
