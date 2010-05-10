YUI.add('yui2-json', function(Y) {
    if (Y.YUI2) {
        var YAHOO    = Y.YUI2;
    }
    /*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.6.0
*/
YAHOO.lang.JSON=(function(){var l=YAHOO.lang,_UNICODE_EXCEPTIONS=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_ESCAPES=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,_VALUES=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,_BRACKETS=/(?:^|:|,)(?:\s*\[)+/g,_INVALID=/^[\],:{}\s]*$/,_SPECIAL_CHARS=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_CHARS={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};function _revive(data,reviver){var walk=function(o,key){var k,v,value=o[key];if(value&&typeof value==="object"){for(k in value){if(l.hasOwnProperty(value,k)){v=walk(value,k);if(v===undefined){delete value[k];}else{value[k]=v;}}}}return reviver.call(o,key,value);};return typeof reviver==="function"?walk({"":data},""):data;}function _char(c){if(!_CHARS[c]){_CHARS[c]="\\u"+("0000"+(+(c.charCodeAt(0))).toString(16)).slice(-4);}return _CHARS[c];}function _prepare(s){return s.replace(_UNICODE_EXCEPTIONS,_char);}function _isValid(str){return l.isString(str)&&_INVALID.test(str.replace(_ESCAPES,"@").replace(_VALUES,"]").replace(_BRACKETS,""));}function _string(s){return'"'+s.replace(_SPECIAL_CHARS,_char)+'"';}function _stringify(h,key,d,w,pstack){var o=typeof w==="function"?w.call(h,key,h[key]):h[key],i,len,j,k,v,isArray,a;if(o instanceof Date){o=l.JSON.dateToString(o);}else{if(o instanceof String||o instanceof Boolean||o instanceof Number){o=o.valueOf();}}switch(typeof o){case"string":return _string(o);case"number":return isFinite(o)?String(o):"null";case"boolean":return String(o);case"object":if(o===null){return"null";}for(i=pstack.length-1;i>=0;--i){if(pstack[i]===o){return"null";}}pstack[pstack.length]=o;a=[];isArray=l.isArray(o);if(d>0){if(isArray){for(i=o.length-1;i>=0;--i){a[i]=_stringify(o,i,d-1,w,pstack)||"null";}}else{j=0;if(l.isArray(w)){for(i=0,len=w.length;i<len;++i){k=w[i];v=_stringify(o,k,d-1,w,pstack);if(v){a[j++]=_string(k)+":"+v;}}}else{for(k in o){if(typeof k==="string"&&l.hasOwnProperty(o,k)){v=_stringify(o,k,d-1,w,pstack);if(v){a[j++]=_string(k)+":"+v;}}}}a.sort();}}pstack.pop();return isArray?"["+a.join(",")+"]":"{"+a.join(",")+"}";}return undefined;}return{isValid:function(s){return _isValid(_prepare(s));},parse:function(s,reviver){s=_prepare(s);if(_isValid(s)){return _revive(eval("("+s+")"),reviver);}throw new SyntaxError("parseJSON");},stringify:function(o,w,d){if(o!==undefined){if(l.isArray(w)){w=(function(a){var uniq=[],map={},v,i,j,len;for(i=0,j=0,len=a.length;i<len;++i){v=a[i];if(typeof v==="string"&&map[v]===undefined){uniq[(map[v]=j++)]=v;}}return uniq;})(w);}d=d>=0?d:1/0;return _stringify({"":o},"",d,w,[]);}return undefined;},dateToString:function(d){function _zeroPad(v){return v<10?"0"+v:v;}return d.getUTCFullYear()+"-"+_zeroPad(d.getUTCMonth()+1)+"-"+_zeroPad(d.getUTCDate())+"T"+_zeroPad(d.getUTCHours())+":"+_zeroPad(d.getUTCMinutes())+":"+_zeroPad(d.getUTCSeconds())+"Z";},stringToDate:function(str){if(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/.test(str)){var d=new Date();d.setUTCFullYear(RegExp.$1,(RegExp.$2|0)-1,RegExp.$3);d.setUTCHours(RegExp.$4,RegExp.$5,RegExp.$6);return d;}return str;}};})();YAHOO.register("json",YAHOO.lang.JSON,{version:"2.6.0",build:"1321"});
    if (!Y.YUI2) {
        Y.YUI2 = YAHOO;
    }
    if (!YAHOO._activ && YAHOO.util.Event) {
        YAHOO._activ = true;
        YAHOO.util.Event._load();
    }
}, '2.6.0' ,{"requires": ["yui2-yahoo"]});
