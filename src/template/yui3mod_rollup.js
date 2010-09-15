{ /* SUPERSEDED */ }YUI.add('{ /* NAME */ }', function(Y) {
    { /* SOURCE */ }
    Y.YUI2 = YAHOO;
    YAHOO.util.Event.generateId = function(el) {
        if (!el.id) {
            el.id = Y.guid();
        }
        return el.id;
    };
    YAHOO.util.Event._load();
    if (YAHOO.env._id_counter < 1e+6) {
        YAHOO.env._id_counter =  Y.Env._yidx * 1e+6;
    }
}, '{ /* VERSION */ }' ,{ /* DATA */ });
