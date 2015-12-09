/**
 * Hashedit (#edit) is a simple, web-based editor for static HTML sites. Learn more at hashedit.io. Download from Github at github.com/madoublet/hashedit
 * @author: Matthew Smith
 */
var hashedit = (function () {

    'use strict';

    return {

        // set version
        version: '0.4.1',

        // set debug messages
        debug: true,

        // set demo mode
        demo: false,

        stylesheet: '/node_modules/hashedit/dist/hashedit-min.css',

        // pointers to selected elements
        current: {
            container: null,
            node: null,
            parent: null,
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

        // define the drawer
        drawer: {
          page: [
            {
                text: 'Add Page',
                attr: 'hashedit-add-page'
            },
            {
                text: 'Page Settings',
                attr: 'hashedit-page-settings'
            }
          ],
          app: [
            {
                text: 'Exit',
                attr: 'hashedit-exit'
            }
          ]
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
            els = document.querySelectorAll('[hashedit] p, [hashedit] h1, [hashedit] h2, [hashedit] h3, [hashedit] h4, [hashedit] h5,[hashedit] li, [hashedit] td, [hashedit] th, [hashedit] blockquote, [hashedit] pre, [hashedit] label');

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

                span = document.createElement('span');
                span.setAttribute('class', 'hashedit-edit');
                span.innerHTML = '<span><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></g></svg></span>';

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
            hashedit.current.container.appendChild(login);

        },

        /**
         * Create the drawer
         */
        setupDrawer: function() {

            var drawer, desc, meta, x, el, option, html;

            // create a menu
            drawer = document.createElement('nav');
            drawer.setAttribute('class', 'hashedit-drawer');

            // setup drawer from hashedit.drawer
            html = '<ul>';

            html += '<li class="hashedit-drawer-title"><span>Page</span></li>'

            for(x= 0; x<hashedit.drawer.page.length; x++){
              html += '<li ' + hashedit.drawer.page[x].attr + '><a>' + hashedit.drawer.page[x].text + '</a></li>';
            }

            html += '<li class="hashedit-drawer-title"><span>App</span></li>'

            for(x= 0; x<hashedit.drawer.app.length; x++){
              html += '<li ' + hashedit.drawer.app[x].attr + '><a>' + hashedit.drawer.app[x].text + '</a></li>';
            }

            html += '</ul>';

            drawer.innerHTML = html;

            // append menu
            hashedit.current.container.appendChild(drawer);

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

                // show modal
                document.querySelector('#hashedit-page-settings').setAttribute('visible', '');
            });


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
          hashedit.current.container.appendChild(toast);

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
          if (status == 'success'){
            toast.setAttribute('success', '');
          }
          else if (status == 'failure'){
            toast.setAttribute('failure', '');
          }

          // hide toast
          setTimeout(function(){
            toast.removeAttribute('active');
          }, 2000);

        },


        /**
         * Create the menu
         */
        setupMenu: function() {

            var menu, drawer, data, xhr, url;

            // create a menu
            menu = document.createElement('menu');
            menu.setAttribute('class', 'hashedit-menu');
            menu.innerHTML = '<button class="hashedit-more"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g></svg></button><button class="hashedit-save"><svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"><g><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path></g></svg></button><div class="hashedit-menu-body"></div>';

            // append menu
            hashedit.current.container.appendChild(menu);

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

                    hashedit.showToast('Cannot save in demo mode', 'failure');

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

                            hashedit.showToast('Updates saved!', 'success');

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
            hashedit.current.parent = hashedit.findParentBySelector(element, '.hashedit-element');
            hashedit.current.node = hashedit.current.parent.firstChild;

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

                if (hashedit.demo === true) {

                    hashedit.showToast('Cannot add page in demo mode', 'failure');

                } else {

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
                                hashedit.showToast('Page added at ' + url, 'success');

                            };

                        }
                    }
                    else{
                        // show success
                        hashedit.showToast('URL required', 'failure');
                    }
                }

            });

            // handle page creation
            document.querySelector('[hashedit-exit]').addEventListener('click', function() {

                // redirect without #edit
                var url = hashedit.replaceAll(window.location.href, '#edit', '');

                // redirect to the URL
                window.location.href = url;

            });

            // handle page creation
            document.querySelector('[hashedit-apply-page-settings]').addEventListener('click', function() {


                if (hashedit.demo === true) {

                    hashedit.showToast('Cannot save settings in demo mode', 'failure');

                } else {

                    // get params
                    title = document.getElementById('hashedit-page-title').value;
                    description = document.getElementById('hashedit-page-desc').value;


                    // set params
                    params = {
                        'title': title,
                        'description': description
                    };

                    if (hashedit.pageSettingsURL) {

                        // construct an HTTP request
                        xhr = new XMLHttpRequest();
                        xhr.open('post', hashedit.pageSettingsURL, true);
                        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

                        // send the collected data as JSON
                        xhr.send(JSON.stringify(params));

                        xhr.onloadend = function() {

                            // hide modal
                            document.getElementById('hashedit-page-settings').removeAttribute('visible');

                            // show success
                            hashedit.showToast('Settings updated successfully!', 'success');

                        };

                    }
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
        setup: function(config){
            if(window.location.href.indexOf('#edit') != -1){
                hashedit.setupEditor(config);
            }
        },

        /**
         * Setup the editor
         * @param {Array} config.sortable
         */
        setupEditor: function(config) {

            console.log('Hashedit version: ' + hashedit.version);

            // create container
            hashedit.current.container = document.createElement('div');
            hashedit.current.container.setAttribute('class', 'hashedit-container');
            hashedit.current.container.setAttribute('id', 'hashedit-container');

            // set stylesheet
            if(config.stylesheet !== null){
                hashedit.stylesheet = config.stylesheet;
            }

            // append container to body
            document.body.appendChild(hashedit.current.container);

            // append scoped stylesheet to container
            var style = document.createElement('style');
            style.innerHTML = '@import url(' + hashedit.stylesheet + ')';

            hashedit.current.container.appendChild(style);

            // check auth
            if (config.demo === true) {

                hashedit.demo = true;

                // init hashedit
                hashedit.init();
                hashedit.setActive();
                hashedit.setupSortable(config.sortable);
                hashedit.setupContentEditableEvents();
                hashedit.setupMenu(config.path);
                hashedit.setupToast();
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
                            hashedit.setupToast();
                            hashedit.setupDrawer();
                            hashedit.createMenu(config.path);
                            hashedit.loadHTML(config.path);

                            // setup loaded event
                            var event = new Event('hashedit.loaded');
                            document.dispatchEvent(event);

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

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    };

}());