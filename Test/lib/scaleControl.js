function getMapResolution(lat, zoom) {
    return 156543.04 * Math.cos(lat * Math.PI / 180) / (Math.pow(2, zoom));
}

function ScaleControl(el, map) {
    this.dom = el;
    this.map = map;
    this.baseWidth = 50; // px
    bind(this);
}

function bind(self) {
    function update(evt) {
        updateScale(self);
    }
    qq.maps.event.addListener(self.map, 'zoom_changed', update);
    qq.maps.event.addListener(self.map, 'center_changed', update);
}

function setWidth(self, width) {
    self.dom.style.width = width + 'px';
}

function setScaleMeters(self, m) {
    if (m < 1000) {
        m = m + ' 米';
    } else {
        m = (m / 1000) + ' 公里';
    }
    self.dom.textContent = m;
}

function updateScale(self) {
    var res = getMapResolution(self.map.getCenter().lat, self.map.getZoom());
    var m = self.baseWidth * res;
    m = roundToScaleDistance(m);

    setScaleMeters(self, m);
    setWidth(self, m / res);
}
// 根据比例尺宽度像素计算出对应的距离，把距离规范为:5 -> 10 -> 20 -> 50 -> 100 -> 200 -> 500 -> 1k -> 2k -> 5k -> 10k -> 20k -> 50k -> 100k -> 200k -> 500k -> 1000k -> 2000k, 单位m
var scaleDistences = [5, 10, 20, 50];
for (var i = 2; i < 7; i++) { // 100, 2位数
    scaleDistences.push(scaleDistences[scaleDistences.length - 3] * 10);
    scaleDistences.push(scaleDistences[scaleDistences.length - 3] * 10);
    scaleDistences.push(scaleDistences[scaleDistences.length - 3] * 10);
}

function roundToScaleDistance(m) {
    for (var i = 1; i < scaleDistences.length; i++) {
        var limit = (scaleDistences[i] + scaleDistences[i - 1]) / 2;
        if (m <= limit) {
            return scaleDistences[i - 1];
        }
    };
    return scaleDistences[scaleDistences.length - 1];
}

module.exports = ScaleControl;