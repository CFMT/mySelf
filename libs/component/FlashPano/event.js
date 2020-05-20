var  ev =  {};

ev.addListener = function(context, type, fn) {
    var events = this._dora_events = this._dora_events || {};
    events[type] = events[type] || [];
    events[type].push({
        action: fn,
        context: context || this
    });
    return this;
};

ev.hasEventListeners = function(type) {
    var k = '_dora_events';
    return (k in this) && (type in this[k]) && (this[k][type].length > 0);
};

ev.removeEventListener = function(context, type, fn) {
    if (!this.hasEventListeners(type)) {
        return this;
    }

    for (var i = 0, events = this._dora_events, len = events[type].length; i < len; i++) {
        if (
            (events[type][i].action === fn) &&
            (!context || (events[type][i].context === context))
            ) {
            events[type].splice(i, 1);
            return this;
        }
    }
    return this;
};

    ev.fireEvent = function(type, data, context) {
        if (!this.hasEventListeners(type)) {
            return this;
        }
        var listeners = this._dora_events[type].slice();

        for (var i = 0, len = listeners.length; i < len; i++) {
            if (context && listeners[i].context != context) {
                continue;
            }
            listeners[i].action.call(listeners[i].context || this, data);
        }
        return this;
    } ;

/**
 * 添加鼠标滚轮事件
 */
ev.addScrollEvent = function(domContext, type,scrollFunc) {
    if(domContext.addEventListener){
        domContext.addEventListener(type, scrollFunc, false);
    }
    domContext.onmousewheel = scrollFunc;//IE/Opera/Chrome
};