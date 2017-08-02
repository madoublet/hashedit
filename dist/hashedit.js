(function(){if(self.fetch){return}function h(q){if(typeof q!=="string"){q=String(q)}if(/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(q)){throw new TypeError("Invalid character in header field name")}return q.toLowerCase()}function f(q){if(typeof q!=="string"){q=String(q)}return q}function o(q){this.map={};if(q instanceof o){q.forEach(function(s,r){this.append(r,s)},this)}else{if(q){Object.getOwnPropertyNames(q).forEach(function(r){this.append(r,q[r])},this)}}}o.prototype.append=function(q,s){q=h(q);s=f(s);var r=this.map[q];if(!r){r=[];this.map[q]=r}r.push(s)};o.prototype["delete"]=function(q){delete this.map[h(q)]};o.prototype.get=function(r){var q=this.map[h(r)];return q?q[0]:null};o.prototype.getAll=function(q){return this.map[h(q)]||[]};o.prototype.has=function(q){return this.map.hasOwnProperty(h(q))};o.prototype.set=function(q,r){this.map[h(q)]=[f(r)]};o.prototype.forEach=function(r,q){Object.getOwnPropertyNames(this.map).forEach(function(s){this.map[s].forEach(function(t){r.call(q,t,s,this)},this)},this)};function k(q){if(q.bodyUsed){return Promise.reject(new TypeError("Already read"))}q.bodyUsed=true}function j(q){return new Promise(function(s,r){q.onload=function(){s(q.result)};q.onerror=function(){r(q.error)}})}function g(r){var q=new FileReader();q.readAsArrayBuffer(r);return j(q)}function p(r){var q=new FileReader();q.readAsText(r);return j(q)}var m={blob:"FileReader" in self&&"Blob" in self&&(function(){try{new Blob();return true}catch(q){return false}})(),formData:"FormData" in self};function l(){this.bodyUsed=false;this._initBody=function(q){this._bodyInit=q;if(typeof q==="string"){this._bodyText=q}else{if(m.blob&&Blob.prototype.isPrototypeOf(q)){this._bodyBlob=q}else{if(m.formData&&FormData.prototype.isPrototypeOf(q)){this._bodyFormData=q}else{if(!q){this._bodyText=""}else{throw new Error("unsupported BodyInit type")}}}}};if(m.blob){this.blob=function(){var q=k(this);if(q){return q}if(this._bodyBlob){return Promise.resolve(this._bodyBlob)}else{if(this._bodyFormData){throw new Error("could not read FormData body as blob")}else{return Promise.resolve(new Blob([this._bodyText]))}}};this.arrayBuffer=function(){return this.blob().then(g)};this.text=function(){var q=k(this);if(q){return q}if(this._bodyBlob){return p(this._bodyBlob)}else{if(this._bodyFormData){throw new Error("could not read FormData body as text")}else{return Promise.resolve(this._bodyText)}}}}else{this.text=function(){var q=k(this);return q?q:Promise.resolve(this._bodyText)}}if(m.formData){this.formData=function(){return this.text().then(a)}}this.json=function(){return this.text().then(JSON.parse)};return this}var e=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function i(r){var q=r.toUpperCase();return(e.indexOf(q)>-1)?q:r}function c(r,s){s=s||{};var q=s.body;if(c.prototype.isPrototypeOf(r)){if(r.bodyUsed){throw new TypeError("Already read")}this.url=r.url;this.credentials=r.credentials;if(!s.headers){this.headers=new o(r.headers)}this.method=r.method;this.mode=r.mode;if(!q){q=r._bodyInit;r.bodyUsed=true}}else{this.url=r}this.credentials=s.credentials||this.credentials||"omit";if(s.headers||!this.headers){this.headers=new o(s.headers)}this.method=i(s.method||this.method||"GET");this.mode=s.mode||this.mode||null;this.referrer=null;if((this.method==="GET"||this.method==="HEAD")&&q){throw new TypeError("Body not allowed for GET or HEAD requests")}this._initBody(q)}c.prototype.clone=function(){return new c(this)};function a(q){var r=new FormData();q.trim().split("&").forEach(function(s){if(s){var u=s.split("=");var t=u.shift().replace(/\+/g," ");var v=u.join("=").replace(/\+/g," ");r.append(decodeURIComponent(t),decodeURIComponent(v))}});return r}function d(s){var q=new o();var r=s.getAllResponseHeaders().trim().split("\n");r.forEach(function(w){var u=w.trim().split(":");var t=u.shift().trim();var v=u.join(":").trim();q.append(t,v)});return q}l.call(c.prototype);function b(r,q){if(!q){q={}}this._initBody(r);this.type="default";this.status=q.status;this.ok=this.status>=200&&this.status<300;this.statusText=q.statusText;this.headers=q.headers instanceof o?q.headers:new o(q.headers);this.url=q.url||""}l.call(b.prototype);b.prototype.clone=function(){return new b(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new o(this.headers),url:this.url})};b.error=function(){var q=new b(null,{status:0,statusText:""});q.type="error";return q};var n=[301,302,303,307,308];b.redirect=function(r,q){if(n.indexOf(q)===-1){throw new RangeError("Invalid status code")}return new b(null,{status:q,headers:{location:r}})};self.Headers=o;self.Request=c;self.Response=b;self.fetch=function(q,r){return new Promise(function(u,t){var s;if(c.prototype.isPrototypeOf(q)&&!r){s=q}else{s=new c(q,r)}var w=new XMLHttpRequest();function v(){if("responseURL" in w){return w.responseURL}if(/^X-Request-URL:/m.test(w.getAllResponseHeaders())){return w.getResponseHeader("X-Request-URL")}return}w.onload=function(){var y=(w.status===1223)?204:w.status;if(y<100||y>599){t(new TypeError("Network request failed"));return}var z={status:y,statusText:w.statusText,headers:d(w),url:v()};var x="response" in w?w.response:w.responseText;u(new b(x,z))};w.onerror=function(){t(new TypeError("Network request failed"))};w.open(s.method,s.url,true);if(s.credentials==="include"){w.withCredentials=true}if("responseType" in w&&m.blob){w.responseType="blob"}s.headers.forEach(function(y,x){w.setRequestHeader(x,y)});w.send(typeof s._bodyInit==="undefined"?null:s._bodyInit)})};self.fetch.polyfill=true})();
// i18next, v1.6.3
// Copyright (c)2013 Jan MÃ¼hlemann (jamuhl).
// Distributed under MIT license
// http://i18next.com
(function(){function n(n,e){if(!e||"function"==typeof e)return n;for(var r in e)n[r]=e[r];return n}function e(n,e,r){var t,u=0,a=n.length,s=void 0===a||"function"==typeof n;if(r)if(s){for(t in n)if(e.apply(n[t],r)===!1)break}else for(;a>u&&e.apply(n[u++],r)!==!1;);else if(s){for(t in n)if(e.call(n[t],t,n[t])===!1)break}else for(;a>u&&e.call(n[u],u,n[u++])!==!1;);return n}function r(n){return"string"==typeof n?n.replace(/[&<>"'\/]/g,function(n){return C[n]}):n}function t(n){var e=function(n){if(window.XMLHttpRequest)return n(null,new XMLHttpRequest);if(window.ActiveXObject)try{return n(null,new ActiveXObject("Msxml2.XMLHTTP"))}catch(e){return n(null,new ActiveXObject("Microsoft.XMLHTTP"))}return n(Error())},r=function(n){if("string"==typeof n)return n;var e=[];for(var r in n)n.hasOwnProperty(r)&&e.push(encodeURIComponent(r)+"="+encodeURIComponent(n[r]));return e.join("&")},t=function(n){n=n.replace(/\r\n/g,"\n");for(var e="",r=0;n.length>r;r++){var t=n.charCodeAt(r);128>t?e+=String.fromCharCode(t):t>127&&2048>t?(e+=String.fromCharCode(192|t>>6),e+=String.fromCharCode(128|63&t)):(e+=String.fromCharCode(224|t>>12),e+=String.fromCharCode(128|63&t>>6),e+=String.fromCharCode(128|63&t))}return e},u=function(n){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";n=t(n);var r,u,a,s,o,i,l,c="",f=0;do r=n.charCodeAt(f++),u=n.charCodeAt(f++),a=n.charCodeAt(f++),s=r>>2,o=(3&r)<<4|u>>4,i=(15&u)<<2|a>>6,l=63&a,isNaN(u)?i=l=64:isNaN(a)&&(l=64),c+=e.charAt(s)+e.charAt(o)+e.charAt(i)+e.charAt(l),r=u=a="",s=o=i=l="";while(n.length>f);return c},a=function(){for(var n=arguments[0],e=1;arguments.length>e;e++){var r=arguments[e];for(var t in r)r.hasOwnProperty(t)&&(n[t]=r[t])}return n},s=function(n,t,u,o){"function"==typeof u&&(o=u,u={}),u.cache=u.cache||!1,u.data=u.data||{},u.headers=u.headers||{},u.jsonp=u.jsonp||!1,u.async=void 0===u.async?!0:u.async;var i,l=a({accept:"*/*","content-type":"application/x-www-form-urlencoded;charset=UTF-8"},s.headers,u.headers);if(i="application/json"===l["content-type"]?JSON.stringify(u.data):r(u.data),"GET"===n){var c=[];if(i&&(c.push(i),i=null),u.cache||c.push("_="+(new Date).getTime()),u.jsonp&&(c.push("callback="+u.jsonp),c.push("jsonp="+u.jsonp)),c=c.join("&"),c.length>1&&(t+=t.indexOf("?")>-1?"&"+c:"?"+c),u.jsonp){var f=document.getElementsByTagName("head")[0],m=document.createElement("script");return m.type="text/javascript",m.src=t,f.appendChild(m),void 0}}e(function(e,r){if(e)return o(e);r.open(n,t,u.async);for(var a in l)l.hasOwnProperty(a)&&r.setRequestHeader(a,l[a]);r.onreadystatechange=function(){if(4===r.readyState){var n=r.responseText||"";if(!o)return;o(r.status,{text:function(){return n},json:function(){return JSON.parse(n)}})}},r.send(i)})},o={authBasic:function(n,e){s.headers.Authorization="Basic "+u(n+":"+e)},connect:function(n,e,r){return s("CONNECT",n,e,r)},del:function(n,e,r){return s("DELETE",n,e,r)},get:function(n,e,r){return s("GET",n,e,r)},head:function(n,e,r){return s("HEAD",n,e,r)},headers:function(n){s.headers=n||{}},isAllowed:function(n,e,r){this.options(n,function(n,t){r(-1!==t.text().indexOf(e))})},options:function(n,e,r){return s("OPTIONS",n,e,r)},patch:function(n,e,r){return s("PATCH",n,e,r)},post:function(n,e,r){return s("POST",n,e,r)},put:function(n,e,r){return s("PUT",n,e,r)},trace:function(n,e,r){return s("TRACE",n,e,r)}},i=n.type?n.type.toLowerCase():"get";o[i](n.url,n,function(e,r){200===e?n.success(r.json(),e,null):n.error(r.text(),e,null)})}function u(n,e){"function"==typeof n&&(e=n,n={}),n=n||{},E.extend(A,n),"string"==typeof A.ns&&(A.ns={namespaces:[A.ns],defaultNs:A.ns}),"string"==typeof A.fallbackNS&&(A.fallbackNS=[A.fallbackNS]),A.interpolationPrefixEscaped=E.regexEscape(A.interpolationPrefix),A.interpolationSuffixEscaped=E.regexEscape(A.interpolationSuffix),A.lng||(A.lng=E.detectLanguage()),A.lng?A.useCookie&&E.cookie.create(A.cookieName,A.lng,A.cookieExpirationTime):(A.lng=A.fallbackLng,A.useCookie&&E.cookie.remove(A.cookieName)),P=E.toLanguages(A.lng),S=P[0],E.log("currentLng set to: "+S),R.setCurrentLng(S),L&&A.setJqueryExt&&m();var r;if(L&&L.Deferred&&(r=L.Deferred()),!A.resStore){var t=E.toLanguages(A.lng);"string"==typeof A.preload&&(A.preload=[A.preload]);for(var u=0,a=A.preload.length;a>u;u++)for(var s=E.toLanguages(A.preload[u]),o=0,i=s.length;i>o;o++)0>t.indexOf(s[o])&&t.push(s[o]);return w.sync.load(t,A,function(n,t){j=t,e&&e(N),r&&r.resolve()}),r?r.promise():void 0}return j=A.resStore,e&&e(N),r&&r.resolve(),r?r.promise():void 0}function a(n,e){"string"==typeof n&&(n=[n]);for(var r=0,t=n.length;t>r;r++)0>A.preload.indexOf(n[r])&&A.preload.push(n[r]);return u(e)}function s(n,e,r){"string"!=typeof e?(r=e,e=A.ns.defaultNs):0>A.ns.namespaces.indexOf(e)&&A.ns.namespaces.push(e),j[n]=j[n]||{},j[n][e]=j[n][e]||{},E.extend(j[n][e],r)}function o(n){A.ns.defaultNs=n}function i(n,e){l([n],e)}function l(n,e){var r={dynamicLoad:A.dynamicLoad,resGetPath:A.resGetPath,getAsync:A.getAsync,customLoad:A.customLoad,ns:{namespaces:n,defaultNs:""}},t=E.toLanguages(A.lng);"string"==typeof A.preload&&(A.preload=[A.preload]);for(var u=0,a=A.preload.length;a>u;u++)for(var s=E.toLanguages(A.preload[u]),o=0,i=s.length;i>o;o++)0>t.indexOf(s[o])&&t.push(s[o]);for(var l=[],c=0,f=t.length;f>c;c++){var m=!1,p=j[t[c]];if(p)for(var b=0,g=n.length;g>b;b++)p[n[b]]||(m=!0);else m=!0;m&&l.push(t[c])}l.length?w.sync._fetch(l,r,function(r,t){var u=n.length*l.length;E.each(n,function(n,r){0>A.ns.namespaces.indexOf(r)&&A.ns.namespaces.push(r),E.each(l,function(n,a){j[a]=j[a]||{},j[a][r]=t[a][r],u--,0===u&&e&&(A.useLocalStorage&&w.sync._storeLocal(j),e())})})}):e&&e()}function c(n,e){return u({lng:n},e)}function f(){return S}function m(){function n(n,e,r){if(0!==e.length){var t="text";if(0===e.indexOf("[")){var u=e.split("]");e=u[1],t=u[0].substr(1,u[0].length-1)}e.indexOf(";")===e.length-1&&(e=e.substr(0,e.length-2));var a;"html"===t?(a=A.defaultValueFromContent?L.extend({defaultValue:n.html()},r):r,n.html(L.t(e,a))):"text"===t?(a=A.defaultValueFromContent?L.extend({defaultValue:n.text()},r):r,n.text(L.t(e,a))):(a=A.defaultValueFromContent?L.extend({defaultValue:n.attr(t)},r):r,n.attr(t,L.t(e,a)))}}function e(e,r){var t=e.attr(A.selectorAttr);if(t){var u=e,a=e.data("i18n-target");if(a&&(u=e.find(a)||e),r||A.useDataAttrOptions!==!0||(r=e.data("i18n-options")),r=r||{},t.indexOf(";")>=0){var s=t.split(";");L.each(s,function(e,t){""!==t&&n(u,t,r)})}else n(u,t,r);A.useDataAttrOptions===!0&&e.data("i18n-options",r)}}L.t=L.t||N,L.fn.i18n=function(n){return this.each(function(){e(L(this),n);var r=L(this).find("["+A.selectorAttr+"]");r.each(function(){e(L(this),n)})})}}function p(n,e,r,t){if(!n)return n;if(t=t||e,0>n.indexOf(t.interpolationPrefix||A.interpolationPrefix))return n;var u=t.interpolationPrefix?E.regexEscape(t.interpolationPrefix):A.interpolationPrefixEscaped,a=t.interpolationSuffix?E.regexEscape(t.interpolationSuffix):A.interpolationSuffixEscaped,s="HTML"+a;return E.each(e,function(e,o){var i=r?r+A.keyseparator+e:e;"object"==typeof o&&null!==o?n=p(n,o,i,t):t.escapeInterpolation||A.escapeInterpolation?(n=n.replace(RegExp([u,i,s].join(""),"g"),o),n=n.replace(RegExp([u,i,a].join(""),"g"),E.escape(o))):n=n.replace(RegExp([u,i,a].join(""),"g"),o)}),n}function b(n,e){var r=",",t="{",u="}",a=E.extend({},e);for(delete a.postProcess;-1!=n.indexOf(A.reusePrefix)&&(T++,!(T>A.maxRecursion));){var s=n.lastIndexOf(A.reusePrefix),o=n.indexOf(A.reuseSuffix,s)+A.reuseSuffix.length,i=n.substring(s,o),l=i.replace(A.reusePrefix,"").replace(A.reuseSuffix,"");if(-1!=l.indexOf(r)){var c=l.indexOf(r);if(-1!=l.indexOf(t,c)&&-1!=l.indexOf(u,c)){var f=l.indexOf(t,c),m=l.indexOf(u,f)+u.length;try{a=E.extend(a,JSON.parse(l.substring(f,m))),l=l.substring(0,c)}catch(p){}}}var b=x(l,a);n=n.replace(i,b)}return n}function g(n){return n.context&&"string"==typeof n.context}function d(n){return void 0!==n.count&&"string"!=typeof n.count&&1!==n.count}function h(n,e){e=e||{};var r=e.defaultValue||n,t=y(n,e);return void 0!==t||t===r}function N(){return T=0,x.apply(null,arguments)}function v(){for(var n=[],e=1;arguments.length>e;e++)n.push(arguments[e]);return{postProcess:"sprintf",sprintf:n}}function x(n,e){e="string"==typeof e?v.apply(null,arguments):e||{};var r,t=e.defaultValue||n,u=y(n,e),a=e.lng?E.toLanguages(e.lng):P,s=e.ns||A.ns.defaultNs;n.indexOf(A.nsseparator)>-1&&(r=n.split(A.nsseparator),s=r[0],n=r[1]),void 0===u&&A.sendMissing&&(e.lng?F.postMissing(a[0],s,n,t,a):F.postMissing(A.lng,s,n,t,a));var o=e.postProcess||A.postProcess;void 0!==u&&o&&z[o]&&(u=z[o](u,n,e));var i=t;if(t.indexOf(A.nsseparator)>-1&&(r=t.split(A.nsseparator),i=r[1]),i===n&&A.parseMissingKey&&(t=A.parseMissingKey(t)),void 0===u&&(t=p(t,e),t=b(t,e),o&&z[o])){var l=e.defaultValue||n;u=z[o](l,n,e)}return void 0!==u?u:t}function y(n,e){e=e||{};var r,t,u=e.defaultValue||n,a=P;if(!j)return u;if(e.lng&&(a=E.toLanguages(e.lng),!j[a[0]])){var s=A.getAsync;A.getAsync=!1,w.sync.load(a,A,function(n,e){E.extend(j,e),A.getAsync=s})}var o=e.ns||A.ns.defaultNs;if(n.indexOf(A.nsseparator)>-1){var i=n.split(A.nsseparator);o=i[0],n=i[1]}if(g(e)){r=E.extend({},e),delete r.context,r.defaultValue=A.contextNotFound;var l=o+A.nsseparator+n+"_"+e.context;if(t=N(l,r),t!=A.contextNotFound)return p(t,{context:e.context})}if(d(e)){r=E.extend({},e),delete r.count,r.defaultValue=A.pluralNotFound;var c=o+A.nsseparator+n+A.pluralSuffix,f=R.get(a[0],e.count);if(f>=0?c=c+"_"+f:1===f&&(c=o+A.nsseparator+n),t=N(c,r),t!=A.pluralNotFound)return p(t,{count:e.count,interpolationPrefix:e.interpolationPrefix,interpolationSuffix:e.interpolationSuffix})}for(var m,h=n.split(A.keyseparator),v=0,k=a.length;k>v&&void 0===m;v++){for(var S=a[v],O=0,L=j[S]&&j[S][o];h[O];)L=L&&L[h[O]],O++;if(void 0!==L){if("string"==typeof L)L=p(L,e),L=b(L,e);else if("[object Array]"!==Object.prototype.toString.apply(L)||A.returnObjectTrees||e.returnObjectTrees){if(null===L&&A.fallbackOnNull===!0)L=void 0;else if(null!==L)if(A.returnObjectTrees||e.returnObjectTrees){var T={};for(var C in L)T[C]=x(o+A.nsseparator+n+A.keyseparator+C,e);L=T}else L="key '"+o+":"+n+" ("+S+")' "+"returned a object instead of string.",E.log(L)}else L=L.join("\n"),L=p(L,e),L=b(L,e);m=L}}if(void 0===m&&!e.isFallbackLookup&&(A.fallbackToDefaultNS===!0||A.fallbackNS&&A.fallbackNS.length>0))if(e.isFallbackLookup=!0,A.fallbackNS.length){for(var _=0,M=A.fallbackNS.length;M>_;_++)if(m=y(A.fallbackNS[_]+A.nsseparator+n,e)){var F=m.indexOf(A.nsseparator)>-1?m.split(A.nsseparator)[1]:m,z=u.indexOf(A.nsseparator)>-1?u.split(A.nsseparator)[1]:u;if(F!==z)break}}else m=y(n,e);return m}function k(){var n,e=[];if("undefined"!=typeof window&&(function(){for(var n=window.location.search.substring(1),r=n.split("&"),t=0;r.length>t;t++){var u=r[t].indexOf("=");if(u>0){var a=r[t].substring(0,u),s=r[t].substring(u+1);e[a]=s}}}(),e[A.detectLngQS]&&(n=e[A.detectLngQS])),!n&&"undefined"!=typeof document&&A.useCookie){var r=E.cookie.read(A.cookieName);r&&(n=r)}return n||"undefined"==typeof navigator||(n=navigator.language?navigator.language:navigator.userLanguage),n}Array.prototype.indexOf||(Array.prototype.indexOf=function(n){"use strict";if(null==this)throw new TypeError;var e=Object(this),r=e.length>>>0;if(0===r)return-1;var t=0;if(arguments.length>0&&(t=Number(arguments[1]),t!=t?t=0:0!=t&&1/0!=t&&t!=-1/0&&(t=(t>0||-1)*Math.floor(Math.abs(t)))),t>=r)return-1;for(var u=t>=0?t:Math.max(r-Math.abs(t),0);r>u;u++)if(u in e&&e[u]===n)return u;return-1}),Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(n){"use strict";if(null==this)throw new TypeError;var e=Object(this),r=e.length>>>0;if(0===r)return-1;var t=r;arguments.length>1&&(t=Number(arguments[1]),t!=t?t=0:0!=t&&t!=1/0&&t!=-(1/0)&&(t=(t>0||-1)*Math.floor(Math.abs(t))));for(var u=t>=0?Math.min(t,r-1):r-Math.abs(t);u>=0;u--)if(u in e&&e[u]===n)return u;return-1});var S,O=this,L=O.jQuery||O.Zepto,w={},j={},T=0,P=[];"undefined"!=typeof module&&module.exports?module.exports=w:(L&&(L.i18n=L.i18n||w),O.i18n=O.i18n||w);var A={lng:void 0,load:"all",preload:[],lowerCaseLng:!1,returnObjectTrees:!1,fallbackLng:"dev",fallbackNS:[],detectLngQS:"setLng",ns:"translation",fallbackOnNull:!0,fallbackToDefaultNS:!1,nsseparator:":",keyseparator:".",selectorAttr:"data-i18n",debug:!1,resGetPath:"locales/__lng__/__ns__.json",resPostPath:"locales/add/__lng__/__ns__",getAsync:!0,postAsync:!0,resStore:void 0,useLocalStorage:!1,localStorageExpirationTime:6048e5,dynamicLoad:!1,sendMissing:!1,sendMissingTo:"fallback",sendType:"POST",interpolationPrefix:"__",interpolationSuffix:"__",reusePrefix:"$t(",reuseSuffix:")",pluralSuffix:"_plural",pluralNotFound:["plural_not_found",Math.random()].join(""),contextNotFound:["context_not_found",Math.random()].join(""),escapeInterpolation:!1,setJqueryExt:!0,defaultValueFromContent:!0,useDataAttrOptions:!1,cookieExpirationTime:void 0,useCookie:!0,cookieName:"i18next",postProcess:void 0,parseMissingKey:void 0},C={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},_={create:function(n,e,r){var t;if(r){var u=new Date;u.setTime(u.getTime()+1e3*60*r),t="; expires="+u.toGMTString()}else t="";document.cookie=n+"="+e+t+"; path=/"},read:function(n){for(var e=n+"=",r=document.cookie.split(";"),t=0;r.length>t;t++){for(var u=r[t];" "==u.charAt(0);)u=u.substring(1,u.length);if(0===u.indexOf(e))return u.substring(e.length,u.length)}return null},remove:function(n){this.create(n,"",-1)}},M={create:function(){},read:function(){return null},remove:function(){}},E={extend:L?L.extend:n,each:L?L.each:e,ajax:L?L.ajax:t,cookie:"undefined"!=typeof document?_:M,detectLanguage:k,escape:r,log:function(n){A.debug&&"undefined"!=typeof console&&console.log(n)},toLanguages:function(n){var e=[];if("string"==typeof n&&n.indexOf("-")>-1){var r=n.split("-");n=A.lowerCaseLng?r[0].toLowerCase()+"-"+r[1].toLowerCase():r[0].toLowerCase()+"-"+r[1].toUpperCase(),"unspecific"!==A.load&&e.push(n),"current"!==A.load&&e.push(r[0])}else e.push(n);return-1===e.indexOf(A.fallbackLng)&&A.fallbackLng&&e.push(A.fallbackLng),e},regexEscape:function(n){return n.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}};E.applyReplacement=p;var F={load:function(n,e,r){e.useLocalStorage?F._loadLocal(n,e,function(t,u){for(var a=[],s=0,o=n.length;o>s;s++)u[n[s]]||a.push(n[s]);a.length>0?F._fetch(a,e,function(n,e){E.extend(u,e),F._storeLocal(e),r(null,u)}):r(null,u)}):F._fetch(n,e,function(n,e){r(null,e)})},_loadLocal:function(n,e,r){var t={},u=(new Date).getTime();if(window.localStorage){var a=n.length;E.each(n,function(n,s){var o=window.localStorage.getItem("res_"+s);o&&(o=JSON.parse(o),o.i18nStamp&&o.i18nStamp+e.localStorageExpirationTime>u&&(t[s]=o)),a--,0===a&&r(null,t)})}},_storeLocal:function(n){if(window.localStorage)for(var e in n)n[e].i18nStamp=(new Date).getTime(),window.localStorage.setItem("res_"+e,JSON.stringify(n[e]))},_fetch:function(n,e,r){var t=e.ns,u={};if(e.dynamicLoad){var a=function(n,e){r(null,e)};if("function"==typeof e.customLoad)e.customLoad(n,t.namespaces,e,a);else{var s=p(e.resGetPath,{lng:n.join("+"),ns:t.namespaces.join("+")});E.ajax({url:s,success:function(n){E.log("loaded: "+s),a(null,n)},error:function(n,e,r){E.log("failed loading: "+s),a("failed loading resource.json error: "+r)},dataType:"json",async:e.getAsync})}}else{var o,i=t.namespaces.length*n.length;E.each(t.namespaces,function(t,a){E.each(n,function(n,t){var s=function(n,e){n&&(o=o||[],o.push(n)),u[t]=u[t]||{},u[t][a]=e,i--,0===i&&r(o,u)};"function"==typeof e.customLoad?e.customLoad(t,a,e,s):F._fetchOne(t,a,e,s)})})}},_fetchOne:function(n,e,r,t){var u=p(r.resGetPath,{lng:n,ns:e});E.ajax({url:u,success:function(n){E.log("loaded: "+u),t(null,n)},error:function(n,e,r){E.log("failed loading: "+u),t(r,{})},dataType:"json",async:r.getAsync})},postMissing:function(n,e,r,t,u){var a={};a[r]=t;var s=[];if("fallback"===A.sendMissingTo&&A.fallbackLng!==!1)s.push({lng:A.fallbackLng,url:p(A.resPostPath,{lng:A.fallbackLng,ns:e})});else if("current"===A.sendMissingTo||"fallback"===A.sendMissingTo&&A.fallbackLng===!1)s.push({lng:n,url:p(A.resPostPath,{lng:n,ns:e})});else if("all"===A.sendMissingTo)for(var o=0,i=u.length;i>o;o++)s.push({lng:u[o],url:p(A.resPostPath,{lng:u[o],ns:e})});for(var l=0,c=s.length;c>l;l++){var f=s[l];E.ajax({url:f.url,type:A.sendType,data:a,success:function(){E.log("posted missing key '"+r+"' to: "+f.url);for(var n=r.split("."),u=0,a=j[f.lng][e];n[u];)a=a[n[u]]=u===n.length-1?t:a[n[u]]||{},u++},error:function(){E.log("failed posting missing key '"+r+"' to: "+f.url)},dataType:"json",async:A.postAsync})}}},R={rules:{ach:{name:"Acholi",numbers:[1,2],plurals:function(n){return Number(n>1)}},af:{name:"Afrikaans",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ak:{name:"Akan",numbers:[1,2],plurals:function(n){return Number(n>1)}},am:{name:"Amharic",numbers:[1,2],plurals:function(n){return Number(n>1)}},an:{name:"Aragonese",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ar:{name:"Arabic",numbers:[0,1,2,3,11,100],plurals:function(n){return Number(0===n?0:1==n?1:2==n?2:n%100>=3&&10>=n%100?3:n%100>=11?4:5)}},arn:{name:"Mapudungun",numbers:[1,2],plurals:function(n){return Number(n>1)}},ast:{name:"Asturian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ay:{name:"AymarÃ¡",numbers:[1],plurals:function(){return 0}},az:{name:"Azerbaijani",numbers:[1,2],plurals:function(n){return Number(1!=n)}},be:{name:"Belarusian",numbers:[1,2,5],plurals:function(n){return Number(1==n%10&&11!=n%100?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},bg:{name:"Bulgarian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},bn:{name:"Bengali",numbers:[1,2],plurals:function(n){return Number(1!=n)}},bo:{name:"Tibetan",numbers:[1],plurals:function(){return 0}},br:{name:"Breton",numbers:[1,2],plurals:function(n){return Number(n>1)}},bs:{name:"Bosnian",numbers:[1,2,5],plurals:function(n){return Number(1==n%10&&11!=n%100?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},ca:{name:"Catalan",numbers:[1,2],plurals:function(n){return Number(1!=n)}},cgg:{name:"Chiga",numbers:[1],plurals:function(){return 0}},cs:{name:"Czech",numbers:[1,2,5],plurals:function(n){return Number(1==n?0:n>=2&&4>=n?1:2)}},csb:{name:"Kashubian",numbers:[1,2,5],plurals:function(n){return Number(1==n?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},cy:{name:"Welsh",numbers:[1,2,3,8],plurals:function(n){return Number(1==n?0:2==n?1:8!=n&&11!=n?2:3)}},da:{name:"Danish",numbers:[1,2],plurals:function(n){return Number(1!=n)}},de:{name:"German",numbers:[1,2],plurals:function(n){return Number(1!=n)}},dz:{name:"Dzongkha",numbers:[1],plurals:function(){return 0}},el:{name:"Greek",numbers:[1,2],plurals:function(n){return Number(1!=n)}},en:{name:"English",numbers:[1,2],plurals:function(n){return Number(1!=n)}},eo:{name:"Esperanto",numbers:[1,2],plurals:function(n){return Number(1!=n)}},es:{name:"Spanish",numbers:[1,2],plurals:function(n){return Number(1!=n)}},es_ar:{name:"Argentinean Spanish",numbers:[1,2],plurals:function(n){return Number(1!=n)}},et:{name:"Estonian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},eu:{name:"Basque",numbers:[1,2],plurals:function(n){return Number(1!=n)}},fa:{name:"Persian",numbers:[1],plurals:function(){return 0}},fi:{name:"Finnish",numbers:[1,2],plurals:function(n){return Number(1!=n)}},fil:{name:"Filipino",numbers:[1,2],plurals:function(n){return Number(n>1)}},fo:{name:"Faroese",numbers:[1,2],plurals:function(n){return Number(1!=n)}},fr:{name:"French",numbers:[1,2],plurals:function(n){return Number(n>1)}},fur:{name:"Friulian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},fy:{name:"Frisian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ga:{name:"Irish",numbers:[1,2,3,7,11],plurals:function(n){return Number(1==n?0:2==n?1:7>n?2:11>n?3:4)}},gd:{name:"Scottish Gaelic",numbers:[1,2,3,20],plurals:function(n){return Number(1==n||11==n?0:2==n||12==n?1:n>2&&20>n?2:3)}},gl:{name:"Galician",numbers:[1,2],plurals:function(n){return Number(1!=n)}},gu:{name:"Gujarati",numbers:[1,2],plurals:function(n){return Number(1!=n)}},gun:{name:"Gun",numbers:[1,2],plurals:function(n){return Number(n>1)}},ha:{name:"Hausa",numbers:[1,2],plurals:function(n){return Number(1!=n)}},he:{name:"Hebrew",numbers:[1,2],plurals:function(n){return Number(1!=n)}},hi:{name:"Hindi",numbers:[1,2],plurals:function(n){return Number(1!=n)}},hr:{name:"Croatian",numbers:[1,2,5],plurals:function(n){return Number(1==n%10&&11!=n%100?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},hu:{name:"Hungarian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},hy:{name:"Armenian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ia:{name:"Interlingua",numbers:[1,2],plurals:function(n){return Number(1!=n)}},id:{name:"Indonesian",numbers:[1],plurals:function(){return 0}},is:{name:"Icelandic",numbers:[1,2],plurals:function(n){return Number(1!=n%10||11==n%100)}},it:{name:"Italian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ja:{name:"Japanese",numbers:[1],plurals:function(){return 0}},jbo:{name:"Lojban",numbers:[1],plurals:function(){return 0}},jv:{name:"Javanese",numbers:[0,1],plurals:function(n){return Number(0!==n)}},ka:{name:"Georgian",numbers:[1],plurals:function(){return 0}},kk:{name:"Kazakh",numbers:[1],plurals:function(){return 0}},km:{name:"Khmer",numbers:[1],plurals:function(){return 0}},kn:{name:"Kannada",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ko:{name:"Korean",numbers:[1],plurals:function(){return 0}},ku:{name:"Kurdish",numbers:[1,2],plurals:function(n){return Number(1!=n)}},kw:{name:"Cornish",numbers:[1,2,3,4],plurals:function(n){return Number(1==n?0:2==n?1:3==n?2:3)}},ky:{name:"Kyrgyz",numbers:[1],plurals:function(){return 0}},lb:{name:"Letzeburgesch",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ln:{name:"Lingala",numbers:[1,2],plurals:function(n){return Number(n>1)}},lo:{name:"Lao",numbers:[1],plurals:function(){return 0}},lt:{name:"Lithuanian",numbers:[1,2,10],plurals:function(n){return Number(1==n%10&&11!=n%100?0:n%10>=2&&(10>n%100||n%100>=20)?1:2)}},lv:{name:"Latvian",numbers:[0,1,2],plurals:function(n){return Number(1==n%10&&11!=n%100?0:0!==n?1:2)}},mai:{name:"Maithili",numbers:[1,2],plurals:function(n){return Number(1!=n)}},mfe:{name:"Mauritian Creole",numbers:[1,2],plurals:function(n){return Number(n>1)}},mg:{name:"Malagasy",numbers:[1,2],plurals:function(n){return Number(n>1)}},mi:{name:"Maori",numbers:[1,2],plurals:function(n){return Number(n>1)}},mk:{name:"Macedonian",numbers:[1,2],plurals:function(n){return Number(1==n||1==n%10?0:1)}},ml:{name:"Malayalam",numbers:[1,2],plurals:function(n){return Number(1!=n)}},mn:{name:"Mongolian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},mnk:{name:"Mandinka",numbers:[0,1,2],plurals:function(n){return Number(1==n?1:2)}},mr:{name:"Marathi",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ms:{name:"Malay",numbers:[1],plurals:function(){return 0}},mt:{name:"Maltese",numbers:[1,2,11,20],plurals:function(n){return Number(1==n?0:0===n||n%100>1&&11>n%100?1:n%100>10&&20>n%100?2:3)}},nah:{name:"Nahuatl",numbers:[1,2],plurals:function(n){return Number(1!=n)}},nap:{name:"Neapolitan",numbers:[1,2],plurals:function(n){return Number(1!=n)}},nb:{name:"Norwegian Bokmal",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ne:{name:"Nepali",numbers:[1,2],plurals:function(n){return Number(1!=n)}},nl:{name:"Dutch",numbers:[1,2],plurals:function(n){return Number(1!=n)}},nn:{name:"Norwegian Nynorsk",numbers:[1,2],plurals:function(n){return Number(1!=n)}},no:{name:"Norwegian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},nso:{name:"Northern Sotho",numbers:[1,2],plurals:function(n){return Number(1!=n)}},oc:{name:"Occitan",numbers:[1,2],plurals:function(n){return Number(n>1)}},or:{name:"Oriya",numbers:[2,1],plurals:function(n){return Number(1!=n)}},pa:{name:"Punjabi",numbers:[1,2],plurals:function(n){return Number(1!=n)}},pap:{name:"Papiamento",numbers:[1,2],plurals:function(n){return Number(1!=n)}},pl:{name:"Polish",numbers:[1,2,5],plurals:function(n){return Number(1==n?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},pms:{name:"Piemontese",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ps:{name:"Pashto",numbers:[1,2],plurals:function(n){return Number(1!=n)}},pt:{name:"Portuguese",numbers:[1,2],plurals:function(n){return Number(1!=n)}},pt_br:{name:"Brazilian Portuguese",numbers:[1,2],plurals:function(n){return Number(1!=n)}},rm:{name:"Romansh",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ro:{name:"Romanian",numbers:[1,2,20],plurals:function(n){return Number(1==n?0:0===n||n%100>0&&20>n%100?1:2)}},ru:{name:"Russian",numbers:[1,2,5],plurals:function(n){return Number(1==n%10&&11!=n%100?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},sah:{name:"Yakut",numbers:[1],plurals:function(){return 0}},sco:{name:"Scots",numbers:[1,2],plurals:function(n){return Number(1!=n)}},se:{name:"Northern Sami",numbers:[1,2],plurals:function(n){return Number(1!=n)}},si:{name:"Sinhala",numbers:[1,2],plurals:function(n){return Number(1!=n)}},sk:{name:"Slovak",numbers:[1,2,5],plurals:function(n){return Number(1==n?0:n>=2&&4>=n?1:2)}},sl:{name:"Slovenian",numbers:[5,1,2,3],plurals:function(n){return Number(1==n%100?1:2==n%100?2:3==n%100||4==n%100?3:0)}},so:{name:"Somali",numbers:[1,2],plurals:function(n){return Number(1!=n)}},son:{name:"Songhay",numbers:[1,2],plurals:function(n){return Number(1!=n)}},sq:{name:"Albanian",numbers:[1,2],plurals:function(n){return Number(1!=n)}},sr:{name:"Serbian",numbers:[1,2,5],plurals:function(n){return Number(1==n%10&&11!=n%100?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},su:{name:"Sundanese",numbers:[1],plurals:function(){return 0}},sv:{name:"Swedish",numbers:[1,2],plurals:function(n){return Number(1!=n)}},sw:{name:"Swahili",numbers:[1,2],plurals:function(n){return Number(1!=n)}},ta:{name:"Tamil",numbers:[1,2],plurals:function(n){return Number(1!=n)}},te:{name:"Telugu",numbers:[1,2],plurals:function(n){return Number(1!=n)}},tg:{name:"Tajik",numbers:[1,2],plurals:function(n){return Number(n>1)}},th:{name:"Thai",numbers:[1],plurals:function(){return 0}},ti:{name:"Tigrinya",numbers:[1,2],plurals:function(n){return Number(n>1)}},tk:{name:"Turkmen",numbers:[1,2],plurals:function(n){return Number(1!=n)}},tr:{name:"Turkish",numbers:[1,2],plurals:function(n){return Number(n>1)}},tt:{name:"Tatar",numbers:[1],plurals:function(){return 0}},ug:{name:"Uyghur",numbers:[1],plurals:function(){return 0}},uk:{name:"Ukrainian",numbers:[1,2,5],plurals:function(n){return Number(1==n%10&&11!=n%100?0:n%10>=2&&4>=n%10&&(10>n%100||n%100>=20)?1:2)}},ur:{name:"Urdu",numbers:[1,2],plurals:function(n){return Number(1!=n)}},uz:{name:"Uzbek",numbers:[1,2],plurals:function(n){return Number(n>1)}},vi:{name:"Vietnamese",numbers:[1],plurals:function(){return 0}},wa:{name:"Walloon",numbers:[1,2],plurals:function(n){return Number(n>1)}},wo:{name:"Wolof",numbers:[1],plurals:function(){return 0}},yo:{name:"Yoruba",numbers:[1,2],plurals:function(n){return Number(1!=n)}},zh:{name:"Chinese",numbers:[1],plurals:function(){return 0}}},addRule:function(n,e){R.rules[n]=e},setCurrentLng:function(n){if(!R.currentRule||R.currentRule.lng!==n){var e=n.split("-");R.currentRule={lng:n,rule:R.rules[e[0]]}}},get:function(n,e){function r(e,r){var t;if(t=R.currentRule&&R.currentRule.lng===n?R.currentRule.rule:R.rules[e]){var u=t.plurals(r),a=t.numbers[u];return 2===t.numbers.length&&1===t.numbers[0]&&(2===a?a=-1:1===a&&(a=1)),a}return 1===r?"1":"-1"}var t=n.split("-");return r(t[0],e)}},z={},D=function(n,e){z[n]=e},I=function(){function n(n){return Object.prototype.toString.call(n).slice(8,-1).toLowerCase()}function e(n,e){for(var r=[];e>0;r[--e]=n);return r.join("")}var r=function(){return r.cache.hasOwnProperty(arguments[0])||(r.cache[arguments[0]]=r.parse(arguments[0])),r.format.call(null,r.cache[arguments[0]],arguments)};return r.format=function(r,t){var u,a,s,o,i,l,c,f=1,m=r.length,p="",b=[];for(a=0;m>a;a++)if(p=n(r[a]),"string"===p)b.push(r[a]);else if("array"===p){if(o=r[a],o[2])for(u=t[f],s=0;o[2].length>s;s++){if(!u.hasOwnProperty(o[2][s]))throw I('[sprintf] property "%s" does not exist',o[2][s]);u=u[o[2][s]]}else u=o[1]?t[o[1]]:t[f++];if(/[^s]/.test(o[8])&&"number"!=n(u))throw I("[sprintf] expecting number but found %s",n(u));switch(o[8]){case"b":u=u.toString(2);break;case"c":u=String.fromCharCode(u);break;case"d":u=parseInt(u,10);break;case"e":u=o[7]?u.toExponential(o[7]):u.toExponential();break;case"f":u=o[7]?parseFloat(u).toFixed(o[7]):parseFloat(u);break;case"o":u=u.toString(8);break;case"s":u=(u+="")&&o[7]?u.substring(0,o[7]):u;break;case"u":u=Math.abs(u);break;case"x":u=u.toString(16);break;case"X":u=u.toString(16).toUpperCase()}u=/[def]/.test(o[8])&&o[3]&&u>=0?"+"+u:u,l=o[4]?"0"==o[4]?"0":o[4].charAt(1):" ",c=o[6]-(u+"").length,i=o[6]?e(l,c):"",b.push(o[5]?u+i:i+u)}return b.join("")},r.cache={},r.parse=function(n){for(var e=n,r=[],t=[],u=0;e;){if(null!==(r=/^[^\x25]+/.exec(e)))t.push(r[0]);else if(null!==(r=/^\x25{2}/.exec(e)))t.push("%");else{if(null===(r=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(e)))throw"[sprintf] huh?";if(r[2]){u|=1;var a=[],s=r[2],o=[];if(null===(o=/^([a-z_][a-z_\d]*)/i.exec(s)))throw"[sprintf] huh?";for(a.push(o[1]);""!==(s=s.substring(o[0].length));)if(null!==(o=/^\.([a-z_][a-z_\d]*)/i.exec(s)))a.push(o[1]);else{if(null===(o=/^\[(\d+)\]/.exec(s)))throw"[sprintf] huh?";a.push(o[1])}r[2]=a}else u|=2;if(3===u)throw"[sprintf] mixing positional and named placeholders is not (yet) supported";t.push(r)}e=e.substring(r[0].length)}return t},r}(),G=function(n,e){return e.unshift(n),I.apply(null,e)};D("sprintf",function(n,e,r){return r.sprintf?"[object Array]"===Object.prototype.toString.apply(r.sprintf)?G(n,r.sprintf):"object"==typeof r.sprintf?I(n,r.sprintf):n:n}),w.init=u,w.setLng=c,w.preload=a,w.addResourceBundle=s,w.loadNamespace=i,w.loadNamespaces=l,w.setDefaultNamespace=o,w.t=N,w.translate=N,w.exists=h,w.detectLanguage=E.detectLanguage,w.pluralExtensions=R,w.sync=F,w.functions=E,w.lng=f,w.addPostProcessor=D,w.options=A})();

(function(){var a,b,c,d,e,f,g,h,i=[].slice,j={}.hasOwnProperty,k=function(a,b){function c(){this.constructor=a}for(var d in b)j.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};g=function(){},b=function(){function a(){}return a.prototype.addEventListener=a.prototype.on,a.prototype.on=function(a,b){return this._callbacks=this._callbacks||{},this._callbacks[a]||(this._callbacks[a]=[]),this._callbacks[a].push(b),this},a.prototype.emit=function(){var a,b,c,d,e,f;if(d=arguments[0],a=2<=arguments.length?i.call(arguments,1):[],this._callbacks=this._callbacks||{},c=this._callbacks[d])for(e=0,f=c.length;f>e;e++)b=c[e],b.apply(this,a);return this},a.prototype.removeListener=a.prototype.off,a.prototype.removeAllListeners=a.prototype.off,a.prototype.removeEventListener=a.prototype.off,a.prototype.off=function(a,b){var c,d,e,f,g;if(!this._callbacks||0===arguments.length)return this._callbacks={},this;if(d=this._callbacks[a],!d)return this;if(1===arguments.length)return delete this._callbacks[a],this;for(e=f=0,g=d.length;g>f;e=++f)if(c=d[e],c===b){d.splice(e,1);break}return this},a}(),a=function(a){function c(a,b){var e,f,g;if(this.element=a,this.version=c.version,this.defaultOptions.previewTemplate=this.defaultOptions.previewTemplate.replace(/\n*/g,""),this.clickableElements=[],this.listeners=[],this.files=[],"string"==typeof this.element&&(this.element=document.querySelector(this.element)),!this.element||null==this.element.nodeType)throw new Error("Invalid dropzone element.");if(this.element.dropzone)throw new Error("Dropzone already attached.");if(c.instances.push(this),this.element.dropzone=this,e=null!=(g=c.optionsForElement(this.element))?g:{},this.options=d({},this.defaultOptions,e,null!=b?b:{}),this.options.forceFallback||!c.isBrowserSupported())return this.options.fallback.call(this);if(null==this.options.url&&(this.options.url=this.element.getAttribute("action")),!this.options.url)throw new Error("No URL provided.");if(this.options.acceptedFiles&&this.options.acceptedMimeTypes)throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");this.options.acceptedMimeTypes&&(this.options.acceptedFiles=this.options.acceptedMimeTypes,delete this.options.acceptedMimeTypes),this.options.method=this.options.method.toUpperCase(),(f=this.getExistingFallback())&&f.parentNode&&f.parentNode.removeChild(f),this.options.previewsContainer!==!1&&(this.previewsContainer=this.options.previewsContainer?c.getElement(this.options.previewsContainer,"previewsContainer"):this.element),this.options.clickable&&(this.clickableElements=this.options.clickable===!0?[this.element]:c.getElements(this.options.clickable,"clickable")),this.init()}var d,e;return k(c,a),c.prototype.Emitter=b,c.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","addedfiles","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"],c.prototype.defaultOptions={url:null,method:"post",withCredentials:!1,parallelUploads:2,uploadMultiple:!1,maxFilesize:256,paramName:"file",createImageThumbnails:!0,maxThumbnailFilesize:10,thumbnailWidth:120,thumbnailHeight:120,filesizeBase:1e3,maxFiles:null,params:{},clickable:!0,ignoreHiddenFiles:!0,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:!0,autoQueue:!0,addRemoveLinks:!1,previewsContainer:null,hiddenInputContainer:"body",capture:null,renameFilename:null,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",dictCancelUpload:"Cancel upload",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",accept:function(a,b){return b()},init:function(){return g},forceFallback:!1,fallback:function(){var a,b,d,e,f,g;for(this.element.className=""+this.element.className+" dz-browser-not-supported",g=this.element.getElementsByTagName("div"),e=0,f=g.length;f>e;e++)a=g[e],/(^| )dz-message($| )/.test(a.className)&&(b=a,a.className="dz-message");return b||(b=c.createElement('<div class="dz-message"><span></span></div>'),this.element.appendChild(b)),d=b.getElementsByTagName("span")[0],d&&(null!=d.textContent?d.textContent=this.options.dictFallbackMessage:null!=d.innerText&&(d.innerText=this.options.dictFallbackMessage)),this.element.appendChild(this.getFallbackForm())},resize:function(a){var b,c,d;return b={srcX:0,srcY:0,srcWidth:a.width,srcHeight:a.height},c=a.width/a.height,b.optWidth=this.options.thumbnailWidth,b.optHeight=this.options.thumbnailHeight,null==b.optWidth&&null==b.optHeight?(b.optWidth=b.srcWidth,b.optHeight=b.srcHeight):null==b.optWidth?b.optWidth=c*b.optHeight:null==b.optHeight&&(b.optHeight=1/c*b.optWidth),d=b.optWidth/b.optHeight,a.height<b.optHeight||a.width<b.optWidth?(b.trgHeight=b.srcHeight,b.trgWidth=b.srcWidth):c>d?(b.srcHeight=a.height,b.srcWidth=b.srcHeight*d):(b.srcWidth=a.width,b.srcHeight=b.srcWidth/d),b.srcX=(a.width-b.srcWidth)/2,b.srcY=(a.height-b.srcHeight)/2,b},drop:function(){return this.element.classList.remove("dz-drag-hover")},dragstart:g,dragend:function(){return this.element.classList.remove("dz-drag-hover")},dragenter:function(){return this.element.classList.add("dz-drag-hover")},dragover:function(){return this.element.classList.add("dz-drag-hover")},dragleave:function(){return this.element.classList.remove("dz-drag-hover")},paste:g,reset:function(){return this.element.classList.remove("dz-started")},addedfile:function(a){var b,d,e,f,g,h,i,j,k,l,m,n,o;if(this.element===this.previewsContainer&&this.element.classList.add("dz-started"),this.previewsContainer){for(a.previewElement=c.createElement(this.options.previewTemplate.trim()),a.previewTemplate=a.previewElement,this.previewsContainer.appendChild(a.previewElement),l=a.previewElement.querySelectorAll("[data-dz-name]"),f=0,i=l.length;i>f;f++)b=l[f],b.textContent=this._renameFilename(a.name);for(m=a.previewElement.querySelectorAll("[data-dz-size]"),g=0,j=m.length;j>g;g++)b=m[g],b.innerHTML=this.filesize(a.size);for(this.options.addRemoveLinks&&(a._removeLink=c.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'+this.options.dictRemoveFile+"</a>"),a.previewElement.appendChild(a._removeLink)),d=function(b){return function(d){return d.preventDefault(),d.stopPropagation(),a.status===c.UPLOADING?c.confirm(b.options.dictCancelUploadConfirmation,function(){return b.removeFile(a)}):b.options.dictRemoveFileConfirmation?c.confirm(b.options.dictRemoveFileConfirmation,function(){return b.removeFile(a)}):b.removeFile(a)}}(this),n=a.previewElement.querySelectorAll("[data-dz-remove]"),o=[],h=0,k=n.length;k>h;h++)e=n[h],o.push(e.addEventListener("click",d));return o}},removedfile:function(a){var b;return a.previewElement&&null!=(b=a.previewElement)&&b.parentNode.removeChild(a.previewElement),this._updateMaxFilesReachedClass()},thumbnail:function(a,b){var c,d,e,f;if(a.previewElement){for(a.previewElement.classList.remove("dz-file-preview"),f=a.previewElement.querySelectorAll("[data-dz-thumbnail]"),d=0,e=f.length;e>d;d++)c=f[d],c.alt=a.name,c.src=b;return setTimeout(function(){return function(){return a.previewElement.classList.add("dz-image-preview")}}(this),1)}},error:function(a,b){var c,d,e,f,g;if(a.previewElement){for(a.previewElement.classList.add("dz-error"),"String"!=typeof b&&b.error&&(b=b.error),f=a.previewElement.querySelectorAll("[data-dz-errormessage]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.textContent=b);return g}},errormultiple:g,processing:function(a){return a.previewElement&&(a.previewElement.classList.add("dz-processing"),a._removeLink)?a._removeLink.textContent=this.options.dictCancelUpload:void 0},processingmultiple:g,uploadprogress:function(a,b){var c,d,e,f,g;if(a.previewElement){for(f=a.previewElement.querySelectorAll("[data-dz-uploadprogress]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push("PROGRESS"===c.nodeName?c.value=b:c.style.width=""+b+"%");return g}},totaluploadprogress:g,sending:g,sendingmultiple:g,success:function(a){return a.previewElement?a.previewElement.classList.add("dz-success"):void 0},successmultiple:g,canceled:function(a){return this.emit("error",a,"Upload canceled.")},canceledmultiple:g,complete:function(a){return a._removeLink&&(a._removeLink.textContent=this.options.dictRemoveFile),a.previewElement?a.previewElement.classList.add("dz-complete"):void 0},completemultiple:g,maxfilesexceeded:g,maxfilesreached:g,queuecomplete:g,addedfiles:g,previewTemplate:'<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>'},d=function(){var a,b,c,d,e,f,g;for(d=arguments[0],c=2<=arguments.length?i.call(arguments,1):[],f=0,g=c.length;g>f;f++){b=c[f];for(a in b)e=b[a],d[a]=e}return d},c.prototype.getAcceptedFiles=function(){var a,b,c,d,e;for(d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.accepted&&e.push(a);return e},c.prototype.getRejectedFiles=function(){var a,b,c,d,e;for(d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.accepted||e.push(a);return e},c.prototype.getFilesWithStatus=function(a){var b,c,d,e,f;for(e=this.files,f=[],c=0,d=e.length;d>c;c++)b=e[c],b.status===a&&f.push(b);return f},c.prototype.getQueuedFiles=function(){return this.getFilesWithStatus(c.QUEUED)},c.prototype.getUploadingFiles=function(){return this.getFilesWithStatus(c.UPLOADING)},c.prototype.getAddedFiles=function(){return this.getFilesWithStatus(c.ADDED)},c.prototype.getActiveFiles=function(){var a,b,d,e,f;for(e=this.files,f=[],b=0,d=e.length;d>b;b++)a=e[b],(a.status===c.UPLOADING||a.status===c.QUEUED)&&f.push(a);return f},c.prototype.init=function(){var a,b,d,e,f,g,h;for("form"===this.element.tagName&&this.element.setAttribute("enctype","multipart/form-data"),this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")&&this.element.appendChild(c.createElement('<div class="dz-default dz-message"><span>'+this.options.dictDefaultMessage+"</span></div>")),this.clickableElements.length&&(d=function(a){return function(){return a.hiddenFileInput&&a.hiddenFileInput.parentNode.removeChild(a.hiddenFileInput),a.hiddenFileInput=document.createElement("input"),a.hiddenFileInput.setAttribute("type","file"),(null==a.options.maxFiles||a.options.maxFiles>1)&&a.hiddenFileInput.setAttribute("multiple","multiple"),a.hiddenFileInput.className="dz-hidden-input",null!=a.options.acceptedFiles&&a.hiddenFileInput.setAttribute("accept",a.options.acceptedFiles),null!=a.options.capture&&a.hiddenFileInput.setAttribute("capture",a.options.capture),a.hiddenFileInput.style.visibility="hidden",a.hiddenFileInput.style.position="absolute",a.hiddenFileInput.style.top="0",a.hiddenFileInput.style.left="0",a.hiddenFileInput.style.height="0",a.hiddenFileInput.style.width="0",document.querySelector(a.options.hiddenInputContainer).appendChild(a.hiddenFileInput),a.hiddenFileInput.addEventListener("change",function(){var b,c,e,f;if(c=a.hiddenFileInput.files,c.length)for(e=0,f=c.length;f>e;e++)b=c[e],a.addFile(b);return a.emit("addedfiles",c),d()})}}(this))(),this.URL=null!=(g=window.URL)?g:window.webkitURL,h=this.events,e=0,f=h.length;f>e;e++)a=h[e],this.on(a,this.options[a]);return this.on("uploadprogress",function(a){return function(){return a.updateTotalUploadProgress()}}(this)),this.on("removedfile",function(a){return function(){return a.updateTotalUploadProgress()}}(this)),this.on("canceled",function(a){return function(b){return a.emit("complete",b)}}(this)),this.on("complete",function(a){return function(){return 0===a.getAddedFiles().length&&0===a.getUploadingFiles().length&&0===a.getQueuedFiles().length?setTimeout(function(){return a.emit("queuecomplete")},0):void 0}}(this)),b=function(a){return a.stopPropagation(),a.preventDefault?a.preventDefault():a.returnValue=!1},this.listeners=[{element:this.element,events:{dragstart:function(a){return function(b){return a.emit("dragstart",b)}}(this),dragenter:function(a){return function(c){return b(c),a.emit("dragenter",c)}}(this),dragover:function(a){return function(c){var d;try{d=c.dataTransfer.effectAllowed}catch(e){}return c.dataTransfer.dropEffect="move"===d||"linkMove"===d?"move":"copy",b(c),a.emit("dragover",c)}}(this),dragleave:function(a){return function(b){return a.emit("dragleave",b)}}(this),drop:function(a){return function(c){return b(c),a.drop(c)}}(this),dragend:function(a){return function(b){return a.emit("dragend",b)}}(this)}}],this.clickableElements.forEach(function(a){return function(b){return a.listeners.push({element:b,events:{click:function(d){return(b!==a.element||d.target===a.element||c.elementInside(d.target,a.element.querySelector(".dz-message")))&&a.hiddenFileInput.click(),!0}}})}}(this)),this.enable(),this.options.init.call(this)},c.prototype.destroy=function(){var a;return this.disable(),this.removeAllFiles(!0),(null!=(a=this.hiddenFileInput)?a.parentNode:void 0)&&(this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),this.hiddenFileInput=null),delete this.element.dropzone,c.instances.splice(c.instances.indexOf(this),1)},c.prototype.updateTotalUploadProgress=function(){var a,b,c,d,e,f,g,h;if(d=0,c=0,a=this.getActiveFiles(),a.length){for(h=this.getActiveFiles(),f=0,g=h.length;g>f;f++)b=h[f],d+=b.upload.bytesSent,c+=b.upload.total;e=100*d/c}else e=100;return this.emit("totaluploadprogress",e,c,d)},c.prototype._getParamName=function(a){return"function"==typeof this.options.paramName?this.options.paramName(a):""+this.options.paramName+(this.options.uploadMultiple?"["+a+"]":"")},c.prototype._renameFilename=function(a){return"function"!=typeof this.options.renameFilename?a:this.options.renameFilename(a)},c.prototype.getFallbackForm=function(){var a,b,d,e;return(a=this.getExistingFallback())?a:(d='<div class="dz-fallback">',this.options.dictFallbackText&&(d+="<p>"+this.options.dictFallbackText+"</p>"),d+='<input type="file" name="'+this._getParamName(0)+'" '+(this.options.uploadMultiple?'multiple="multiple"':void 0)+' /><input type="submit" value="Upload!"></div>',b=c.createElement(d),"FORM"!==this.element.tagName?(e=c.createElement('<form action="'+this.options.url+'" enctype="multipart/form-data" method="'+this.options.method+'"></form>'),e.appendChild(b)):(this.element.setAttribute("enctype","multipart/form-data"),this.element.setAttribute("method",this.options.method)),null!=e?e:b)},c.prototype.getExistingFallback=function(){var a,b,c,d,e,f;for(b=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)if(b=a[c],/(^| )fallback($| )/.test(b.className))return b},f=["div","form"],d=0,e=f.length;e>d;d++)if(c=f[d],a=b(this.element.getElementsByTagName(c)))return a},c.prototype.setupEventListeners=function(){var a,b,c,d,e,f,g;for(f=this.listeners,g=[],d=0,e=f.length;e>d;d++)a=f[d],g.push(function(){var d,e;d=a.events,e=[];for(b in d)c=d[b],e.push(a.element.addEventListener(b,c,!1));return e}());return g},c.prototype.removeEventListeners=function(){var a,b,c,d,e,f,g;for(f=this.listeners,g=[],d=0,e=f.length;e>d;d++)a=f[d],g.push(function(){var d,e;d=a.events,e=[];for(b in d)c=d[b],e.push(a.element.removeEventListener(b,c,!1));return e}());return g},c.prototype.disable=function(){var a,b,c,d,e;for(this.clickableElements.forEach(function(a){return a.classList.remove("dz-clickable")}),this.removeEventListeners(),d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(this.cancelUpload(a));return e},c.prototype.enable=function(){return this.clickableElements.forEach(function(a){return a.classList.add("dz-clickable")}),this.setupEventListeners()},c.prototype.filesize=function(a){var b,c,d,e,f,g,h,i;if(d=0,e="b",a>0){for(g=["TB","GB","MB","KB","b"],c=h=0,i=g.length;i>h;c=++h)if(f=g[c],b=Math.pow(this.options.filesizeBase,4-c)/10,a>=b){d=a/Math.pow(this.options.filesizeBase,4-c),e=f;break}d=Math.round(10*d)/10}return"<strong>"+d+"</strong> "+e},c.prototype._updateMaxFilesReachedClass=function(){return null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(this.getAcceptedFiles().length===this.options.maxFiles&&this.emit("maxfilesreached",this.files),this.element.classList.add("dz-max-files-reached")):this.element.classList.remove("dz-max-files-reached")},c.prototype.drop=function(a){var b,c;a.dataTransfer&&(this.emit("drop",a),b=a.dataTransfer.files,this.emit("addedfiles",b),b.length&&(c=a.dataTransfer.items,c&&c.length&&null!=c[0].webkitGetAsEntry?this._addFilesFromItems(c):this.handleFiles(b)))},c.prototype.paste=function(a){var b,c;if(null!=(null!=a&&null!=(c=a.clipboardData)?c.items:void 0))return this.emit("paste",a),b=a.clipboardData.items,b.length?this._addFilesFromItems(b):void 0},c.prototype.handleFiles=function(a){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++)b=a[c],e.push(this.addFile(b));return e},c.prototype._addFilesFromItems=function(a){var b,c,d,e,f;for(f=[],d=0,e=a.length;e>d;d++)c=a[d],f.push(null!=c.webkitGetAsEntry&&(b=c.webkitGetAsEntry())?b.isFile?this.addFile(c.getAsFile()):b.isDirectory?this._addFilesFromDirectory(b,b.name):void 0:null!=c.getAsFile?null==c.kind||"file"===c.kind?this.addFile(c.getAsFile()):void 0:void 0);return f},c.prototype._addFilesFromDirectory=function(a,b){var c,d,e;return c=a.createReader(),d=function(a){return"undefined"!=typeof console&&null!==console&&"function"==typeof console.log?console.log(a):void 0},(e=function(a){return function(){return c.readEntries(function(c){var d,f,g;if(c.length>0){for(f=0,g=c.length;g>f;f++)d=c[f],d.isFile?d.file(function(c){return a.options.ignoreHiddenFiles&&"."===c.name.substring(0,1)?void 0:(c.fullPath=""+b+"/"+c.name,a.addFile(c))}):d.isDirectory&&a._addFilesFromDirectory(d,""+b+"/"+d.name);e()}return null},d)}}(this))()},c.prototype.accept=function(a,b){return a.size>1024*this.options.maxFilesize*1024?b(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(a.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize)):c.isValidFile(a,this.options.acceptedFiles)?null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(b(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles)),this.emit("maxfilesexceeded",a)):this.options.accept.call(this,a,b):b(this.options.dictInvalidFileType)},c.prototype.addFile=function(a){return a.upload={progress:0,total:a.size,bytesSent:0},this.files.push(a),a.status=c.ADDED,this.emit("addedfile",a),this._enqueueThumbnail(a),this.accept(a,function(b){return function(c){return c?(a.accepted=!1,b._errorProcessing([a],c)):(a.accepted=!0,b.options.autoQueue&&b.enqueueFile(a)),b._updateMaxFilesReachedClass()}}(this))},c.prototype.enqueueFiles=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)b=a[c],this.enqueueFile(b);return null},c.prototype.enqueueFile=function(a){if(a.status!==c.ADDED||a.accepted!==!0)throw new Error("This file can't be queued because it has already been processed or was rejected.");return a.status=c.QUEUED,this.options.autoProcessQueue?setTimeout(function(a){return function(){return a.processQueue()}}(this),0):void 0},c.prototype._thumbnailQueue=[],c.prototype._processingThumbnail=!1,c.prototype._enqueueThumbnail=function(a){return this.options.createImageThumbnails&&a.type.match(/image.*/)&&a.size<=1024*this.options.maxThumbnailFilesize*1024?(this._thumbnailQueue.push(a),setTimeout(function(a){return function(){return a._processThumbnailQueue()}}(this),0)):void 0},c.prototype._processThumbnailQueue=function(){return this._processingThumbnail||0===this._thumbnailQueue.length?void 0:(this._processingThumbnail=!0,this.createThumbnail(this._thumbnailQueue.shift(),function(a){return function(){return a._processingThumbnail=!1,a._processThumbnailQueue()}}(this)))},c.prototype.removeFile=function(a){return a.status===c.UPLOADING&&this.cancelUpload(a),this.files=h(this.files,a),this.emit("removedfile",a),0===this.files.length?this.emit("reset"):void 0},c.prototype.removeAllFiles=function(a){var b,d,e,f;for(null==a&&(a=!1),f=this.files.slice(),d=0,e=f.length;e>d;d++)b=f[d],(b.status!==c.UPLOADING||a)&&this.removeFile(b);return null},c.prototype.createThumbnail=function(a,b){var c;return c=new FileReader,c.onload=function(d){return function(){return"image/svg+xml"===a.type?(d.emit("thumbnail",a,c.result),void(null!=b&&b())):d.createThumbnailFromUrl(a,c.result,b)}}(this),c.readAsDataURL(a)},c.prototype.createThumbnailFromUrl=function(a,b,c,d){var e;return e=document.createElement("img"),d&&(e.crossOrigin=d),e.onload=function(b){return function(){var d,g,h,i,j,k,l,m;return a.width=e.width,a.height=e.height,h=b.options.resize.call(b,a),null==h.trgWidth&&(h.trgWidth=h.optWidth),null==h.trgHeight&&(h.trgHeight=h.optHeight),d=document.createElement("canvas"),g=d.getContext("2d"),d.width=h.trgWidth,d.height=h.trgHeight,f(g,e,null!=(j=h.srcX)?j:0,null!=(k=h.srcY)?k:0,h.srcWidth,h.srcHeight,null!=(l=h.trgX)?l:0,null!=(m=h.trgY)?m:0,h.trgWidth,h.trgHeight),i=d.toDataURL("image/png"),b.emit("thumbnail",a,i),null!=c?c():void 0}}(this),null!=c&&(e.onerror=c),e.src=b},c.prototype.processQueue=function(){var a,b,c,d;if(b=this.options.parallelUploads,c=this.getUploadingFiles().length,a=c,!(c>=b)&&(d=this.getQueuedFiles(),d.length>0)){if(this.options.uploadMultiple)return this.processFiles(d.slice(0,b-c));for(;b>a;){if(!d.length)return;this.processFile(d.shift()),a++}}},c.prototype.processFile=function(a){return this.processFiles([a])},c.prototype.processFiles=function(a){var b,d,e;for(d=0,e=a.length;e>d;d++)b=a[d],b.processing=!0,b.status=c.UPLOADING,this.emit("processing",b);return this.options.uploadMultiple&&this.emit("processingmultiple",a),this.uploadFiles(a)},c.prototype._getFilesWithXhr=function(a){var b,c;return c=function(){var c,d,e,f;for(e=this.files,f=[],c=0,d=e.length;d>c;c++)b=e[c],b.xhr===a&&f.push(b);return f}.call(this)},c.prototype.cancelUpload=function(a){var b,d,e,f,g,h,i;if(a.status===c.UPLOADING){for(d=this._getFilesWithXhr(a.xhr),e=0,g=d.length;g>e;e++)b=d[e],b.status=c.CANCELED;for(a.xhr.abort(),f=0,h=d.length;h>f;f++)b=d[f],this.emit("canceled",b);this.options.uploadMultiple&&this.emit("canceledmultiple",d)}else((i=a.status)===c.ADDED||i===c.QUEUED)&&(a.status=c.CANCELED,this.emit("canceled",a),this.options.uploadMultiple&&this.emit("canceledmultiple",[a]));return this.options.autoProcessQueue?this.processQueue():void 0},e=function(){var a,b;return b=arguments[0],a=2<=arguments.length?i.call(arguments,1):[],"function"==typeof b?b.apply(this,a):b},c.prototype.uploadFile=function(a){return this.uploadFiles([a])},c.prototype.uploadFiles=function(a){var b,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L;for(w=new XMLHttpRequest,x=0,B=a.length;B>x;x++)b=a[x],b.xhr=w;p=e(this.options.method,a),u=e(this.options.url,a),w.open(p,u,!0),w.withCredentials=!!this.options.withCredentials,s=null,g=function(c){return function(){var d,e,f;for(f=[],d=0,e=a.length;e>d;d++)b=a[d],f.push(c._errorProcessing(a,s||c.options.dictResponseError.replace("{{statusCode}}",w.status),w));return f}}(this),t=function(c){return function(d){var e,f,g,h,i,j,k,l,m;if(null!=d)for(f=100*d.loaded/d.total,g=0,j=a.length;j>g;g++)b=a[g],b.upload={progress:f,total:d.total,bytesSent:d.loaded};else{for(e=!0,f=100,h=0,k=a.length;k>h;h++)b=a[h],(100!==b.upload.progress||b.upload.bytesSent!==b.upload.total)&&(e=!1),b.upload.progress=f,b.upload.bytesSent=b.upload.total;if(e)return}for(m=[],i=0,l=a.length;l>i;i++)b=a[i],m.push(c.emit("uploadprogress",b,f,b.upload.bytesSent));return m}}(this),w.onload=function(b){return function(d){var e;if(a[0].status!==c.CANCELED&&4===w.readyState){if(s=w.responseText,w.getResponseHeader("content-type")&&~w.getResponseHeader("content-type").indexOf("application/json"))try{s=JSON.parse(s)}catch(f){d=f,s="Invalid JSON response from server."}return t(),200<=(e=w.status)&&300>e?b._finished(a,s,d):g()}}}(this),w.onerror=function(){return function(){return a[0].status!==c.CANCELED?g():void 0}}(this),r=null!=(G=w.upload)?G:w,r.onprogress=t,j={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&d(j,this.options.headers);for(h in j)i=j[h],i&&w.setRequestHeader(h,i);if(f=new FormData,this.options.params){H=this.options.params;for(o in H)v=H[o],f.append(o,v)}for(y=0,C=a.length;C>y;y++)b=a[y],this.emit("sending",b,w,f);if(this.options.uploadMultiple&&this.emit("sendingmultiple",a,w,f),"FORM"===this.element.tagName)for(I=this.element.querySelectorAll("input, textarea, select, button"),z=0,D=I.length;D>z;z++)if(l=I[z],m=l.getAttribute("name"),n=l.getAttribute("type"),"SELECT"===l.tagName&&l.hasAttribute("multiple"))for(J=l.options,A=0,E=J.length;E>A;A++)q=J[A],q.selected&&f.append(m,q.value);else(!n||"checkbox"!==(K=n.toLowerCase())&&"radio"!==K||l.checked)&&f.append(m,l.value);for(k=F=0,L=a.length-1;L>=0?L>=F:F>=L;k=L>=0?++F:--F)f.append(this._getParamName(k),a[k],this._renameFilename(a[k].name));return this.submitRequest(w,f,a)},c.prototype.submitRequest=function(a,b){return a.send(b)},c.prototype._finished=function(a,b,d){var e,f,g;for(f=0,g=a.length;g>f;f++)e=a[f],e.status=c.SUCCESS,this.emit("success",e,b,d),this.emit("complete",e);return this.options.uploadMultiple&&(this.emit("successmultiple",a,b,d),this.emit("completemultiple",a)),this.options.autoProcessQueue?this.processQueue():void 0},c.prototype._errorProcessing=function(a,b,d){var e,f,g;for(f=0,g=a.length;g>f;f++)e=a[f],e.status=c.ERROR,this.emit("error",e,b,d),this.emit("complete",e);return this.options.uploadMultiple&&(this.emit("errormultiple",a,b,d),this.emit("completemultiple",a)),this.options.autoProcessQueue?this.processQueue():void 0},c}(b),a.version="4.3.0",a.options={},a.optionsForElement=function(b){return b.getAttribute("id")?a.options[c(b.getAttribute("id"))]:void 0},a.instances=[],a.forElement=function(a){if("string"==typeof a&&(a=document.querySelector(a)),null==(null!=a?a.dropzone:void 0))throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");return a.dropzone},a.autoDiscover=!0,a.discover=function(){var b,c,d,e,f,g;for(document.querySelectorAll?d=document.querySelectorAll(".dropzone"):(d=[],b=function(a){var b,c,e,f;for(f=[],c=0,e=a.length;e>c;c++)b=a[c],f.push(/(^| )dropzone($| )/.test(b.className)?d.push(b):void 0);return f},b(document.getElementsByTagName("div")),b(document.getElementsByTagName("form"))),g=[],e=0,f=d.length;f>e;e++)c=d[e],g.push(a.optionsForElement(c)!==!1?new a(c):void 0);return g},a.blacklistedBrowsers=[/opera.*Macintosh.*version\/12/i],a.isBrowserSupported=function(){var b,c,d,e,f;if(b=!0,window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector)if("classList"in document.createElement("a"))for(f=a.blacklistedBrowsers,d=0,e=f.length;e>d;d++)c=f[d],c.test(navigator.userAgent)&&(b=!1);else b=!1;else b=!1;return b},h=function(a,b){var c,d,e,f;for(f=[],d=0,e=a.length;e>d;d++)c=a[d],c!==b&&f.push(c);return f},c=function(a){return a.replace(/[\-_](\w)/g,function(a){return a.charAt(1).toUpperCase()})},a.createElement=function(a){var b;return b=document.createElement("div"),b.innerHTML=a,b.childNodes[0]},a.elementInside=function(a,b){if(a===b)return!0;for(;a=a.parentNode;)if(a===b)return!0;return!1},a.getElement=function(a,b){var c;if("string"==typeof a?c=document.querySelector(a):null!=a.nodeType&&(c=a),null==c)throw new Error("Invalid `"+b+"` option provided. Please provide a CSS selector or a plain HTML element.");return c},a.getElements=function(a,b){var c,d,e,f,g,h,i,j;if(a instanceof Array){e=[];try{for(f=0,h=a.length;h>f;f++)d=a[f],e.push(this.getElement(d,b))}catch(k){c=k,e=null}}else if("string"==typeof a)for(e=[],j=document.querySelectorAll(a),g=0,i=j.length;i>g;g++)d=j[g],e.push(d);else null!=a.nodeType&&(e=[a]);if(null==e||!e.length)throw new Error("Invalid `"+b+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");return e},a.confirm=function(a,b,c){return window.confirm(a)?b():null!=c?c():void 0},a.isValidFile=function(a,b){var c,d,e,f,g;if(!b)return!0;for(b=b.split(","),d=a.type,c=d.replace(/\/.*$/,""),f=0,g=b.length;g>f;f++)if(e=b[f],e=e.trim(),"."===e.charAt(0)){if(-1!==a.name.toLowerCase().indexOf(e.toLowerCase(),a.name.length-e.length))return!0}else if(/\/\*$/.test(e)){if(c===e.replace(/\/.*$/,""))return!0
}else if(d===e)return!0;return!1},"undefined"!=typeof jQuery&&null!==jQuery&&(jQuery.fn.dropzone=function(b){return this.each(function(){return new a(this,b)})}),"undefined"!=typeof module&&null!==module?module.exports=a:window.Dropzone=a,a.ADDED="added",a.QUEUED="queued",a.ACCEPTED=a.QUEUED,a.UPLOADING="uploading",a.PROCESSING=a.UPLOADING,a.CANCELED="canceled",a.ERROR="error",a.SUCCESS="success",e=function(a){var b,c,d,e,f,g,h,i,j,k;for(h=a.naturalWidth,g=a.naturalHeight,c=document.createElement("canvas"),c.width=1,c.height=g,d=c.getContext("2d"),d.drawImage(a,0,0),e=d.getImageData(0,0,1,g).data,k=0,f=g,i=g;i>k;)b=e[4*(i-1)+3],0===b?f=i:k=i,i=f+k>>1;return j=i/g,0===j?1:j},f=function(a,b,c,d,f,g,h,i,j,k){var l;return l=e(b),a.drawImage(b,c,d,f,g,h,i,j,k/l)},d=function(a,b){var c,d,e,f,g,h,i,j,k;if(e=!1,k=!0,d=a.document,j=d.documentElement,c=d.addEventListener?"addEventListener":"attachEvent",i=d.addEventListener?"removeEventListener":"detachEvent",h=d.addEventListener?"":"on",f=function(c){return"readystatechange"!==c.type||"complete"===d.readyState?(("load"===c.type?a:d)[i](h+c.type,f,!1),!e&&(e=!0)?b.call(a,c.type||c):void 0):void 0},g=function(){var a;try{j.doScroll("left")}catch(b){return a=b,void setTimeout(g,50)}return f("poll")},"complete"!==d.readyState){if(d.createEventObject&&j.doScroll){try{k=!a.frameElement}catch(l){}k&&g()}return d[c](h+"DOMContentLoaded",f,!1),d[c](h+"readystatechange",f,!1),a[c](h+"load",f,!1)}},a._autoDiscoverFunction=function(){return a.autoDiscover?a.discover():void 0},d(window,a._autoDiscoverFunction)}).call(this);
/*! Sortable 1.4.2 - MIT | git://github.com/rubaxa/Sortable.git */
!function(a){"use strict";"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():"undefined"!=typeof Package?Sortable=a():window.Sortable=a()}(function(){"use strict";function a(a,b){if(!a||!a.nodeType||1!==a.nodeType)throw"Sortable: `el` must be HTMLElement, and not "+{}.toString.call(a);this.el=a,this.options=b=r({},b),a[L]=this;var c={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(a.nodeName)?"li":">*",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",ignore:"a, img",filter:null,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1};for(var d in c)!(d in b)&&(b[d]=c[d]);V(b);for(var f in this)"_"===f.charAt(0)&&(this[f]=this[f].bind(this));this.nativeDraggable=b.forceFallback?!1:P,e(a,"mousedown",this._onTapStart),e(a,"touchstart",this._onTapStart),this.nativeDraggable&&(e(a,"dragover",this),e(a,"dragenter",this)),T.push(this._onDragOver),b.store&&this.sort(b.store.get(this))}function b(a){v&&v.state!==a&&(h(v,"display",a?"none":""),!a&&v.state&&w.insertBefore(v,s),v.state=a)}function c(a,b,c){if(a){c=c||N,b=b.split(".");var d=b.shift().toUpperCase(),e=new RegExp("\\s("+b.join("|")+")(?=\\s)","g");do if(">*"===d&&a.parentNode===c||(""===d||a.nodeName.toUpperCase()==d)&&(!b.length||((" "+a.className+" ").match(e)||[]).length==b.length))return a;while(a!==c&&(a=a.parentNode))}return null}function d(a){a.dataTransfer&&(a.dataTransfer.dropEffect="move"),a.preventDefault()}function e(a,b,c){a.addEventListener(b,c,!1)}function f(a,b,c){a.removeEventListener(b,c,!1)}function g(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(K," ").replace(" "+b+" "," ");a.className=(d+(c?" "+b:"")).replace(K," ")}}function h(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return N.defaultView&&N.defaultView.getComputedStyle?c=N.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function i(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;f>e;e++)c(d[e],e);return d}return[]}function j(a,b,c,d,e,f,g){var h=N.createEvent("Event"),i=(a||b[L]).options,j="on"+c.charAt(0).toUpperCase()+c.substr(1);h.initEvent(c,!0,!0),h.to=b,h.from=e||b,h.item=d||b,h.clone=v,h.oldIndex=f,h.newIndex=g,b.dispatchEvent(h),i[j]&&i[j].call(a,h)}function k(a,b,c,d,e,f){var g,h,i=a[L],j=i.options.onMove;return g=N.createEvent("Event"),g.initEvent("move",!0,!0),g.to=b,g.from=a,g.dragged=c,g.draggedRect=d,g.related=e||b,g.relatedRect=f||b.getBoundingClientRect(),a.dispatchEvent(g),j&&(h=j.call(i,g)),h}function l(a){a.draggable=!1}function m(){R=!1}function n(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return(b.clientY-(d.top+d.height)>5||b.clientX-(d.right+d.width)>5)&&c}function o(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function p(a){var b=0;if(!a||!a.parentNode)return-1;for(;a&&(a=a.previousElementSibling);)"TEMPLATE"!==a.nodeName.toUpperCase()&&b++;return b}function q(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,setTimeout(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}function r(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}var s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J={},K=/\s+/g,L="Sortable"+(new Date).getTime(),M=window,N=M.document,O=M.parseInt,P=!!("draggable"in N.createElement("div")),Q=function(a){return a=N.createElement("x"),a.style.cssText="pointer-events:auto","auto"===a.style.pointerEvents}(),R=!1,S=Math.abs,T=([].slice,[]),U=q(function(a,b,c){if(c&&b.scroll){var d,e,f,g,h=b.scrollSensitivity,i=b.scrollSpeed,j=a.clientX,k=a.clientY,l=window.innerWidth,m=window.innerHeight;if(z!==c&&(y=b.scroll,z=c,y===!0)){y=c;do if(y.offsetWidth<y.scrollWidth||y.offsetHeight<y.scrollHeight)break;while(y=y.parentNode)}y&&(d=y,e=y.getBoundingClientRect(),f=(S(e.right-j)<=h)-(S(e.left-j)<=h),g=(S(e.bottom-k)<=h)-(S(e.top-k)<=h)),f||g||(f=(h>=l-j)-(h>=j),g=(h>=m-k)-(h>=k),(f||g)&&(d=M)),(J.vx!==f||J.vy!==g||J.el!==d)&&(J.el=d,J.vx=f,J.vy=g,clearInterval(J.pid),d&&(J.pid=setInterval(function(){d===M?M.scrollTo(M.pageXOffset+f*i,M.pageYOffset+g*i):(g&&(d.scrollTop+=g*i),f&&(d.scrollLeft+=f*i))},24)))}},30),V=function(a){var b=a.group;b&&"object"==typeof b||(b=a.group={name:b}),["pull","put"].forEach(function(a){a in b||(b[a]=!0)}),a.groups=" "+b.name+(b.put.join?" "+b.put.join(" "):"")+" "};return a.prototype={constructor:a,_onTapStart:function(a){var b=this,d=this.el,e=this.options,f=a.type,g=a.touches&&a.touches[0],h=(g||a).target,i=h,k=e.filter;if(!("mousedown"===f&&0!==a.button||e.disabled)&&(h=c(h,e.draggable,d))){if(D=p(h),"function"==typeof k){if(k.call(this,a,h,this))return j(b,i,"filter",h,d,D),void a.preventDefault()}else if(k&&(k=k.split(",").some(function(a){return a=c(i,a.trim(),d),a?(j(b,a,"filter",h,d,D),!0):void 0})))return void a.preventDefault();(!e.handle||c(i,e.handle,d))&&this._prepareDragStart(a,g,h)}},_prepareDragStart:function(a,b,c){var d,f=this,h=f.el,j=f.options,k=h.ownerDocument;c&&!s&&c.parentNode===h&&(G=a,w=h,s=c,t=s.parentNode,x=s.nextSibling,F=j.group,d=function(){f._disableDelayedDrag(),s.draggable=!0,g(s,f.options.chosenClass,!0),f._triggerDragStart(b)},j.ignore.split(",").forEach(function(a){i(s,a.trim(),l)}),e(k,"mouseup",f._onDrop),e(k,"touchend",f._onDrop),e(k,"touchcancel",f._onDrop),j.delay?(e(k,"mouseup",f._disableDelayedDrag),e(k,"touchend",f._disableDelayedDrag),e(k,"touchcancel",f._disableDelayedDrag),e(k,"mousemove",f._disableDelayedDrag),e(k,"touchmove",f._disableDelayedDrag),f._dragStartTimer=setTimeout(d,j.delay)):d())},_disableDelayedDrag:function(){var a=this.el.ownerDocument;clearTimeout(this._dragStartTimer),f(a,"mouseup",this._disableDelayedDrag),f(a,"touchend",this._disableDelayedDrag),f(a,"touchcancel",this._disableDelayedDrag),f(a,"mousemove",this._disableDelayedDrag),f(a,"touchmove",this._disableDelayedDrag)},_triggerDragStart:function(a){a?(G={target:s,clientX:a.clientX,clientY:a.clientY},this._onDragStart(G,"touch")):this.nativeDraggable?(e(s,"dragend",this),e(w,"dragstart",this._onDragStart)):this._onDragStart(G,!0);try{N.selection?N.selection.empty():window.getSelection().removeAllRanges()}catch(b){}},_dragStarted:function(){w&&s&&(g(s,this.options.ghostClass,!0),a.active=this,j(this,w,"start",s,w,D))},_emulateDragOver:function(){if(H){if(this._lastX===H.clientX&&this._lastY===H.clientY)return;this._lastX=H.clientX,this._lastY=H.clientY,Q||h(u,"display","none");var a=N.elementFromPoint(H.clientX,H.clientY),b=a,c=" "+this.options.group.name,d=T.length;if(b)do{if(b[L]&&b[L].options.groups.indexOf(c)>-1){for(;d--;)T[d]({clientX:H.clientX,clientY:H.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);Q||h(u,"display","")}},_onTouchMove:function(b){if(G){a.active||this._dragStarted(),this._appendGhost();var c=b.touches?b.touches[0]:b,d=c.clientX-G.clientX,e=c.clientY-G.clientY,f=b.touches?"translate3d("+d+"px,"+e+"px,0)":"translate("+d+"px,"+e+"px)";I=!0,H=c,h(u,"webkitTransform",f),h(u,"mozTransform",f),h(u,"msTransform",f),h(u,"transform",f),b.preventDefault()}},_appendGhost:function(){if(!u){var a,b=s.getBoundingClientRect(),c=h(s),d=this.options;u=s.cloneNode(!0),g(u,d.ghostClass,!1),g(u,d.fallbackClass,!0),h(u,"top",b.top-O(c.marginTop,10)),h(u,"left",b.left-O(c.marginLeft,10)),h(u,"width",b.width),h(u,"height",b.height),h(u,"opacity","0.8"),h(u,"position","fixed"),h(u,"zIndex","100000"),h(u,"pointerEvents","none"),d.fallbackOnBody&&N.body.appendChild(u)||w.appendChild(u),a=u.getBoundingClientRect(),h(u,"width",2*b.width-a.width),h(u,"height",2*b.height-a.height)}},_onDragStart:function(a,b){var c=a.dataTransfer,d=this.options;this._offUpEvents(),"clone"==F.pull&&(v=s.cloneNode(!0),h(v,"display","none"),w.insertBefore(v,s)),b?("touch"===b?(e(N,"touchmove",this._onTouchMove),e(N,"touchend",this._onDrop),e(N,"touchcancel",this._onDrop)):(e(N,"mousemove",this._onTouchMove),e(N,"mouseup",this._onDrop)),this._loopId=setInterval(this._emulateDragOver,50)):(c&&(c.effectAllowed="move",d.setData&&d.setData.call(this,c,s)),e(N,"drop",this),setTimeout(this._dragStarted,0))},_onDragOver:function(a){var d,e,f,g=this.el,i=this.options,j=i.group,l=j.put,o=F===j,p=i.sort;if(void 0!==a.preventDefault&&(a.preventDefault(),!i.dragoverBubble&&a.stopPropagation()),I=!0,F&&!i.disabled&&(o?p||(f=!w.contains(s)):F.pull&&l&&(F.name===j.name||l.indexOf&&~l.indexOf(F.name)))&&(void 0===a.rootEl||a.rootEl===this.el)){if(U(a,i,this.el),R)return;if(d=c(a.target,i.draggable,g),e=s.getBoundingClientRect(),f)return b(!0),void(v||x?w.insertBefore(s,v||x):p||w.appendChild(s));if(0===g.children.length||g.children[0]===u||g===a.target&&(d=n(g,a))){if(d){if(d.animated)return;r=d.getBoundingClientRect()}b(o),k(w,g,s,e,d,r)!==!1&&(s.contains(g)||(g.appendChild(s),t=g),this._animate(e,s),d&&this._animate(r,d))}else if(d&&!d.animated&&d!==s&&void 0!==d.parentNode[L]){A!==d&&(A=d,B=h(d),C=h(d.parentNode));var q,r=d.getBoundingClientRect(),y=r.right-r.left,z=r.bottom-r.top,D=/left|right|inline/.test(B.cssFloat+B.display)||"flex"==C.display&&0===C["flex-direction"].indexOf("row"),E=d.offsetWidth>s.offsetWidth,G=d.offsetHeight>s.offsetHeight,H=(D?(a.clientX-r.left)/y:(a.clientY-r.top)/z)>.5,J=d.nextElementSibling,K=k(w,g,s,e,d,r);if(K!==!1){if(R=!0,setTimeout(m,30),b(o),1===K||-1===K)q=1===K;else if(D){var M=s.offsetTop,N=d.offsetTop;q=M===N?d.previousElementSibling===s&&!E||H&&E:N>M}else q=J!==s&&!G||H&&G;s.contains(g)||(q&&!J?g.appendChild(s):d.parentNode.insertBefore(s,q?J:d)),t=s.parentNode,this._animate(e,s),this._animate(r,d)}}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();h(b,"transition","none"),h(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,h(b,"transition","all "+c+"ms"),h(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=setTimeout(function(){h(b,"transition",""),h(b,"transform",""),b.animated=!1},c)}},_offUpEvents:function(){var a=this.el.ownerDocument;f(N,"touchmove",this._onTouchMove),f(a,"mouseup",this._onDrop),f(a,"touchend",this._onDrop),f(a,"touchcancel",this._onDrop)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(J.pid),clearTimeout(this._dragStartTimer),f(N,"mousemove",this._onTouchMove),this.nativeDraggable&&(f(N,"drop",this),f(c,"dragstart",this._onDragStart)),this._offUpEvents(),b&&(I&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation()),u&&u.parentNode.removeChild(u),s&&(this.nativeDraggable&&f(s,"dragend",this),l(s),g(s,this.options.ghostClass,!1),g(s,this.options.chosenClass,!1),w!==t?(E=p(s),E>=0&&(j(null,t,"sort",s,w,D,E),j(this,w,"sort",s,w,D,E),j(null,t,"add",s,w,D,E),j(this,w,"remove",s,w,D,E))):(v&&v.parentNode.removeChild(v),s.nextSibling!==x&&(E=p(s),E>=0&&(j(this,w,"update",s,w,D,E),j(this,w,"sort",s,w,D,E)))),a.active&&((null===E||-1===E)&&(E=D),j(this,w,"end",s,w,D,E),this.save())),w=s=t=u=x=v=y=z=G=H=I=E=A=B=F=a.active=null)},handleEvent:function(a){var b=a.type;"dragover"===b||"dragenter"===b?s&&(this._onDragOver(a),d(a)):("drop"===b||"dragend"===b)&&this._onDrop(a)},toArray:function(){for(var a,b=[],d=this.el.children,e=0,f=d.length,g=this.options;f>e;e++)a=d[e],c(a,g.draggable,this.el)&&b.push(a.getAttribute(g.dataIdAttr)||o(a));return b},sort:function(a){var b={},d=this.el;this.toArray().forEach(function(a,e){var f=d.children[e];c(f,this.options.draggable,d)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(d.removeChild(b[a]),d.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return c(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:(c[a]=b,void("group"===a&&V(c)))},destroy:function(){var a=this.el;a[L]=null,f(a,"mousedown",this._onTapStart),f(a,"touchstart",this._onTapStart),this.nativeDraggable&&(f(a,"dragover",this),f(a,"dragenter",this)),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),T.splice(T.indexOf(this._onDragOver),1),this._onDrop(),this.el=a=null}},a.utils={on:e,off:f,css:h,find:i,is:function(a,b){return!!c(a,b,a)},extend:r,throttle:q,closest:c,toggleClass:g,index:p},a.create=function(b,c){return new a(b,c)},a.version="1.4.2",a});
/**
 * Hashedit (#edit) is a simple, web-based editor for static HTML sites. Learn more at hashedit.io. Download from Github at github.com/madoublet/hashedit
 * @author: Matthew Smith
 */
var hashedit = hashedit || {};

hashedit = (function() {

  'use strict';

  return {

    // url to page
    url: null,
    previewUrl: null,

    // page title
    title: '',

    // API urls
    saveUrl: '/api/pages/save',
    addPageURL: '/api/pages/add',
    pageSettingsURL: '/api/pages/settings',
    uploadUrl: '/api/images/add',
    imagesListUrl: '/api/images/list',
    pagesListUrl: '/api/pages/list',
    authUrl: '/api/auth',
    loginUrl: '/login',
    pathListUrl: '/api/pages/path/list',

    // loading indicators
    imagesListLoaded: false,
    pagesListLoaded: false,
    pathListLoaded: false,

    // set debug messages
    debug: false,

    // set demo mode
    demo: false,

    // init menu
    menu: [],

    // path to hashedit library
    path: '/node_modules/hashedit/',

    // path to stylesheet
    stylesheet: ['/node_modules/hashedit/dist/hashedit-min.css'],

    // pointers to selected elements
    current: {
      container: null,
      node: null,
      parent: null,
      element: null,
      image: null
    },

    // new grid elements
    grid: [
      {
        "name": "1 Column",
        "desc": "100%",
        "html": "<div class=\"block row\" hashedit-block><div class=\"col col-md-12\" hashedit-sortable></div></div>"
      },
      {
        "name": "2 Column",
        "desc": "100%",
        "html": "<div class=\"block row\" hashedit-block><div class=\"col col-md-6\" hashedit-sortable></div><div class=\"col col-md-6\" hashedit-sortable></div></div>"
      }
    ],

    // handles text selection
    selection: null,

    // configurations
    elementMenu: '<span class="hashedit-element-menu"><span class="hashedit-move"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g></svg></span></span><span class="hashedit-properties"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg></span></span><span class="hashedit-remove"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g></svg></span></span></span>',

    framework: 'bootstrap',

    // framework defaults
    frameworkDefaults: {
      'bootstrap': {
        'table': 'table',
        'image': 'img-responsive',
        'code': ''
      },
      'foundation': {
        'table': '',
        'image': '',
        'code': ''
      },
      'mdl': {
        'table': 'mdl-data-table',
        'image': '',
        'code': ''
      }
    },

    // counts and flags
    isI18nInit: false,

    /**
     * Set as active
     */
    setActive: function() {

      // set [hashedit-active] on body
      document.querySelector('body').setAttribute('hashedit-active', '');

    },

    /**
     * Setup content editable element
     */
    setContentEditable: function() {

      var x, els;

      // setup [contentEditable=true]
      els = document.querySelectorAll(
        'p[hashedit-element], [hashedit] h1[hashedit-element], [hashedit] h2[hashedit-element], h3[hashedit-element], h4[hashedit-element], h5[hashedit-element], span[hashedit-element], ul[hashedit-element] li, ol[hashedit-element] li, table[hashedit-element] td, table[hashedit-element] th, blockquote[hashedit-element], pre[hashedit-element]'
      );

      for (x = 0; x < els.length; x += 1) {

        // add attribute
        els[x].setAttribute('contentEditable', 'true');

      }

    },

    /**
     * Sets up empty
     * @param {Array} sortable
     */
    setupEmpty: function() {

      var x, sortable, els;

      els = document.querySelectorAll('[hashedit-sortable]');

      // walk through sortable clases
      for (x = 0; x < els.length; x += 1) {

        if(els[x].firstElementChild === null){
          els[x].setAttribute('hashedit-empty', 'true');
        }
        else {
          els[x].removeAttribute('hashedit-empty');
        }

      }

    },

    /**
     * Sets up block
     * @param {Array} sortable
     */
    setupBlocks: function() {

      var x, els, y, div, blocks, el, next, previous;

      blocks = hashedit.config.blocks;

      // setup sortable classes
      els = document.querySelectorAll('[hashedit] ' + blocks);

      // set [data-hashedit-sortable=true]
      for (y = 0; y < els.length; y += 1) {

        // setup blocks
        if(els[y].querySelector('.hashedit-block-menu') === null) {

          els[y].setAttribute('hashedit-block', '');

          div = document.createElement('DIV');
          div.setAttribute('class', 'hashedit-block-menu');

          div.innerHTML =
          '<span class="hashedit-block-properties"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg></span>' +
          '<span class="hashedit-block-remove"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span>' +
          '<span class="hashedit-block-duplicate"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></span>' +
          '<span class="hashedit-block-down"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg></span>' +
          '<span class="hashedit-block-up"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span>'+
          '<span class="hashedit-block-add"><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg></span>';

          els[y].appendChild(div);

        }


        // next sibling
        next = els[y].nextElementSibling;
        el = els[y].querySelector('.hashedit-block-down');

        // check if the element exists and it is a block
        if(next !== null && next.matches('[hashedit] ' + blocks)) {

          if(el !== null) {
            el.style.display = 'block';
          }

        }
        else {

          if(el !== null) {
            el.style.display = 'none';
          }

        }

        // previous sibling
        previous = els[y].previousElementSibling;
        el = els[y].querySelector('.hashedit-block-up');

        // check if the element exists and it is a block
        if(previous !== null && previous.matches('[hashedit] ' + blocks)) {

          if(el !== null) {
            el.style.display = 'block';
          }

        }
        else {

          if(el !== null) {
            el.style.display = 'none';
          }

        }

      }

    },

    /**
     * Adds a hashedit-sortable class to any selector in the sortable array, enables sorting
     * @param {Array} sortable
     */
    setupSortable: function() {

      var x, y, els, div, span, el, item, obj, menu, sortable;

      sortable = hashedit.config.sortable;

      // walk through sortable clases
      for (x = 0; x < sortable.length; x += 1) {

        // setup sortable classes
        els = document.querySelectorAll('[hashedit] ' + sortable[x]);

        // set [data-hashedit-sortable=true]
        for (y = 0; y < els.length; y += 1) {

          // add attribute
          els[y].setAttribute('hashedit-sortable', '');

        }

      }

      // wrap elements in the sortable class
      els = document.querySelectorAll('[hashedit-sortable] > *');

      // wrap editable items
      for (y = 0; y < els.length; y += 1) {

        // set element
        els[y].setAttribute('hashedit-element', '');

        // create element menu
        menu = document.createElement('span');
        menu.setAttribute('class', 'hashedit-element-menu');

        // create a handle
        span = document.createElement('span');
        span.setAttribute('class', 'hashedit-move');
        span.innerHTML =
          '<span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g></svg></span>';


        // append the handle to the wrapper
        menu.appendChild(span);

        span = document.createElement('span');
        span.setAttribute('class', 'hashedit-properties');
        span.innerHTML =
          '<span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg></span>';

        // append the handle to the wrapper
        menu.appendChild(span);

        span = document.createElement('span');
        span.setAttribute('class', 'hashedit-remove');
        span.innerHTML =
          '<span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g></svg></span>';

        // append the handle to the wrapper
        menu.appendChild(span);

        // append the handle to the wrapper
        els[y].appendChild(menu);


      }

      // get all sortable elements
      els = document.querySelectorAll('[hashedit] [hashedit-sortable]');

      // walk through elements
      for (x = 0; x < els.length; x += 1) {

        el = els[x];

        obj = new Sortable(el, {
          group: "hashedit-sortable", // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
          sort: true, // sorting inside list
          delay: 0, // time in milliseconds to define when the sorting should start
          disabled: false, // Disables the sortable if set to true.
          store: null, // @see Store
          animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
          handle: ".hashedit-move", // Drag handle selector within list items
          ghostClass: "hashedit-highlight", // Class name for the drop placeholder

          scroll: true, // or HTMLElement
          scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
          scrollSpeed: 10, // px

          // dragging ended
          onEnd: function(evt) {

            // get item
            item = evt.item;

            // handle empty
            hashedit.setupEmpty();

          }

        });

      }

      // set the display of empty columns
      hashedit.setupEmpty();

    },

    /**
     * Create the menu
     */
    setupMenu: function() {

      var menu, data, xhr, url, help, els, x, title = '', arr;

      // create top menu
      menu = document.createElement('menu');
      menu.setAttribute('class', 'hashedit-top-menu');
      menu.innerHTML =
        '<button class="hashedit-back"><svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button><h2>' + hashedit.title + '</h2><button class="hashedit-focused"><i class="material-icons">create</i></button><button class="hashedit-view"><i class="material-icons">launch</i></button><button class="hashedit-add"><i class="material-icons">add</i></button>';

      // append menu
      hashedit.current.container.appendChild(menu);

      // create menu
      menu = document.createElement('menu');
      menu.setAttribute('class', 'hashedit-menu');
      menu.innerHTML =
        '<div class="hashedit-menu-body"></div>';

      // append menu
      hashedit.current.container.appendChild(menu);

      // create alternate menu
      menu = document.createElement('menu');
      menu.setAttribute('class', 'hashedit-bottom-menu');
      menu.innerHTML = '<button class="hashedit-save" exit>Save and Exit</button>' +
                        '<button class="hashedit-save primary">Save</button>';

      // append menu
      hashedit.current.container.appendChild(menu);

      // back
      if(document.querySelector('.hashedit-back') != null) {
        document.querySelector('.hashedit-back').addEventListener('click', function() {
          history.go(-1);
        });
      }

      // add
      if(document.querySelector('.hashedit-add') != null) {

        document.querySelector('.hashedit-add').addEventListener('click', function() {
          menu = document.querySelector('.hashedit-menu');

          if(menu.hasAttribute('active') == true) {
            menu.removeAttribute('active');
          }
          else {
            menu.setAttribute('active', true);
          }
        });

      }

      // view
      if(document.querySelector('.hashedit-view') != null) {

        var el = document.querySelector('.hashedit-view');

        el.addEventListener('click', function(e) {

          window.open(hashedit.previewUrl, '_blank');

          });

      }


      // focused
      if(document.querySelector('.hashedit-focused') != null) {

        var el = document.querySelector('.hashedit-focused');

        if(document.querySelector('[focused-content]') == null) {
          el.style.display = 'none';
        }

        el.addEventListener('click', function(e) {

          var url = window.location.href.replace('mode=page', 'mode=focused');
          //location.href = url;

          var iframe = window.parent.document.getElementsByTagName('iframe')[0];

          iframe.setAttribute('src', url);

          console.log(iframe);

          });

      }

      // save
      if(document.querySelector('.hashedit-save') != null) {

        var els = document.querySelectorAll('.hashedit-save');

        for(var x=0; x<els.length; x++) {

          els[x].addEventListener('click', function(e) {

              var el = e.target;

              // disable button
              el.setAttribute("disabled", "disabled");

              if (hashedit.demo === true) {

                el.removeAttribute("disabled");

                hashedit.showToast('Cannot save in demo mode',
                  'failure');

              } else {

                data = hashedit.retrieveUpdateArray();

                if (hashedit.saveUrl) {

                  // construct an HTTP request
                  xhr = new XMLHttpRequest();
                  xhr.open('post', hashedit.saveUrl, true);

                  // set token
                  if(hashedit.useToken == true) {
                    xhr.setRequestHeader(hashedit.authHeader, hashedit.authHeaderPrefix + ' ' + localStorage.getItem(hashedit.tokenName));
                  }

                  // send the collected data as JSON
                  xhr.send(JSON.stringify(data));

                  xhr.onloadend = function() {

                    hashedit.showToast('<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24" viewBox="0 0 24 24" width="24">' +
                      '<path d="M0 0h24v24H0z" fill="none"/>' +
                      '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>' +
                      '</svg>', 'success');

                    el.removeAttribute("disabled");

                    if(el.hasAttribute('exit') == true) {
                      if(hashedit.debug === false) {
                        history.go(-1);
                      }
                    }
                    else {
                      location.reload();
                    }

                  };

                }

              }


            });

          }

        }

    },

    /**
     * Setup draggable events on menu items
     */
    setupDraggable: function() {

      var x, el, selector, sortable, item, action, html;

      // setup sortable on the menu
      el = document.querySelector('.hashedit-menu-body');

      sortable = new Sortable(el, {
        group: {
          name: 'hashedit-sortable',
          pull: 'clone',
          put: false
        },
        draggable: 'a',
        sort: false, // sorting inside list
        delay: 0, // time in milliseconds to define when the sorting should start
        disabled: false, // Disables the sortable if set to true.
        animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
        ghostClass: "hashedit-highlight", // Class name for the drop placeholder

        scroll: true, // or HTMLElement
        scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
        scrollSpeed: 10, // px

        onStart: function(evt) {

          document.querySelector('.hashedit-menu').removeAttribute('active');

        },

        // dragging ended
        onEnd: function(evt) {

          // get item
          item = evt.item;

          if (hashedit.debug === true) {
            console.log(item);
          }

          // get action
          selector = item.getAttribute('data-selector');

          // append html associated with action
          for (x = 0; x < hashedit.menu.length; x += 1) {
            if (hashedit.menu[x].selector == selector) {
              html = hashedit.menu[x].html;
              html = hashedit.replaceAll(html, '{{path}}', hashedit.path);
              html = hashedit.replaceAll(html, '{{framework.image}}', hashedit.frameworkDefaults[hashedit.framework].image);
              html = hashedit.replaceAll(html, '{{framework.table}}', hashedit.frameworkDefaults[hashedit.framework].table);
              html = hashedit.replaceAll(html, '{{framework.code}}', hashedit.frameworkDefaults[hashedit.framework].code);

              var node = hashedit.append(html);

              // add
              if(hashedit.menu[x].view != undefined) {
                node.innerHTML += hashedit.menu[x].view;
              }

            }
          }

          // setup empty columns
          hashedit.setupEmpty();

          // remove help
          var help = document.querySelector('.hashedit-help');

          if(help != null) {
            help.innerHTML = '';
            help.removeAttribute('active');
          }

          return false;

        }
      });
    },

    /**
     * Load html
     */
    loadHTML: function(path) {

      var x, wrapper;

      // fetch the config
      fetch(path + 'html/modals.html')
        .then(function(response) {
          return response.text();
        }).then(function(text) {

          wrapper = document.createElement('div');
          wrapper.innerHTML = text;

          for (x = 0; x < wrapper.childNodes.length; x += 1) {
            hashedit.current.container.appendChild(wrapper.childNodes[x]);
          }

          // init menu
          for (x = 0; x < hashedit.menu.length; x += 1) {

            // initialize
            if (hashedit.menu[x].init) {
              hashedit.menu[x].init();
            }

          }

          // setup events
          hashedit.setupConfigEvents();
          hashedit.setupTextEvents();
          hashedit.setupModalEvents();

        });

    },

    /**
     * Create menu
     */
    createMenu: function() {

      var x, item, a;

      // setup menu
      var menu = [{
          selector: "H1",
          title: "H1 Headline",
          display: "H1",
          html: '<h1>' + hashedit.i18n('Tap to update') + '</h1>'
        }, {
          selector: "h2",
          title: "H2 Headline",
          display: "H2",
          html: '<h2>' + hashedit.i18n('Tap to update') + '</h2>'
        }, {
          selector: "h3",
          title: "H3 Headline",
          display: "H3",
          html: '<h3>' + hashedit.i18n('Tap to update') + '</h3>'
        }, {
          selector: "h4",
          title: "H4 Headline",
          display: "H4",
          html: '<h4>' + hashedit.i18n('Tap to update') + '</h4>'
        }, {
          selector: "h5",
          title: "H5 Headline",
          display: "H5",
          html: '<h5>' + hashedit.i18n('Tap to update') + '</h5>'
        }, {
          selector: "p",
          title: "Paragraph",
          display: "P",
          html: '<p>' + hashedit.i18n('Tap to update') + '</p>'
        }, {
          selector: "blockquote",
          title: "Blockquote",
          display: "<i class=\"material-icons\">format_quote</i>",
          html: '<blockquote>' + hashedit.i18n('Tap to update') + '</blockquote>'
        }, {
          selector: "ul",
          title: "Unordered List",
          display: "<i class=\"material-icons\">format_list_bulleted</i>",
          html: '<ul><li>' + hashedit.i18n('Tap to update') + '</li></ul>'
        }, {
          selector: "ol",
          title: "Ordered List",
          display: "<i class=\"material-icons\">format_list_numbered</i>",
          html: "<ol><li></li></ol>"
        }, {
          selector: "hr",
          title: "Break",
          display: "<i class=\"material-icons\">remove</i>",
          html: "<hr>"
        },{
          selector: "img",
          title: "Image",
          display: "<i class=\"material-icons\">insert_photo</i>",
          html: '<p><img src="{{path}}images/placeholder.png" class="{{framework.image}}"></p>',
          configure: function() {
            hashedit.showImageDialog();
          }
        }, {
          selector: "table[rows]",
          title: "Table",
          display: "<i class=\"material-icons\">grid_on</i>",
          html: '<table class="{{framework.table}}" rows="1" columns="2"><thead><tr><th>Header</th><th>Header</th></tr></thead><tbody><tr><td>Content</td><td>Content</td></tr></tbody></table>',
          attributes: [
            {
              attr: 'rows',
              label: 'Rows',
              type: 'select',
              values: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
            }  ,
            {
              attr: 'columns',
              label: 'Columns',
              type: 'select',
              values: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
            }
          ],
          change: function(attr, newValue, oldValue) {

            var x, y, rows, curr_rows, columns, curr_columns, toBeAdded,
              toBeRemoved, table, trs, th, tr, td, tbody;

            if (newValue != oldValue) {

              if (attr == 'columns') {

                columns = newValue;
                curr_columns = oldValue;

                if (columns > curr_columns) { // add columns

                  toBeAdded = columns - curr_columns;

                  table = hashedit.current.node;
                  trs = hashedit.current.node.getElementsByTagName('tr');

                  // walk through table
                  for (x = 0; x < trs.length; x += 1) {

                    // add columns
                    for (y = 0; y < toBeAdded; y += 1) {
                      if (trs[x].parentNode.nodeName == 'THEAD') {

                        th = document.createElement('th');
                        th.setAttribute('contentEditable', 'true');
                        th.innerHTML = 'New Header';

                        trs[x].appendChild(th);
                      } else {
                        td = document.createElement('td');
                        td.setAttribute('contentEditable', 'true');
                        td.innerHTML = 'Content';

                        trs[x].appendChild(td);
                      }
                    }
                  }

                } else if (columns < curr_columns) { // remove columns

                  toBeRemoved = curr_columns - columns;

                  table = hashedit.current.node;
                  trs = hashedit.current.node.getElementsByTagName('tr');

                  // walk through table
                  for (x = 0; x < trs.length; x += 1) {

                    // remove columns
                    for (y = 0; y < toBeRemoved; y += 1) {
                      if (trs[x].parentNode.nodeName == 'THEAD') {
                        trs[x].querySelector('th:last-child').remove();
                      } else {
                        trs[x].querySelector('td:last-child').remove();
                      }
                    }
                  }

                }

              } else if (attr == 'rows') {

                rows = newValue;
                curr_rows = oldValue;
                table = hashedit.current.node;
                columns = table.querySelectorAll('thead tr:first-child th').length;

                if (rows > curr_rows) { // add rows

                  toBeAdded = rows - curr_rows;

                  // add rows
                  for (y = 0; y < toBeAdded; y += 1) {
                    tr = document.createElement('tr');

                    for (x = 0; x < columns; x += 1) {
                      td = document.createElement('td');
                      td.setAttribute('contentEditable', 'true');
                      td.innerHTML = 'Content';
                      tr.appendChild(td);
                    }

                    tbody = table.getElementsByTagName('tbody')[0];
                    tbody.appendChild(tr);
                  }

                } else if (rows < curr_rows) { // remove columns

                  toBeRemoved = curr_rows - rows;

                  // remove rows
                  for (y = 0; y < toBeRemoved; y += 1) {
                    tr = table.querySelector('tbody tr:last-child');

                    if (tr !== null) {
                      tr.remove();
                    }
                  }

                }

              }

            }

          }
        },{
          selector: "pre",
          title: "Code",
          display: "<i class=\"material-icons\">code</i>",
          html: "<pre>Start adding code</pre>"
        }, {
          selector: "[respond-html]",
          title: "HTML",
          display: "HTML",
          html: '<div respond-html>' + hashedit.i18n('Tap settings to edit HTML') + '</div>'
        }];

      hashedit.menu = menu.concat(hashedit.menu);

      // walk through plugins
      for (x = 0; x < hashedit.menu.length; x += 1) {

        item = hashedit.menu[x];

        // create a menu item
        a = document.createElement('a');
        a.setAttribute('title', item.title);
        a.setAttribute('data-selector', item.selector);
        a.innerHTML = '<span class="icon">' + item.display + '</span><span class="title">' + item.title + '</span>';

        // append the child to the menu
        document.querySelector('.hashedit-menu-body').appendChild(a);

      }

      // make the menu draggable
      hashedit.setupDraggable();

    },

    /**
     * Setup view
     */
    setupView: function() {

      var x, y, item, els;

      // walk through plugins
      for (x = 0; x < hashedit.menu.length; x += 1) {

        if(hashedit.menu[x].view !== undefined) {

          els = document.querySelectorAll(hashedit.menu[x].selector);

          for(y=0; y<els.length; y++) {
            els[y].innerHTML = hashedit.menu[x].view;
          }
        }

      }

    },

    /**
     * Shows the text options
     */
    showTextOptions: function(element) {

      var x, link, image, text, fields;

      // set current element and node
      hashedit.current.element = element;
      hashedit.current.node = element;

      // if the current element is not a [hashedit-element], find the parent that matches
      if(hashedit.current.element.hasAttribute('hashedit-element') === false) {
        hashedit.current.element = hashedit.findParentBySelector(element, '[hashedit-element]');
      }

      // hide #hashedit-image
      image = document.querySelector('#hashedit-image-settings-modal');
      image.removeAttribute('visible');

      // hide #hashedit-link
      link = document.querySelector('#hashedit-link-settings-modal');
      link.removeAttribute('visible');

      // get #hashedit-config
      text = document.querySelector('#hashedit-text-settings');
      text.setAttribute('visible', '');

      // clear form fields
      fields = document.querySelectorAll('[data-model]');

      for (x = 0; x < fields.length; x += 1) {
        if (fields[x].nodeType == 'SELECT') {
          fields[x].selectedIndex = 0;
        } else {
          fields[x].value = '';
        }
      }

      hashedit.bind();

    },

    /**
     * Binds data from the current element
     */
    bind: function() {

      var attrs, x, y, z, key, value, html, inputs, textarea;

      console.log(hashedit.current.node);

      if (hashedit.current.node !== null) {

        // get attributes
        attrs = hashedit.current.node.attributes;

        for (x = 0; x < attrs.length; x += 1) {

          // get key and value
          key = attrs[x].nodeName.replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
          });
          value = attrs[x].nodeValue;

          // if is numeric
          if (!isNaN(parseFloat(value)) && isFinite(value)) {
            value = parseFloat(value);
          }

          // set value
          inputs = document.querySelectorAll('[data-model="node.' + key + '"]');

          for (y = 0; y < inputs.length; y += 1) {
            inputs[y].value = value;
          }

        }

        // get html
        html = hashedit.current.node.innerHTML;

        // remove the element menu
        html = hashedit.replaceAll(html, hashedit.elementMenu, '');

        inputs = document.querySelectorAll('[data-model="node.html"]');

        for (y = 0; y < inputs.length; y += 1) {
          inputs[y].value = html;
        }

      }


    },

    /**
     * Setup contentEditable events for the editor
     */
    setupContentEditableEvents: function() {

      var x, y, z, arr, edits, isEditable, configs, isConfig, el, html,li, parent, els, isDefault, removeElement, element, modal, body, attr, div, label, control, option, menuItem, els, text, block;


      // clean pasted text, #ref: http://bit.ly/1Tr8IR3
      document.addEventListener('paste', function(e) {

        if(e.target.nodeName == 'TEXTAREA') {
          // do nothing
        }
        else {
          // cancel paste
          e.preventDefault();

          // get text representation of clipboard
          var text = e.clipboardData.getData("text/plain");

          // insert text manually
          document.execCommand("insertHTML", false, text);
        }

      });


      // get contentEditable elements
      arr = document.querySelectorAll('body');

      for (x = 0; x < arr.length; x += 1) {

        // delegate CLICK, FOCUS event
        ['click', 'focus'].forEach(function(e) {

          arr[x].addEventListener(e, function(e) {

            if (e.target.hasAttribute('hashedit-element')) {
              element = e.target;
              
              // get value of text node
              var text = hashedit.getTextNodeValue(element);
              
              // if text is set to "Tap to update" select all the text
              if(text === hashedit.i18n('Tap to update')) {
                document.execCommand('selectAll', false, null);
              }
              
            }
            else {
              element = hashedit.findParentBySelector(e.target, '[hashedit-element]');
            }

            // remove all current elements
            els = document.querySelectorAll('[current-hashedit-element]');

            for (y = 0; y < els.length; y += 1) {
              els[y].removeAttribute('current-hashedit-element');
            }

            // set current element
            if (element) {
              element.setAttribute('current-hashedit-element', 'true');
            }

            // check for remove element
            if (hashedit.findParentBySelector(e.target, '.hashedit-remove') !== null) {
              element.remove();
            }
            // check for properties element
            else if (hashedit.findParentBySelector(e.target, '.hashedit-properties') !== null) {

              hashedit.current.node = element;

              isDefault = true;

              // get menuItem
              menuItem = null;

              // see if the element matches a plugin selector
              for (x = 0; x < hashedit.menu.length; x += 1) {

                if (element.matches(hashedit.menu[x].selector)) {

                  menuItem = hashedit.menu[x];

                  if (hashedit.menu[x].configure) {
                    isDefault = false;
                    hashedit.menu[x].configure();
                  }

                }

              }

              if (isDefault === true) {

                modal = document.getElementById('hashedit-element-settings-modal');
                body = modal.querySelector('.hashedit-modal-body');

                // remove existing custom attributes
                els = body.querySelectorAll('.hashedit-custom-attr');

                for(y=0; y<els.length; y++) {
                  els[y].parentNode.removeChild(els[y]);
                }

                // setup custom attributes
                if(menuItem != null) {

                  if(menuItem.attributes) {

                    for(y=0; y<menuItem.attributes.length; y++){

                      attr = menuItem.attributes[y];

                      div = document.createElement('div');
                      div.setAttribute('class', 'hashedit-custom-attr');

                      label = document.createElement('label');
                      label.innerHTML = attr.label;

                      div.appendChild(label);

                      if(attr.type == 'text'){
                        control = document.createElement('input');
                        control.setAttribute('type', 'text');
                        control.setAttribute('data-model', 'node.' + attr.attr);
                        control.setAttribute('name', 'attr');

                        div.appendChild(control);
                      }

                      if(attr.type == 'select'){
                        control = document.createElement('select');
                        control.setAttribute('data-model', 'node.' + attr.attr);
                        control.setAttribute('name', 'attr');

                        // create options
                        if(attr.values != null) {

                          for(z=0; z<attr.values.length; z++){

                            option = document.createElement('option');

                            // determine if hashed array
                            if(attr.values[z].text) {
                              option.setAttribute('value', attr.values[z].value);
                              option.innerHTML = attr.values[z].text;
                            }
                            else {
                              option.setAttribute('value', attr.values[z]);
                              option.innerHTML = attr.values[z];
                            }

                            control.appendChild(option);
                          }

                        }

                        div.appendChild(control);

                      }

                      body.appendChild(div);

                    }


                  }

                }

                // bind
                hashedit.bind();

                // show modal
                modal.setAttribute('visible', 'true');

              }

            }
            // add block
            else if (hashedit.findParentBySelector(e.target, '.hashedit-block-add') !== null) {

              block = hashedit.findParentBySelector(e.target, '[hashedit-block]');

              if(block !== null) {
                hashedit.showLayoutDialog(block);
              }

            }
            // properites block
            else if (hashedit.findParentBySelector(e.target, '.hashedit-block-properties') !== null) {

              block = hashedit.findParentBySelector(e.target, '[hashedit-block]');

              if(block !== null) {

                var modal = document.getElementById('hashedit-block-settings-modal');

                // show modal
                modal.setAttribute('visible', 'true');

                hashedit.current.node = block;
                hashedit.bind();

              }

            }
            // move block up
            else if (hashedit.findParentBySelector(e.target, '.hashedit-block-up') !== null) {

              block = hashedit.findParentBySelector(e.target, '[hashedit-block]');

              if(block.previousElementSibling != null) {

                if(block.previousElementSibling.hasAttribute('hashedit-block') === true) {
                  block.parentNode.insertBefore(block, block.previousElementSibling);
                }

              }

              hashedit.setupBlocks();

            }
            // move block down
            else if (hashedit.findParentBySelector(e.target, '.hashedit-block-down') !== null) {

              block = hashedit.findParentBySelector(e.target, '[hashedit-block]');

              if(block.nextElementSibling != null) {

                if(block.nextElementSibling.hasAttribute('hashedit-block') === true) {
                  block.nextElementSibling.parentNode.insertBefore(block.nextElementSibling, block);
                }

              }

              hashedit.setupBlocks();

            }
            // remove block
            else if (hashedit.findParentBySelector(e.target, '.hashedit-block-remove') !== null) {

              block = hashedit.findParentBySelector(e.target, '[hashedit-block]');
              block.remove();

              hashedit.setupBlocks();

            }
            // remove block
            else if (hashedit.findParentBySelector(e.target, '.hashedit-block-duplicate') !== null) {

              block = hashedit.findParentBySelector(e.target, '[hashedit-block]');

              hashedit.duplicateBlock(block, 'before');

              hashedit.setupBlocks();

            }
            // handle links
            else if (e.target.nodeName == 'A') {

                // hide .hashedit-config, .hashedit-modal
                edits = document.querySelectorAll('[hashedit]');

                // determines whether the element is a configuration
                isEditable = false;

                for (x = 0; x < edits.length; x += 1) {

                  if (edits[x].contains(e.target) === true) {
                    isEditable = true;
                  }

                }

                if (isEditable) {
                  hashedit.showLinkDialog();
                }
            }
            else if (e.target.nodeName == 'IMG') {
                hashedit.current.node = e.target;
                hashedit.current.image = e.target;

                // hide .hashedit-config, .hashedit-modal
                edits = document.querySelectorAll('[hashedit]');

                // determines whether the element is a configuration
                isEditable = false;

                for (x = 0; x < edits.length; x += 1) {

                  if (edits[x].contains(e.target) === true) {
                    isEditable = true;
                  }

                }

                if (isEditable) {
                  hashedit.showImageDialog();
                }
            }
            else if (e.target.hasAttribute('contentEditable')) {

              // shows the text options
              hashedit.showTextOptions(e.target);

            }
            else if (e.target.parentNode.hasAttribute('contentEditable') && e.target.parentNode) {

              // shows the text options
              hashedit.showTextOptions(e.target);

            }
            else if (e.target.className == 'dz-hidden-input') {
              // do nothing
            }
            else {
              // hide .hashedit-config, .hashedit-modal
              configs = document.querySelectorAll(
                '.hashedit-config, .hashedit-modal, .hashedit-menu'
              );

              // determines whether the element is a configuration
              isConfig = false;

              for (x = 0; x < configs.length; x += 1) {

                if (configs[x].contains(e.target) === true) {
                  isConfig = true;
                }

              }

              // hide if not in config
              if (isConfig === false) {

                for (x = 0; x < configs.length; x += 1) {
                  configs[x].removeAttribute('visible');
                }

              }
            }

          });

        });


        // delegate INPUT event
        ['input'].forEach(function(e) {
          arr[x].addEventListener(e, function(e) {
          
            if (e.target.hasAttribute('contentEditable')) {

              el = e.target;
              
              while (el !== null) {
              
                var node = el.childNodes[0];

                if (hashedit.debug === true) {
                  console.log('input event');
                  console.log(el.nodeName);
                }

                // get value of text node
                var text = hashedit.getTextNodeValue(el);
                
                // if text is blank, add "Tap to update" to prevent the editor from breaking
                if(text === '') {
                  text = document.createTextNode(hashedit.i18n('Tap to update'));
                  el.insertBefore(text, el.firstChild);
                  document.execCommand('selectAll', false, null);
                }

                html = el.innerHTML;

                // strip out &nbsps
                html = hashedit.replaceAll(html, '&nbsp;', ' ');

                // trim
                html = html.trim();

                // set to null
                el = null;
              }

            }


          });

        });

        // delegate INPUT event
        ['keydown'].forEach(function(e) {
          arr[x].addEventListener(e, function(e) {

            if (e.target.hasAttribute('contentEditable')) {

              el = e.target;

              // ENTER key
              if (e.keyCode === 13) {

                if (el.nodeName == 'LI') {

                  // create LI
                  li = document.createElement('li');
                  li.setAttribute('contentEditable', true);

                  // append LI
                  el.parentNode.appendChild(li);

                  el.parentNode.lastChild.focus();

                  e.preventDefault();
                  e.stopPropagation();

                }
                else if (el.nodeName == 'P') {

                  var node = hashedit.append('<p>' + hashedit.i18n('Tap to update') + '</p>');

                  hashedit.current.node = node;
                  

                  e.preventDefault();
                  e.stopPropagation();

                }

              }

              // DELETE key
              if (e.keyCode === 8) {

                if (el.nodeName == 'LI') {

                  if (el.innerHTML === '') {

                    if (el.previousSibling !== null) {

                      parent = el.parentNode;

                      el.remove();

                      parent.lastChild.focus();
                    }

                    e.preventDefault();
                    e.stopPropagation();
                  }

                } // end LI
                
              }
              
            }


          });

        });

      }

    },
    
    /**
     * Returns the value of the text node
     */
    getTextNodeValue: function(el) {
    
      var text = '';
    
      for (var i = 0; i < el.childNodes.length; i++) {
          var curNode = el.childNodes[i];
          var whitespace = /^\s*$/;
          
          if(curNode === undefined) {
            text = "";
            break;
          }
          
          if (curNode.nodeName === "#text" && !(whitespace.test(curNode.nodeValue))) {
              text = curNode.nodeValue;
              break;
          }
      }
      
      return text;
      
    },

    /**
     * Selects element contents
     */
    selectElementContents: function(el) {
      var range, sel;

      range = document.createRange();
      range.selectNodeContents(el);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },

    /**
     * Appends items to the editor
     */
    append: function(html) {

      var x, newNode, node, firstChild;

      // create a new node
      newNode = document.createElement('div');
      newNode.innerHTML = html;

      // get new new node
      newNode = newNode.childNodes[0];
      newNode.setAttribute('hashedit-element', '');

      newNode.innerHTML += hashedit.elementMenu;

      // get existing node
      node = document.querySelector('[hashedit-sortable] [data-selector]');

      if (node === null) {

        if (hashedit.current.node !== null) {

          // insert after current node
          hashedit.current.node.parentNode.insertBefore(newNode, hashedit.current.node.nextSibling);

        }

      }
      else {
        // replace existing node with newNode
        node.parentNode.replaceChild(newNode, node);
      }

      var types = 'p, h1, h2, h3, h4, h5, li, td, th, blockquote, pre';

      // set editable children
      var editable = newNode.querySelectorAll(types);

      for (x = 0; x < editable.length; x += 1) {
        editable[x].setAttribute('contentEditable', 'true');
      }

      if (types.indexOf(newNode.nodeName.toLowerCase()) != -1) {
        newNode.setAttribute('contentEditable', 'true');
      }

      // select element
      function selectElementContents(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }

      // focus on first element
      if (editable.length > 0) {

        editable[0].focus();
        selectElementContents(editable[0]);

        // show edit options for the text
        hashedit.showTextOptions(editable[0]);

        // select editable contents, #ref: http://bit.ly/1jxd8er
        hashedit.selectElementContents(editable[0]);
      }
      else {

        if(newNode.matches(types)) {

          newNode.focus();
          selectElementContents(newNode);

        }

      }

      return newNode;

    },

    /**
     * Duplicates a block and appends it to the editor
     */
    duplicateBlock: function(current, position) {

      var x, newNode, node, firstChild;

      // create a new node
      newNode = current.cloneNode(true);

      // create new node in mirror
      if (position == 'before') {

        // insert element
        current.parentNode.insertBefore(newNode, current);

      }

      // re-init sortable
      hashedit.setupSortable();

      return newNode;

    },

    /**
     * Appends blocks to the editor
     */
    appendBlock: function(html, current, position) {

      var x, newNode, node, firstChild;

      // create a new node
      newNode = document.createElement('div');
      newNode.innerHTML = html;

      // get new new node
      newNode = newNode.childNodes[0];

      // create new node in mirror
      if (position == 'before') {

        // insert element
        current.parentNode.insertBefore(newNode, current);

      }

      // re-init sortable
      hashedit.setupSortable();

      return newNode;

    },

    /**
     * Setup modal events
     */
    setupModalEvents: function() {

      var x, dz, arr, card, list, item, path, url, title, description,
        params, xhr, value, el, options;

      // check for dropzone
      if(Dropzone != undefined && Dropzone != null) {

        // set dropzone options
        var options = {
          url: hashedit.uploadUrl
        };

        // setup token headers
        if(hashedit.useToken == true) {
          options.headers = {};
          options.headers[hashedit.authHeader] = hashedit.authHeaderPrefix + ' ' + localStorage.getItem(hashedit.tokenName);
        }

        // create the dropzone
        dz = new Dropzone("#hashedit-dropzone", options);

        dz.on("complete", function(file) {
          dz.removeFile(file);
        });

        dz.on("success", function(file, response) {

          var value = 'files/' + file.name;

          // set value
          el = document.getElementById('hashedit-image-src');
          el.value = value;

          // add item to list
          list = document.getElementById('images-list');

          item = document.createElement('div');
          item.setAttribute('class', 'hashedit-list-item');
          item.innerHTML = 'images/' + value;
          item.setAttribute('data-value', 'images/' + value);

          list.appendChild(item);

          // fire input event
          el.dispatchEvent(new Event('input', {
            'bubbles': true
          }));

          // flip card
          card = document.getElementById('hashedit-image-settings-modal');
          card.removeAttribute('hashedit-card-flipped');

        });

      }

      // handle click on images list
      list = document.getElementById('images-list');

      ['click'].forEach(function(e) {
        list.addEventListener(e, function(e) {

          if (e.target.hasAttribute('data-value') === true) {
            value = e.target.getAttribute('data-value');

            // set value
            el = document.getElementById('hashedit-image-src');
            el.value = value;

            // fire input event
            el.dispatchEvent(new Event('input', {
              'bubbles': true
            }));

            // flip card
            card = document.getElementById(
              'hashedit-image-settings-modal');
            card.removeAttribute('hashedit-card-flipped');
          }

        });
      });

      // handle click on images list
      list = document.getElementById('pages-list');

      ['click'].forEach(function(e) {
        list.addEventListener(e, function(e) {

          if (e.target.hasAttribute('data-value') === true) {
            value = e.target.getAttribute('data-value');

            // set value
            el = document.getElementById('hashedit-link-href');
            el.value = value;

            // fire input event
            el.dispatchEvent(new Event('input', {
              'bubbles': true
            }));

            // flip card
            card = document.getElementById('hashedit-link-settings-modal');
            card.removeAttribute('hashedit-card-flipped');
          }

        });
      });

      // setup config events
      arr = document.querySelectorAll('.toggle-select-image');

      for (x = 0; x < arr.length; x += 1) {

        // delegate on .hashedit-config
        ['click'].forEach(function(e) {

          arr[x].addEventListener(e, function(e) {

            // flip the card
            card = document.querySelector(
              '#hashedit-image-settings-modal');

            if(card.hasAttribute('hashedit-card-flipped')) {
              card.removeAttribute('hashedit-card-flipped');
            } else {
              card.setAttribute('hashedit-card-flipped', 'true');
            }

            if (hashedit.imagesListLoaded === false) {

              // set default auth
              var obj = {
                credentials: 'include'
              }

              // enable token based auth
              if(hashedit.useToken) {

                // set obj headers
                obj = {
                  headers: {}
                };

                obj.headers[hashedit.authHeader] = hashedit.authHeaderPrefix + ' ' + localStorage.getItem(hashedit.tokenName);
              }

              // load the images
              fetch(hashedit.imagesListUrl, obj)
                .then(function(response) {

                  return response.json();

                }).then(function(json) {

                  list = document.getElementById('images-list');
                  list.innerHTML = '';

                  for (x = 0; x < json.length; x += 1) {
                    item = document.createElement('div');
                    item.setAttribute('class',
                      'hashedit-list-item');
                    item.innerHTML = json[x];
                    item.setAttribute('data-value', json[x]);

                    list.appendChild(item);
                  }

                  hashedit.imagesListLoaded = true;

                }).catch(function(ex) {
                  console.log('parsing failed', ex);
                });
            }

          });

        });
      }

      // setup config events
      arr = document.querySelectorAll('.toggle-select-url');

      for(x = 0; x < arr.length; x += 1) {

        // delegate on .hashedit-config
        ['click'].forEach(function(e) {

          arr[x].addEventListener(e, function(e) {

            // flip the card
            card = document.querySelector('#hashedit-link-settings-modal');

            if(card.hasAttribute('hashedit-card-flipped')) {
              card.removeAttribute('hashedit-card-flipped');
            }
            else {
              card.setAttribute('hashedit-card-flipped', 'true');
            }

            if(hashedit.pagesListLoaded === false) {

              // set default auth
              var obj = {
                credentials: 'include'
              }

              // enable token based auth
              if(hashedit.useToken) {

                // set obj headers
                obj = {
                  headers: {}
                };

                obj.headers[hashedit.authHeader] = hashedit.authHeaderPrefix + ' ' + localStorage.getItem(hashedit.tokenName);
              }

              // load the pages
              fetch(hashedit.pagesListUrl, obj)
                .then(function(response) {

                  return response.json();

                }).then(function(json) {

                  list = document.getElementById('pages-list');
                  list.innerHTML = '';

                  for (x = 0; x < json.length; x += 1) {
                    item = document.createElement('div');
                    item.setAttribute('class', 'hashedit-list-item');
                    item.innerHTML = json[x].url;
                    item.setAttribute('data-value', json[x].url);

                    list.appendChild(item);
                  }

                  hashedit.pagesListLoaded = true;

                }).catch(function(ex) {
                  console.log('parsing failed', ex);
                });


            }

          });

        });
      }

    },

    /**
     * Setup configuration events
     */
    setupConfigEvents: function() {

      var x, arr, el, configs, model, value, attr, parts, style;

      // setup config events
      arr = document.querySelectorAll('.hashedit-config, .hashedit-modal');

      for (x = 0; x < arr.length; x += 1) {

        // delegate on .hashedit-config
        ['propertychange', 'change', 'click', 'keyup', 'input', 'paste'].forEach
          (function(e) {

            arr[x].addEventListener(e, function(e) {

              el = e.target;

              if (el.hasAttribute('hashedit-cancel-modal')) {

                // hide .hashedit-config, .hashedit-modal
                configs = document.querySelectorAll(
                  '.hashedit-modal');

                for (x = 0; x < configs.length; x += 1) {
                  configs[x].removeAttribute('visible');
                }

              }

              // look for [data-model]
              if (el.hasAttribute('data-model')) {

                model = el.getAttribute('data-model');
                value = '';
                attr = '';

                value = el.value;

                if (model.indexOf('node.') != -1) {
                  parts = model.split('.');

                  // converts camelcase to hyphens, sets attribute
                  if (parts.length > 1) {

                    // get property
                    attr = parts[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

                    if(attr === 'html') {
                      hashedit.current.node.innerHTML = value + hashedit.elementMenu;
                    }
                    else { // other elements

                      // get currentValue
                      var old = hashedit.current.node.getAttribute(attr);

                      // set attribute
                      hashedit.current.node.setAttribute(attr, value);

                      if(hashedit.debug === true) {
                        console.log('setattribute on [data-model]');
                        console.log('attr=' + attr + 'value=' + value);
                      }

                      // create text style
                      style = hashedit.createTextStyle(hashedit.current.node);

                      hashedit.current.node.setAttribute('style', style);

                      // call change event
                      for (x = 0; x < hashedit.menu.length; x += 1) {

                        if(hashedit.current.node.matches(hashedit.menu[x].selector)) {
                          if(hashedit.menu[x].change) {
                            hashedit.menu[x].change(attr, value, old);
                          }

                        }

                      }

                    }


                  }
                }

                if (model.indexOf('link.') != -1) {
                  parts = model.split('.');

                  // converts camelcase to hyphens, sets attribute
                  if (parts.length > 1) {

                    // get property
                    attr = parts[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

                    // set attribute
                    hashedit.currLink.setAttribute(attr, value);

                    // get current node
                    if(hashedit.current.node == null){
                      hashedit.current.node = hashedit.findParentBySelector(hashedit.currLink, '[hashedit-element]');
                    }

                    // fire event
                    hashedit.current.node.dispatchEvent(new Event(
                      'input', {
                        'bubbles': true
                      }));

                  }
                }

                if (model.indexOf('image.') != -1) {
                  parts = model.split('.');

                  // converts camelcase to hyphens, sets attribute
                  if (parts.length > 1) {

                    // get property
                    attr = parts[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

                    // set attribute
                    hashedit.current.image.setAttribute(attr, value);

                    hashedit.current.node = hashedit.findParentBySelector(hashedit.current.image, '[hashedit-element]');

                    // fire event
                    if (hashedit.current.node !== null) {

                      hashedit.current.node.dispatchEvent(new Event(
                        'input', {
                          'bubbles': true
                        }));
                    }

                  }
                }

              }

            }, false);

          });

      }

    },

    /**
     * Setup text events (e.g. bold, italic, etc)
     */
    setupTextEvents: function() {

      var x, arr, el, action, text, html, input, value;

      arr = document.querySelectorAll('.hashedit-config');

      for (x = 0; x < arr.length; x += 1) {

        // delegate on .hashedit-config
        ['mousedown', 'touchstart'].forEach(function(e) {

          arr[x].addEventListener(e, function(e) {

            el = e.target;

            if (el.nodeName !== 'A') {
              el = hashedit.findParentBySelector(el, '[data-action]');
            }

            // look for [data-model]
            if (el.hasAttribute('data-action')) {

              action = el.getAttribute('data-action');

              if (action == 'hashedit.text.bold') {
                document.execCommand("Bold", false, null);
                return false;
              } else if (action == 'hashedit.text.italic') {
                document.execCommand("Italic", false, null);
                return false;
              } else if (action == 'hashedit.text.strike') {
                document.execCommand("strikeThrough", false, null);
                return false;
              } else if (action == 'hashedit.text.subscript') {
                document.execCommand("subscript", false, null);
                return false;
              } else if (action == 'hashedit.text.superscript') {
                document.execCommand("superscript", false, null);
                return false;
              } else if (action == 'hashedit.text.underline') {
                document.execCommand("underline", false, null);
                return false;
              }
              else if (action == 'hashedit.text.link') {

                // add link html
                text = hashedit.getSelectedText();
                html = '<a>' + text + '</a>';

                document.execCommand("insertHTML", false, html);

                // shows/manages the link dialog
                hashedit.showLinkDialog();

                return false;
              }
              else if (action == 'hashedit.text.image') {

                // add link html
                text = hashedit.getSelectedText();
                html = '<img src="{{path}}images/placeholder-inline.png" class="pull-left">';
                html = hashedit.replaceAll(html, '{{path}}', hashedit.path);

                document.execCommand("insertHTML", false, html);


                return false;
              }
              else if (action == 'hashedit.text.code') {

                // create code html
                text = hashedit.getSelectedText();
                html = '<code>' + text + '</code>';

                document.execCommand("insertHTML", false, html);
                return false;
              }
              else if (action == 'hashedit.text.alignLeft') {
                input = document.querySelector('.hashedit-modal [data-model="node.class"]');

                // clear existing alignments
                value = input.value;

                value = hashedit.replaceAll(value,'text-center', '');
                value = hashedit.replaceAll(value,'text-left', '');
                value = hashedit.replaceAll(value,'text-right', '');
                value += ' text-left';

                console.log(value);

                // update value and trigger change
                input.value = value.trim();

                // fire event
                input.dispatchEvent(new Event('change', {
                  'bubbles': true
                }));

                return false;
              }
              else if (action == 'hashedit.text.alignRight') {
                input = document.querySelector('.hashedit-modal [data-model="node.class"]');

                // clear existing alignments
                value = input.value;

                value = hashedit.replaceAll(value, 'text-center', '');
                value = hashedit.replaceAll(value, 'text-left', '');
                value = hashedit.replaceAll(value, 'text-right', '');
                value += ' text-right';

                // update value and trigger change
                input.value = value.trim();

                // fire event
                input.dispatchEvent(new Event('change', {
                  'bubbles': true
                }));

                return false;
              }
              else if (action == 'hashedit.text.alignCenter') {
                input = document.querySelector(
                  '.hashedit-modal [data-model="node.class"]');

                // clear existing alignments
                value = input.value;

                value = hashedit.replaceAll(value,
                  'text-center', '');
                value = hashedit.replaceAll(value,
                  'text-left', '');
                value = hashedit.replaceAll(value,
                  'text-right', '');
                value += ' text-center';

                // update value and trigger change
                input.value = value.trim();

                // fire event
                input.dispatchEvent(new Event('change', {
                  'bubbles': true
                }));

                return false;
              } else if (action == 'hashedit.text.undo') {
                document.execCommand("undo", false, null);
                return false;
              }


            }

          }, false);

        });

      }

    },

    /**
     * Sets up the link dialog
     */
    showLinkDialog: function() {

      var id, cssClass, href, target, title, link;

      // get selected link
      hashedit.currLink = hashedit.getLinkFromSelection();

      // populate link values
      if (hashedit.currLink !== null) {

        // get  attributes
        id = hashedit.currLink.getAttribute('id') || '';
        cssClass = hashedit.currLink.getAttribute('class') || '';
        href = hashedit.currLink.getAttribute('href') || '';
        target = hashedit.currLink.getAttribute('target') || '';
        title = hashedit.currLink.getAttribute('title') || '';

        // show the link dialog
        link = document.querySelector('#hashedit-link-settings-modal');
        link.setAttribute('visible', '');

        // sets start values
        document.getElementById('hashedit-link-id').value = id;
        document.getElementById('hashedit-link-cssclass').value =
          cssClass;
        document.getElementById('hashedit-link-href').value = href;
        document.getElementById('hashedit-link-target').value = target;
        document.getElementById('hashedit-link-title').value = title;

      }

    },

    /**
     * Sets up the layout dialog
     */
    showLayoutDialog: function(block) {

      var x, dialog, list, html, el, target, i, items;

      if(block !== null) {
        block.setAttribute('hashedit-block-active', '');
      }

      // show the layout dialog
      dialog = document.querySelector('#hashedit-layout-modal');

      // get list
      list = document.querySelector('#hashedit-layouts-list');

      items = list.querySelectorAll('.hashedit-list-item');

      // init items
      if(items.length === 0) {

        for(x=0; x<hashedit.grid.length; x++) {
           el = document.createElement('DIV');
           el.setAttribute('class', 'hashedit-list-item');
           el.setAttribute('data-index', x);
           el.innerHTML = '<h2>' + hashedit.grid[x].name + '</h2><small>' + hashedit.grid[x].desc + '</small>';

           list.appendChild(el);
        }

        list.addEventListener('click', function(e) {

          target = e.target;

          if(target.nodeName.toUpperCase() !== 'DIV'){
            target = hashedit.findParentBySelector(target, '.hashedit-list-item');
          }

          if(target != null) {

            // append the block
            i = target.getAttribute('data-index');
            html = hashedit.grid[i].html;

            hashedit.appendBlock(html, block, 'before');

            hashedit.setupBlocks();

            dialog.removeAttribute('visible');

          }

        });

      }

      dialog.setAttribute('visible', '');

    },

    /**
     * Sets up the images dialog
     */
    showImageDialog: function() {

      var id, cssClass, src, target, link, alt, title;

      // populate link values
      if (hashedit.current.node !== null) {

        // get  attributes
        id = hashedit.current.node.getAttribute('id') || '';
        cssClass = hashedit.current.node.getAttribute('class') || '';
        src = hashedit.current.node.getAttribute('src') || '';
        alt = hashedit.current.node.getAttribute('alt') || '';
        title = hashedit.current.node.getAttribute('title') || '';


        // show the link dialog
        link = document.querySelector('#hashedit-image-settings-modal');
        link.setAttribute('visible', '');

        // sets start values
        document.getElementById('hashedit-image-id').value = id;
        document.getElementById('hashedit-image-cssclass').value = cssClass;
        document.getElementById('hashedit-image-src').value = src;
        document.getElementById('hashedit-image-alt').value = alt;
        document.getElementById('hashedit-image-title').value = title;

      }

    },


    /**
     * Executes a function by its name and applies arguments
     * @param {String} functionName
     * @param {String} context
     */
    executeFunctionByName: function(functionName, context /*, args */ ) {

      var i, args, namespaces, func;

      args = [].slice.call(arguments).splice(2);
      namespaces = functionName.split(".");

      func = namespaces.pop();
      for (i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }

      return context[func].apply(this, args);
    },

    /**
     * Retrieves selected text
     */
    getSelectedText: function() {

      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type !=
        "Control") {
        text = document.selection.createRange().text;
      }
      return text;
    },

    /**
     * Saves text selection
     */
    saveSelection: function() {

      var ranges, i, sel, len;

      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          ranges = [];
          len = sel.rangeCount;
          for (i = 0; i < len; i += 1) {
            ranges.push(sel.getRangeAt(i));
          }
          return ranges;
        }
      } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
      }
      return null;
    },

    /**
     * Retrieve a link from the selection
     */
    getLinkFromSelection: function() {

      var parent, selection, range, div, links;

      parent = null;

      if (document.selection) {
        parent = document.selection.createRange().parentElement();
      } else {
        selection = window.getSelection();
        if (selection.rangeCount > 0) {
          parent = selection.getRangeAt(0).startContainer.parentNode;
        }
      }

      if (parent !== null) {
        if (parent.tagName == 'A') {
          return parent;
        }
      }

      if (window.getSelection) {
        selection = window.getSelection();

        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
          div = document.createElement('DIV');
          div.appendChild(range.cloneContents());
          links = div.getElementsByTagName("A");

          if (links.length > 0) {
            return links[0];
          } else {
            return null;
          }

        }
      }

      return null;
    },

    /**
     * Restore the selection
     * @param {?} savedSelection
     */
    restoreSelection: function(savedSel) {
      var i, len, sel;

      if (savedSel) {
        if (window.getSelection) {
          sel = window.getSelection();
          sel.removeAllRanges();
          len = savedSel.length;
          for (i = 0; i < len; i += 1) {
            sel.addRange(savedSel[i]);
          }
        } else if (document.selection && savedSel.select) {
          savedSel.select();
        }
      }
    },

    /**
     * Executes a function by its name and applies arguments
     * @param {HTMLElement} node
     */
    createTextStyle: function(node) {

      var style, textColor, textSize, textShadowColor, textShadowHorizontal, textShadowVertical, textShadowBlur;

      // get current node
      style = '';

      // build a style attribute for (text-color, text-size, text-shadow-color, text-shadow-vertical, text-shadow-horizontal, text-shadow-blur)
      textColor = node.getAttribute('text-color') || '';
      textSize = node.getAttribute('text-size') || '';
      textShadowColor = node.getAttribute('text-shadow-color') || '';
      textShadowHorizontal = node.getAttribute('text-shadow-horizontal') || '';
      textShadowVertical = node.getAttribute('text-shadow-horizontal') || '';
      textShadowBlur = node.getAttribute('text-shadow-blur') || '';

      if (textColor !== '') {
        style += 'color:' + textColor + ';';
      }

      if (textSize !== '') {
        style += 'font-size:' + textSize + ';';
      }

      if (textShadowColor !== '') {
        style += 'text-shadow: ' + textShadowHorizontal + ' ' +
          textShadowVertical + ' ' + textShadowBlur + ' ' +
          textShadowColor + ';';
      }

      return style;

    },

    /**
     * Retrieves a QS by name
     * @param {String} name
     */
    getQueryStringByName: function(name) {

      var regexS, regex, results;

      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      regexS = "[\\?&]" + name + "=([^&#]*)";
      regex = new RegExp(regexS);
      results = regex.exec(window.location.href);

      if (results === null) {
        return '';
      } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
      }
    },

    /**
     * Retrieve changes
     */
    retrieveUpdateArray: function() {

      var x, y, data, els, el, refs, actions;

      els = document.querySelectorAll('[hashedit]');
      data = [];

      for (x = 0; x < els.length; x += 1) {

        // remove action
        actions = els[x].querySelectorAll('.hashedit-edit');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove action
        actions = els[x].querySelectorAll('.hashedit-move');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove action
        actions = els[x].querySelectorAll('.hashedit-properties');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove action
        actions = els[x].querySelectorAll('.hashedit-remove');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove block menus
        actions = els[x].querySelectorAll('.hashedit-block-menu');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove block menus
        actions = els[x].querySelectorAll('.hashedit-element-menu');

        for(y=0; y<actions.length; y++) {
          actions[y].parentNode.removeChild(actions[y]);
        }

        // remove attributes
        actions = els[x].querySelectorAll('[hashedit-block]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('hashedit-block');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[hashedit-element]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('hashedit-element');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[hashedit-sortable]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('hashedit-sortable');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[hashedit-empty]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('hashedit-empty');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[contenteditable]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('contenteditable');
        }

        // remove attributes
        actions = els[x].querySelectorAll('[current-hashedit-element]');

        for(y=0; y<actions.length; y++) {
          actions[y].removeAttribute('current-hashedit-element');
        }


        el = {
          'selector': els[x].getAttribute('hashedit-selector'),
          'html': els[x].innerHTML
        };

        if(hashedit.debug === true) {
          console.log('update array');
          console.log(el);
        }

        data.push(el);
      }

      return {
        url: hashedit.url,
        changes: data
      };

    },

    /**
     * Setup the editor
     * @param {Array} incoming
     */
    setup: function(incoming) {

      var body, attr, path, stylesheet, sortable, demo, url, login, blocks, grid;

      // get body
      body = document.querySelector('body');

      // production
      login = '/login';
      path = '/node_modules/hashedit/';
      stylesheet = ['/node_modules/hashedit/dist/hashedit-min.css'];
      sortable = ['.sortable'];
      demo = false;
      url = null;
      blocks = [];

      // get attributes
      if(body != null) {

        // setup development
        if(incoming.dev) {
          path = '/dev/hashedit/';
          stylesheet = ['/dev/hashedit/css/hashedit.css'];
        }

        if(incoming.path) {
          path = incoming.path;
        }

        if(incoming.stylesheet) {
          stylesheet = incoming.stylesheet;
        }

        // setup demo
        if(body.hasAttribute('hashedit-demo') == true) {
          demo = true;
        }

        // setup framework
        if(incoming.framework) {
          hashedit.framework = incoming.framework;
        }

        // setup sortable
        if(incoming.sortable) {

          if(incoming.sortable != '') {
            sortable = incoming.sortable.split(',');
          }

        }

        // setup blocks
        if(incoming.blocks) {

          if(incoming.blocks != '') {
            blocks = incoming.blocks.split(',');
          }

        }

        // setup grid
        if(incoming.grid) {

          if(incoming.grid != '') {
            grid = incoming.grid;
          }

        }

        // setup editable
        if(incoming.editable) {

          if(incoming.editable != '') {
            editable = incoming.editable.split(',');
          }

        }

        // set url
        if(incoming.url) {
          url = incoming.url;
        }

        // set previewUrl
        if(incoming.previewUrl) {
          hashedit.previewUrl = incoming.previewUrl;
        }
        else {
          hashedit.previewUrl = url;
        }

        // set title
        if(incoming.title) {
          hashedit.title = incoming.title;
        }

        // set login
        if(incoming.login) {
          login = incoming.login;
        }

        // handle alternative auth types (e.g. token based auth)
        if(incoming.auth) {

          // setup token auth
          if(incoming.auth === 'token') {

            // defaults
            hashedit.useToken = true;
            hashedit.authHeader = 'Authorization';
            hashedit.authHeaderPrefix = 'Bearer';
            hashedit.tokenName = 'id_token';

            // override defaults
            if(incoming.authHeader) {
              hashedit.authHeader = incoming.authHeader;
            }

            if(incoming.authHeaderPrefix) {
              hashedit.authHeaderPrefix = incoming.authHeaderPrefix;
            }

            if(incoming.tokenName) {
              hashedit.tokenName = incoming.tokenName;
            }

          }

        }

        // handle language
        if(incoming.translate) {

          hashedit.canTranslate = true;
          hashedit.language = 'en';
          hashedit.languagePath = '/i18n/{{language}}.json';

          if(incoming.languagePath) {
            hashedit.languagePath = incoming.languagePath;
          }

          // get language
          if(localStorage['user_language'] != null){
    				hashedit.language = localStorage['user_language'];
    			}
    		}

    		if(incoming.saveUrl) {
      		hashedit.saveUrl = incoming.saveUrl;
    		}

      }

      // setup config
      var config = {
        path: path,
        login: login,
        stylesheet: stylesheet,
        sortable: sortable,
        blocks: blocks,
        grid: grid,
        demo: demo
      };

      // set url
      if (url != null) {
        config.url = url;
      }

      // setup editor
      hashedit.setupEditor(config);

    },

    /**
     * Setup the editor
     * @param {Array} config.sortable
     */
    setupEditor: function(config) {

      var x, style;

      // save config
      hashedit.config = config;

      // set path
      if (config.path != null) {
        hashedit.path = config.path;
      }

      // set login
      if (config.login != null) {
        hashedit.loginUrl = config.login;
      }

      // set grid
      if (config.grid != null) {
        hashedit.grid = config.grid;
      }

      // create container
      hashedit.current.container = document.createElement('div');
      hashedit.current.container.setAttribute('class', 'hashedit-container');
      hashedit.current.container.setAttribute('id', 'hashedit-container');

      // set stylesheet
      if (config.stylesheet !== null) {
        hashedit.stylesheet = config.stylesheet;
      }

      // set url
      if (config.url !== null) {
        hashedit.url = config.url;
      }

      // append container to body
      document.body.appendChild(hashedit.current.container);

      // create style
      style = document.createElement('style');

      // append scoped stylesheet to container
      for (x = 0; x < hashedit.stylesheet.length; x++) {
        style.innerHTML += '@import url(' + hashedit.stylesheet[x] + ');';
      }

      hashedit.current.container.appendChild(style);

      // check auth
      if (config.demo === true) {

        hashedit.demo = true;

        // init hashedit
        hashedit.setActive();
        hashedit.setupView();
        hashedit.setupSortable();
        hashedit.setupBlocks();
        hashedit.setContentEditable();
        hashedit.setupContentEditableEvents();
        hashedit.setupMenu(config.path);
        hashedit.setupToast();
        hashedit.createMenu(config.path);
        hashedit.loadHTML(config.path);
        hashedit.translate();

      }
      else {

        // set default auth
        var obj = {
          credentials: 'include'
        }

        // enable token based auth
        if(hashedit.useToken) {

          // set obj headers
          obj = {
            headers: {}
          };

          obj.headers[hashedit.authHeader] = hashedit.authHeaderPrefix + ' ' + localStorage.getItem(hashedit.tokenName);
        }

        // check auth
        fetch(hashedit.authUrl, obj)
          .then(function(response) {

            if (response.status !== 200) {
              hashedit.showAuth();
            }
            else {

              // init hashedit
              hashedit.setActive();
              hashedit.setupView();
              hashedit.setupSortable();
              hashedit.setupBlocks();
              hashedit.setContentEditable();
              hashedit.setupContentEditableEvents();
              hashedit.setupMenu(config.path);
              hashedit.setupToast();
              hashedit.createMenu(config.path);
              hashedit.loadHTML(config.path);
              hashedit.translate();

              // setup loaded event
              var event = new Event('hashedit.loaded');
              document.dispatchEvent(event);

            }

          });
      }

    },

    /**
     * Wrap an HTMLElement around each element in an HTMLElement array.
     * @param {Array} config.sortable
     */
    wrap: function(node, elms) {
      var i, child, el, parent, sibling;

      // Convert `elms` to an array, if necessary.
      if (!elms.length) {
        elms = [elms];
      }

      // Loops backwards to prevent having to clone the wrapper on the
      // first element (see `child` below).
      for (i = elms.length - 1; i >= 0; i--) {
        child = (i > 0) ? node.cloneNode(true) : node;
        el = elms[i];

        // Cache the current parent and sibling.
        parent = el.parentNode;
        sibling = el.nextSibling;

        // Wrap the element (is automatically removed from its current
        // parent).
        child.appendChild(el);

        // If the element had a sibling, insert the wrapper before
        // the sibling to maintain the HTML structure; otherwise, just
        // append it to the parent.
        if (sibling) {
          parent.insertBefore(child, sibling);
        } else {
          parent.appendChild(child);
        }
      }
    },

    /**
     * Generates a uniqueid
     */
    guid: function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + s4() + s4();
    },

    /**
     * Redirect to login URL
     */
    showAuth: function() {
      window.location = hashedit.loginUrl;
    },

    /**
     * Create the toast
     */
    setupToast: function() {

      var toast;

      toast = document.createElement('div');
      toast.setAttribute('class', 'hashedit-toast');
      toast.innerHTML = 'Sample Toast';

      // append toast
      if (hashedit.current) {
        hashedit.current.container.appendChild(toast);
      } else {
        document.body.appendChild(toast);
      }

    },

    /**
     * Replace all occurrences of a string
     * @param {String} src - Source string (e.g. haystack)
     * @param {String} stringToFind - String to find (e.g. needle)
     * @param {String} stringToReplace - String to replacr
     */
    replaceAll: function(src, stringToFind, stringToReplace) {

      var temp, index;

      temp = src;
      index = temp.indexOf(stringToFind);

      while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
      }

      return temp;
    },

    /**
     * Shows the toast
     */
    showToast: function(text, status) {

      var toast;

      toast = document.querySelector('.hashedit-toast');
      toast.innerHTML = text;
      toast.removeAttribute('success');
      toast.removeAttribute('failure');

      toast.setAttribute('active', '');

      // add success/failure
      if (status == 'success') {
        toast.setAttribute('success', '');
      } else if (status == 'failure') {
        toast.setAttribute('failure', '');
      }

      // hide toast
      setTimeout(function() {
        toast.removeAttribute('active');
      }, 2000);

    },

    /**
     * Find the parent by a selector ref: http://stackoverflow.com/questions/14234560/javascript-how-to-get-parent-element-by-selector
     * @param {Array} config.sortable
     */
    findParentBySelector: function(elm, selector) {
      var all, cur;

      all = document.querySelectorAll(selector);
      cur = elm.parentNode;

      while (cur && !hashedit.collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
      }
      return cur; //will return null if not found
    },

    /**
     * Helper for findParentBySelecotr
     * @param {Array} config.sortable
     */
    collectionHas: function(a, b) { //helper function (see below)
      var i, len;

      len = a.length;

      for (i = 0; i < len; i += 1) {
        if (a[i] == b) {
          return true;
        }
      }
      return false;
    },

    // translates a page
  	translate: function(language){

  	  var els, x, id, html;

  		// select elements
  		els = document.querySelectorAll('[data-i18n]');

  		// walk through elements
  		for(x=0; x<els.length; x++){
  			id = els[x].getAttribute('data-i18n');

  			// set id to text if empty
  			if(id == ''){
  				id = els[x].innerText();
  			}

  			// translate
  			html = hashedit.i18n(id);

  			els[x].innerHTML = html;
  		}

  	},

  	// translates a text string
  	i18n: function(text){

    	var options, language, path;

			language = hashedit.language;

      // translatable
      if(hashedit.canTranslate === true) {

    		// make sure library is installed
        if(i18n !== undefined) {

          if(hashedit.isI18nInit === false) {

            // get language path
            path = hashedit.languagePath;
            path = hashedit.replaceAll(path, '{{language}}', hashedit.language);

      			// set language
      			options = {
      		        lng: hashedit.language,
      		        getAsync : false,
      		        useCookie: false,
      		        useLocalStorage: false,
      		        fallbackLng: 'en',
      		        resGetPath: path,
      		        defaultLoadingValue: ''
      		    };

            // init
      			i18n.init(options);

      			// set flag
      			hashedit.isI18nInit = true;
    			}
    		}

  		}

  		return i18n.t(text);
  	},

  };

}());