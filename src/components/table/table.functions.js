export function shouldResize(event) {
  return (
    event.target.dataset['resizer'] === 'column' ||
    event.target.dataset['resizer'] === 'row'
  );
}
