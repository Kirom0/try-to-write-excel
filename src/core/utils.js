export function forEachExtension(item, call) {
  const replacementer = (item) => {
    return function(call) {
      call(item);
    };
  };
  item = item || [];
  ((item.forEach && item.forEach.bind(item)) || replacementer(item))(call);
}
