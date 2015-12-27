var hashedit = hashedit || {};

hashedit.app = (function () {

    'use strict';

    return {

        authUrl: '/api/auth',

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

        /**
         * Create the auth
         */
        showAuth: function() {

            // create a login
            var login = document.createElement('nav');
            login.setAttribute('class', 'hashedit-login');
            login.innerHTML = 'You need to signin to begin editing. <a href="/auth/google">Sign In with Google</a>';

            // append menu
            if(hashedit.current){
                hashedit.current.container.appendChild(login);
            }
            else{
                document.body.appendChild(login);
            }

        },

        /**
         * Create the drawer
         */
        setupDrawer: function() {

            var drawer, desc, meta, x, el, option, html;

            // toggle drawer
            document.querySelector('.hashedit-more').addEventListener('click', function() {

                drawer = document.querySelector('.hashedit-drawer');

                if (drawer.hasAttribute('visible')) {
                    drawer.removeAttribute('visible');
                } else {
                    drawer.setAttribute('visible', '');
                }

            });

            // create a menu
            drawer = document.createElement('nav');
            drawer.setAttribute('class', 'hashedit-drawer');

            // setup drawer from hashedit.app.drawer
            html = '<ul>';

            html += '<li class="hashedit-drawer-title"><span>Page</span></li>'

            for(x= 0; x<hashedit.app.drawer.page.length; x++){

                if(hashedit.app.drawer.page[x].attr != null){
                    html += '<li ' + hashedit.app.drawer.page[x].attr + '><a>' + hashedit.app.drawer.page[x].text + '</a></li>';
                }
                else if(hashedit.app.drawer.page[x].href != null){
                    html += '<li><a href="' + hashedit.app.drawer.page[x].href + '">' + hashedit.app.drawer.page[x].text + '</a></li>';
                }


            }

            html += '<li class="hashedit-drawer-title"><span>App</span></li>'

            for(x= 0; x<hashedit.app.drawer.app.length; x++){
                if(hashedit.app.drawer.app[x].attr != null){
                    html += '<li ' + hashedit.app.drawer.app[x].attr + '><a>' + hashedit.app.drawer.app[x].text + '</a></li>';
                }
                else if(hashedit.app.drawer.app[x].href != null){
                    html += '<li><a href="' + hashedit.app.drawer.app[x].href + '">' + hashedit.app.drawer.app[x].text + '</a></li>';
                }
            }

            html += '</ul>';

            drawer.innerHTML = html;

            // append menu
            if(hashedit.current){
                hashedit.current.container.appendChild(drawer);
            }
            else{
                document.body.appendChild(drawer);
            }

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
            if(hashedit.current){
                hashedit.current.container.appendChild(toast);
            }
            else{
                document.body.appendChild(toast);
            }

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

        }

    }

}());