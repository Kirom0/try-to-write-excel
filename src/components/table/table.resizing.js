import {$} from '@core/dom';

export function resizeHandler(context, event) {
  const type = event.target.dataset['resizer'];
  const $element = $(event.target).closest('[data-type=resizable]');
  const startPosition =
    event.target.dataset['resizer'] === 'column' ?
      event.pageX :
      event.pageY;

  const mousemove = (event) => {
    const cssSelector =
      `[data-resizer="${type}s"]`;

    if (type === 'column') {
      context.cssRules.addRules({
        [cssSelector]: {
          left: event.pageX + 'px !important',
          display: 'block !important',
        },
      });
    } else {
      context.cssRules.addRules({
        [cssSelector]: {
          top: event.pageY -
            context.$root.getBoundingClientRect().top +
            'px !important',
          display: 'block !important',
        },
      });
    }
  };

  const mouseup = (event) => {
    context.eraseGlobalListener('mousemove');
    context.eraseGlobalListener('mouseup');

    const delta =
      type === 'column' ?
        event.pageX - startPosition :
        event.pageY - startPosition;
    const DOMRect = $element.getBoundingClientRect();
    const cssSelector =
      `[data-${type}-title="${
        $element.getAttribute(`data-${type}-title`)
      }"]`;

    if (type === 'column') {
      context.cssRules.addRules({
        [cssSelector]: {
          width: (DOMRect.width + delta) + 'px !important',
        },
      });
    } else {
      context.cssRules.addRules({
        [cssSelector]: {
          height: (DOMRect.height + delta) + 'px !important',
        },
      });
    }
    context.cssRules.deleteSelectorsRules(`[data-resizer="${type}s"]`);
  };

  context.addGlobalListener('mousemove', mousemove);
  context.addGlobalListener('mouseup', mouseup);
}
