/**
 * Hashedit (#edit) is a simple, web-based editor for static HTML sites. Learn more at hashedit.io. Download from Github at github.com/madoublet/hashedit
 * @author: Matthew Smith
 */	
"use strict";
 
var hashedit = {

	// set debug messages
	debug: true,
	
	// pointers to selected elements
	currNode: null,
	currConfig: null,
	
	// function to save
	save: null,
	
	// handles text selection
	selection: null,
	
	// configurations
	elementMenu: '<span class="hashedit-move"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g></svg></span></span>',
	
	// stores a mirror of the DOM
	mirror: null,
	
	// count of new element
	newElementCount: 0,
	
	/**
	 * Retrieve HTML
	 */
	init: function(url){
	
		// get HTML
		var html = '';
		
		// set id
		var key = window.location.href;
	
		// retrieve the ref HTML from session storage
		if(localStorage.getItem(key) != null){
			html = localStorage.getItem(key);
			
			// start parser
			var parser = new DOMParser();
			
			hashedit.mirror = parser.parseFromString(html, 'text/html');
		}
		else{ // we need to create the annotated [data-ref] html and send it to session storage
		
			// fetch the html
			fetch(url)
			  .then(function(response) {
			    return response.text();
			  }).then(function(text) { 
			  
			 	 // start parser
				var parser = new DOMParser();
				
				// create the mirror
				var doc = parser.parseFromString(text, 'text/html');
			
				// remove the first script tag (e.g. #edit load script)
				var els = doc.getElementsByTagName('script');
				
				// remove this script
				var el = els[0];
				el.parentNode.removeChild(el);
				
				// get all elements
				var els = doc.getElementsByTagName('*');
				
				// add [data-ref] attributes to all DOM elements
				for(var x=0; x<els.length; x++){
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
	setActive: function(){
	
		// set hashedit on body		
		document.querySelector('body').setAttribute('hashedit', '');
		
		// setup [contentEditable=true]
		var els = document.querySelectorAll('p, h1, h2, h3, h4, h5, li, td, th, blockquote');
		
		for(var x=0; x < els.length; x++){
			
			// add attribute
			els[x].setAttribute('contentEditable', 'true');
			
		}
		
	},

	/**
	 * Adds a hashedit-sortable class to any selector in the sortable array, enables sorting
	 * @param {Array} sortable
	 */
	setupSortable: function(sortable){
	
		// walk through sortable clases
		for(var x=0; x<sortable.length; x++){
		
			// setup sortable classes
			var els = document.querySelectorAll('[hashedit] ' + sortable[x]);
			
			// set [data-hashedit-sortable=true]
			for(var x=0; x < els.length; x++){
				
				// add attribute
				els[x].setAttribute('hashedit-sortable', '');
				
			}
			
		}
		
		// wrap elements in the sortable class
		var els = document.querySelectorAll('[hashedit-sortable] > *');
		
		// wrap editable items
		for(var y = 0; y < els.length; y++){
			
			// create element
			var div = document.createElement('div');
			div.setAttribute('class', 'hashedit-element');
			
			// wrap element in div
			div.wrap(els[y]);
			
			// create a handle
			var span = document.createElement('span');
			span.setAttribute('class', 'hashedit-move');
			span.innerHTML = '<span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g></svg></span>';
			
			// append the handle to the wrapper
			div.appendChild(span);
			
		}
		
		// get all sortable elements
		var els = document.querySelectorAll('[hashedit] [hashedit-sortable]');
	
		// walk through elements
		for(var x=0; x<els.length; x++){
		
			var el = els[x];
		
			var sortable = new Sortable(el, {
			    group: "hashedit-sortable",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
			    sort: true,  // sorting inside list
			    delay: 0, // time in milliseconds to define when the sorting should start
			    disabled: false, // Disables the sortable if set to true.
			    store: null,  // @see Store
			    animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
			    handle: ".hashedit-move",  // Drag handle selector within list items
			    ghostClass: "hashedit-highlight",  // Class name for the drop placeholder
			
			    scroll: true, // or HTMLElement
			    scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
			    scrollSpeed: 10, // px
			
			    // dragging ended
			    onEnd: function (evt) {
			    
			    	// get item
			    	var item = evt.item;
			    	
			    	var ref = item.querySelector(':first-child').getAttribute('data-ref');
			    
					// get reference of nextSibling or parent
			        if(ref != undefined){
			        
			        	if(item.nextSibling){
				        	var nextRef = item.nextSibling.querySelector(':first-child').getAttribute('data-ref');
				        	
				        	hashedit.moveMirrorElement(ref, nextRef, 'before');
			        	}
			        	else if(item.parentNode){
				        	var parentRef = item.parentNode.getAttribute('data-ref');
				        	
				        	hashedit.moveMirrorElement(ref, parentRef, 'append');
			        	}
			        	
					}
					
			    }
			    
			});
			
		}
		
		
	},
	
	/**
	 * Create the menu
	 */
	setupMenu: function(path){
	
		// create a menu
		var menu = document.createElement('menu');
		menu.setAttribute('class', 'hashedit-menu');
		menu.innerHTML = '<button class="hashedit-save"><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></g></svg></button>';
		
		// append menu
		document.body.appendChild(menu);
		
		// create click event
		document.querySelector('.hashedit-menu .hashedit-save').addEventListener('click', function(){
			var html = hashedit.retrieveHTML();
			
			if(hashedit.save){
				hashedit.save(html);
			}
		});
		
	},
	
	/**
	 * Setup draggable events on menu items
	 */
	setupDraggable: function(){
	
		// setup sortable on the menu
		var el = document.querySelector('.hashedit-menu');
		
		var sortable = new Sortable(el, {
		    group: {
				name: 'hashedit-sortable',
				pull: 'clone',
				put: false
			},
			draggable: 'a',
		    sort: false,  // sorting inside list
		    delay: 0, // time in milliseconds to define when the sorting should start
		    disabled: false, // Disables the sortable if set to true.
		    animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
		    ghostClass: "hashedit-highlight",  // Class name for the drop placeholder
		
		    scroll: true, // or HTMLElement
		    scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
		    scrollSpeed: 10, // px
		
		    // dragging ended
		    onEnd: function (evt) {
		    
		    	// get item
		    	var item = evt.item;
		    	
		    	// execute action
		    	var action = item.getAttribute('data-action') + '.create';
		    	
				hashedit.executeFunctionByName(action, window);
				
				return false;
				
		    }
		});		
	},
	
	/**
	 * Load html from html/* into the aside
	 */
	loadHTML: function(path){
	
		// create aside
		var aside = document.createElement('aside');
		aside.setAttribute('class', 'hashedit-config');
		
		document.body.appendChild(aside);
	
		// fetch the config
		fetch(path + 'html/config.html')
		  .then(function(response) {
		    return response.text();
		  }).then(function(text) { 
		  
		  	var div = document.createElement('div');
		  	div.setAttribute('class', 'config');
		  	div.innerHTML = text;
		  	
		  	document.querySelector('.hashedit-config').appendChild(div);
		  	
			hashedit.setupConfigEvents();
		  });

		// fetch the config
		fetch(path + 'html/link.html')
		  .then(function(response) {
		    return response.text();
		  }).then(function(text) { 
		  
		  	var div = document.createElement('div');
		  	div.setAttribute('class', 'link');
		  	div.innerHTML = text;
		  	
		  	document.querySelector('.hashedit-config').appendChild(div);
		  	
			hashedit.setupConfigEvents();
		  });
		 
	},
	
	/**
	 * Create menu
	 */
	createMenu: function(path){
	
		// walk through plugins
		for(var x=0; x < hashedit.menu.length; x++){
		
			var item = hashedit.menu[x];
			
			// create a menu item
			var a = document.createElement('a');
			a.setAttribute('title', item.title);
			a.setAttribute('data-action', item.action);
			a.innerHTML = item.display;
			
			// append hte child to the menu
			document.querySelector('.hashedit-menu').appendChild(a);
			
		}
		
		// make the menu draggable
		hashedit.setupDraggable();
		
	},
	
	/**
	 * Setup contentEditable events for the editor
	 */
	setupContentEditableEvents: function(){
		
		// get contentEditable elements
		var arr = document.querySelectorAll('[hashedit]');
		
		for(var x=0; x<arr.length; x++){
		
			// delegate CLICK, FOCUS event
			['click', 'focus'].forEach(function(e){
		    	arr[x].addEventListener(e, function(e){
		    	
		    		if(e.target.nodeName == 'A'){
			    		hashedit.showLinkDialog();
		    		}
		    		
			    	if(e.target.hasAttribute('contentEditable')){
			    	
			    		// set current node
			    		hashedit.currNode = e.target;
			    		
			    		// hide link
			    		var link = document.querySelector('.hashedit-config .link');
					    link.removeAttribute('visible');
			    		
			    		// get .config
			    		var form = document.querySelector('.hashedit-config .config');
				    	form.setAttribute('visible', '');
				    		
				    	// clear form fields
				    	var fields = document.querySelectorAll('[data-model]');
				    	
				    	for(var x=0; x<fields.length; x++){
					    	if(fields[x].nodeType == 'SELECT'){
						    	fields[x].selectedIndex = 0;
					    	}
					    	else{
						    	fields[x].value = '';
					    	}
				    	}
				    	
				    	// get attributes
				    	var attrs = hashedit.currNode.attributes;
				    	
				    	for(var x=0; x<attrs.length; x++){
					    	
					    	// get key and value
					    	var key = attrs[x].nodeName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
							var value = attrs[x].nodeValue;
							
							// if is numeric
							if(!isNaN(parseFloat(value)) && isFinite(value)){
								value = parseFloat(value);
							}
							
							// set value
							var input = form.querySelector('[data-model="node.' + key + '"]');
							
							if(input != null){
								input.value = value;
							}
							
				    	}
				    	
				    }
					    
				});
				    
			});
				
			// delegate INPUT event
			['input'].forEach(function(e){
		    	arr[x].addEventListener(e, function(e){
			    	
			    	if(e.target.hasAttribute('contentEditable')){
			    	
			    		var el = e.target;
			    		
						var ref = el.getAttribute('data-ref');
			    		var html = el.innerHTML;
			    								
						// set the mirror HTML
						hashedit.setMirrorHTML(ref, html);
						
				    }
			    		
			    	
			    });
				    
			});

		}
		
	},
	
	/**
	 * Appends items to the editor
	 */
	append: function(html){ 
	
		// create a new node
		var newNode = document.createElement('div');
		newNode.setAttribute('class', 'hashedit-element');
		newNode.innerHTML = html + hashedit.elementMenu;
	
		// get existing node		
		var node = document.querySelector('[hashedit-sortable] [data-action]');
	
		// if dragged placeholder exists
		if(node != null){
		
			// replace existing node with newNode
			node.parentNode.replaceChild(newNode, node);
			
			// set editable
			var editable = newNode.querySelectorAll('p, h1, h2, h3, h4, h5, li, td, th, blockquote');
			
			for(var x=0; x<editable.length; x++){
				editable[x].setAttribute('contentEditable', 'true');
			}
			
			// focus on first element
			if(editable.length > 0){
				editable[0].focus();
			}
			
			// increment the new element count
			hashedit.newElementCount = hashedit.newElementCount + 1;
			
			// get first child of new node
			var firstChild = newNode.querySelector(':first-child');
			
			if(firstChild != null){
				
				// create ref
				var ref = 'new-' + hashedit.newElementCount;
				
				// set ref
				firstChild.setAttribute('data-ref', ref);
			}
			
			// create new node in mirror			
			if(newNode.nextSibling){
			
				var nextRef = newNode.nextSibling.querySelector(':first-child').getAttribute('data-ref');
				hashedit.insertMirrorElement(ref, nextRef, 'before', html);
			
			}
			else if(newNode.parentNode){
			
				var parentRef = newNode.parentNode.getAttribute('data-ref');
				hashedit.insertMirrorElement(ref, parentRef, 'append', html);
				
			}
			
		}
	
	},
	
	/**
	 * Setup configuration events
	 */
	setupConfigEvents: function(){
		
		var arr = document.querySelectorAll('.hashedit-config');
		
		for(var x = 0; x < arr.length; x++){
			
			// delegate on .hashedit-config
			['propertychange', 'change', 'click', 'keyup', 'input', 'paste'].forEach(function(e){
			
		    	arr[x].addEventListener(e, function(e){
			    	
			    	var el = e.target;
			    	
			    	// look for [data-model]
			    	if(el.hasAttribute('data-model')){
			    	
				    	var ref = hashedit.currNode.getAttribute('data-ref');
						var model = el.getAttribute('data-model');
						var value = '';
						var attr = '';
						
						value = el.value;
						
						if(model.indexOf('node.') != -1){
							var parts = model.split('.');
							
							// converts camelcase to hyphens, sets attribute
							if(parts.length > 1){
							
								// get property
								attr = parts[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
								
								// set attribute
								hashedit.currNode.setAttribute(attr, value);
								
								// set mirror attribute
								hashedit.setMirrorAttribute(ref, attr, value);
								
								var style = hashedit.createTextStyle(hashedit.currNode);
								
								hashedit.currNode.setAttribute('style', style);
							}
						}
						
						if(model.indexOf('link.') != -1){
							var parts = model.split('.');
							
							// converts camelcase to hyphens, sets attribute
							if(parts.length > 1){
							
								// get property
								attr = parts[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
								
								// set attribute
								hashedit.currLink.setAttribute(attr, value);
								
								// fire event
								hashedit.currNode.dispatchEvent(new Event('input', { 'bubbles': true }));
								
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
	setupTextEvents: function(){
	
		var arr = document.querySelectorAll('.hashedit-config');
		
		for(var x = 0; x < arr.length; x++){
			
			// delegate on .hashedit-config
			['mousedown', 'touchstart'].forEach(function(e){
			
		    	arr[x].addEventListener(e, function(e){
			    	
			    	var el = e.target;
			    	
			    	if(el.nodeName == 'I'){
				    	el = el.parentNode;
			    	}
			    	
			    	// look for [data-model]
			    	if(el.hasAttribute('data-action')){
			    	
			    		var action = el.getAttribute('data-action');
			    		    		
			    		if(action == 'hashedit.text.bold'){
				    		document.execCommand("Bold", false, null);
							return false;
			    		}
			    		else if(action == 'hashedit.text.italic'){
				    		document.execCommand("Italic", false, null);
							return false;
			    		}
			    		else if(action == 'hashedit.text.strike'){
				    		document.execCommand("strikeThrough", false, null);
							return false;
			    		}
			    		else if(action == 'hashedit.text.subscript'){
				    		document.execCommand("subscript", false, null);
							return false;
			    		}
			    		else if(action == 'hashedit.text.superscript'){
				    		document.execCommand("superscript", false, null);
							return false;
			    		}
			    		else if(action == 'hashedit.text.underline'){
				    		document.execCommand("underline", false, null);
							return false;
			    		}
			    		else if(action == 'hashedit.text.link'){
			    			
			    			// add link html
			    			var text = hashedit.getSelectedText();
							var html = '<a>'+text+'</a>';
							
							document.execCommand("insertHTML", false, html);
			    		
							// shows/manages the link dialog
							hashedit.showLinkDialog();
							
							return false;
			    		}
			    		else if(action == 'hashedit.text.code'){
			    		
			    			// create code html
				    		var text = hashedit.getSelectedText();
							var html = '<code>'+text+'</code>';
							
							document.execCommand("insertHTML", false, html);
							return false;
			    		}
			    		else if(action == 'hashedit.text.alignLeft'){
				    		var input = document.querySelector('.hashedit-config [data-model="node.class"]');
			
							// clear existing alignments
							var value = input.value;
							
							value = hashedit.replaceAll(value, 'text-center', '');
							value = hashedit.replaceAll(value, 'text-left', '');
							value = hashedit.replaceAll(value, 'text-right', '');
							value += ' text-left'
							
							// update value and trigger change
							input.value = value.trim();
							
							// fire event
							input.dispatchEvent(new Event('change', { 'bubbles': true }));
							
							return false;
			    		}
			    		else if(action == 'hashedit.text.alignRight'){
				    		var input = document.querySelector('.hashedit-config [data-model="node.class"]');
			
							// clear existing alignments
							var value = input.value;
							
							value = hashedit.replaceAll(value, 'text-center', '');
							value = hashedit.replaceAll(value, 'text-left', '');
							value = hashedit.replaceAll(value, 'text-right', '');
							value += ' text-right'
							
							// update value and trigger change
							input.value = value.trim();
							
							// fire event
							input.dispatchEvent(new Event('change', { 'bubbles': true }));
							
							return false;
			    		}
			    		else if(action == 'hashedit.text.alignCenter'){
				    		var input = document.querySelector('.hashedit-config [data-model="node.class"]');
			
							// clear existing alignments
							var value = input.value;
							
							value = hashedit.replaceAll(value, 'text-center', '');
							value = hashedit.replaceAll(value, 'text-left', '');
							value = hashedit.replaceAll(value, 'text-right', '');
							value += ' text-center'
							
							// update value and trigger change
							input.value = value.trim();
							
							// fire event
							input.dispatchEvent(new Event('change', { 'bubbles': true }));
							
							return false;
			    		}
			    		else if(action == 'hashedit.text.undo'){
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
	showLinkDialog: function(){
	
		// get selected link
		hashedit.currLink = hashedit.getLinkFromSelection();
		
		// populate link values
		if(hashedit.currLink != null){
		
			// get  attributes
			var id = hashedit.currLink.getAttribute('id');
			var cssClass = hashedit.currLink.getAttribute('class');
			var href = hashedit.currLink.getAttribute('href');
			var target = hashedit.currLink.getAttribute('target');
			var title = hashedit.currLink.getAttribute('title');
		
			// show the link dialog
			var link = document.querySelector('.hashedit-config .link');
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
	 * Executes a function by its name and applies arguments
	 * @param {String} functionName
	 * @param {String} context
	 */
	executeFunctionByName: function(functionName, context /*, args */) {
	
		var args = [].slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		
		var func = namespaces.pop();
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		
		return context[func].apply(this, args);
	},
	
	/**
	 * Retrieves selected text
	 */
	getSelectedText:function(){

		var text = "";
	    if(window.getSelection) {
	        text = window.getSelection().toString();
	    }else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	},
	
	/**
	 * Saves text selection
	 */
	saveSelection:function(){
	    if (window.getSelection) {
	        sel = window.getSelection();
	        if (sel.getRangeAt && sel.rangeCount) {
	            var ranges = [];
	            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
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
	getLinkFromSelection:function() {
		
		var parent = null;
		
		if(document.selection){
    		parent = document.selection.createRange().parentElement();
    	}
	    else{
	    	var selection = window.getSelection();
	    	if(selection.rangeCount > 0){
	    		parent = selection.getRangeAt(0).startContainer.parentNode;
	    	}
	    }
	    
	    if(parent != null){
		    if(parent.tagName == 'A'){
			    return parent;
		    }
	    }
	    
	    if (window.getSelection) {
	        var selection = window.getSelection();
	        
	        if(selection.rangeCount > 0) {
	            var range = selection.getRangeAt(0);
	            var div = document.createElement('DIV');
	            div.appendChild(range.cloneContents());
	            var links = div.getElementsByTagName("A");
	            
	            if(links.length > 0){
		            return links[0];
	            }
	            else{
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
	restoreSelection:function(savedSel) {
	    if (savedSel) {
	        if (window.getSelection) {
	            sel = window.getSelection();
	            sel.removeAllRanges();
	            for (var i = 0, len = savedSel.length; i < len; ++i) {
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
	replaceAll:function(src, stringToFind, stringToReplace){
	  	var temp = src;
	
		var index = temp.indexOf(stringToFind);
		
		while(index != -1){
			temp = temp.replace(stringToFind,stringToReplace);
			index = temp.indexOf(stringToFind);
		}
		
		return temp;
	},
	
	/**
	 * Executes a function by its name and applies arguments
	 * @param {HTMLElement} node
	 */
	createTextStyle: function(node){
		
		// get current node
		var style = '';
		
		// build a style attribute for (text-color, text-size, text-shadow-color, text-shadow-vertical, text-shadow-horizontal, text-shadow-blur)
		var textColor = node.getAttribute('text-color') || '';
		var textSize = node.getAttribute('text-size') || '';
		var textShadowColor = node.getAttribute('text-shadow-color') || '';
		var textShadowHorizontal = node.getAttribute('text-shadow-horizontal') || '';
		var textShadowVertical = node.getAttribute('text-shadow-horizontal') || '';
		var textShadowBlur = node.getAttribute('text-shadow-blur') || '';
		
		if(textColor != ''){
			style += 'color:' + textColor + ';';
		}
		
		if(textSize != ''){
			style += 'font-size:' + textSize + ';';
		}
		
		if(textShadowColor != ''){
			style += 'text-shadow: ' 
				+ textShadowHorizontal + ' '
				+ textShadowVertical + ' '
				+ textShadowBlur + ' '
				+ textShadowColor + ';';
		}
		
		return style;
		
	},
	
	/**
	 * Retrieves a QS by name
	 * @param {String} name
	 */
	getQueryStringByName:function(name){
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.href);
		if(results == null){
			return '';
		}
		else{
			return decodeURIComponent(results[1].replace(/\+/g, " "));
		}
	},

	/**
	 * Retrieve HTML
	 */
	retrieveHTML: function(){
		
		var html = hashedit.mirror.documentElement.outerHTML;
		return html;
		
	},
	
	/**
	 * Update the mirror HTML based on an edit
	 */
	setMirrorHTML: function(ref, html){
	
		var node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
		node.innerHTML = html;
		
	},
	
	/**
	 * Sets the attribute of a mirror value
	 * @param {String} ref
	 * @param {String} attr
	 * @param {String} value
	 */
	setMirrorAttribute: function(ref, attr, value){
		
		var node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
		node.setAttribute(attr, value);
		
	},
	
	/**
	 * Moves an element in the mirror HTML based on drag & drop
	 * @param {String} ref
	 * @param {String} toRef
	 * @param {String} method - before, append
	 */
	moveMirrorElement: function(ref, toRef, method){
	
		if(hashedit.debug == true){
			console.log('[hashedit.moveMirrorElement] ref=' + ref + ' toref=' + toRef + ' method=' + method);
		}
	
		var node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
		var to = hashedit.mirror.querySelector('[data-ref="' + toRef + '"]');
		
		// setup parentNode
		if(to != null){
		
			var parent = to.parentNode;
			
			// insert into DOM
			if(method == 'before'){
				parent.insertBefore(node, to);
			}
			else if(method == 'append'){
				parent.appendChild(node);
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
	insertMirrorElement: function(ref, toRef, method, html){
	
		if(hashedit.debug == true){
			console.log('[hashedit.insertMirrorElement] ref=' + ref + ' toref=' + toRef + ' method=' + method);
		}
		
		// create a div to wrap the new node
		var div = document.createElement('div');
		div.innerHTML = html;
		
		// get the new node and add the ref
		var node = div.firstChild;
		node.setAttribute('data-ref', ref);
	
		// get the to element
		var to = hashedit.mirror.querySelector('[data-ref="' + toRef + '"]');
		var parent = to.parentNode;
		
		// insert into DOM
		if(method == 'before'){
			parent.insertBefore(node, to);
		}
		else if(method == 'append'){
			parent.appendChild(node);
		}
		
	},

	/**
	 * Setup the editor
	 * @param {Array} config.sortable
	 */
	setup: function(config){
	
		hashedit.init(config.url);
		hashedit.setActive();
		hashedit.setupSortable(config.sortable);
		hashedit.setupContentEditableEvents();
		hashedit.setupMenu(config.path);
		hashedit.createMenu(config.path);
		hashedit.loadHTML(config.path);
		hashedit.setupTextEvents();
		
		if(config.save != null){
			hashedit.save = config.save;
		}
		
	}
	
}

// Wrap an HTMLElement around each element in an HTMLElement array.
HTMLElement.prototype.wrap = function(elms) {
    // Convert `elms` to an array, if necessary.
    if (!elms.length) elms = [elms];
    
    // Loops backwards to prevent having to clone the wrapper on the
    // first element (see `child` below).
    for (var i = elms.length - 1; i >= 0; i--) {
        var child = (i > 0) ? this.cloneNode(true) : this;
        var el    = elms[i];
        
        // Cache the current parent and sibling.
        var parent  = el.parentNode;
        var sibling = el.nextSibling;
        
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
};