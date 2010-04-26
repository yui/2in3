var navigator = navigator || {
        userAgent: "custom"
    },
    document = document || {},
    window = window || {
        document: document,
        navigator: navigator
    };

// load("lib/2.8.0r4/build/yuiloader/yuiloader.js");
// load("lib/2.8.0r4/build/json/json.js");
load("../../../yui2/build/yuiloader/yuiloader.js");
load("../../../yui2/build/json/json.js");



var i, loader2, req, newmods = {}, stringified,
    reqs = []
    loader = new YAHOO.util.YUILoader(),
    modules = YAHOO.lang.merge(loader.moduleInfo);

for (i in modules) {
    reqs.push(i);
}

// expand all dependencies
loader.allowRollup = false;
loader.require(reqs);
loader.calculate();

modules = YAHOO.lang.merge(loader.moduleInfo);

for (i in modules) {
    mod = YAHOO.lang.merge(modules[i]);
    exp = mod.expanded;
    opt = mod.optional;

    // the dependencies have been expanded, if we sort them loader will be more efficient
    loader = new YAHOO.util.YUILoader();
    loader.force = ['yahoo', 'get', 'yuiloader', 'json'];
    loader.require(exp);
    loader.allowRollup = false;
    loader.calculate();

    req = loader.sorted.concat();

    mod.requires = req;

    // expand the optional dependencies, but make sure the list doesn't include the std requirements
    loader = new YAHOO.util.YUILoader();
    loader.require(opt);
    loader.ignore = mod.requires;
    loader.allowRollup = false;
    loader.calculate();
    mod.optional = loader.sorted;

    // decruft
    delete mod._supersedes;
    delete mod._provides;
    delete mod.expanded;
    delete mod.skinnable;
    if (mod.type == 'js') {
        delete mod.type;
    }

    if (mod.requires && mod.requires.length == 0) {
        delete mod.requires;
    }

    if (mod.optional && mod.optional.length == 0) {
        delete mod.optional;
    }

    // mod.DRACULA = "BLAH";
    // print(i + ': ' + mod.requires + ' ' + ((mod.optional && mod.optional.length) ? ('+ ' + mod.optional) : ''));

    // append to the pristine set
    newmods[i] = mod;
}

stringified = YAHOO.lang.JSON.stringify(newmods);

// build a giant regexp to prefix all of the module names
var search = '\\"(';
for (i in modules) {
    search += i + '|';
}
search = search.substr(0, search.length-1);
search += ')\\"';

// print(search);

var re = new RegExp(search, "g");
var replaced = stringified.replace(re, '"yui2-$1"');

print(replaced);

