/**
 * Created by qiangliu on 2015/6/3.
 */

/**
 * Created by qiangliu on 2014/11/26.
 */

function Panorama (container,pano, options) {
//    qq.maps.MVCObject.apply(this);
    this.panoObj = new TPanoFlash(this, {
        scrollwheel: true,
        container: container,
        pano: pano,
        pov: {
            heading: options.heading,
            pitch: options.pitch
        },
        zoom: options.zoom
    });
}

var pp = Panorama.prototype;

pp.setPano = function(pano) {
    this.pano = pano;
    if (this.get('pano') != this.panoObj.pano.svid) {
        this.panoObj.setPano(this.get('pano'))
    }
}

pp.setZoom = function (zoom) {
    this.panoObj.setZoom(zoom);
}

pp.set = function (key, value) {
    this[key] = value;
}

pp.getZoom = function(){
    return this.panoObj._getKey('zoom');
}

pp.getHeading = function(){
    return this.panoObj._getKey('pov').heading;
}

pp.getPitch = function(){
    return this.panoObj._getKey('pov').pitch;
}

/**
 * 开始自动播放
 * @param speed:旋转角度
 */
pp.autoPlayStart = function(angle) {
    this.panoObj.autoPlayStart(angle);
}

pp.autoPlayStop = function() {
    this.panoObj.autoPlayStop();
}


pp.fireEvent = function (key, value, view) {
    var t = this;
    switch (key) {
        case 'pano_changed' :
            this.set('pano', value.svid);
            this.set('position', new qq.maps.LatLng(value.position.lat, value.position.lng));
            this.set('planeInfo',this.panoObj.planeInfo);
            if(labels[value.svid]) {
                this.panoObj.addLabel(labels[value.svid]['367']);
            } else {
                this.panoObj.removeLabel('367');
            }
            break;
        case 'labelEvent':
            if (value.type == 'click') {
//                t.showInfoWin();
            }
        case 'zoom_changed':
            if (value == 4){
                $('#zoomIn').addClass('zoomInDis');
            } else {
                $('#zoomIn').removeClass('zoomInDis');
            }

            if(value == 1) {
                $('#zoomOut').addClass('zoomOutDis');
            }  else {
                $('#zoomOut').removeClass('zoomOutDis');
            }
            this.set('zoom', value);
            break;

        case 'pov_changed':
            this.set('pov', value);
            break;
        case 'autoPlayStop':
            t.onAutoPlayStop && t.onAutoPlayStop()
            break;
    }
}
