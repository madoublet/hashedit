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