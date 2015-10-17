/**
 * Hashedit (#edit) is a simple, web-based editor for static HTML sites. Learn more at hashedit.io. Download from Github at github.com/madoublet/hashedit
 * @author: Matthew Smith
 */ 
"use strict";
 
var hashedit = {

    // set debug messages
    debug: true,
    
    // set demo mode
    demo: false,
    
    // pointers to selected elements
    currNode: null,
    currConfig: null,

    // handles text selection
    selection: null,
    
    // configurations
    elementMenu: '<span class="hashedit-move"><span><svg viewBox="0 0 24 24" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" fit="" style="pointer-events: none; display: block;"><g><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></g></svg></span></span>',
    
    // define the menu
    menu: [
        {
            "action":	"hashedit.h1",
            "selector":	"h1",
            "title":	"H1 Headline",
            "display":	"H1",
            "html":     "<h1></h1>"
        },
        {
            "action":	"hashedit.h2",
            "selector":	"h2",
            "title":	"H2 Headline",
            "display":	"H2",
            "html":     "<h2></h2>"
        },
        {
            "action":	"hashedit.h3",
            "selector":	"h3",
            "title":	"H3 Headline",
            "display":	"H3",
            "html":     "<h3></h3>"
        },
        {
            "action":	"hashedit.h4",
            "selector":	"h4",
            "title":	"H4 Headline",
            "display":	"H4",
            "html":     "<h4></h4>"
        },
        {
            "action":	"hashedit.h5",
            "selector":	"h5",
            "title":	"H5 Headline",
            "display":	"H5",
            "html":     "<h5></h5>"
        },
        {
            "action":	"hashedit.p",
            "selector":	"p",
            "title":	"Paragraph",
            "display":	"P",
            "html":     "<p></p>"
        },
        {
            "action":	"hashedit.blockquote",
            "selector":	"blockquote",
            "title":	"Blockquote",
            "display":	"<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'></path></g></svg>",
            "html":     "<blockquote></blockquote>"
        },
        {
            "action": "hashedit.ul",
            "selector": "ul",
            "title": "Unordered List",
            "display": "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12.17c-.74 0-1.33.6-1.33 1.33s.6 1.33 1.33 1.33 1.33-.6 1.33-1.33-.59-1.33-1.33-1.33zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z'></path></g></svg>",
            "html": "<ul><li></li></ul>"
        },
        {
            "action": "hashedit.ol",
            "selector": "ol",
            "title": "Ordered List",
            "display": "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z'></path></g></svg>",
            "html": "<ol><li></li></ol>"
        }
    ],
    
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
    
    /**
     * Retrieve HTML
     */
    init: function(){
    
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
            fetch(hashedit.retrieveUrl, {credentials: 'include'})
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
        document.querySelector('body').setAttribute('hashedit-active', '');
        
        // setup [contentEditable=true]
        var els = document.querySelectorAll('[hashedit] p, [hashedit] h1, [hashedit] h2, [hashedit] h3, [hashedit] h4, [hashedit] h5,[hashedit] li, [hashedit] td, [hashedit] th, [hashedit] blockquote');
        
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
     * Create the auth
     */
    showAuth: function(path){
    
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
    setupDrawer: function(path){
    
        // create a menu
        var drawer = document.createElement('nav');
        drawer.setAttribute('class', 'hashedit-drawer');
        drawer.innerHTML = '<ul><li hashedit-add-page><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></g></svg><a>Add Page</a></li><li hashedit-page-settings><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path></g></svg><a>Page Settings</a></li></ul>';
        
        // append menu
        document.body.appendChild(drawer);
        
        // show add page
        document.querySelector('[hashedit-add-page]').addEventListener('click', function(){
            
            // hide drawer
            var drawer = document.querySelector('.hashedit-drawer');
            drawer.removeAttribute('visible');
            
            // init url
            document.getElementById('hashedit-page-url').value = '';
            
            // show modal
            document.getElementById('hashedit-add-page').setAttribute('visible', '');
            
        });
        
        // show settings
        document.querySelector('[hashedit-page-settings]').addEventListener('click', function(){
            
            // hide drawer
            var drawer = document.querySelector('.hashedit-drawer');
            drawer.removeAttribute('visible');
            
            // get description
            var desc = '';
            var meta = document.querySelector('meta[name="description"]');
            
            if(meta != null){
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
    setupMenu: function(path){
    
        // create a menu
        var menu = document.createElement('menu');
        menu.setAttribute('class', 'hashedit-menu');
        menu.innerHTML = '<button class="hashedit-more"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g></svg></button><button class="hashedit-save"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" class="style-scope iron-icon"></path></g></svg></button><div class="hashedit-menu-body"></div>';
        
        // append menu
        document.body.appendChild(menu);
        
        // toggle drawer
        document.querySelector('.hashedit-more').addEventListener('click', function(){
            
            var drawer = document.querySelector('.hashedit-drawer');
            
            if(drawer.hasAttribute('visible')){
                drawer.removeAttribute('visible');
            }
            else{
                drawer.setAttribute('visible', '');
            }
            
        });
        
        // save
        document.querySelector('.hashedit-save').addEventListener('click', function(){
            
            if(hashedit.demo == true){
              
              // alert
              alert('Cannot save in demo mode :)');
              
              // clear localStorage
              localStorage.clear();
              
            }
            else{
            
              var data = hashedit.retrieveUpdateArray();
              
              if(hashedit.saveUrl){
              
                // construct an HTTP request
                var xhr = new XMLHttpRequest();
                xhr.open('post', hashedit.saveUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
              
                // send the collected data as JSON
                xhr.send(JSON.stringify(data));
              
                xhr.onloadend = function () {
                  // done
                  localStorage.clear();
                  
                  // redirect without #edit
                  var url = hashedit.replaceAll(window.location.href, '#edit', '');
                  
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
    setupDraggable: function(){
    
        // setup sortable on the menu
        var el = document.querySelector('.hashedit-menu-body');
        
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
                
                // get action
                var action = item.getAttribute('data-action');
                
                // append html associated with action
                for(var x=0; x<hashedit.menu.length; x++){
                    if(hashedit.menu[x].action == action){
                        hashedit.append(hashedit.menu[x].html);
                    }
                }
                
                return false;
                
            }
        });     
    },
    
    /**
     * Load html from html/* into the aside
     */
    loadHTML: function(path){
        
        // fetch the config
        fetch(path + 'html/modals.html')
          .then(function(response) {
            return response.text();
          }).then(function(text) { 
          
            var wrapper = document.createElement('div');
            wrapper.innerHTML = text;
            
            for(var x=0; x<wrapper.childNodes.length; x++){
                document.querySelector('body').appendChild(wrapper.childNodes[x]);
            }
            
            hashedit.setupConfigEvents();
            hashedit.setupTextEvents();
            hashedit.setupModalEvents();
            
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
            document.querySelector('.hashedit-menu-body').appendChild(a);
            
        }
        
        // make the menu draggable
        hashedit.setupDraggable();
        
    },
    
    /**
     * Setup contentEditable events for the editor
     */
    setupContentEditableEvents: function(){
        
        // get contentEditable elements
        var arr = document.querySelectorAll('body');
        
        for(var x=0; x<arr.length; x++){
        
            // delegate CLICK, FOCUS event
            ['click', 'focus'].forEach(function(e){
                arr[x].addEventListener(e, function(e){
                
                    if(e.target.nodeName == 'A'){
                        
                        // hide .hashedit-config, .hashedit-modal
                        var edits = document.querySelectorAll('[hashedit]');
                        
                        // determines whether the element is a configuration
                        var isEditable = false;
                        
                        for(x=0; x<edits.length; x++){
                            
                            if(edits[x].contains(e.target) == true){
                              isEditable = true;
                            }
                            
                        }
                        
                        if(isEditable){
                            hashedit.showLinkDialog();
                        }
                    }
                    else if(e.target.nodeName == 'IMG'){
                        hashedit.currImage = e.target;
                        
                        // hide .hashedit-config, .hashedit-modal
                        var edits = document.querySelectorAll('[hashedit]');
                        
                        // determines whether the element is a configuration
                        var isEditable = false;
                        
                        for(x=0; x<edits.length; x++){
                            
                            if(edits[x].contains(e.target) == true){
                              isEditable = true;
                            }
                            
                        }
                        
                        if(isEditable){
                            hashedit.showImageDialog();
                        }
                    }
                    else if(e.target.hasAttribute('contentEditable')){
                    
                        // set current node
                        hashedit.currNode = e.target;
                        
                        // hide drawer
                        var drawer = document.querySelector('.hashedit-drawer');
                        drawer.removeAttribute('visible');
                        
                        // hide #hashedit-image
                        var link = document.querySelector('#hashedit-image-settings');
                        link.removeAttribute('visible');
                        
                        // hide #hashedit-link
                        var link = document.querySelector('#hashedit-link-settings');
                        link.removeAttribute('visible');
                        
                        // get #hashedit-config
                        var form = document.querySelector('#hashedit-element-settings');
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
                            var input = document.querySelector('[data-model="node.' + key + '"]');
                            
                            if(input != null){
                                input.value = value;
                            }
                            
                        }
                        
                    }
                    else{
                        // hide .hashedit-config, .hashedit-modal
                        var configs = document.querySelectorAll('.hashedit-config, .hashedit-modal, .hashedit-menu, .hashedit-drawer');
                        
                        // determines whether the element is a configuration
                        var isConfig = false;
                        
                        for(x=0; x<configs.length; x++){
                            
                            if(configs[x].contains(e.target) == true){
                              isConfig = true;
                            }
                            
                        }
                        
                        // hide if not in config
                        if(isConfig == false){
                          
                          for(x=0; x<configs.length; x++){
                            configs[x].removeAttribute('visible');
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
                        
                        while(el !== null){
                            if(el.hasAttribute('data-ref')){
                                var ref = el.getAttribute('data-ref');
                                var html = el.innerHTML;
                                                        
                                // set the mirror HTML
                                hashedit.setMirrorHTML(ref, html);
                                
                                // set to null
                                el = null;
                            }
                            else{
                                el = el.parentNode;
                            }
                        }
                        
                    }
                        
                    
                });
                    
            });
            
            // delegate INPUT event
            ['keydown'].forEach(function(e){
                arr[x].addEventListener(e, function(e){
                    
                    if(e.target.hasAttribute('contentEditable')){
                    
                        var el = e.target;
                    
                        // ENTER key
                        if(e.keyCode === 13){
                            
                            if(el.nodeName == 'LI'){
                                
                                // create LI
                                var li = document.createElement('li');
                                li.setAttribute('contentEditable', true);
                                
                                // append LI
                                el.parentNode.appendChild(li);
                                
                                el.parentNode.lastChild.focus();
                                
                                e.preventDefault();
                                e.stopPropagation();
                                
                            }
                            
                        }
                        
                        // DELETE key
                        if(e.keyCode === 8){
                            
                            if(el.nodeName == 'LI'){
                                
                                if(el.innerHTML == ''){
                                
                                    console.log(el.previousSibling);
                                    
                                    if(el.previousSibling !== null){
                                    
                                        var parent = el.parentNode;
                                    
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
        
        return newNode;
    
    },
    
    /**
     * Setup modal events
     */
    setupModalEvents: function(){
    
        // handle page creation
        document.querySelector('[hashedit-add-page-create]').addEventListener('click', function(){
            
            // get url
            var url = document.getElementById('hashedit-page-url').value;
            
            // set params
            var params = {
              'url': url
            }
            
            if(hashedit.addPageURL){
              
              // construct an HTTP request
              var xhr = new XMLHttpRequest();
              xhr.open('post', hashedit.addPageURL, true);
              xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            
              // send the collected data as JSON
              xhr.send(JSON.stringify(params));
            
              xhr.onloadend = function () {
                
                // hide modal
                document.getElementById('hashedit-add-page').removeAttribute('visible');
                
                // log success
                console.log('success');
                
              };
            
            }
            
        });
    },
    
    /**
     * Setup configuration events
     */
    setupConfigEvents: function(){
        
        // setup config events
        var arr = document.querySelectorAll('.hashedit-config, .hashedit-modal');
        
        for(var x = 0; x < arr.length; x++){
            
            // delegate on .hashedit-config
            ['propertychange', 'change', 'click', 'keyup', 'input', 'paste'].forEach(function(e){
            
                arr[x].addEventListener(e, function(e){
                    
                    var el = e.target;
                    
                    if(el.hasAttribute('hashedit-cancel-modal')){
                        
                        // hide .hashedit-config, .hashedit-modal
                        var configs = document.querySelectorAll('.hashedit-modal');
                 
                        for(x=0; x<configs.length; x++){
                            configs[x].removeAttribute('visible');
                        }
                          
                    }
                    
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
                            
                            console.log(parts);
                            
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
                        
                        if(model.indexOf('image.') != -1){
                            var parts = model.split('.');
                            
                            // converts camelcase to hyphens, sets attribute
                            if(parts.length > 1){
                            
                                // get property
                                attr = parts[1].replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                                
                                // set attribute
                                hashedit.currImage.setAttribute(attr, value);
                                
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
                    
                    if(el.nodeName == 'SVG'){
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
                            var input = document.querySelector('.hashedit-modal [data-model="node.class"]');
            
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
                            var input = document.querySelector('.hashedit-modal [data-model="node.class"]');
            
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
                            var input = document.querySelector('.hashedit-modal [data-model="node.class"]');
            
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
        
        document.querySelector('[hashedit-element-details]').addEventListener('click', function(){
            
            // show modal
            document.getElementById('hashedit-element-details').setAttribute('visible', '');
        });
        
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
            var id = hashedit.currLink.getAttribute('id') || '';
            var cssClass = hashedit.currLink.getAttribute('class') || '';
            var href = hashedit.currLink.getAttribute('href') || '';
            var target = hashedit.currLink.getAttribute('target') || '';
            var title = hashedit.currLink.getAttribute('title') || '';
        
            // show the link dialog
            var link = document.querySelector('#hashedit-link-settings');
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
    showImageDialog: function(){
    

        // populate link values
        if(hashedit.currImage != null){
        
            // get  attributes
            var id = hashedit.currImage.getAttribute('id') || '';
            var cssClass = hashedit.currImage.getAttribute('class') || '';
            var src = hashedit.currImage.getAttribute('src') || '';
            var title = hashedit.currImage.getAttribute('title') || '';
        
            // show the link dialog
            var link = document.querySelector('#hashedit-image-settings');
            link.setAttribute('visible', '');
            
            // sets start values
            document.getElementById('hashedit-image-id').value = id;
            document.getElementById('hashedit-image-cssclass').value = cssClass;
            document.getElementById('hashedit-image-src').value = src;
            document.getElementById('hashedit-image-title').value = title;
            
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
        
        return hashedit.mirror.documentElement.outerHTML;
        
    },
    
    /**
     * Retrieve changes
     */
    retrieveUpdateArray: function(){
        
        var els = hashedit.mirror.documentElement.querySelectorAll('[hashedit]');
        var data = [];
        
        for(var x=0; x<els.length; x++){
            var el = {'selector':els[x].getAttribute('hashedit-selector'), 'html':els[x].innerHTML}
            data.push(el);
        }
        
        return data;
        
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

        // check auth
        if(config.demo == true){
        
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
            
        }
        else{
            fetch(hashedit.authUrl, {credentials: 'include'})
              .then(function(response) {
            
                if(response.status !== 200){ 
                
                  // show authorization
                  hashedit.showAuth();
                
                }
                else{
                
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

/*! Sortable 1.2.1 - MIT | git://github.com/rubaxa/Sortable.git */
!function(a){"use strict";"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():"undefined"!=typeof Package?Sortable=a():window.Sortable=a()}(function(){"use strict";function a(a,b){this.el=a,this.options=b=s({},b),a[J]=this;var d={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(a.nodeName)?"li":">*",ghostClass:"sortable-ghost",ignore:"a, img",filter:null,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0};for(var e in d)!(e in b)&&(b[e]=d[e]);var g=b.group;g&&"object"==typeof g||(g=b.group={name:g}),["pull","put"].forEach(function(a){a in g||(g[a]=!0)}),b.groups=" "+g.name+(g.put.join?" "+g.put.join(" "):"")+" ";for(var h in this)"_"===h.charAt(0)&&(this[h]=c(this,this[h]));f(a,"mousedown",this._onTapStart),f(a,"touchstart",this._onTapStart),f(a,"dragover",this),f(a,"dragenter",this),R.push(this._onDragOver),b.store&&this.sort(b.store.get(this))}function b(a){v&&v.state!==a&&(i(v,"display",a?"none":""),!a&&v.state&&w.insertBefore(v,t),v.state=a)}function c(a,b){var c=Q.call(arguments,2);return b.bind?b.bind.apply(b,[a].concat(c)):function(){return b.apply(a,c.concat(Q.call(arguments)))}}function d(a,b,c){if(a){c=c||L,b=b.split(".");var d=b.shift().toUpperCase(),e=new RegExp("\\s("+b.join("|")+")(?=\\s)","g");do if(">*"===d&&a.parentNode===c||(""===d||a.nodeName.toUpperCase()==d)&&(!b.length||((" "+a.className+" ").match(e)||[]).length==b.length))return a;while(a!==c&&(a=a.parentNode))}return null}function e(a){a.dataTransfer.dropEffect="move",a.preventDefault()}function f(a,b,c){a.addEventListener(b,c,!1)}function g(a,b,c){a.removeEventListener(b,c,!1)}function h(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(I," ").replace(" "+b+" "," ");a.className=(d+(c?" "+b:"")).replace(I," ")}}function i(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return L.defaultView&&L.defaultView.getComputedStyle?c=L.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function j(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;f>e;e++)c(d[e],e);return d}return[]}function k(a,b,c,d,e,f,g){var h=L.createEvent("Event"),i=(a||b[J]).options,j="on"+c.charAt(0).toUpperCase()+c.substr(1);h.initEvent(c,!0,!0),h.to=b,h.from=e||b,h.item=d||b,h.clone=v,h.oldIndex=f,h.newIndex=g,b.dispatchEvent(h),i[j]&&i[j].call(a,h)}function l(a,b,c,d,e,f){var g,h,i=a[J],j=i.options.onMove;return j&&(g=L.createEvent("Event"),g.initEvent("move",!0,!0),g.to=b,g.from=a,g.dragged=c,g.draggedRect=d,g.related=e||b,g.relatedRect=f||b.getBoundingClientRect(),h=j.call(i,g)),h}function m(a){a.draggable=!1}function n(){O=!1}function o(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return b.clientY-(d.top+d.height)>5&&c}function p(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function q(a){for(var b=0;a&&(a=a.previousElementSibling);)"TEMPLATE"!==a.nodeName.toUpperCase()&&b++;return b}function r(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,setTimeout(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}function s(a,b){if(a&&b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}var t,u,v,w,x,y,z,A,B,C,D,E,F,G,H={},I=/\s+/g,J="Sortable"+(new Date).getTime(),K=window,L=K.document,M=K.parseInt,N=!!("draggable"in L.createElement("div")),O=!1,P=Math.abs,Q=[].slice,R=[],S=r(function(a,b,c){if(c&&b.scroll){var d,e,f,g,h=b.scrollSensitivity,i=b.scrollSpeed,j=a.clientX,k=a.clientY,l=window.innerWidth,m=window.innerHeight;if(z!==c&&(y=b.scroll,z=c,y===!0)){y=c;do if(y.offsetWidth<y.scrollWidth||y.offsetHeight<y.scrollHeight)break;while(y=y.parentNode)}y&&(d=y,e=y.getBoundingClientRect(),f=(P(e.right-j)<=h)-(P(e.left-j)<=h),g=(P(e.bottom-k)<=h)-(P(e.top-k)<=h)),f||g||(f=(h>=l-j)-(h>=j),g=(h>=m-k)-(h>=k),(f||g)&&(d=K)),(H.vx!==f||H.vy!==g||H.el!==d)&&(H.el=d,H.vx=f,H.vy=g,clearInterval(H.pid),d&&(H.pid=setInterval(function(){d===K?K.scrollTo(K.pageXOffset+f*i,K.pageYOffset+g*i):(g&&(d.scrollTop+=g*i),f&&(d.scrollLeft+=f*i))},24)))}},30);return a.prototype={constructor:a,_onTapStart:function(a){var b=this,c=this.el,e=this.options,f=a.type,g=a.touches&&a.touches[0],h=(g||a).target,i=h,j=e.filter;if(!("mousedown"===f&&0!==a.button||e.disabled)&&(h=d(h,e.draggable,c))){if(C=q(h),"function"==typeof j){if(j.call(this,a,h,this))return k(b,i,"filter",h,c,C),void a.preventDefault()}else if(j&&(j=j.split(",").some(function(a){return a=d(i,a.trim(),c),a?(k(b,a,"filter",h,c,C),!0):void 0})))return void a.preventDefault();(!e.handle||d(i,e.handle,c))&&this._prepareDragStart(a,g,h)}},_prepareDragStart:function(a,b,c){var d,e=this,g=e.el,h=e.options,i=g.ownerDocument;c&&!t&&c.parentNode===g&&(F=a,w=g,t=c,x=t.nextSibling,E=h.group,d=function(){e._disableDelayedDrag(),t.draggable=!0,h.ignore.split(",").forEach(function(a){j(t,a.trim(),m)}),e._triggerDragStart(b)},f(i,"mouseup",e._onDrop),f(i,"touchend",e._onDrop),f(i,"touchcancel",e._onDrop),h.delay?(f(i,"mousemove",e._disableDelayedDrag),f(i,"touchmove",e._disableDelayedDrag),e._dragStartTimer=setTimeout(d,h.delay)):d())},_disableDelayedDrag:function(){var a=this.el.ownerDocument;clearTimeout(this._dragStartTimer),g(a,"mousemove",this._disableDelayedDrag),g(a,"touchmove",this._disableDelayedDrag)},_triggerDragStart:function(a){a?(F={target:t,clientX:a.clientX,clientY:a.clientY},this._onDragStart(F,"touch")):N?(f(t,"dragend",this),f(w,"dragstart",this._onDragStart)):this._onDragStart(F,!0);try{L.selection?L.selection.empty():window.getSelection().removeAllRanges()}catch(b){}},_dragStarted:function(){w&&t&&(h(t,this.options.ghostClass,!0),a.active=this,k(this,w,"start",t,w,C))},_emulateDragOver:function(){if(G){i(u,"display","none");var a=L.elementFromPoint(G.clientX,G.clientY),b=a,c=" "+this.options.group.name,d=R.length;if(b)do{if(b[J]&&b[J].options.groups.indexOf(c)>-1){for(;d--;)R[d]({clientX:G.clientX,clientY:G.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);i(u,"display","")}},_onTouchMove:function(a){if(F){var b=a.touches?a.touches[0]:a,c=b.clientX-F.clientX,d=b.clientY-F.clientY,e=a.touches?"translate3d("+c+"px,"+d+"px,0)":"translate("+c+"px,"+d+"px)";G=b,i(u,"webkitTransform",e),i(u,"mozTransform",e),i(u,"msTransform",e),i(u,"transform",e),a.preventDefault()}},_onDragStart:function(a,b){var c=a.dataTransfer,d=this.options;if(this._offUpEvents(),"clone"==E.pull&&(v=t.cloneNode(!0),i(v,"display","none"),w.insertBefore(v,t)),b){var e,g=t.getBoundingClientRect(),h=i(t);u=t.cloneNode(!0),i(u,"top",g.top-M(h.marginTop,10)),i(u,"left",g.left-M(h.marginLeft,10)),i(u,"width",g.width),i(u,"height",g.height),i(u,"opacity","0.8"),i(u,"position","fixed"),i(u,"zIndex","100000"),w.appendChild(u),e=u.getBoundingClientRect(),i(u,"width",2*g.width-e.width),i(u,"height",2*g.height-e.height),"touch"===b?(f(L,"touchmove",this._onTouchMove),f(L,"touchend",this._onDrop),f(L,"touchcancel",this._onDrop)):(f(L,"mousemove",this._onTouchMove),f(L,"mouseup",this._onDrop)),this._loopId=setInterval(this._emulateDragOver,150)}else c&&(c.effectAllowed="move",d.setData&&d.setData.call(this,c,t)),f(L,"drop",this);setTimeout(this._dragStarted,0)},_onDragOver:function(a){var c,e,f,g=this.el,h=this.options,j=h.group,k=j.put,m=E===j,p=h.sort;if(void 0!==a.preventDefault&&(a.preventDefault(),!h.dragoverBubble&&a.stopPropagation()),E&&!h.disabled&&(m?p||(f=!w.contains(t)):E.pull&&k&&(E.name===j.name||k.indexOf&&~k.indexOf(E.name)))&&(void 0===a.rootEl||a.rootEl===this.el)){if(S(a,h,this.el),O)return;if(c=d(a.target,h.draggable,g),e=t.getBoundingClientRect(),f)return b(!0),void(v||x?w.insertBefore(t,v||x):p||w.appendChild(t));if(0===g.children.length||g.children[0]===u||g===a.target&&(c=o(g,a))){if(c){if(c.animated)return;r=c.getBoundingClientRect()}b(m),l(w,g,t,e,c,r)!==!1&&(g.appendChild(t),this._animate(e,t),c&&this._animate(r,c))}else if(c&&!c.animated&&c!==t&&void 0!==c.parentNode[J]){A!==c&&(A=c,B=i(c));var q,r=c.getBoundingClientRect(),s=r.right-r.left,y=r.bottom-r.top,z=/left|right|inline/.test(B.cssFloat+B.display),C=c.offsetWidth>t.offsetWidth,D=c.offsetHeight>t.offsetHeight,F=(z?(a.clientX-r.left)/s:(a.clientY-r.top)/y)>.5,G=c.nextElementSibling,H=l(w,g,t,e,c,r);H!==!1&&(O=!0,setTimeout(n,30),b(m),q=1===H||-1===H?1===H:z?c.previousElementSibling===t&&!C||F&&C:G!==t&&!D||F&&D,q&&!G?g.appendChild(t):c.parentNode.insertBefore(t,q?G:c),this._animate(e,t),this._animate(r,c))}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();i(b,"transition","none"),i(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,i(b,"transition","all "+c+"ms"),i(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=setTimeout(function(){i(b,"transition",""),i(b,"transform",""),b.animated=!1},c)}},_offUpEvents:function(){var a=this.el.ownerDocument;g(L,"touchmove",this._onTouchMove),g(a,"mouseup",this._onDrop),g(a,"touchend",this._onDrop),g(a,"touchcancel",this._onDrop)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(H.pid),clearTimeout(this._dragStartTimer),g(L,"drop",this),g(L,"mousemove",this._onTouchMove),g(c,"dragstart",this._onDragStart),this._offUpEvents(),b&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation(),u&&u.parentNode.removeChild(u),t&&(g(t,"dragend",this),m(t),h(t,this.options.ghostClass,!1),w!==t.parentNode?(D=q(t),k(null,t.parentNode,"sort",t,w,C,D),k(this,w,"sort",t,w,C,D),k(null,t.parentNode,"add",t,w,C,D),k(this,w,"remove",t,w,C,D)):(v&&v.parentNode.removeChild(v),t.nextSibling!==x&&(D=q(t),k(this,w,"update",t,w,C,D),k(this,w,"sort",t,w,C,D))),a.active&&(k(this,w,"end",t,w,C,D),this.save())),w=t=u=x=v=y=z=F=G=A=B=E=a.active=null)},handleEvent:function(a){var b=a.type;"dragover"===b||"dragenter"===b?t&&(this._onDragOver(a),e(a)):("drop"===b||"dragend"===b)&&this._onDrop(a)},toArray:function(){for(var a,b=[],c=this.el.children,e=0,f=c.length,g=this.options;f>e;e++)a=c[e],d(a,g.draggable,this.el)&&b.push(a.getAttribute(g.dataIdAttr)||p(a));return b},sort:function(a){var b={},c=this.el;this.toArray().forEach(function(a,e){var f=c.children[e];d(f,this.options.draggable,c)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(c.removeChild(b[a]),c.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return d(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:void(c[a]=b)},destroy:function(){var a=this.el;a[J]=null,g(a,"mousedown",this._onTapStart),g(a,"touchstart",this._onTapStart),g(a,"dragover",this),g(a,"dragenter",this),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),R.splice(R.indexOf(this._onDragOver),1),this._onDrop(),this.el=a=null}},a.utils={on:f,off:g,css:i,find:j,bind:c,is:function(a,b){return!!d(a,b,a)},extend:s,throttle:r,closest:d,toggleClass:h,index:q},a.version="1.2.1",a.create=function(b,c){return new a(b,c)},a});