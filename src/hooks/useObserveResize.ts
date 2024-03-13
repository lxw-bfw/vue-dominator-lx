const useObserveResize = (
  el: HTMLElement,
  callback: (cr: DOMRectReadOnly, resize: ResizeObserver) => void
) => {
  const resize: ResizeObserver = new ResizeObserver((entries) => {
    // 一个观察目标，一般entries数组只会包含一个ResizeObserverEntry对象
    // 但是某些情况下可能会把批量触发的ResizeObserverEntry对象一次性返回，导致entries数组存在多个ResizeObserverEntry对象
    // 这里我们直接取最后一个ResizeObserverEntry对象,来保证获取最新的元素位置和尺寸等信息
    const lastEntry = entries[entries.length - 1];
    const cr = lastEntry.contentRect;
    callback(cr, resize);
  });
  resize.observe(el);
};

export default useObserveResize;
