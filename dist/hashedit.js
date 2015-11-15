(function(){var a,b,c,d,e,f,g,h,i=[].slice,j={}.hasOwnProperty,k=function(a,b){function c(){this.constructor=a}for(var d in b)j.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a};g=function(){},b=function(){function a(){}return a.prototype.addEventListener=a.prototype.on,a.prototype.on=function(a,b){return this._callbacks=this._callbacks||{},this._callbacks[a]||(this._callbacks[a]=[]),this._callbacks[a].push(b),this},a.prototype.emit=function(){var a,b,c,d,e,f;if(d=arguments[0],a=2<=arguments.length?i.call(arguments,1):[],this._callbacks=this._callbacks||{},c=this._callbacks[d])for(e=0,f=c.length;f>e;e++)b=c[e],b.apply(this,a);return this},a.prototype.removeListener=a.prototype.off,a.prototype.removeAllListeners=a.prototype.off,a.prototype.removeEventListener=a.prototype.off,a.prototype.off=function(a,b){var c,d,e,f,g;if(!this._callbacks||0===arguments.length)return this._callbacks={},this;if(d=this._callbacks[a],!d)return this;if(1===arguments.length)return delete this._callbacks[a],this;for(e=f=0,g=d.length;g>f;e=++f)if(c=d[e],c===b){d.splice(e,1);break}return this},a}(),a=function(a){function c(a,b){var e,f,g;if(this.element=a,this.version=c.version,this.defaultOptions.previewTemplate=this.defaultOptions.previewTemplate.replace(/\n*/g,""),this.clickableElements=[],this.listeners=[],this.files=[],"string"==typeof this.element&&(this.element=document.querySelector(this.element)),!this.element||null==this.element.nodeType)throw new Error("Invalid dropzone element.");if(this.element.dropzone)throw new Error("Dropzone already attached.");if(c.instances.push(this),this.element.dropzone=this,e=null!=(g=c.optionsForElement(this.element))?g:{},this.options=d({},this.defaultOptions,e,null!=b?b:{}),this.options.forceFallback||!c.isBrowserSupported())return this.options.fallback.call(this);if(null==this.options.url&&(this.options.url=this.element.getAttribute("action")),!this.options.url)throw new Error("No URL provided.");if(this.options.acceptedFiles&&this.options.acceptedMimeTypes)throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");this.options.acceptedMimeTypes&&(this.options.acceptedFiles=this.options.acceptedMimeTypes,delete this.options.acceptedMimeTypes),this.options.method=this.options.method.toUpperCase(),(f=this.getExistingFallback())&&f.parentNode&&f.parentNode.removeChild(f),this.options.previewsContainer!==!1&&(this.previewsContainer=this.options.previewsContainer?c.getElement(this.options.previewsContainer,"previewsContainer"):this.element),this.options.clickable&&(this.clickableElements=this.options.clickable===!0?[this.element]:c.getElements(this.options.clickable,"clickable")),this.init()}var d,e;return k(c,a),c.prototype.Emitter=b,c.prototype.events=["drop","dragstart","dragend","dragenter","dragover","dragleave","addedfile","addedfiles","removedfile","thumbnail","error","errormultiple","processing","processingmultiple","uploadprogress","totaluploadprogress","sending","sendingmultiple","success","successmultiple","canceled","canceledmultiple","complete","completemultiple","reset","maxfilesexceeded","maxfilesreached","queuecomplete"],c.prototype.defaultOptions={url:null,method:"post",withCredentials:!1,parallelUploads:2,uploadMultiple:!1,maxFilesize:256,paramName:"file",createImageThumbnails:!0,maxThumbnailFilesize:10,thumbnailWidth:120,thumbnailHeight:120,filesizeBase:1e3,maxFiles:null,params:{},clickable:!0,ignoreHiddenFiles:!0,acceptedFiles:null,acceptedMimeTypes:null,autoProcessQueue:!0,autoQueue:!0,addRemoveLinks:!1,previewsContainer:null,hiddenInputContainer:"body",capture:null,dictDefaultMessage:"Drop files here to upload",dictFallbackMessage:"Your browser does not support drag'n'drop file uploads.",dictFallbackText:"Please use the fallback form below to upload your files like in the olden days.",dictFileTooBig:"File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",dictInvalidFileType:"You can't upload files of this type.",dictResponseError:"Server responded with {{statusCode}} code.",dictCancelUpload:"Cancel upload",dictCancelUploadConfirmation:"Are you sure you want to cancel this upload?",dictRemoveFile:"Remove file",dictRemoveFileConfirmation:null,dictMaxFilesExceeded:"You can not upload any more files.",accept:function(a,b){return b()},init:function(){return g},forceFallback:!1,fallback:function(){var a,b,d,e,f,g;for(this.element.className=""+this.element.className+" dz-browser-not-supported",g=this.element.getElementsByTagName("div"),e=0,f=g.length;f>e;e++)a=g[e],/(^| )dz-message($| )/.test(a.className)&&(b=a,a.className="dz-message");return b||(b=c.createElement('<div class="dz-message"><span></span></div>'),this.element.appendChild(b)),d=b.getElementsByTagName("span")[0],d&&(null!=d.textContent?d.textContent=this.options.dictFallbackMessage:null!=d.innerText&&(d.innerText=this.options.dictFallbackMessage)),this.element.appendChild(this.getFallbackForm())},resize:function(a){var b,c,d;return b={srcX:0,srcY:0,srcWidth:a.width,srcHeight:a.height},c=a.width/a.height,b.optWidth=this.options.thumbnailWidth,b.optHeight=this.options.thumbnailHeight,null==b.optWidth&&null==b.optHeight?(b.optWidth=b.srcWidth,b.optHeight=b.srcHeight):null==b.optWidth?b.optWidth=c*b.optHeight:null==b.optHeight&&(b.optHeight=1/c*b.optWidth),d=b.optWidth/b.optHeight,a.height<b.optHeight||a.width<b.optWidth?(b.trgHeight=b.srcHeight,b.trgWidth=b.srcWidth):c>d?(b.srcHeight=a.height,b.srcWidth=b.srcHeight*d):(b.srcWidth=a.width,b.srcHeight=b.srcWidth/d),b.srcX=(a.width-b.srcWidth)/2,b.srcY=(a.height-b.srcHeight)/2,b},drop:function(){return this.element.classList.remove("dz-drag-hover")},dragstart:g,dragend:function(){return this.element.classList.remove("dz-drag-hover")},dragenter:function(){return this.element.classList.add("dz-drag-hover")},dragover:function(){return this.element.classList.add("dz-drag-hover")},dragleave:function(){return this.element.classList.remove("dz-drag-hover")},paste:g,reset:function(){return this.element.classList.remove("dz-started")},addedfile:function(a){var b,d,e,f,g,h,i,j,k,l,m,n,o;if(this.element===this.previewsContainer&&this.element.classList.add("dz-started"),this.previewsContainer){for(a.previewElement=c.createElement(this.options.previewTemplate.trim()),a.previewTemplate=a.previewElement,this.previewsContainer.appendChild(a.previewElement),l=a.previewElement.querySelectorAll("[data-dz-name]"),f=0,i=l.length;i>f;f++)b=l[f],b.textContent=a.name;for(m=a.previewElement.querySelectorAll("[data-dz-size]"),g=0,j=m.length;j>g;g++)b=m[g],b.innerHTML=this.filesize(a.size);for(this.options.addRemoveLinks&&(a._removeLink=c.createElement('<a class="dz-remove" href="javascript:undefined;" data-dz-remove>'+this.options.dictRemoveFile+"</a>"),a.previewElement.appendChild(a._removeLink)),d=function(b){return function(d){return d.preventDefault(),d.stopPropagation(),a.status===c.UPLOADING?c.confirm(b.options.dictCancelUploadConfirmation,function(){return b.removeFile(a)}):b.options.dictRemoveFileConfirmation?c.confirm(b.options.dictRemoveFileConfirmation,function(){return b.removeFile(a)}):b.removeFile(a)}}(this),n=a.previewElement.querySelectorAll("[data-dz-remove]"),o=[],h=0,k=n.length;k>h;h++)e=n[h],o.push(e.addEventListener("click",d));return o}},removedfile:function(a){var b;return a.previewElement&&null!=(b=a.previewElement)&&b.parentNode.removeChild(a.previewElement),this._updateMaxFilesReachedClass()},thumbnail:function(a,b){var c,d,e,f;if(a.previewElement){for(a.previewElement.classList.remove("dz-file-preview"),f=a.previewElement.querySelectorAll("[data-dz-thumbnail]"),d=0,e=f.length;e>d;d++)c=f[d],c.alt=a.name,c.src=b;return setTimeout(function(){return function(){return a.previewElement.classList.add("dz-image-preview")}}(this),1)}},error:function(a,b){var c,d,e,f,g;if(a.previewElement){for(a.previewElement.classList.add("dz-error"),"String"!=typeof b&&b.error&&(b=b.error),f=a.previewElement.querySelectorAll("[data-dz-errormessage]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.textContent=b);return g}},errormultiple:g,processing:function(a){return a.previewElement&&(a.previewElement.classList.add("dz-processing"),a._removeLink)?a._removeLink.textContent=this.options.dictCancelUpload:void 0},processingmultiple:g,uploadprogress:function(a,b){var c,d,e,f,g;if(a.previewElement){for(f=a.previewElement.querySelectorAll("[data-dz-uploadprogress]"),g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push("PROGRESS"===c.nodeName?c.value=b:c.style.width=""+b+"%");return g}},totaluploadprogress:g,sending:g,sendingmultiple:g,success:function(a){return a.previewElement?a.previewElement.classList.add("dz-success"):void 0},successmultiple:g,canceled:function(a){return this.emit("error",a,"Upload canceled.")},canceledmultiple:g,complete:function(a){return a._removeLink&&(a._removeLink.textContent=this.options.dictRemoveFile),a.previewElement?a.previewElement.classList.add("dz-complete"):void 0},completemultiple:g,maxfilesexceeded:g,maxfilesreached:g,queuecomplete:g,addedfiles:g,previewTemplate:'<div class="dz-preview dz-file-preview">\n  <div class="dz-image"><img data-dz-thumbnail /></div>\n  <div class="dz-details">\n    <div class="dz-size"><span data-dz-size></span></div>\n    <div class="dz-filename"><span data-dz-name></span></div>\n  </div>\n  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\n  <div class="dz-error-message"><span data-dz-errormessage></span></div>\n  <div class="dz-success-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Check</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF" sketch:type="MSShapeGroup"></path>\n      </g>\n    </svg>\n  </div>\n  <div class="dz-error-mark">\n    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">\n      <title>Error</title>\n      <defs></defs>\n      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">\n        <g id="Check-+-Oval-2" sketch:type="MSLayerGroup" stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">\n          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" id="Oval-2" sketch:type="MSShapeGroup"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>'},d=function(){var a,b,c,d,e,f,g;for(d=arguments[0],c=2<=arguments.length?i.call(arguments,1):[],f=0,g=c.length;g>f;f++){b=c[f];for(a in b)e=b[a],d[a]=e}return d},c.prototype.getAcceptedFiles=function(){var a,b,c,d,e;for(d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.accepted&&e.push(a);return e},c.prototype.getRejectedFiles=function(){var a,b,c,d,e;for(d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.accepted||e.push(a);return e},c.prototype.getFilesWithStatus=function(a){var b,c,d,e,f;for(e=this.files,f=[],c=0,d=e.length;d>c;c++)b=e[c],b.status===a&&f.push(b);return f},c.prototype.getQueuedFiles=function(){return this.getFilesWithStatus(c.QUEUED)},c.prototype.getUploadingFiles=function(){return this.getFilesWithStatus(c.UPLOADING)},c.prototype.getAddedFiles=function(){return this.getFilesWithStatus(c.ADDED)},c.prototype.getActiveFiles=function(){var a,b,d,e,f;for(e=this.files,f=[],b=0,d=e.length;d>b;b++)a=e[b],(a.status===c.UPLOADING||a.status===c.QUEUED)&&f.push(a);return f},c.prototype.init=function(){var a,b,d,e,f,g,h;for("form"===this.element.tagName&&this.element.setAttribute("enctype","multipart/form-data"),this.element.classList.contains("dropzone")&&!this.element.querySelector(".dz-message")&&this.element.appendChild(c.createElement('<div class="dz-default dz-message"><span>'+this.options.dictDefaultMessage+"</span></div>")),this.clickableElements.length&&(d=function(a){return function(){return a.hiddenFileInput&&a.hiddenFileInput.parentNode.removeChild(a.hiddenFileInput),a.hiddenFileInput=document.createElement("input"),a.hiddenFileInput.setAttribute("type","file"),(null==a.options.maxFiles||a.options.maxFiles>1)&&a.hiddenFileInput.setAttribute("multiple","multiple"),a.hiddenFileInput.className="dz-hidden-input",null!=a.options.acceptedFiles&&a.hiddenFileInput.setAttribute("accept",a.options.acceptedFiles),null!=a.options.capture&&a.hiddenFileInput.setAttribute("capture",a.options.capture),a.hiddenFileInput.style.visibility="hidden",a.hiddenFileInput.style.position="absolute",a.hiddenFileInput.style.top="0",a.hiddenFileInput.style.left="0",a.hiddenFileInput.style.height="0",a.hiddenFileInput.style.width="0",document.querySelector(a.options.hiddenInputContainer).appendChild(a.hiddenFileInput),a.hiddenFileInput.addEventListener("change",function(){var b,c,e,f;if(c=a.hiddenFileInput.files,c.length)for(e=0,f=c.length;f>e;e++)b=c[e],a.addFile(b);return a.emit("addedfiles",c),d()})}}(this))(),this.URL=null!=(g=window.URL)?g:window.webkitURL,h=this.events,e=0,f=h.length;f>e;e++)a=h[e],this.on(a,this.options[a]);return this.on("uploadprogress",function(a){return function(){return a.updateTotalUploadProgress()}}(this)),this.on("removedfile",function(a){return function(){return a.updateTotalUploadProgress()}}(this)),this.on("canceled",function(a){return function(b){return a.emit("complete",b)}}(this)),this.on("complete",function(a){return function(){return 0===a.getAddedFiles().length&&0===a.getUploadingFiles().length&&0===a.getQueuedFiles().length?setTimeout(function(){return a.emit("queuecomplete")},0):void 0}}(this)),b=function(a){return a.stopPropagation(),a.preventDefault?a.preventDefault():a.returnValue=!1},this.listeners=[{element:this.element,events:{dragstart:function(a){return function(b){return a.emit("dragstart",b)}}(this),dragenter:function(a){return function(c){return b(c),a.emit("dragenter",c)}}(this),dragover:function(a){return function(c){var d;try{d=c.dataTransfer.effectAllowed}catch(e){}return c.dataTransfer.dropEffect="move"===d||"linkMove"===d?"move":"copy",b(c),a.emit("dragover",c)}}(this),dragleave:function(a){return function(b){return a.emit("dragleave",b)}}(this),drop:function(a){return function(c){return b(c),a.drop(c)}}(this),dragend:function(a){return function(b){return a.emit("dragend",b)}}(this)}}],this.clickableElements.forEach(function(a){return function(b){return a.listeners.push({element:b,events:{click:function(d){return(b!==a.element||d.target===a.element||c.elementInside(d.target,a.element.querySelector(".dz-message")))&&a.hiddenFileInput.click(),!0}}})}}(this)),this.enable(),this.options.init.call(this)},c.prototype.destroy=function(){var a;return this.disable(),this.removeAllFiles(!0),(null!=(a=this.hiddenFileInput)?a.parentNode:void 0)&&(this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput),this.hiddenFileInput=null),delete this.element.dropzone,c.instances.splice(c.instances.indexOf(this),1)},c.prototype.updateTotalUploadProgress=function(){var a,b,c,d,e,f,g,h;if(d=0,c=0,a=this.getActiveFiles(),a.length){for(h=this.getActiveFiles(),f=0,g=h.length;g>f;f++)b=h[f],d+=b.upload.bytesSent,c+=b.upload.total;e=100*d/c}else e=100;return this.emit("totaluploadprogress",e,c,d)},c.prototype._getParamName=function(a){return"function"==typeof this.options.paramName?this.options.paramName(a):""+this.options.paramName+(this.options.uploadMultiple?"["+a+"]":"")},c.prototype.getFallbackForm=function(){var a,b,d,e;return(a=this.getExistingFallback())?a:(d='<div class="dz-fallback">',this.options.dictFallbackText&&(d+="<p>"+this.options.dictFallbackText+"</p>"),d+='<input type="file" name="'+this._getParamName(0)+'" '+(this.options.uploadMultiple?'multiple="multiple"':void 0)+' /><input type="submit" value="Upload!"></div>',b=c.createElement(d),"FORM"!==this.element.tagName?(e=c.createElement('<form action="'+this.options.url+'" enctype="multipart/form-data" method="'+this.options.method+'"></form>'),e.appendChild(b)):(this.element.setAttribute("enctype","multipart/form-data"),this.element.setAttribute("method",this.options.method)),null!=e?e:b)},c.prototype.getExistingFallback=function(){var a,b,c,d,e,f;for(b=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)if(b=a[c],/(^| )fallback($| )/.test(b.className))return b},f=["div","form"],d=0,e=f.length;e>d;d++)if(c=f[d],a=b(this.element.getElementsByTagName(c)))return a},c.prototype.setupEventListeners=function(){var a,b,c,d,e,f,g;for(f=this.listeners,g=[],d=0,e=f.length;e>d;d++)a=f[d],g.push(function(){var d,e;d=a.events,e=[];for(b in d)c=d[b],e.push(a.element.addEventListener(b,c,!1));return e}());return g},c.prototype.removeEventListeners=function(){var a,b,c,d,e,f,g;for(f=this.listeners,g=[],d=0,e=f.length;e>d;d++)a=f[d],g.push(function(){var d,e;d=a.events,e=[];for(b in d)c=d[b],e.push(a.element.removeEventListener(b,c,!1));return e}());return g},c.prototype.disable=function(){var a,b,c,d,e;for(this.clickableElements.forEach(function(a){return a.classList.remove("dz-clickable")}),this.removeEventListeners(),d=this.files,e=[],b=0,c=d.length;c>b;b++)a=d[b],e.push(this.cancelUpload(a));return e},c.prototype.enable=function(){return this.clickableElements.forEach(function(a){return a.classList.add("dz-clickable")}),this.setupEventListeners()},c.prototype.filesize=function(a){var b,c,d,e,f,g,h,i;if(d=0,e="b",a>0){for(g=["TB","GB","MB","KB","b"],c=h=0,i=g.length;i>h;c=++h)if(f=g[c],b=Math.pow(this.options.filesizeBase,4-c)/10,a>=b){d=a/Math.pow(this.options.filesizeBase,4-c),e=f;break}d=Math.round(10*d)/10}return"<strong>"+d+"</strong> "+e},c.prototype._updateMaxFilesReachedClass=function(){return null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(this.getAcceptedFiles().length===this.options.maxFiles&&this.emit("maxfilesreached",this.files),this.element.classList.add("dz-max-files-reached")):this.element.classList.remove("dz-max-files-reached")},c.prototype.drop=function(a){var b,c;a.dataTransfer&&(this.emit("drop",a),b=a.dataTransfer.files,this.emit("addedfiles",b),b.length&&(c=a.dataTransfer.items,c&&c.length&&null!=c[0].webkitGetAsEntry?this._addFilesFromItems(c):this.handleFiles(b)))},c.prototype.paste=function(a){var b,c;if(null!=(null!=a&&null!=(c=a.clipboardData)?c.items:void 0))return this.emit("paste",a),b=a.clipboardData.items,b.length?this._addFilesFromItems(b):void 0},c.prototype.handleFiles=function(a){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++)b=a[c],e.push(this.addFile(b));return e},c.prototype._addFilesFromItems=function(a){var b,c,d,e,f;for(f=[],d=0,e=a.length;e>d;d++)c=a[d],f.push(null!=c.webkitGetAsEntry&&(b=c.webkitGetAsEntry())?b.isFile?this.addFile(c.getAsFile()):b.isDirectory?this._addFilesFromDirectory(b,b.name):void 0:null!=c.getAsFile?null==c.kind||"file"===c.kind?this.addFile(c.getAsFile()):void 0:void 0);return f},c.prototype._addFilesFromDirectory=function(a,b){var c,d;return c=a.createReader(),d=function(a){return function(c){var d,e,f;for(e=0,f=c.length;f>e;e++)d=c[e],d.isFile?d.file(function(c){return a.options.ignoreHiddenFiles&&"."===c.name.substring(0,1)?void 0:(c.fullPath=""+b+"/"+c.name,a.addFile(c))}):d.isDirectory&&a._addFilesFromDirectory(d,""+b+"/"+d.name)}}(this),c.readEntries(d,function(a){return"undefined"!=typeof console&&null!==console&&"function"==typeof console.log?console.log(a):void 0})},c.prototype.accept=function(a,b){return a.size>1024*this.options.maxFilesize*1024?b(this.options.dictFileTooBig.replace("{{filesize}}",Math.round(a.size/1024/10.24)/100).replace("{{maxFilesize}}",this.options.maxFilesize)):c.isValidFile(a,this.options.acceptedFiles)?null!=this.options.maxFiles&&this.getAcceptedFiles().length>=this.options.maxFiles?(b(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}",this.options.maxFiles)),this.emit("maxfilesexceeded",a)):this.options.accept.call(this,a,b):b(this.options.dictInvalidFileType)},c.prototype.addFile=function(a){return a.upload={progress:0,total:a.size,bytesSent:0},this.files.push(a),a.status=c.ADDED,this.emit("addedfile",a),this._enqueueThumbnail(a),this.accept(a,function(b){return function(c){return c?(a.accepted=!1,b._errorProcessing([a],c)):(a.accepted=!0,b.options.autoQueue&&b.enqueueFile(a)),b._updateMaxFilesReachedClass()}}(this))},c.prototype.enqueueFiles=function(a){var b,c,d;for(c=0,d=a.length;d>c;c++)b=a[c],this.enqueueFile(b);return null},c.prototype.enqueueFile=function(a){if(a.status!==c.ADDED||a.accepted!==!0)throw new Error("This file can't be queued because it has already been processed or was rejected.");return a.status=c.QUEUED,this.options.autoProcessQueue?setTimeout(function(a){return function(){return a.processQueue()}}(this),0):void 0},c.prototype._thumbnailQueue=[],c.prototype._processingThumbnail=!1,c.prototype._enqueueThumbnail=function(a){return this.options.createImageThumbnails&&a.type.match(/image.*/)&&a.size<=1024*this.options.maxThumbnailFilesize*1024?(this._thumbnailQueue.push(a),setTimeout(function(a){return function(){return a._processThumbnailQueue()}}(this),0)):void 0},c.prototype._processThumbnailQueue=function(){return this._processingThumbnail||0===this._thumbnailQueue.length?void 0:(this._processingThumbnail=!0,this.createThumbnail(this._thumbnailQueue.shift(),function(a){return function(){return a._processingThumbnail=!1,a._processThumbnailQueue()}}(this)))},c.prototype.removeFile=function(a){return a.status===c.UPLOADING&&this.cancelUpload(a),this.files=h(this.files,a),this.emit("removedfile",a),0===this.files.length?this.emit("reset"):void 0},c.prototype.removeAllFiles=function(a){var b,d,e,f;for(null==a&&(a=!1),f=this.files.slice(),d=0,e=f.length;e>d;d++)b=f[d],(b.status!==c.UPLOADING||a)&&this.removeFile(b);return null},c.prototype.createThumbnail=function(a,b){var c;return c=new FileReader,c.onload=function(d){return function(){return"image/svg+xml"===a.type?(d.emit("thumbnail",a,c.result),void(null!=b&&b())):d.createThumbnailFromUrl(a,c.result,b)}}(this),c.readAsDataURL(a)},c.prototype.createThumbnailFromUrl=function(a,b,c,d){var e;return e=document.createElement("img"),d&&(e.crossOrigin=d),e.onload=function(b){return function(){var d,g,h,i,j,k,l,m;return a.width=e.width,a.height=e.height,h=b.options.resize.call(b,a),null==h.trgWidth&&(h.trgWidth=h.optWidth),null==h.trgHeight&&(h.trgHeight=h.optHeight),d=document.createElement("canvas"),g=d.getContext("2d"),d.width=h.trgWidth,d.height=h.trgHeight,f(g,e,null!=(j=h.srcX)?j:0,null!=(k=h.srcY)?k:0,h.srcWidth,h.srcHeight,null!=(l=h.trgX)?l:0,null!=(m=h.trgY)?m:0,h.trgWidth,h.trgHeight),i=d.toDataURL("image/png"),b.emit("thumbnail",a,i),null!=c?c():void 0}}(this),null!=c&&(e.onerror=c),e.src=b},c.prototype.processQueue=function(){var a,b,c,d;if(b=this.options.parallelUploads,c=this.getUploadingFiles().length,a=c,!(c>=b)&&(d=this.getQueuedFiles(),d.length>0)){if(this.options.uploadMultiple)return this.processFiles(d.slice(0,b-c));for(;b>a;){if(!d.length)return;this.processFile(d.shift()),a++}}},c.prototype.processFile=function(a){return this.processFiles([a])},c.prototype.processFiles=function(a){var b,d,e;for(d=0,e=a.length;e>d;d++)b=a[d],b.processing=!0,b.status=c.UPLOADING,this.emit("processing",b);return this.options.uploadMultiple&&this.emit("processingmultiple",a),this.uploadFiles(a)},c.prototype._getFilesWithXhr=function(a){var b,c;return c=function(){var c,d,e,f;for(e=this.files,f=[],c=0,d=e.length;d>c;c++)b=e[c],b.xhr===a&&f.push(b);return f}.call(this)},c.prototype.cancelUpload=function(a){var b,d,e,f,g,h,i;if(a.status===c.UPLOADING){for(d=this._getFilesWithXhr(a.xhr),e=0,g=d.length;g>e;e++)b=d[e],b.status=c.CANCELED;for(a.xhr.abort(),f=0,h=d.length;h>f;f++)b=d[f],this.emit("canceled",b);this.options.uploadMultiple&&this.emit("canceledmultiple",d)}else((i=a.status)===c.ADDED||i===c.QUEUED)&&(a.status=c.CANCELED,this.emit("canceled",a),this.options.uploadMultiple&&this.emit("canceledmultiple",[a]));return this.options.autoProcessQueue?this.processQueue():void 0},e=function(){var a,b;return b=arguments[0],a=2<=arguments.length?i.call(arguments,1):[],"function"==typeof b?b.apply(this,a):b},c.prototype.uploadFile=function(a){return this.uploadFiles([a])},c.prototype.uploadFiles=function(a){var b,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L;for(w=new XMLHttpRequest,x=0,B=a.length;B>x;x++)b=a[x],b.xhr=w;p=e(this.options.method,a),u=e(this.options.url,a),w.open(p,u,!0),w.withCredentials=!!this.options.withCredentials,s=null,g=function(c){return function(){var d,e,f;for(f=[],d=0,e=a.length;e>d;d++)b=a[d],f.push(c._errorProcessing(a,s||c.options.dictResponseError.replace("{{statusCode}}",w.status),w));return f}}(this),t=function(c){return function(d){var e,f,g,h,i,j,k,l,m;if(null!=d)for(f=100*d.loaded/d.total,g=0,j=a.length;j>g;g++)b=a[g],b.upload={progress:f,total:d.total,bytesSent:d.loaded};else{for(e=!0,f=100,h=0,k=a.length;k>h;h++)b=a[h],(100!==b.upload.progress||b.upload.bytesSent!==b.upload.total)&&(e=!1),b.upload.progress=f,b.upload.bytesSent=b.upload.total;if(e)return}for(m=[],i=0,l=a.length;l>i;i++)b=a[i],m.push(c.emit("uploadprogress",b,f,b.upload.bytesSent));return m}}(this),w.onload=function(b){return function(d){var e;if(a[0].status!==c.CANCELED&&4===w.readyState){if(s=w.responseText,w.getResponseHeader("content-type")&&~w.getResponseHeader("content-type").indexOf("application/json"))try{s=JSON.parse(s)}catch(f){d=f,s="Invalid JSON response from server."}return t(),200<=(e=w.status)&&300>e?b._finished(a,s,d):g()}}}(this),w.onerror=function(){return function(){return a[0].status!==c.CANCELED?g():void 0}}(this),r=null!=(G=w.upload)?G:w,r.onprogress=t,j={Accept:"application/json","Cache-Control":"no-cache","X-Requested-With":"XMLHttpRequest"},this.options.headers&&d(j,this.options.headers);for(h in j)i=j[h],i&&w.setRequestHeader(h,i);if(f=new FormData,this.options.params){H=this.options.params;for(o in H)v=H[o],f.append(o,v)}for(y=0,C=a.length;C>y;y++)b=a[y],this.emit("sending",b,w,f);if(this.options.uploadMultiple&&this.emit("sendingmultiple",a,w,f),"FORM"===this.element.tagName)for(I=this.element.querySelectorAll("input, textarea, select, button"),z=0,D=I.length;D>z;z++)if(l=I[z],m=l.getAttribute("name"),n=l.getAttribute("type"),"SELECT"===l.tagName&&l.hasAttribute("multiple"))for(J=l.options,A=0,E=J.length;E>A;A++)q=J[A],q.selected&&f.append(m,q.value);else(!n||"checkbox"!==(K=n.toLowerCase())&&"radio"!==K||l.checked)&&f.append(m,l.value);for(k=F=0,L=a.length-1;L>=0?L>=F:F>=L;k=L>=0?++F:--F)f.append(this._getParamName(k),a[k],a[k].name);return this.submitRequest(w,f,a)},c.prototype.submitRequest=function(a,b){return a.send(b)},c.prototype._finished=function(a,b,d){var e,f,g;for(f=0,g=a.length;g>f;f++)e=a[f],e.status=c.SUCCESS,this.emit("success",e,b,d),this.emit("complete",e);return this.options.uploadMultiple&&(this.emit("successmultiple",a,b,d),this.emit("completemultiple",a)),this.options.autoProcessQueue?this.processQueue():void 0},c.prototype._errorProcessing=function(a,b,d){var e,f,g;for(f=0,g=a.length;g>f;f++)e=a[f],e.status=c.ERROR,this.emit("error",e,b,d),this.emit("complete",e);return this.options.uploadMultiple&&(this.emit("errormultiple",a,b,d),this.emit("completemultiple",a)),this.options.autoProcessQueue?this.processQueue():void 0},c}(b),a.version="4.2.0",a.options={},a.optionsForElement=function(b){return b.getAttribute("id")?a.options[c(b.getAttribute("id"))]:void 0},a.instances=[],a.forElement=function(a){if("string"==typeof a&&(a=document.querySelector(a)),null==(null!=a?a.dropzone:void 0))throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");return a.dropzone},a.autoDiscover=!0,a.discover=function(){var b,c,d,e,f,g;for(document.querySelectorAll?d=document.querySelectorAll(".dropzone"):(d=[],b=function(a){var b,c,e,f;for(f=[],c=0,e=a.length;e>c;c++)b=a[c],f.push(/(^| )dropzone($| )/.test(b.className)?d.push(b):void 0);return f},b(document.getElementsByTagName("div")),b(document.getElementsByTagName("form"))),g=[],e=0,f=d.length;f>e;e++)c=d[e],g.push(a.optionsForElement(c)!==!1?new a(c):void 0);return g},a.blacklistedBrowsers=[/opera.*Macintosh.*version\/12/i],a.isBrowserSupported=function(){var b,c,d,e,f;if(b=!0,window.File&&window.FileReader&&window.FileList&&window.Blob&&window.FormData&&document.querySelector)if("classList"in document.createElement("a"))for(f=a.blacklistedBrowsers,d=0,e=f.length;e>d;d++)c=f[d],c.test(navigator.userAgent)&&(b=!1);else b=!1;else b=!1;return b},h=function(a,b){var c,d,e,f;for(f=[],d=0,e=a.length;e>d;d++)c=a[d],c!==b&&f.push(c);return f},c=function(a){return a.replace(/[\-_](\w)/g,function(a){return a.charAt(1).toUpperCase()})},a.createElement=function(a){var b;return b=document.createElement("div"),b.innerHTML=a,b.childNodes[0]},a.elementInside=function(a,b){if(a===b)return!0;for(;a=a.parentNode;)if(a===b)return!0;return!1},a.getElement=function(a,b){var c;if("string"==typeof a?c=document.querySelector(a):null!=a.nodeType&&(c=a),null==c)throw new Error("Invalid `"+b+"` option provided. Please provide a CSS selector or a plain HTML element.");return c},a.getElements=function(a,b){var c,d,e,f,g,h,i,j;if(a instanceof Array){e=[];try{for(f=0,h=a.length;h>f;f++)d=a[f],e.push(this.getElement(d,b))}catch(k){c=k,e=null}}else if("string"==typeof a)for(e=[],j=document.querySelectorAll(a),g=0,i=j.length;i>g;g++)d=j[g],e.push(d);else null!=a.nodeType&&(e=[a]);if(null==e||!e.length)throw new Error("Invalid `"+b+"` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");return e},a.confirm=function(a,b,c){return window.confirm(a)?b():null!=c?c():void 0},a.isValidFile=function(a,b){var c,d,e,f,g;if(!b)return!0;for(b=b.split(","),d=a.type,c=d.replace(/\/.*$/,""),f=0,g=b.length;g>f;f++)if(e=b[f],e=e.trim(),"."===e.charAt(0)){if(-1!==a.name.toLowerCase().indexOf(e.toLowerCase(),a.name.length-e.length))return!0}else if(/\/\*$/.test(e)){if(c===e.replace(/\/.*$/,""))return!0}else if(d===e)return!0;return!1},"undefined"!=typeof jQuery&&null!==jQuery&&(jQuery.fn.dropzone=function(b){return this.each(function(){return new a(this,b)})}),"undefined"!=typeof module&&null!==module?module.exports=a:window.Dropzone=a,a.ADDED="added",a.QUEUED="queued",a.ACCEPTED=a.QUEUED,a.UPLOADING="uploading",a.PROCESSING=a.UPLOADING,a.CANCELED="canceled",a.ERROR="error",a.SUCCESS="success",e=function(a){var b,c,d,e,f,g,h,i,j,k;
for(h=a.naturalWidth,g=a.naturalHeight,c=document.createElement("canvas"),c.width=1,c.height=g,d=c.getContext("2d"),d.drawImage(a,0,0),e=d.getImageData(0,0,1,g).data,k=0,f=g,i=g;i>k;)b=e[4*(i-1)+3],0===b?f=i:k=i,i=f+k>>1;return j=i/g,0===j?1:j},f=function(a,b,c,d,f,g,h,i,j,k){var l;return l=e(b),a.drawImage(b,c,d,f,g,h,i,j,k/l)},d=function(a,b){var c,d,e,f,g,h,i,j,k;if(e=!1,k=!0,d=a.document,j=d.documentElement,c=d.addEventListener?"addEventListener":"attachEvent",i=d.addEventListener?"removeEventListener":"detachEvent",h=d.addEventListener?"":"on",f=function(c){return"readystatechange"!==c.type||"complete"===d.readyState?(("load"===c.type?a:d)[i](h+c.type,f,!1),!e&&(e=!0)?b.call(a,c.type||c):void 0):void 0},g=function(){var a;try{j.doScroll("left")}catch(b){return a=b,void setTimeout(g,50)}return f("poll")},"complete"!==d.readyState){if(d.createEventObject&&j.doScroll){try{k=!a.frameElement}catch(l){}k&&g()}return d[c](h+"DOMContentLoaded",f,!1),d[c](h+"readystatechange",f,!1),a[c](h+"load",f,!1)}},a._autoDiscoverFunction=function(){return a.autoDiscover?a.discover():void 0},d(window,a._autoDiscoverFunction)}).call(this);
/*! Sortable 1.4.2 - MIT | git://github.com/rubaxa/Sortable.git */
!function(a){"use strict";"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():"undefined"!=typeof Package?Sortable=a():window.Sortable=a()}(function(){"use strict";function a(a,b){if(!a||!a.nodeType||1!==a.nodeType)throw"Sortable: `el` must be HTMLElement, and not "+{}.toString.call(a);this.el=a,this.options=b=r({},b),a[L]=this;var c={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(a.nodeName)?"li":">*",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",ignore:"a, img",filter:null,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1};for(var d in c)!(d in b)&&(b[d]=c[d]);V(b);for(var f in this)"_"===f.charAt(0)&&(this[f]=this[f].bind(this));this.nativeDraggable=b.forceFallback?!1:P,e(a,"mousedown",this._onTapStart),e(a,"touchstart",this._onTapStart),this.nativeDraggable&&(e(a,"dragover",this),e(a,"dragenter",this)),T.push(this._onDragOver),b.store&&this.sort(b.store.get(this))}function b(a){v&&v.state!==a&&(h(v,"display",a?"none":""),!a&&v.state&&w.insertBefore(v,s),v.state=a)}function c(a,b,c){if(a){c=c||N,b=b.split(".");var d=b.shift().toUpperCase(),e=new RegExp("\\s("+b.join("|")+")(?=\\s)","g");do if(">*"===d&&a.parentNode===c||(""===d||a.nodeName.toUpperCase()==d)&&(!b.length||((" "+a.className+" ").match(e)||[]).length==b.length))return a;while(a!==c&&(a=a.parentNode))}return null}function d(a){a.dataTransfer&&(a.dataTransfer.dropEffect="move"),a.preventDefault()}function e(a,b,c){a.addEventListener(b,c,!1)}function f(a,b,c){a.removeEventListener(b,c,!1)}function g(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(K," ").replace(" "+b+" "," ");a.className=(d+(c?" "+b:"")).replace(K," ")}}function h(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return N.defaultView&&N.defaultView.getComputedStyle?c=N.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function i(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;f>e;e++)c(d[e],e);return d}return[]}function j(a,b,c,d,e,f,g){var h=N.createEvent("Event"),i=(a||b[L]).options,j="on"+c.charAt(0).toUpperCase()+c.substr(1);h.initEvent(c,!0,!0),h.to=b,h.from=e||b,h.item=d||b,h.clone=v,h.oldIndex=f,h.newIndex=g,b.dispatchEvent(h),i[j]&&i[j].call(a,h)}function k(a,b,c,d,e,f){var g,h,i=a[L],j=i.options.onMove;return g=N.createEvent("Event"),g.initEvent("move",!0,!0),g.to=b,g.from=a,g.dragged=c,g.draggedRect=d,g.related=e||b,g.relatedRect=f||b.getBoundingClientRect(),a.dispatchEvent(g),j&&(h=j.call(i,g)),h}function l(a){a.draggable=!1}function m(){R=!1}function n(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return(b.clientY-(d.top+d.height)>5||b.clientX-(d.right+d.width)>5)&&c}function o(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function p(a){var b=0;if(!a||!a.parentNode)return-1;for(;a&&(a=a.previousElementSibling);)"TEMPLATE"!==a.nodeName.toUpperCase()&&b++;return b}function q(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,setTimeout(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}function r(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}var s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J={},K=/\s+/g,L="Sortable"+(new Date).getTime(),M=window,N=M.document,O=M.parseInt,P=!!("draggable"in N.createElement("div")),Q=function(a){return a=N.createElement("x"),a.style.cssText="pointer-events:auto","auto"===a.style.pointerEvents}(),R=!1,S=Math.abs,T=([].slice,[]),U=q(function(a,b,c){if(c&&b.scroll){var d,e,f,g,h=b.scrollSensitivity,i=b.scrollSpeed,j=a.clientX,k=a.clientY,l=window.innerWidth,m=window.innerHeight;if(z!==c&&(y=b.scroll,z=c,y===!0)){y=c;do if(y.offsetWidth<y.scrollWidth||y.offsetHeight<y.scrollHeight)break;while(y=y.parentNode)}y&&(d=y,e=y.getBoundingClientRect(),f=(S(e.right-j)<=h)-(S(e.left-j)<=h),g=(S(e.bottom-k)<=h)-(S(e.top-k)<=h)),f||g||(f=(h>=l-j)-(h>=j),g=(h>=m-k)-(h>=k),(f||g)&&(d=M)),(J.vx!==f||J.vy!==g||J.el!==d)&&(J.el=d,J.vx=f,J.vy=g,clearInterval(J.pid),d&&(J.pid=setInterval(function(){d===M?M.scrollTo(M.pageXOffset+f*i,M.pageYOffset+g*i):(g&&(d.scrollTop+=g*i),f&&(d.scrollLeft+=f*i))},24)))}},30),V=function(a){var b=a.group;b&&"object"==typeof b||(b=a.group={name:b}),["pull","put"].forEach(function(a){a in b||(b[a]=!0)}),a.groups=" "+b.name+(b.put.join?" "+b.put.join(" "):"")+" "};return a.prototype={constructor:a,_onTapStart:function(a){var b=this,d=this.el,e=this.options,f=a.type,g=a.touches&&a.touches[0],h=(g||a).target,i=h,k=e.filter;if(!("mousedown"===f&&0!==a.button||e.disabled)&&(h=c(h,e.draggable,d))){if(D=p(h),"function"==typeof k){if(k.call(this,a,h,this))return j(b,i,"filter",h,d,D),void a.preventDefault()}else if(k&&(k=k.split(",").some(function(a){return a=c(i,a.trim(),d),a?(j(b,a,"filter",h,d,D),!0):void 0})))return void a.preventDefault();(!e.handle||c(i,e.handle,d))&&this._prepareDragStart(a,g,h)}},_prepareDragStart:function(a,b,c){var d,f=this,h=f.el,j=f.options,k=h.ownerDocument;c&&!s&&c.parentNode===h&&(G=a,w=h,s=c,t=s.parentNode,x=s.nextSibling,F=j.group,d=function(){f._disableDelayedDrag(),s.draggable=!0,g(s,f.options.chosenClass,!0),f._triggerDragStart(b)},j.ignore.split(",").forEach(function(a){i(s,a.trim(),l)}),e(k,"mouseup",f._onDrop),e(k,"touchend",f._onDrop),e(k,"touchcancel",f._onDrop),j.delay?(e(k,"mouseup",f._disableDelayedDrag),e(k,"touchend",f._disableDelayedDrag),e(k,"touchcancel",f._disableDelayedDrag),e(k,"mousemove",f._disableDelayedDrag),e(k,"touchmove",f._disableDelayedDrag),f._dragStartTimer=setTimeout(d,j.delay)):d())},_disableDelayedDrag:function(){var a=this.el.ownerDocument;clearTimeout(this._dragStartTimer),f(a,"mouseup",this._disableDelayedDrag),f(a,"touchend",this._disableDelayedDrag),f(a,"touchcancel",this._disableDelayedDrag),f(a,"mousemove",this._disableDelayedDrag),f(a,"touchmove",this._disableDelayedDrag)},_triggerDragStart:function(a){a?(G={target:s,clientX:a.clientX,clientY:a.clientY},this._onDragStart(G,"touch")):this.nativeDraggable?(e(s,"dragend",this),e(w,"dragstart",this._onDragStart)):this._onDragStart(G,!0);try{N.selection?N.selection.empty():window.getSelection().removeAllRanges()}catch(b){}},_dragStarted:function(){w&&s&&(g(s,this.options.ghostClass,!0),a.active=this,j(this,w,"start",s,w,D))},_emulateDragOver:function(){if(H){if(this._lastX===H.clientX&&this._lastY===H.clientY)return;this._lastX=H.clientX,this._lastY=H.clientY,Q||h(u,"display","none");var a=N.elementFromPoint(H.clientX,H.clientY),b=a,c=" "+this.options.group.name,d=T.length;if(b)do{if(b[L]&&b[L].options.groups.indexOf(c)>-1){for(;d--;)T[d]({clientX:H.clientX,clientY:H.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);Q||h(u,"display","")}},_onTouchMove:function(b){if(G){a.active||this._dragStarted(),this._appendGhost();var c=b.touches?b.touches[0]:b,d=c.clientX-G.clientX,e=c.clientY-G.clientY,f=b.touches?"translate3d("+d+"px,"+e+"px,0)":"translate("+d+"px,"+e+"px)";I=!0,H=c,h(u,"webkitTransform",f),h(u,"mozTransform",f),h(u,"msTransform",f),h(u,"transform",f),b.preventDefault()}},_appendGhost:function(){if(!u){var a,b=s.getBoundingClientRect(),c=h(s),d=this.options;u=s.cloneNode(!0),g(u,d.ghostClass,!1),g(u,d.fallbackClass,!0),h(u,"top",b.top-O(c.marginTop,10)),h(u,"left",b.left-O(c.marginLeft,10)),h(u,"width",b.width),h(u,"height",b.height),h(u,"opacity","0.8"),h(u,"position","fixed"),h(u,"zIndex","100000"),h(u,"pointerEvents","none"),d.fallbackOnBody&&N.body.appendChild(u)||w.appendChild(u),a=u.getBoundingClientRect(),h(u,"width",2*b.width-a.width),h(u,"height",2*b.height-a.height)}},_onDragStart:function(a,b){var c=a.dataTransfer,d=this.options;this._offUpEvents(),"clone"==F.pull&&(v=s.cloneNode(!0),h(v,"display","none"),w.insertBefore(v,s)),b?("touch"===b?(e(N,"touchmove",this._onTouchMove),e(N,"touchend",this._onDrop),e(N,"touchcancel",this._onDrop)):(e(N,"mousemove",this._onTouchMove),e(N,"mouseup",this._onDrop)),this._loopId=setInterval(this._emulateDragOver,50)):(c&&(c.effectAllowed="move",d.setData&&d.setData.call(this,c,s)),e(N,"drop",this),setTimeout(this._dragStarted,0))},_onDragOver:function(a){var d,e,f,g=this.el,i=this.options,j=i.group,l=j.put,o=F===j,p=i.sort;if(void 0!==a.preventDefault&&(a.preventDefault(),!i.dragoverBubble&&a.stopPropagation()),I=!0,F&&!i.disabled&&(o?p||(f=!w.contains(s)):F.pull&&l&&(F.name===j.name||l.indexOf&&~l.indexOf(F.name)))&&(void 0===a.rootEl||a.rootEl===this.el)){if(U(a,i,this.el),R)return;if(d=c(a.target,i.draggable,g),e=s.getBoundingClientRect(),f)return b(!0),void(v||x?w.insertBefore(s,v||x):p||w.appendChild(s));if(0===g.children.length||g.children[0]===u||g===a.target&&(d=n(g,a))){if(d){if(d.animated)return;r=d.getBoundingClientRect()}b(o),k(w,g,s,e,d,r)!==!1&&(s.contains(g)||(g.appendChild(s),t=g),this._animate(e,s),d&&this._animate(r,d))}else if(d&&!d.animated&&d!==s&&void 0!==d.parentNode[L]){A!==d&&(A=d,B=h(d),C=h(d.parentNode));var q,r=d.getBoundingClientRect(),y=r.right-r.left,z=r.bottom-r.top,D=/left|right|inline/.test(B.cssFloat+B.display)||"flex"==C.display&&0===C["flex-direction"].indexOf("row"),E=d.offsetWidth>s.offsetWidth,G=d.offsetHeight>s.offsetHeight,H=(D?(a.clientX-r.left)/y:(a.clientY-r.top)/z)>.5,J=d.nextElementSibling,K=k(w,g,s,e,d,r);if(K!==!1){if(R=!0,setTimeout(m,30),b(o),1===K||-1===K)q=1===K;else if(D){var M=s.offsetTop,N=d.offsetTop;q=M===N?d.previousElementSibling===s&&!E||H&&E:N>M}else q=J!==s&&!G||H&&G;s.contains(g)||(q&&!J?g.appendChild(s):d.parentNode.insertBefore(s,q?J:d)),t=s.parentNode,this._animate(e,s),this._animate(r,d)}}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();h(b,"transition","none"),h(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,h(b,"transition","all "+c+"ms"),h(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=setTimeout(function(){h(b,"transition",""),h(b,"transform",""),b.animated=!1},c)}},_offUpEvents:function(){var a=this.el.ownerDocument;f(N,"touchmove",this._onTouchMove),f(a,"mouseup",this._onDrop),f(a,"touchend",this._onDrop),f(a,"touchcancel",this._onDrop)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(J.pid),clearTimeout(this._dragStartTimer),f(N,"mousemove",this._onTouchMove),this.nativeDraggable&&(f(N,"drop",this),f(c,"dragstart",this._onDragStart)),this._offUpEvents(),b&&(I&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation()),u&&u.parentNode.removeChild(u),s&&(this.nativeDraggable&&f(s,"dragend",this),l(s),g(s,this.options.ghostClass,!1),g(s,this.options.chosenClass,!1),w!==t?(E=p(s),E>=0&&(j(null,t,"sort",s,w,D,E),j(this,w,"sort",s,w,D,E),j(null,t,"add",s,w,D,E),j(this,w,"remove",s,w,D,E))):(v&&v.parentNode.removeChild(v),s.nextSibling!==x&&(E=p(s),E>=0&&(j(this,w,"update",s,w,D,E),j(this,w,"sort",s,w,D,E)))),a.active&&((null===E||-1===E)&&(E=D),j(this,w,"end",s,w,D,E),this.save())),w=s=t=u=x=v=y=z=G=H=I=E=A=B=F=a.active=null)},handleEvent:function(a){var b=a.type;"dragover"===b||"dragenter"===b?s&&(this._onDragOver(a),d(a)):("drop"===b||"dragend"===b)&&this._onDrop(a)},toArray:function(){for(var a,b=[],d=this.el.children,e=0,f=d.length,g=this.options;f>e;e++)a=d[e],c(a,g.draggable,this.el)&&b.push(a.getAttribute(g.dataIdAttr)||o(a));return b},sort:function(a){var b={},d=this.el;this.toArray().forEach(function(a,e){var f=d.children[e];c(f,this.options.draggable,d)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(d.removeChild(b[a]),d.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return c(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:(c[a]=b,void("group"===a&&V(c)))},destroy:function(){var a=this.el;a[L]=null,f(a,"mousedown",this._onTapStart),f(a,"touchstart",this._onTapStart),this.nativeDraggable&&(f(a,"dragover",this),f(a,"dragenter",this)),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),T.splice(T.indexOf(this._onDragOver),1),this._onDrop(),this.el=a=null}},a.utils={on:e,off:f,css:h,find:i,is:function(a,b){return!!c(a,b,a)},extend:r,throttle:q,closest:c,toggleClass:g,index:p},a.create=function(b,c){return new a(b,c)},a.version="1.4.2",a});
/**
 * Hashedit (#edit) is a simple, web-based editor for static HTML sites. Learn more at hashedit.io. Download from Github at github.com/madoublet/hashedit
 * @author: Matthew Smith
 */
var hashedit = (function () {

    'use strict';

    return {

        // set version
        version: '0.1',

        // set debug messages
        debug: true,

        // set demo mode
        demo: false,

        // pointers to selected elements
        current: {
            node: null,
            container: null,
            element: null,
            image: null
        },

        // handles text selection
        selection: null,

        // configurations
        elementMenu: '<span class="hashedit-move"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g></svg></span></span><span class="hashedit-properties"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg></span></span><span class="hashedit-remove"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g></svg></span></span>',

        framework: 'bootstrap',

        // framework defaults
        frameworkDefaults: {
            'bootstrap': {
                'table': 'table',
                'image': 'img-responsive',
                'code': ''
            }
        },

        // define the menu
        menu: [{
            action: "hashedit.h1",
            selector: "h1",
            title: "H1 Headline",
            display: "H1",
            html: "<h1>Start Typing...</h1>"
        }, {
            action: "hashedit.h2",
            selector: "h2",
            title: "H2 Headline",
            display: "H2",
            html: "<h2>Start Typing...</h2>"
        }, {
            action: "hashedit.h3",
            selector: "h3",
            title: "H3 Headline",
            display: "H3",
            html: "<h3>Start Typing...</h3>"
        }, {
            action: "hashedit.h4",
            selector: "h4",
            title: "H4 Headline",
            display: "H4",
            html: "<h4>Start Typing...</h4>"
        }, {
            action: "hashedit.h5",
            selector: "h5",
            title: "H5 Headline",
            display: "H5",
            html: "<h5>Start Typing...</h5>"
        }, {
            action: "hashedit.p",
            selector: "p",
            title: "Paragraph",
            display: "P",
            html: "<p>Start Typing...</p>"
        }, {
            action: "hashedit.blockquote",
            selector: "blockquote",
            title: "Blockquote",
            display: "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'></path></g></svg>",
            html: "<blockquote></blockquote>"
        }, {
            action: "hashedit.ul",
            selector: "ul",
            title: "Unordered List",
            display: "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12.17c-.74 0-1.33.6-1.33 1.33s.6 1.33 1.33 1.33 1.33-.6 1.33-1.33-.59-1.33-1.33-1.33zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z'></path></g></svg>",
            html: "<ul><li></li></ul>"
        }, {
            action: "hashedit.ol",
            selector: "ol",
            title: "Ordered List",
            display: "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z'></path></g></svg>",
            html: "<ol><li></li></ol>"
        }, {
            action: "hashedit.image",
            selector: "img",
            title: "Image",
            display: "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'></path></g></svg>",
            html: '<img src="images/bridge.png" class="{{framework.image}}">',
            configure: function() {
                hashedit.showImageDialog();
            }
        }, {
            action: "hashedit.table",
            selector: "table",
            title: "Table",
            display: "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z'></path></g></svg>",
            html: '<table class="{{framework.table}}" rows="1" columns="2"><thead><tr><th>Header</th><th>Header</th></tr></thead><tbody><tr><td>Content</td><td>Content</td></tr></tbody></table>',
            configure: function() {
                document.querySelector('#hashedit-table-settings').setAttribute('visible', '');
            },
            change: function(attr, newValue, oldValue) {

                var x, y, rows, curr_rows, columns, curr_columns, toBeAdded, toBeRemoved, table, trs, th, tr, td, tbody;

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

                        console.log('rows, new=' + rows + ', old=' + curr_rows + ', columns=' + columns);

                        if (rows > curr_rows) { // add rows

                            toBeAdded = rows - curr_rows;

                            console.log('rows, tobeadded=' + toBeAdded);

                            // add rows
                            for (y = 0; y < toBeAdded; y += 1) {
                                tr = document.createElement('tr');

                                for (x = 0; x < columns; x += 1) {
                                    td = document.createElement('td');
                                    td.setAttribute('contentEditable', 'true');
                                    td.innerHTML = 'Content';
                                    tr.appendChild(td);
                                }

                                console.log(tbody);

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
        }, {
            action: "hashedit.code",
            selector: "pre",
            title: "Code",
            display: "<svg viewBox='0 0 24 24'  height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'></path></g></svg>",
            html: "<pre>Start adding code</pre>"
        }],

        // stores a mirror of the DOM
        mirror: null,

        // count of new element
        newElementCount: 0,

        // API urls
        authUrl: '/api/auth',
        saveUrl: '/api/pages/save',
        addPageURL: '/api/pages/add',
        pageSettingsURL: '/api/pages/settings',
        retrieveUrl: '/api/pages/retrieve',
        uploadUrl: '/api/images/add',
        imagesListUrl: '/api/images/list',
        pagesListUrl: '/api/pages/list',
        pathListUrl: '/api/pages/path/list',

        // loading indicators
        imagesListLoaded: false,
        pagesListLoaded: false,
        pathListLoaded: false,

        /**
         * Retrieve HTML
         */
        init: function() {

            var x, html, parser, key, doc, els, el;

            // get HTML
            html = '';
            parser = null;

            // set id
            key = window.location.pathname;

            // retrieve the ref HTML from session storage
            if (localStorage.getItem(key) !== null) {
                html = localStorage.getItem(key);

                // start parser
                parser = new DOMParser();

                hashedit.mirror = parser.parseFromString(html, 'text/html');
            } else { // we need to create the annotated [data-ref] html and send it to session storage

                // fetch the html
                fetch(hashedit.retrieveUrl, {
                        credentials: 'include'
                    })
                    .then(function(response) {
                        return response.text();
                    }).then(function(text) {

                        // start parser
                        parser = new DOMParser();

                        // create the mirror
                        doc = parser.parseFromString(text, 'text/html');

                        // remove the first script tag (e.g. #edit load script)
                        els = doc.getElementsByTagName('script');

                        // remove this script
                        el = els[0];
                        el.parentNode.removeChild(el);

                        // get all elements
                        els = doc.getElementsByTagName('*');

                        // add [data-ref] attributes to all DOM elements
                        for (x = 0; x < els.length; x += 1) {
                            els[x].setAttribute('data-ref', x);
                        }

                        // clear localStorage
                        localStorage.clear();

                        // set the HTML in session
                        localStorage.setItem(key, doc.documentElement.innerHTML);

                        // rewrite the URL
                        window.location.href = window.location.href;

                        // reload the page
                        location.reload();

                    });


            }


        },

        /**
         * Adds a hashedit attribute to any selector in the editable array
         */
        setActive: function() {

            var x, els;

            // set hashedit on body
            document.querySelector('body').setAttribute('hashedit-active', '');

            // setup [contentEditable=true]
            els = document.querySelectorAll('[hashedit] p, [hashedit] h1, [hashedit] h2, [hashedit] h3, [hashedit] h4, [hashedit] h5,[hashedit] li, [hashedit] td, [hashedit] th, [hashedit] blockquote, [hashedit] pre');

            for (x = 0; x < els.length; x += 1) {

                // add attribute
                els[x].setAttribute('contentEditable', 'true');

            }

        },

        /**
         * Adds a hashedit-sortable class to any selector in the sortable array, enables sorting
         * @param {Array} sortable
         */
        setupSortable: function(sortable) {

            var x, y, els, div, span, el, item, ref, nextRef, parentRef, obj;

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

                // create element
                div = document.createElement('div');
                div.setAttribute('class', 'hashedit-element');

                // wrap element in div
                hashedit.wrap(div, els[y]);

                // create a handle
                span = document.createElement('span');
                span.setAttribute('class', 'hashedit-move');
                span.innerHTML = '<span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g></svg></span>';

                // append the handle to the wrapper
                div.appendChild(span);

                span = document.createElement('span');
                span.setAttribute('class', 'hashedit-properties');
                span.innerHTML = '<span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg></span>';

                // append the handle to the wrapper
                div.appendChild(span);

                span = document.createElement('span');
                span.setAttribute('class', 'hashedit-remove');
                span.innerHTML = '<span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet"><g><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g></svg></span>';

                // append the handle to the wrapper
                div.appendChild(span);



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

                        ref = item.querySelector(':first-child').getAttribute('data-ref');

                        // get reference of nextSibling or parent
                        if (ref !== undefined) {

                            if (item.nextSibling.querySelector) {
                                nextRef = item.nextSibling.querySelector(':first-child').getAttribute('data-ref');

                                hashedit.moveMirrorElement(ref, nextRef, 'before');
                            } else if (item.parentNode) {
                                parentRef = item.parentNode.getAttribute('data-ref');

                                hashedit.moveMirrorElement(ref, parentRef, 'append');
                            }

                        }

                    }

                });

            }


        },

        /**
         * Create the auth
         */
        showAuth: function() {

            // create a login
            var login = document.createElement('nav');
            login.setAttribute('class', 'hashedit-login');
            login.innerHTML = 'You need to signin to begin editing. <a href="/auth/google">Sign In with Google</a>';

            // append menu
            document.body.appendChild(login);

        },

        /**
         * Create the drawer
         */
        setupDrawer: function() {

            var drawer, desc, meta, x, el, option;

            // create a menu
            drawer = document.createElement('nav');
            drawer.setAttribute('class', 'hashedit-drawer');
            drawer.innerHTML = '<ul><li hashedit-add-page><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></g></svg><a>Add Page</a></li><li hashedit-page-settings><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg><a>Page Settings</a></li></ul>';

            // append menu
            document.body.appendChild(drawer);

            // show add page
            document.querySelector('[hashedit-add-page]').addEventListener('click', function() {

                // hide drawer
                drawer = document.querySelector('.hashedit-drawer');
                drawer.removeAttribute('visible');

                // init url
                document.getElementById('hashedit-add-page-url').value = '';

                // show modal
                document.getElementById('hashedit-add-page').setAttribute('visible', '');

                if (hashedit.pathListLoaded === false) {

                    // load the pages
                    fetch(hashedit.pathListUrl, {
                            credentials: 'include'
                        })
                        .then(function(response) {

                            return response.json();

                        }).then(function(json) {

                            el = document.getElementById('hashedit-add-page-path');

                            for (x = 0; x < json.length; x += 1) {
                                option = document.createElement('option');
                                option.setAttribute('value', json[x]);
                                option.innerHTML = json[x];

                                el.appendChild(option);
                            }

                            hashedit.pathListLoaded = true;

                        }).catch(function(ex) {
                            console.log('parsing failed', ex);
                        });


                }

            });

            // show settings
            document.querySelector('[hashedit-page-settings]').addEventListener('click', function() {

                // hide drawer
                drawer = document.querySelector('.hashedit-drawer');
                drawer.removeAttribute('visible');

                // get description
                desc = '';
                meta = document.querySelector('meta[name="description"]');

                if (meta !== null) {
                    desc = meta.getAttribute('content');
                }

                // set title and description
                document.getElementById('hashedit-page-title').value = document.title;
                document.getElementById('hashedit-page-desc').value = desc;

                console.log(document.getElementById('hashedit-page-settings'));

                // show modal
                document.querySelector('#hashedit-page-settings').setAttribute('visible', '');
            });

        },


        /**
         * Create the menu
         */
        setupMenu: function() {

            var menu, drawer, data, xhr, url;

            // create a menu
            menu = document.createElement('menu');
            menu.setAttribute('class', 'hashedit-menu');
            menu.innerHTML = '<button class="hashedit-more"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g></svg></button><button class="hashedit-save"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" class="style-scope iron-icon"></path></g></svg></button><div class="hashedit-menu-body"></div>';

            // append menu
            document.body.appendChild(menu);

            // toggle drawer
            document.querySelector('.hashedit-more').addEventListener('click', function() {

                drawer = document.querySelector('.hashedit-drawer');

                if (drawer.hasAttribute('visible')) {
                    drawer.removeAttribute('visible');
                } else {
                    drawer.setAttribute('visible', '');
                }

            });

            // save
            document.querySelector('.hashedit-save').addEventListener('click', function() {

                if (hashedit.demo === true) {

                    // alert
                    alert('Cannot save in demo mode :)');

                    // clear localStorage
                    localStorage.clear();

                } else {

                    data = hashedit.retrieveUpdateArray();

                    if (hashedit.saveUrl) {

                        // construct an HTTP request
                        xhr = new XMLHttpRequest();
                        xhr.open('post', hashedit.saveUrl, true);
                        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

                        // send the collected data as JSON
                        xhr.send(JSON.stringify(data));

                        xhr.onloadend = function() {

                            // done
                            localStorage.clear();

                            // redirect without #edit
                            url = hashedit.replaceAll(window.location.href, '#edit', '');

                            // redirect to the URL
                            window.location.href = url;

                        };

                    }

                }


            });

        },

        /**
         * Setup draggable events on menu items
         */
        setupDraggable: function() {

            var x, el, sortable, item, action, html;

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

                // dragging ended
                onEnd: function(evt) {

                    // get item
                    item = evt.item;

                    // get action
                    action = item.getAttribute('data-action');

                    // append html associated with action
                    for (x = 0; x < hashedit.menu.length; x += 1) {
                        if (hashedit.menu[x].action == action) {
                            html = hashedit.menu[x].html;
                            html = hashedit.replaceAll(html, '{{framework.image}}', hashedit.frameworkDefaults[hashedit.framework].image);
                            html = hashedit.replaceAll(html, '{{framework.table}}', hashedit.frameworkDefaults[hashedit.framework].table);
                            html = hashedit.replaceAll(html, '{{framework.code}}', hashedit.frameworkDefaults[hashedit.framework].code);


                            hashedit.append(html);
                        }
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
                        document.querySelector('body').appendChild(wrapper.childNodes[x]);
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

            // walk through plugins
            for (x = 0; x < hashedit.menu.length; x += 1) {

                item = hashedit.menu[x];

                // create a menu item
                a = document.createElement('a');
                a.setAttribute('title', item.title);
                a.setAttribute('data-action', item.action);
                a.innerHTML = item.display;

                // append the child to the menu
                document.querySelector('.hashedit-menu-body').appendChild(a);

            }

            // make the menu draggable
            hashedit.setupDraggable();

        },

        /**
         * Shows the text options
         */
        showTextOptions: function(element) {

            var x, drawer, link, form, fields;

            // set current element, container, and node
            hashedit.current.element = element;
            hashedit.current.container = hashedit.findParentBySelector(element, '.hashedit-element');
            hashedit.current.node = hashedit.current.container.firstChild;

            // hide drawer
            drawer = document.querySelector('.hashedit-drawer');
            drawer.removeAttribute('visible');

            // hide #hashedit-image
            link = document.querySelector('#hashedit-image-settings');
            link.removeAttribute('visible');

            // hide #hashedit-link
            link = document.querySelector('#hashedit-link-settings');
            link.removeAttribute('visible');

            // get #hashedit-config
            form = document.querySelector('#hashedit-text-settings');
            form.setAttribute('visible', '');

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

            var attrs, x, y, key, value, inputs;

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

        },

        /**
         * Setup contentEditable events for the editor
         */
        setupContentEditableEvents: function() {

            var x, y, arr, edits, isEditable, configs, isConfig, el, ref, html, li, parent, els, showProperties, isDefault, removeElement, element;

            // get contentEditable elements
            arr = document.querySelectorAll('body');

            for (x = 0; x < arr.length; x += 1) {

                // delegate CLICK, FOCUS event
                ['click', 'focus'].forEach(function(e) {
                    arr[x].addEventListener(e, function(e) {

                        // determine if the event occurred within a hashedit-lement
                        parent = hashedit.findParentBySelector(e.target, '.hashedit-element');
                        element = null;

                        if (parent !== null) {
                            element = parent.firstChild;
                        }

                        // remove all current elements
                        els = document.querySelectorAll('[current-hashedit-element]');

                        for (y = 0; y < els.length; y += 1) {
                            els[y].removeAttribute('current-hashedit-element');
                        }

                        // set current element
                        if (parent) {
                            parent.setAttribute('current-hashedit-element', 'true');
                        }

                        // check for properties
                        showProperties = false;

                        if (hashedit.findParentBySelector(e.target, '.hashedit-properties') !== null) {
                            showProperties = true;
                        }

                        // remove element
                        removeElement = false;

                        if (hashedit.findParentBySelector(e.target, '.hashedit-remove') !== null) {
                            removeElement = true;
                        }

                        if (removeElement === true) {
                            parent.remove();

                            var ref = element.getAttribute('data-ref');

                            // remove the mirror element
                            if (ref !== null) {
                                hashedit.removeMirrorElement(ref);
                            }
                        } else if (showProperties === true) {

                            hashedit.current.node = element;

                            // bind
                            hashedit.bind();

                            isDefault = true;

                            // see if the element matches a plugin selector
                            for (x = 0; x < hashedit.menu.length; x += 1) {

                                if (parent.firstChild.matches(hashedit.menu[x].selector)) {
                                    if (hashedit.menu[x].configure) {
                                        isDefault = false;
                                        hashedit.menu[x].configure();
                                    }

                                }

                            }

                            if (isDefault === true) {
                                document.getElementById('hashedit-element-settings').setAttribute('visible', 'true');
                            }
                        } else if (e.target.nodeName == 'A') {

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
                        } else if (e.target.nodeName == 'IMG') {
                            hashedit.current.node = e.target;

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
                        } else if (e.target.hasAttribute('contentEditable')) {

                            // shows the text options
                            hashedit.showTextOptions(e.target);

                        } else if (e.target.parentNode.hasAttribute('contentEditable') && e.target.parentNode) {

                            // shows the text options
                            hashedit.showTextOptions(e.target);

                        } else if (e.target.className == 'dz-hidden-input') {
                            // do nothing
                        } else {
                            // hide .hashedit-config, .hashedit-modal
                            configs = document.querySelectorAll('.hashedit-config, .hashedit-modal, .hashedit-menu, .hashedit-drawer');

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
                                if (el.hasAttribute('data-ref')) {
                                    ref = el.getAttribute('data-ref');
                                    html = el.innerHTML;

                                    // set the mirror HTML
                                    hashedit.setMirrorHTML(ref, html);

                                    // set to null
                                    el = null;
                                } else {
                                    el = el.parentNode;
                                }
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

                            }

                            // DELETE key
                            if (e.keyCode === 8) {

                                if (el.nodeName == 'LI') {

                                    if (el.innerHTML === '') {

                                        console.log(el.previousSibling);

                                        if (el.previousSibling !== null) {

                                            parent = el.parentNode;

                                            el.remove();

                                            parent.lastChild.focus();
                                        }

                                        e.preventDefault();
                                        e.stopPropagation();
                                    }

                                }

                            }

                        }


                    });

                });

            }

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

            var x, newNode, node, firstChild, ref, nextRef, parentRef;

            // create a new node
            newNode = document.createElement('div');
            newNode.setAttribute('class', 'hashedit-element');
            newNode.innerHTML = html + hashedit.elementMenu;

            // get existing node
            node = document.querySelector('[hashedit-sortable] [data-action]');

            // if dragged placeholder exists
            if (node !== null) {

                // replace existing node with newNode
                node.parentNode.replaceChild(newNode, node);

                // set editable
                var editable = newNode.querySelectorAll('p, h1, h2, h3, h4, h5, li, td, th, blockquote, pre');

                for (x = 0; x < editable.length; x += 1) {
                    editable[x].setAttribute('contentEditable', 'true');
                }

                // focus on first element
                if (editable.length > 0) {
                    editable[0].focus();

                    // show edit options for the text
                    hashedit.showTextOptions(editable[0]);

                    // select editable contents, #ref: http://bit.ly/1jxd8er
                    hashedit.selectElementContents(editable[0]);
                }

                // increment the new element count
                hashedit.newElementCount = hashedit.newElementCount + 1;

                // get first child of new node
                firstChild = newNode.querySelector(':first-child');

                if (firstChild !== null) {

                    // create ref
                    ref = 'new-' + hashedit.newElementCount;

                    // set ref
                    firstChild.setAttribute('data-ref', ref);
                }

                // create new node in mirror
                if (newNode.nextSibling) {

                    nextRef = newNode.nextSibling.querySelector(':first-child').getAttribute('data-ref');
                    hashedit.insertMirrorElement(ref, nextRef, 'before', html);

                } else if (newNode.parentNode) {

                    parentRef = newNode.parentNode.getAttribute('data-ref');
                    hashedit.insertMirrorElement(ref, parentRef, 'append', html);

                }

            }

            return newNode;

        },

        /**
         * Setup modal events
         */
        setupModalEvents: function() {

            var x, dz, arr, card, list, item, path, url, title, description, params, xhr, value, el;

            // create the dropzone
            dz = new Dropzone("#hashedit-dropzone", {
                url: hashedit.uploadUrl
            });

            dz.on("complete", function(file) {
                dz.removeFile(file);
            });

            dz.on("success", function(file, response) {

                var value = 'images/' + file.name;

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
                card = document.getElementById('hashedit-image-settings');
                card.removeAttribute('hashedit-card-flipped');

            });

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
                        card = document.getElementById('hashedit-image-settings');
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
                        card = document.getElementById('hashedit-link-settings');
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
                        card = document.querySelector('#hashedit-image-settings');

                        if (card.hasAttribute('hashedit-card-flipped')) {
                            card.removeAttribute('hashedit-card-flipped');
                        } else {
                            card.setAttribute('hashedit-card-flipped', 'true');
                        }

                        if (hashedit.imagesListLoaded === false) {

                            // load the images
                            fetch(hashedit.imagesListUrl, {
                                    credentials: 'include'
                                })
                                .then(function(response) {

                                    return response.json();

                                }).then(function(json) {

                                    list = document.getElementById('images-list');
                                    list.innerHTML = '';

                                    for (x = 0; x < json.length; x += 1) {
                                        item = document.createElement('div');
                                        item.setAttribute('class', 'hashedit-list-item');
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

            for (x = 0; x < arr.length; x += 1) {

                // delegate on .hashedit-config
                ['click'].forEach(function(e) {

                    arr[x].addEventListener(e, function(e) {

                        // flip the card
                        card = document.querySelector('#hashedit-link-settings');

                        if (card.hasAttribute('hashedit-card-flipped')) {
                            card.removeAttribute('hashedit-card-flipped');
                        } else {
                            card.setAttribute('hashedit-card-flipped', 'true');
                        }

                        if (hashedit.pagesListLoaded === false) {

                            // load the pages
                            fetch(hashedit.pagesListUrl, {
                                    credentials: 'include'
                                })
                                .then(function(response) {

                                    return response.json();

                                }).then(function(json) {

                                    list = document.getElementById('pages-list');
                                    list.innerHTML = '';

                                    for (x = 0; x < json.length; x += 1) {
                                        item = document.createElement('div');
                                        item.setAttribute('class', 'hashedit-list-item');
                                        item.innerHTML = json[x];
                                        item.setAttribute('data-value', json[x]);

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

            // handle page creation
            document.querySelector('[hashedit-add-page-create]').addEventListener('click', function() {

                // get params
                path = document.getElementById('hashedit-add-page-path').value;
                url = document.getElementById('hashedit-add-page-url').value;
                title = document.getElementById('hashedit-add-page-title').value;
                description = document.getElementById('hashedit-add-page-desc').value;

                // cleanup url
                url = url.trim();

                if(url !== ''){
                    // cleanup url
                    url = hashedit.replaceAll(url, '.html', '');
                    url = hashedit.replaceAll(url, '.htm', '');
                    url = hashedit.replaceAll(url, '.', '-');
                    url = hashedit.replaceAll(url, ' ', '-');
                    url = hashedit.replaceAll(url, '/', '-');

                    // append path to url
                    url = path + '/' + url + '.html';

                    // fix duplicates
                    url = hashedit.replaceAll(url, '//', '/');

                    // set params
                    params = {
                        'url': url,
                        'title': title,
                        'description': description
                    };

                    if (hashedit.addPageURL) {

                        // construct an HTTP request
                        xhr = new XMLHttpRequest();
                        xhr.open('post', hashedit.addPageURL, true);
                        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

                        // send the collected data as JSON
                        xhr.send(JSON.stringify(params));

                        xhr.onloadend = function() {

                            // hide modal
                            document.getElementById('hashedit-add-page').removeAttribute('visible');

                            // log success
                            console.log('success');

                        };

                    }
                }
                else{
                    alert('URL required'); // cleanup
                }

            });
        },

        /**
         * Setup configuration events
         */
        setupConfigEvents: function() {

            var x, arr, el, configs, ref, model, value, attr, parts, style;

            // setup config events
            arr = document.querySelectorAll('.hashedit-config, .hashedit-modal');

            for (x = 0; x < arr.length; x += 1) {

                // delegate on .hashedit-config
                ['propertychange', 'change', 'click', 'keyup', 'input', 'paste'].forEach(function(e) {

                    arr[x].addEventListener(e, function(e) {

                        el = e.target;

                        if (el.hasAttribute('hashedit-cancel-modal')) {

                            // hide .hashedit-config, .hashedit-modal
                            configs = document.querySelectorAll('.hashedit-modal');

                            for (x = 0; x < configs.length; x += 1) {
                                configs[x].removeAttribute('visible');
                            }

                        }

                        // look for [data-model]
                        if (el.hasAttribute('data-model')) {

                            if (hashedit.current.node !== null) {
                                ref = hashedit.current.node.getAttribute('data-ref');
                            }
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

                                    // get currentValue
                                    var old = hashedit.current.node.getAttribute(attr);

                                    // set attribute
                                    hashedit.current.node.setAttribute(attr, value);

                                    // set mirror attribute
                                    hashedit.setMirrorAttribute(ref, attr, value);

                                    // create text style
                                    style = hashedit.createTextStyle(hashedit.current.node);

                                    hashedit.current.node.setAttribute('style', style);

                                    // call change event
                                    for (x = 0; x < hashedit.menu.length; x += 1) {

                                        if (hashedit.current.node.matches(hashedit.menu[x].selector)) {
                                            if (hashedit.menu[x].configure) {
                                                hashedit.menu[x].change(attr, value, old);
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

                                    // fire event
                                    hashedit.current.node.dispatchEvent(new Event('input', {
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

                                    // get ref from image
                                    ref = hashedit.current.node.getAttribute('data-ref');

                                    // set attribute
                                    hashedit.current.node.setAttribute(attr, value);
                                    hashedit.setMirrorAttribute(ref, attr, value);

                                    // fire event
                                    if (hashedit.current.node !== null) {
                                        hashedit.current.node.dispatchEvent(new Event('input', {
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

                        if (el.nodeName == 'SVG') {
                            el = el.parentNode;
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
                            } else if (action == 'hashedit.text.link') {

                                // add link html
                                text = hashedit.getSelectedText();
                                html = '<a>' + text + '</a>';

                                document.execCommand("insertHTML", false, html);

                                // shows/manages the link dialog
                                hashedit.showLinkDialog();

                                return false;
                            } else if (action == 'hashedit.text.code') {

                                // create code html
                                text = hashedit.getSelectedText();
                                html = '<code>' + text + '</code>';

                                document.execCommand("insertHTML", false, html);
                                return false;
                            } else if (action == 'hashedit.text.alignLeft') {
                                input = document.querySelector('.hashedit-modal [data-model="node.class"]');

                                // clear existing alignments
                                value = input.value;

                                value = hashedit.replaceAll(value, 'text-center', '');
                                value = hashedit.replaceAll(value, 'text-left', '');
                                value = hashedit.replaceAll(value, 'text-right', '');
                                value += ' text-left';

                                // update value and trigger change
                                input.value = value.trim();

                                // fire event
                                input.dispatchEvent(new Event('change', {
                                    'bubbles': true
                                }));

                                return false;
                            } else if (action == 'hashedit.text.alignRight') {
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
                            } else if (action == 'hashedit.text.alignCenter') {
                                input = document.querySelector('.hashedit-modal [data-model="node.class"]');

                                // clear existing alignments
                                value = input.value;

                                value = hashedit.replaceAll(value, 'text-center', '');
                                value = hashedit.replaceAll(value, 'text-left', '');
                                value = hashedit.replaceAll(value, 'text-right', '');
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
                link = document.querySelector('#hashedit-link-settings');
                link.setAttribute('visible', '');

                // sets start values
                document.getElementById('hashedit-link-id').value = id;
                document.getElementById('hashedit-link-cssclass').value = cssClass;
                document.getElementById('hashedit-link-href').value = href;
                document.getElementById('hashedit-link-target').value = target;
                document.getElementById('hashedit-link-title').value = title;

            }

        },

        /**
         * Sets up the images dialog
         */
        showImageDialog: function() {

            var id, cssClass, src, target, link;

            // populate link values
            if (hashedit.current.node !== null) {

                // get  attributes
                id = hashedit.current.node.getAttribute('id') || '';
                cssClass = hashedit.current.node.getAttribute('class') || '';
                src = hashedit.current.node.getAttribute('src') || '';
                target = hashedit.current.node.getAttribute('target') || '';

                // show the link dialog
                link = document.querySelector('#hashedit-image-settings');
                link.setAttribute('visible', '');

                // sets start values
                document.getElementById('hashedit-image-id').value = id;
                document.getElementById('hashedit-image-cssclass').value = cssClass;
                document.getElementById('hashedit-image-src').value = src;
                document.getElementById('hashedit-image-target').value = target;

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
            } else if (document.selection && document.selection.type != "Control") {
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
                style += 'text-shadow: ' + textShadowHorizontal + ' ' + textShadowVertical + ' ' + textShadowBlur + ' ' + textShadowColor + ';';
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
         * Retrieve HTML
         */
        retrieveHTML: function() {

            return hashedit.mirror.documentElement.outerHTML;

        },

        /**
         * Retrieve changes
         */
        retrieveUpdateArray: function() {

            var x, y, data, els, el, refs;

            els = hashedit.mirror.documentElement.querySelectorAll('[hashedit]');
            data = [];

            for (x = 0; x < els.length; x += 1) {

                // remove refs
                refs = els[x].querySelectorAll('[data-ref]');

                for (y = 0; y < refs.length; y += 1) {
                    refs[y].removeAttribute('data-ref');
                }

                el = {
                    'selector': els[x].getAttribute('hashedit-selector'),
                    'html': els[x].innerHTML
                };
                data.push(el);
            }

            return data;

        },

        /**
         * Removes the mirror element
         */
        removeMirrorElement: function(ref) {

            var node;

            node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
            node.remove();

        },

        /**
         * Update the mirror HTML based on an edit
         */
        setMirrorHTML: function(ref, html) {

            var node;

            node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
            node.innerHTML = html;

        },

        /**
         * Sets the attribute of a mirror value
         * @param {String} ref
         * @param {String} attr
         * @param {String} value
         */
        setMirrorAttribute: function(ref, attr, value) {

            var node;

            node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
            node.setAttribute(attr, value);

        },

        /**
         * Moves an element in the mirror HTML based on drag & drop
         * @param {String} ref
         * @param {String} toRef
         * @param {String} method - before, append
         */
        moveMirrorElement: function(ref, toRef, method) {

            console.log('ref=' + ref + ' toRef=' + toRef + ' method=' + method);

            var node, to, parent;

            if (hashedit.debug === true) {
                console.log('[hashedit.moveMirrorElement] ref=' + ref + ' toref=' + toRef + ' method=' + method);
            }

            node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
            to = hashedit.mirror.querySelector('[data-ref="' + toRef + '"]');

            // setup parentNode
            if (to !== null) {

                parent = to.parentNode;

                // insert into DOM
                if (method == 'before') {
                    parent.insertBefore(node, to);
                } else if (method == 'append') {
                    to.appendChild(node);
                }

            }

        },

        /**
         * Creates a new mirror element
         * @param {String} ref
         * @param {String} toRef
         * @param {String} method - before, append
         * @param {String} html - before, append
         */
        insertMirrorElement: function(ref, toRef, method, html) {

            var div, node, to, parent;

            if (hashedit.debug === true) {
                console.log('[hashedit.insertMirrorElement] ref=' + ref + ' toref=' + toRef + ' method=' + method);
            }

            // create a div to wrap the new node
            div = document.createElement('div');
            div.innerHTML = html;

            // get the new node and add the ref
            node = div.firstChild;
            node.setAttribute('data-ref', ref);

            // get the to element
            to = hashedit.mirror.querySelector('[data-ref="' + toRef + '"]');
            parent = to.parentNode;

            // insert into DOM
            if (method == 'before') {
                parent.insertBefore(node, to);
            } else if (method == 'append') {
                to.appendChild(node);
            }

        },

        /**
         * Setup the editor
         * @param {Array} config.sortable
         */
        setup: function(config) {

            console.log('Hashedit version: ' + hashedit.version);

            // check auth
            if (config.demo === true) {

                hashedit.demo = true;

                // init hashedit
                hashedit.init();
                hashedit.setActive();
                hashedit.setupSortable(config.sortable);
                hashedit.setupContentEditableEvents();
                hashedit.setupMenu(config.path);
                hashedit.setupDrawer();
                hashedit.createMenu(config.path);
                hashedit.loadHTML(config.path);

            } else {
                fetch(hashedit.authUrl, {
                        credentials: 'include'
                    })
                    .then(function(response) {

                        if (response.status !== 200) {

                            // show authorization
                            hashedit.showAuth();

                        } else {

                            // init hashedit
                            hashedit.init();
                            hashedit.setActive();
                            hashedit.setupSortable(config.sortable);
                            hashedit.setupContentEditableEvents();
                            hashedit.setupMenu(config.path);
                            hashedit.setupDrawer();
                            hashedit.createMenu(config.path);
                            hashedit.loadHTML(config.path);

                        }

                    });
            }

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
        }
    };

}());