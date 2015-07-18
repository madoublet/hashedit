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

// utilities singleton
var utilities = {
	
	selection: null,
	
	// executes a function by its name
	executeFunctionByName:function(functionName, context /*, args */) {
	
		
		var args = [].slice.call(arguments).splice(2);
		var namespaces = functionName.split(".");
		
		var func = namespaces.pop();
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		
		return context[func].apply(this, args);
	},
	
	// gets the selected text
	getSelectedText:function(){

		var text = "";
	    if(window.getSelection) {
	        text = window.getSelection().toString();
	    }else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	},
	
	// saves a selection to add a link
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
	
	// get a link from the selected text
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
	
	// restores the selection
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
	
	// replaces all occurences for a string
	replaceAll:function(src, stringToFind, stringToReplace){
	  	var temp = src;
	
		var index = temp.indexOf(stringToFind);
		
		while(index != -1){
			temp = temp.replace(stringToFind,stringToReplace);
			index = temp.indexOf(stringToFind);
		}
		
		return temp;
	},
	
	// set text style
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
		
	}
		
}