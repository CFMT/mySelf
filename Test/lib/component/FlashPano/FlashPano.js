/**
 * Created by qiangliu on 2015/6/3.
 */
var root_theme = 'theme/swf/';
var root_plugin_theme = 'http://s.map.qq.com/TPano/TPanoFlash/v1.3.0/plugins/';
var ua = navigator.userAgent;;

var ie = (function (){
    return /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || + RegExp['\x241']) : 0;
})();

var opera = (function (){
    return /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : 0;
})();

var safari = (function (){
    return /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : 0;
})();



function event_coordinate(event) {
    var coords;
    if (ie) {
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        coords = [(event.clientX + scrollLeft), (event.clientY + scrollTop)];
    } else {
        coords = [event.pageX, event.pageY];
    }
    return coords;
}


function dom_coordinate (dom) {
    if (dom.parentNode === null || dom.style.display == 'none') {
        return [0, 0, 0, 0];
    }
    var parent = null;
    var box;
    var left = 0;
    var top = 0;
    var width = dom.offsetWidth;
    var height = dom.offsetHeight;
    if (dom.getBoundingClientRect) {
        box = dom.getBoundingClientRect();
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        left = box.left + scrollLeft;
        top = box.top + scrollTop;
    } else {
        if (document.getBoxObjectFor) {
            box = document.getBoxObjectFor(dom);
            var borderLeft = (dom.style.borderLeftWidth) ? parseInt(dom.style.borderLeftWidth) : 0;
            var borderTop = (dom.style.borderTopWidth) ? parseInt(dom.style.borderTopWidth) : 0;
            left = box.x - borderLeft;
            top = box.y - borderTop;
        } else {
            left = dom.offsetLeft;
            top = dom.offsetTop;
            parent = dom.offsetParent;
            if (parent != dom) {
                while (parent) {
                    left += parent.offsetLeft;
                    top += parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }
            if (opera || (safari && dom.style.position == 'absolute')) {
                left -= document.body.offsetLeft;
                top -= document.body.offsetTop;
            }
        }
        if (dom.parentNode) {
            parent = dom.parentNode;
        } else {
            parent = null;
        }
        while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
            left -= parent.scrollLeft;
            top -= parent.scrollTop;
            if (parent.parentNode) {
                parent = parent.parentNode;
            } else {
                parent = null;
            }
        }
    }
    return [left, top, width, height];
}

var flashDefaultParam1 = {
    movie: root_theme + 'TPano.swf',
    altHtml: '<div style="position: relative;width: 300px;background-color:#FFEFB6;'
        + 'border: 1px solid #FFC337;margin: 65px auto;padding: 10px;">'
        + '<p>使用腾讯街景，需要将您的Adobe Flash Player 播放器升级到10或更新版本</p>'
        + '<div><a href="http://get.adobe.com/cn/flashplayer/" target="_blank;">下载最新版本</a></div>'
        + '</div>',
    minVer: '10.0.0',
    width: '100%',
    height: '100%',
    bgcolor: '#EEEEEE',
    wmode: 'transparent',
    align: 'middle',
    quality: 'high',
    allowscriptaccess: 'always',
    allowfullscreen: 'true',
    menu: false
};

var metoV = 111319.49077777777777777777777778;
var _lastId = 0;

//flash检测js是否可用
window.checkJSReady = function () {
    return true;
};

function mix (dest, src, override_){
    for (var k in src) {
        if (src.hasOwnProperty(k)) {
            if (override_ || !dest.hasOwnProperty(k)) {
                dest[k] = src[k];
            }
        }
    }
    return dest;
};

function TPanoFlash(view, option) {
    this._genId();
    setValues(this, option);

    this.flashVars = {
        callback: this._getKey('swfCallbackId')
    };

    this.status = 0;   //0 flash未创建 1：swf已创建 2：接口可用
    this.waitQuene = [];  //flash没有加载完毕的时候需要等待的事件
    this.view = view;
    this._isFristLoadFlash = true;
    this._isFirstChange = true;
    this._labels = {};
    this._labelsArr = new Array();
    this._plugins = {};

    this._bindSwfCallback(); //将swf的回调放到swf上面

    this.createPano();
    this._initEvents();
    this.view._render = this;
}

var fp = TPanoFlash.prototype;

fp._setKey = function(key, value) {
    var oldValue = this[key];
    if (oldValue && (oldValue == value)) {
        return;
    } else {
        this[key] = value;
    }
};
fp._getKey = function(key) {
    return this[key];
};

fp.createPano = function () {
    var flashvars = this.flashVars;
    flashvars.panoId = this._getKey('pano');
    var pov = this._getKey('pov');
    if (pov) {
        if (pov.heading !== null) {
            flashvars['heading'] = pov.heading;
        }
        if (pov.pitch !== null) {
            flashvars['pitch'] = pov.pitch;
        }
    }
    if (this._getKey('zoom') !== null) {
        flashvars['zoom'] = parseInt(this._getKey('zoom'));
    }

    if (this._getKey('disableMove')) {           //街景是否可以移动
        flashvars['disableMove'] = this._getKey('disableMove');
    }

    if (this._getKey('pf')) {
        flashvars['pf'] = this._getKey('pf');
    }

    if (this._getKey('ch')) {
        flashvars['ch'] = this._getKey('ch');
    }

    if (this._getKey('key')) {
        flashvars['key'] = this._getKey('key');
    }

    flashvars['keystatus'] = 1;

    var buff = [];
    flashDefaultParam1.id = this._getKey("swfId");
    flashDefaultParam1.flashvars = paramToString(flashvars);
    var swfHtml = genHtml(flashDefaultParam1);
    buff.push(swfHtml);
    var panoContainer = document.createElement('div');
    panoContainer.style.width = "100%";
    panoContainer.style.height = "100%";
    if (this._getKey('visible') === false) {
        panoContainer.style.visibility = 'hidden';
    }

    panoContainer.innerHTML = buff.join('');
    this._setKey('panoContainer', panoContainer);
    var viewContainer = this._getKey('container');
    var container = (typeof(viewContainer) == "object") ?viewContainer : document.getElementById(viewContainer);
    container.appendChild(panoContainer);

    this.status = 1;

    if (checkLocalPath()) {
        var self = this;
        setTimeout(function() {
            self.checkCommunication();
        }, 3000);
    }
};

fp.setKeyStatus = function(obj) {
    this._sendToAs('setKeyStatus', obj);
};

fp.removePano = function() {
    this.status = 0;
    this.waitQuene = [];
    this._isFristLoadFlash = true;
    var swf = getSwf(this._getKey('swfId'));
    if(swf) {
        var ie = isIE();
        if (swf && ie) {
            swf.style.display = 'none';
            for (var k in swf) {
                if (typeof swf[k] === 'function') {
                    swf[k] = null;
                }
            }
            if (window.CollectGarbage) {
                setTimeout(window.CollectGarbage, 0);
            }
        }
        var div = document.createElement('div');
        div.appendChild(swf);
        div.innerHTML = '';
        var viewContainer = this._getKey('container');
        var container = (typeof(viewContainer) == "object") ?viewContainer : document.getElementById(viewContainer);
        container.removeChild(this._getKey('panoContainer'));
    }
}

fp.setVisible = function(value) {
    if (this._getKey('visible') == value) {
        return;
    };
    this._setKey('visible', value);
    this._getKey('panoContainer').style.visibility = value?  'visible': 'hidden';
}

fp.setPano = function(pano) {
    if (!pano) {
        this._setKey('pano', null);
        return;
    }
    if (pano && pano !== this._getKey('pano')) {
        if (!this._getKey('pano')) {
            this._setKey('pano', pano);
            this.removePano();
            this.createPano();
            this._initEvents();
        }
        var option = {svid: pano};
        this._setKey("_setPanoValue", {svid:pano}); //存储设置的pano
        this._sendToAs('setPanoOptions', option);
    }
};

fp.setThumb = function(thumb) {
    this._sendToAs('setThumb', thumb.globe);
};

fp.setPov = function(newPov) {
    var pov = this._getKey('pov'); // 原来的pov值
    var obj = {};
    var isSend = false;
    if (newPov && isNumber(newPov.heading) && (!pov || pov.heading !== newPov.heading)) {
        obj["heading"] = Math.round(newPov.heading * 10) / 10;
        isSend = true;
    }

    if (newPov && isNumber(newPov.pitch) && (!pov || pov.pitch !== newPov.pitch)) {
        obj["pitch"] = Math.round(newPov.pitch * 10) / 10;
        isSend = true;
    }

    if (isSend) {
        this._setKey("_setPovValue", obj); //存储设置的pov
        this._sendToAs('setPanoOptions', obj);
    }
};

fp.setZoom = function(newZoom) {
    var zoom = this._getKey('zoom');
    if (parseInt(newZoom) != zoom) {
        var option = {zoom: parseInt(newZoom)};
        this._setKey("_setZoomValue", parseInt(newZoom)); //存储设置的zoom
        this._sendToAs('setPanoOptions', option);
    }
};

fp.pano_changed = function(svid) {
    var pano = this._getKey('pano');
    if (pano && pano != svid || this._isFirstChange) {
        this._setKey('pano', svid);
        this._setKey('_setPanoValue', svid);
        this.view.fireEvent('pano_changed', svid, this.view);
    }
};

fp.pov_changed = function(newPov) {
    var oldPov = this._getKey('pov') || {};
    this._pov = newPov;
    var ischange = 0;
    var rst = {};
    if (oldPov) {
        rst.heading = oldPov.heading;
        rst.pitch = oldPov.pitch
    }

    if (!oldPov || !equals(newPov.heading, oldPov.heading)) {
        rst.heading = newPov.heading;
        ischange = 1;
    }

    if (!oldPov || !equals(newPov.pitch, oldPov.pitch)) {
        rst.pitch = newPov.pitch;
        ischange = 1;
    }

    if (ischange || this._isFirstChange) {
        this._setKey('pov', rst);
        this._setKey('_setPovValue',rst);
        this.view.fireEvent('pov_changed', rst, this.view);
    }
};

fp.zoom_changed = function(zoom) {
    if (zoom !== this._getKey('zoom') || this._isFirstChange) {
        this._setKey('zoom', zoom);
        this._setKey('_setZoomValue',zoom);
        this.view.fireEvent('zoom_changed', zoom, this.view);
    }
};

fp.addLabel = function (label) {
    if (this._labels[label['id']]) {
        return;
    }
    this._labelsArr.push(label);
    this._labels[label['id']] = label;
    this._sendToAs('addLabel', {
        id: label.id,
        lat: latFrom4326ToProjection(label.position.lat),
        lng: lngFrom4326ToProjection(label.position.lng),
        height: label.altitude,
        content: label.content
    });
}

fp.removeLabel = function (id) {
    this._sendToAs('removeLabel', {
        id: id
    });
    this._labels[id] = undefined;
    for (var i = 0; i < this._labelsArr.length; i++) {
        var label = this._labelsArr[i];
        if (label.id == id) {
            this._labelsArr.splice(i, 1);
        }
    }
}

fp.addPlugin = function(plugin) {
    this._sendToAs('addPlugin', {'name': plugin.id, 'options': {'url': root_plugin_theme + plugin.name}});
    if (!this._plugins[plugin.id]) {
        this._plugins[plugin.id] = plugin;
    }
}

/**
 * 开始自动播放
 * @param speed:旋转角度
 */
fp.autoPlayStart = function(angle) {
    this._sendToAs('autoPlayStart', angle);
}

fp.autoPlayStop = function() {
    this._sendToAs('autoPlayStop');
}

fp._onInterfaceReady = function () {
    this.status = 2;
    while (this.waitQuene.length > 0) {
        var eventObj = this.waitQuene.shift();
        this._sendToAs(eventObj.eventName, eventObj.data, eventObj.tp);
    }
};

fp._addDefalutPlugin = function () {

    // 添加覆盖物(箭头、井盖、探面)
    if (!this._getKey('disableMove') || !(this._getKey('disableMove') === true
        || this._getKey('disableMove') === 1)) {
//        this._sendToAs('addPlugin', {'name': 'PanoOverlay', 'options': {'url': root_plugin_theme + 'PanoOverlay.swf'}});
    }
//    this._sendToAs('addPlugin', {'name': 'PanoPOI', 'options': {'url': root_plugin_theme + 'PanoPOI.swf'}});
}

/**
 * interready时重新得到最新值初始化swf
 * @type {*}
 * @private
 */
fp._addResetFlash = function() {
    //设置最新的pano和pov值、zoom
    var newPanoOption = {};
    if (this._getKey("_setPovValue")) {
        newPanoOption.heading = this._getKey("_setPovValue").heading;
        newPanoOption.pitch = this._getKey('_setPovValue').pitch;
        this._sendToAs('setPanoOptions', newPanoOption);
    };
    if (this._getKey('_setZoomValue')) {
        this._sendToAs('setPanoOptions', {'zoom': parseInt(this._getKey('_setZoomValue'))});
    };

    //添加lables
    for (var i =0; i < this._labelsArr.length; i++) {
        var label = this._labelsArr[i];
        this._sendToAs('addLabel', {
            id: label.id,
            lat: latFrom4326ToProjection(label.position.lat),
            lng: lngFrom4326ToProjection(label.position.lng),
            height: label.altitude,
            content: label.content
        });
    };
}

fp._sendToAs = function (eventName, data, _toPlugin) {
    if (this.status >= 2) {
        try {
            getSwf(this._getKey('swfId'))[_toPlugin ? "sendToPlugin" : "sendToAS"](eventName, data);
        }
        catch (ex) {
        }
    } else {
        var newData = mix({}, data);
        this.waitQuene.push({
            eventName: eventName,
            data: newData,
            tp: _toPlugin
        });
    }
};

fp._sendToPlugin = function (eventName, data) {
    this._sendToAs(eventName, data, true);
};

/**
 * 检测与flash通讯是否正常
 */
fp.checkCommunication = function () {
    var isUser = null;
    try {
        isUser = getSwf(this._getKey('swfId'))["callBackToAS"]("checkCommunication");
    } catch (ex) {
        var container = this._getKey('panoContainer');
        var promptDivWidth = 255;
        var promptDivHeight = 45;

        var promptDiv = document.createElement('div');
        promptDiv.innerHTML = "API程序无法与flash通信，导致街景可能无法正常使用，这可能和flash安全策略有关,请参考" +
            "<a href='http://open.map.qq.com/javascript_v2/guide-pano.html#link-two' target='_blank' style='color:#7CCD7C;text-decoration:none '>解决步骤</a>。";
        promptDiv.style.width = promptDivWidth + "px";
        promptDiv.style.height = promptDivHeight + "px";
        promptDiv.style.position = "absolute";
        promptDiv.style.backgroundColor = "black";
        promptDiv.style.color = "#FFFFFF";
        promptDiv.style.fontSize = "13px";
        promptDiv.style.padding = "5px";
        promptDiv.style.opacity = 0.5;
        promptDiv.style.filter = "alpha(opacity=50)";
        promptDiv.style.left = container.offsetWidth / 2 - promptDivWidth / 2 + "px";
        promptDiv.style.top = "10px";

        container.appendChild(promptDiv);
    }
};

fp._receiveFromSwf = function (eventName, data) {
    switch (eventName) {
        case 'interface_ready':
            this._onInterfaceReady();
            this._addResetFlash();
            this._addDefalutPlugin();
            if (this._getKey('_setPanoValue') && this._getKey('_setPanoValue').svid != data.svid) {
                var oldPano = this._getKey('_setPanoValue').svid;
                this.setPano(oldPano);
            }

            if (this._isFristLoadFlash) {
                this._isFristLoadFlash = false;
                this.view.fireEvent('loaded', null, this.view);
            }
            break;
        case 'pano_model_error':
            this.view.fireEvent('error', null, this.view);
            break;
        case 'pano_changed':
            //平面图信息获取
            if (data.chartId && data.bestChartLevel > 0) {
                var bounds = [
                    lngFromProjectionTo4326(data.minx),
                    latFromProjectionTo4326(data.miny),
                    lngFromProjectionTo4326(data.maxx),
                    latFromProjectionTo4326(data.maxy)
                ];
                var lat = parseFloat(data.lat);
                var lng = parseFloat(data.lng);
                var latlng = {};
                latlng.lat = latFromProjectionTo4326(lat);
                latlng.lng = lngFromProjectionTo4326(lng);
                var planeInfo = {
                    bounds: bounds,
                    minZoom: data.minZoom,
                    maxZoom: data.maxZoom,
                    zoomLevel: data.bestChartLevel,
                    regionId: data.chartId,
                    forwardMatrix: data.forwardMatrix,
                    backwardMatrix: data.backwardMatrix,
                    center: latlng
                }
                this._setKey('planeInfo', planeInfo);
            } else {
                this._setKey('planeInfo', null);
            }

            var panoData = {};
            panoData.dir = data.dir || 0;
            panoData.x = data.lng || 0;
            panoData.y = data.lat || 0;
            panoData.svid = data.svid || '-1';
            panoData.mode = data.mode || 'day';
            panoData.photoTime = data.photoTime || '0000.00';
            panoData.sno = data.sno || '-1';
            panoData.source = data.source || 'qq';
            panoData.position = latlng

            this.pano_changed(panoData);
            break;
        case 'pov_changed':
            this.pov_changed(data);
            break;
        case 'zoom_changed':
            this.zoom_changed(data.zoom);
            break;
        case 'label_mouse_over':
            if (this._labels[data.id]) {
                this.view.fireEvent('labelEvent', {
                    id: data.id,
                    type:'mouseover',
                    viewBounds: data.bounds
                });
            }
            break;
        case 'label_mouse_out':
            if (this._labels[data.id]) {
                this.view.fireEvent('labelEvent', {
                    id: data.id,
                    type:'mouseout',
                    viewBounds: data.bounds
                });
            }
            break;
        case 'label_mouse_click':
            if (this._labels[data.id]) {
                this.view.fireEvent('labelEvent', {
                    id: data.id,
                    type:'click',
                    viewBounds: data.bounds
                });
            };
            break;
        case 'thumb_loaded':
            if ( this._isFirstChange) {
                this._isFirstChange = false;
            }
            this.view.fireEvent('thumb_loaded', data, this.view);
            break;
        case 'autoPlayStop':
            this.view.fireEvent('autoPlayStop', data, this.view);
            break;
        case 'dragStart':
            this.view.fireEvent('dragstart', data, this.view);
            break;
        case 'dragEnd':
            this.view.fireEvent('dragend', data, this.view);
            break;
        default:
            this.view.fireEvent(eventName,data, this.view);
    }
};

fp._genId = function() {
    var id = _lastId++;
    var swfId = '_panoSwf_' + id;
    var swfCallbackId = '_panoSwfCallback_' + id;
    this._setKey('swfId', swfId);
    this._setKey('swfCallbackId', swfCallbackId);
};


/**
 *  绑定flash对js的回调函数
 * @private
 */
fp._bindSwfCallback = function () {
    var callBackId = this._getKey('swfCallbackId');
    var this_ = this;
    window[callBackId] = function (eventName, data) {
        return this_._receiveFromSwf(eventName, data);
    };
};

fp._initEvents = function () {
    var div = this._getKey('panoContainer');
    var this_ = this;
    if (this._getKey('scrollwheel')) {
        this._wheelListener = ev.addScrollEvent(div, gecko ? 'DOMMouseScroll' : 'mousewheel', function (evt) {
            evt = evt || window.event;

            var mouseCoord = event_coordinate(evt);
            var containerCoord = dom_coordinate(div);

            if (this_.status >= 2) {
                var delta = 0;
                if (evt.wheelDelta) { /* IE/Opera. */
                    delta = evt.wheelDelta / 120;
                } else if (evt.detail) { /** Mozilla case. */
                    /** In Mozilla, sign of delta is different than in IE.
                     * Also, delta is multiple of 3.
                     */
                    delta = -evt.detail / 3;
                }
//                    this_._sendToAs('mouseWheel', {delta: delta, mouseX:evt.x, mouseY:evt.y});
                this_._sendToAs('mouseWheel', { delta: delta,
                    mouseX: mouseCoord[0] - containerCoord[0],
                    mouseY:  mouseCoord[1] - containerCoord[1]
                });
            }
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        });
    }
};

/**
 * 检测是否为本地路径
 */
function checkLocalPath() {
    var path = window.location.href;
    return path.indexOf("http://") != -1? false : true;
}

function getSwf(swfId){
    return document.getElementById(swfId);
};

function isNumber(v){
    return '[object Number]' == Object.prototype.toString.call(v) && isFinite(v);
};

function equals(num1, num2) {
    num1 = Math.round(num1 * 10) / 10;
    num2 = Math.round(num2 * 10) / 10;
    return num1 == num2;
};

function latFrom4326ToProjection(lat) {
    var ret = Math.log(Math.tan((90 + lat) *
        0.0087266462599716478846184538424431)) /
        0.017453292519943295769236907684886;
    ret = ret * metoV;
    return ret;
};

function latFromProjectionTo4326(y) {
    var lat = y / metoV;
    lat = Math.atan(Math.exp(lat *
        0.017453292519943295769236907684886)) *
        114.59155902616464175359630962821 - 90;
    return lat;
};

function lngFrom4326ToProjection(lng) {
    return lng * metoV;
};

function lngFromProjectionTo4326(x) {
    return x / metoV;
};

function paramToString(obj){
    var buff = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            var item = obj[k];
            buff.push(k + "=" + encodeURIComponent(item));
        }
    }
    return buff.join('&');
};

function setValues(obj, values) {
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
            obj[key] = values[key];
        }
    }
};

/**
 * 判断是否为gecko浏览器
 * @returns {Boolean}
 */
function gecko(){
    var ua = navigator.userAgent;
    return /gecko/i.test(ua) && !/like gecko/i.test(ua);
};

/**
 * 判断是否为ie浏览器
 * @returns {Number} IE版本号
 */
function isIE(){
    var ua = navigator.userAgent;
    return /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || + RegExp['\x241']) : 0;
};

function comparaVersion(v1, v2){
    v1 = v1.split('.');
    v2 = v2.split('.');
    var l = Math.max(v1.length, v2.length);
    for (var i=0; i<l; i++) {
        var p1 = v1[i];
        var p2 = v2[i];
        if (!p1 || !p2) {
            return !p1 && !p2 ? 0 : p1 ? 1 : -1;
        }
        p1 = Number(p1);
        p2 = Number(p2);
        if (p1 < p2) {
            return -1;
        } else if (p1 > p2) {
            return 1;
        }
    }
    return 0;
};

function getFlashPlayerVersion(){
    var IE = isIE();

    var ver;
    if (ver == null) {
        var n = navigator;
        if (n.plugins && n.mimeTypes.length) {
            var plugin = n.plugins["Shockwave Flash"];
            if (plugin && plugin.description) {
                ver = plugin.description
                    .replace(/([a-zA-Z]|\s)+/, "")
                    .replace(/(\s)+r/, ".") + ".0";
            }
        } else if (IE) {
            try {
                var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (c) {
                    var v = c.GetVariable("$version");
                    ver = v.replace(/WIN/g, '').replace(/,/g, '.');
                }
            } catch (e) { }
        }
    }
    return ver;
};

function genHtml(options){
    var IE = isIE();

    var objDefAttrs = IE ? ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' +
        ' codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"' :
        ' type="application/x-shockwave-flash"';
    var objAttrKeys = ['id', 'width', 'height', 'align', 'data'];
    var objParamKeys = ['wmode', 'movie', 'flashvars', 'scale', 'quality', 'play', 'loop', 'menu', 'salign', 'bgcolor', 'base',
        'allowscriptaccess', 'allownetworking', 'allowfullscreen', 'seamlesstabbing', 'devicefont', 'swliveconnect'];
    options=options||{};

    function createHtml(){
        var i, key;
        var minVer = options['minVer'];
        var maxVer = options['maxVer'];
        if (minVer || maxVer) {
            var localVer = getFlashPlayerVersion();
            if (!localVer ||
                (minVer && comparaVersion(localVer, minVer) < 0) ||
                (maxVer && comparaVersion(localVer, maxVer) > 0)) {
                return options['altHtml'] || '';
            }
        }
        var buff = ['<object', objDefAttrs];
        options['data'] = options['movie'];
        for (i=0; i<objAttrKeys.length; i++) {
            key = objAttrKeys[i];
            if (options.hasOwnProperty(key)) {
                buff.push(' ', key, '="', options[key], '"');
            }
        }
        buff.push('>');
        for (i=0; i<objParamKeys.length; i++) {
            key = objParamKeys[i];
            if (options.hasOwnProperty(key)) {
                buff.push('<param name="', key, '" value="', options[key], '"/>');
            }
        }
        buff.push('</object>');
        return buff.join('');
    };

    var flashHtml = createHtml();
    return flashHtml;
};
