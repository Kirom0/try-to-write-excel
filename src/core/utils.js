export function forEachExtension(item, call) {
  const replacementer = (item) => {
    return function(call) {
      call(item);
    };
  };
  item = item || [];
  ((item.forEach && item.forEach.bind(item)) || replacementer(item))(call);
}

export function range(number) {
  const result = [];
  for (let i = 0; i < number; i++) {
    result.push(i);
  }
  return result;
}
