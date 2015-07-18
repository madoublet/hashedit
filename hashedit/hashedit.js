// gets multiple scripts
$.getMultipleScripts = function(arr, path) {
    var _arr = $.map(arr, function(scr) {
        return $.getScript( (path||"") + scr );
    });

    _arr.push($.Deferred(function( deferred ){
        $( deferred.resolve );
    }));

    return $.when.apply($, _arr);
}

/**
 * Hashedit (#edit) is a simple, web-based editor for static HTML sites. Learn more at hashedit.io. Download from Github at github.com/madoublet/hashedit
 * @author: Matthew Smith
 */
var hashedit = {

	// set debug messages
	debug: true,
	
	// pointers to selected elements
	currNode: null,
	currConfig: null,
	
	// handles text selection
	selection: null,
	
	// configurations
	elementMenu: '<span class="hashedit-move"><span></span></span>',
	
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
			
			$.get(url, function(data){
			
				// start parser
				var parser = new DOMParser();
				
				// create the mirror
				var doc = parser.parseFromString(data, 'text/html');
			
				// remove the first script tag (e.g. #edit load script)
				var els = doc.getElementsByTagName('script');
				
				// remove this script
				var el = els[0];
				el.parentNode.removeChild(el);
				
				// get all elements
				var els = doc.getElementsByTagName('*');
				
				// add [data-ref] attributes to all DOM elements
				for(x=0; x<els.length; x++){
					els[x].setAttribute('data-ref', x);
				}
				
				// clear localStorage
				localStorage.clear();
				
				// set the HTML in session
				localStorage.setItem(key, doc.body.innerHTML);
				
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
	
		// setup hashedit
		$('body').attr('hashedit', '');
		
		// make content editable
		$('[hashedit]').find('p, h1, h2, h3, h4, h5, li, td, th, blockquote').attr('contentEditable', 'true');
		
	},

	/**
	 * Adds a hashedit-sortable class to any selector in the sortable array, enables sorting
	 * @param {Array} sortable
	 */
	setupSortable: function(sortable){
	
		for(var x=0; x<sortable.length; x++){
		
			// add the sortable class
			$('[hashedit] ' + sortable[x]).addClass('hashedit-sortable', '');
			
			// wrap sortable elements in a hashedit-element node
			$('[hashedit] ' + sortable[x] + ' > *').wrap('<div class="hashedit-element"></div>');
			
		}
	
		// add an anchor to allow the element to be dragged
		$('.hashedit-element').append('<span class="hashedit-move"><span></span></span>');
		
		// enable sorting using jQuery UI sortable
		$('.hashedit-sortable').sortable({
			handle:'.hashedit-move', 
			connectWith: '.hashedit-sortable', 
			placeholder: 'hashedit-highlight', 
			opacity:'0.6', 
			tolerance: 'pointer',
			receive: function(event, ui) {
				if($(ui.item).is('a')){
				   $('.hashedit-sortable').find('a.ui-draggable').replaceWith('<div id="hashedit-placeholder" class="hashedit-highlight"></div');
				
				}
			},
			stop: function(event, ui) {
			
				// get ref 	
				var ref = $(ui.item).find(':first-child').attr('data-ref');
				
				// error checking to handle new elements
				if(ref != undefined){
				
					// insert before or append element
					if($(ui.item).next('.hashedit-element').length > 0){
					
						var nextRef = $(ui.item).next('.hashedit-element').find(':first-child').attr('data-ref');
						hashedit.moveMirrorElement(ref, nextRef, 'before');
					
					}
					else{
					
						var parentRef = $(ui.item).parents('.hashedit-sortable').attr('data-ref');
						hashedit.moveMirrorElement(ref, parentRef, 'append');
						
					}
					
				}
				
			}
		});
		
	},
	
	/**
	 * Create the menu
	 */
	setupMenu: function(path){
		
		// build menu
		var menu = '<menu class="hashedit-menu">' +
						'<img class="hashedit-menu-logo" src="' + path + 'logo.png">' + 
						'<button class="hashedit-save"><i class="fa fa-floppy-o"></i></button>' + 
						'</menu>';
		
		// append menu
		$(document.body).append(menu);
		
		// save
		$('.hashedit-menu .hashedit-save').on('click', function(){
			var html = hashedit.retrieveHTML();
		});
		
		
	},
	
	/**
	 * Setup draggable events on menu items
	 */
	setupDraggable: function(){
		
		// a flag to flip if an event should be cancelled
		var cancel = false;
		
		// cancel on escape (revert draggable)
		$(document).keyup(function(e){
		    if(e.which=== 27 || e.keyCode === 27){
		        $('.hashedit-menu a').draggable({'revert': true }).trigger( 'mouseup' );
		        cancel = true;
		    }
		});
	
		// set up draggable
		$('.hashedit-menu a').draggable({
	      connectToSortable: '.hashedit-sortable',
	      helper: 'clone',
	      appendTo: 'body'
	    });
	    
	    // reset the draggable on dragstart
	    $('.hashedit-menu').on('dragstart', '.editor-menu a', function(){
	    	cancel = false;
	    	$('.hashedit-menu a').draggable({'revert': false });
	    });
	    
	    // handle click/dragstop
	    $('.hashedit-menu').on('dragstop click', 'a', function(){
	    
	    	if(cancel == false){
		    	var action = $(this).attr('data-action') + '.create';
				hashedit.executeFunctionByName(action, window);
				cancel = false;
		    }
		    else{
			    $('#editor-placeholder').remove();
		    }
		    
	    });
	    
		// clear existing text events
		$(document).unbind('mousedown touchstart');
	   
	    // setup text events
		$(document).on('mousedown touchstart', '.context-menu a', function(e){
			var action = $(this).attr('data-action') + '.create';
			hashedit.executeFunctionByName(action, window);
			
			return false;
		});
		
	},
	
	/**
	 * Load config from html/config.html into the aside
	 */
	loadConfig: function(path){
		 
		// build aside
		var aside = '<aside class="hashedit-config"></aside>';
		
		// append aside
		$(document.body).append(aside);
		
		// add properties to the aside
		$.get(path + 'html/config.html', function(data){
			var html = '<div class="config">' + data + '</div>';
			$('.hashedit-config').append(html);
		});
		 
	},
	
	/**
	 * Load plugins from plugins/config.json
	 */
	loadPlugins: function(path){
		
		// load configurations
		$.ajax({
			url: path + 'plugins/config.json',
			type: 'POST',
			success: function(data){
			
				// scripts to be loaded
				var scripts = [];
	
				// walk through plugins
				for(x=0; x<data.length; x++){
				
					var item = data[x];
		
					// setup menu
					$('.hashedit-menu').append('<a title="' + item.title + '" data-action="' + item.action + '">'
					+ item.display + '</a>');
					
					// add script to queue
					var url = path + item.path + 'element.js';
					
					if(scripts.indexOf(url) == -1){
						scripts.push(url);
					}
					
				}
				
				hashedit.setupDraggable();
				
				// retrieve all the scripts
				$.getMultipleScripts(scripts, '').done(function() {});
				
	        }
		});
		
	},
	
	/**
	 * Setup contentEditable events for the editor
	 */
	setupContentEditableEvents: function(){
	
		// handles when an element gains focus
		$('[hashedit]').on('click focusin', '[contentEditable=true]', function(){
			
			hashedit.currNode = this;
		
			// get current configuration
			var form = $('.hashedit-config').find('.config');
			
			// set current form
			form.addClass('active');
			hashedit.currConfig = form;
			
			// clear model
			hashedit.currConfig.find('[data-model]').val('');
		
	  		// walk through attributes of node
		    $.each($(hashedit.currNode).get(0).attributes, function(index, attr) {
			    
			    var key = attr.nodeName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
		        var value = attr.nodeValue;
	           	
			   	// this enables binding to type=number fields for numeric values
	           	if($.isNumeric(value) === true){
		           	value = parseFloat(value);
	           	}
	           	
	           	// set value
				$(form).find('[data-model="node.' + key + '"]').val(value);
		       
		    });
			
		});
		
		// handles when an element gains focus
		$('[hashedit]').on('input', '[contentEditable=true]', function(){
			
			var html = $(this).html();
			var ref = $(this).attr('data-ref');
			
			// set the mirror HTML
			hashedit.setMirrorHTML(ref, html);
			
		});
		
		// handle focus out on div
		$('[hashedit]').on('focusout', '[contentEditable=true]', function(){});
		
	},
	
	/**
	 * Appends items to the editor
	 */
	append: function(html){ 
	
		// wrap element
		var wrappedHTML = '<div class="hashedit-element">' +
						html + 
						hashedit.elementMenu +
					'</div>';
	
		// if dragged placeholder exists
		if($('#hashedit-placeholder').length > 0){
			var node = $('#hashedit-placeholder');
			
			var temp = $(node).after(wrappedHTML).get(0);
			
			// get reference to added element
			var added = $(temp).next();
			
			// setup contenteditalbe
			$(added).find('p, h1, h2, h3, h4, h5, li, td, th, blockquote').attr('contentEditable', 'true');
			
			// focus on content editable area
			$('[contentEditable=true], input, textarea').blur();
			$(added).find('[contentEditable=true]').first().focus();
			
			$(node).remove();
			
			hashedit.currNode = $(added).find('[contentEditable=true]');
			
			// increment new element count
			hashedit.newElementCount = hashedit.newElementCount + 1;
			
			// create ref
			var ref = 'new-' + hashedit.newElementCount;
			
			// add reference to new element
			$(added).find(':first-child').attr('data-ref', ref);
		
			// insert mirror element
			if($(added).next('.hashedit-element').length > 0){
			
				var nextRef = $(added).next('.hashedit-element').find(':first-child').attr('data-ref');
				hashedit.insertMirrorElement(ref, nextRef, 'before', html);
			
			}
			else{
			
				var parentRef = $(added).parents('.hashedit-sortable').attr('data-ref');
				hashedit.insertMirrorElement(ref, parentRef, 'append', html);
				
			}
		}
	
	},
	
	/**
	 * Setup configuration events
	 */
	setupConfigEvents: function(){
		
		// handle changes to bindable values
		$('.hashedit-config').on('propertychange change click keyup input paste', '[data-model]', function(){
			
			var model = $(this).attr('data-model');
			var value = $(this).val();
			var prop = '';
			
			// set attribute on node
			if(model.indexOf('node.') != -1){
				var parts = model.split('.');
				
				// converts camelcase to hyphens, sets attribute
				if(parts.length > 1){
					prop = parts[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
					$(hashedit.currNode).attr(prop, value);
				}
			}
			
			// create style
			var style = hashedit.createTextStyle(hashedit.currNode);
			
			// update style
			$(hashedit.currNode).attr('style', style);
			
		});
		
	},
	
	/**
	 * Setup text events (e.g. bold, italic, etc)
	 */
	setupTextEvents: function(){
		
		// bold
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.bold"]', function(e){
			document.execCommand("Bold", false, null);
			return false;
		});
		
		// italic
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.italic"]', function(e){
			document.execCommand("Italic", false, null);
			return false;
		});
		
		// strikeThrough
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.strike"]', function(e){
			document.execCommand("strikeThrough", false, null);
			return false;
		});
		
		// subscript
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.subscript"]', function(e){
			document.execCommand("subscript", false, null);
			return false;
		});
		
		// superscript
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.superscript"]', function(e){
			document.execCommand("superscript", false, null);
			return false;
		});
		
		// underline
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.underline"]', function(e){
			document.execCommand("underline", false, null);
			return false;
		});
		
		// link
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.link"]', function(e){
			
			return false;
		});
		
		// code
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.code"]', function(e){
			var text = hashedit.getSelectedText();
			var html = '<code>'+text+'</code>';
			
			document.execCommand("insertHTML", false, html);
		
			return false;
		});
		
		// alignLeft
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.alignLeft"]', function(e){
			var input = $(hashedit.currConfig).find('[data-model="node.class"]');
			
			// clear existing alignments
			var value = input.val();
			value = hashedit.replaceAll(value, 'text-center', '');
			value = hashedit.replaceAll(value, 'text-left', '');
			value = hashedit.replaceAll(value, 'text-right', '');
			
			// update value and trigger change
			input.val($.trim(value + ' text-left'));
			input.trigger('change');
			return false;
		});
		
		// alignRight
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.alignRight"]', function(e){
			var input = $(hashedit.currConfig).find('[data-model="node.class"]');
			
			// clear existing alignments
			var value = input.val();
			value = hashedit.replaceAll(value, 'text-center', '');
			value = hashedit.replaceAll(value, 'text-left', '');
			value = hashedit.replaceAll(value, 'text-right', '');
			
			// update value and trigger change
			input.val($.trim(value + ' text-right'));
			input.trigger('change');
			return false;
		});
		
		// alignCenter
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.alignCenter"]', function(e){
			var input = $(hashedit.currConfig).find('[data-model="node.class"]');
			
			// clear existing alignments
			var value = input.val();
			value = hashedit.replaceAll(value, 'text-center', '');
			value = hashedit.replaceAll(value, 'text-left', '');
			value = hashedit.replaceAll(value, 'text-right', '');
			
			// update value and trigger change
			input.val($.trim(value + ' text-center'));
			input.trigger('change');
			return false;
		});
		
		// undo
		$('.hashedit-config').on('mousedown touchstart', '[data-action="hashedit.text.undo"]', function(e){
			document.execCommand("undo", false, null);
			return false;
		});
		
	},
	
	/**
	 * Executes a function by its name and applies arguments
	 * @param {String} functionName
	 * @param {String} context
	 */
	executeFunctionByName:function(functionName, context /*, args */) {
	
		
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
		var node = $(node)
		var style = '';
		
		// build a style attribute for (text-color, text-size, text-shadow-color, text-shadow-vertical, text-shadow-horizontal, text-shadow-blur)
		var textColor = node.attr('text-color') || '';
		var textSize = node.attr('text-size') || '';
		var textShadowColor = node.attr('text-shadow-color') || '';
		var textShadowHorizontal = node.attr('text-shadow-horizontal') || '';
		var textShadowVertical = node.attr('text-shadow-horizontal') || '';
		var textShadowBlur = node.attr('text-shadow-blur') || '';
		
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
		
		var html = hashedit.mirror.documentElement.innerHTML;
		
		console.log(html);
		alert(html);
		
		return html;
		
	},
	
	/**
	 * Update teh mirror HTML based on an edit
	 */
	setMirrorHTML: function(ref, html){
	
		var node = hashedit.mirror.querySelector('[data-ref="' + ref + '"]');
		node.innerHTML = html;
		
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
		hashedit.setupMenu(config.path);
		hashedit.loadPlugins(config.path);
		hashedit.loadConfig(config.path);
		hashedit.setupContentEditableEvents();
		hashedit.setupTextEvents();
		hashedit.setupConfigEvents();
		
	}
	
}