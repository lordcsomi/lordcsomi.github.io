var sourceId = undefined;
function pointerDown(event) {
  event.preventDefault();
  event.target.releasePointerCapture(event.pointerId);
  sourceId = event.target.id;
}
function pointerUp(event) {
  if (sourceId === undefined) {
    return;
  }
  event.preventDefault();
  var target = event.target;
  var source = document.getElementById(sourceId);
  var sourceHTML = source.outerHTML;
  source.outerHTML = target.outerHTML;
  target.outerHTML = sourceHTML;
  sourceId = undefined;
}