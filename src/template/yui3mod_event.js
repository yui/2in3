{ /* SUPERSEDED */ }YUI.add('{ /* NAME */ }', function(Y) {
    var YAHOO    = Y.YUI2;
    { /* SOURCE */ }
    YAHOO.util.Event.generateId = function(el) {
        if (!el.id) {
            el.id = Y.guid();
        }
        return el.id;
    };
    YAHOO.util.Event._load();
}, '{ /* VERSION */ }' ,{ /* DATA */ });
