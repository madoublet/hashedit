# Hashedit (or #edit)

### What if you could append #edit to the end of a URL to edit it?

Hashedit aims to make that notion a reality.  It is a framework agnostic WYSIWYG editor for static web sites.  Hashedit supports inline rich text editing; the creation and destruction of HTML blocks (and elements); editing of links and images; and drag-and-drop reordering powered by the fantastic Sortable Library.  Hashedit is built in plain JS with just the Sortable dependency.  

### Status

We are in early, early pre-beta.  Expect changes to occur frequently as we build up the library.

### Installation

The best way to get started with Hashedit is to install Hashedit Spark.  Hashedit Spark is a Express (NodeJS) powered starter app that is built specifically to help you create sites using Hashedit.  Learn more:

https://github.com/madoublet/hashedit-spark

### Using Hashedit without Spark

##### 1. Install Hashedit

```
bower install hashedit
```

##### 2. Add a reference to the CSS/JS

```
<link type="text/css" href="/bower_components/hashedit/dist/hashedit-min.css" rel="stylesheet">
<script src="/bower_components/hashedit/dist/hashedit-min.js"></script>
```

##### 3. Add the following JS snippet before any other script

This script looks for the #edit in the URL and then writes the annotated (e.g. HTML modified with data-ref attributes) HTML from localStorage to the browser.

```
<!-- #edit -->
<script>function write(){html=localStorage.getItem(key),document.body.innerHTML=html}if(-1!=window.location.href.indexOf("#edit")){var key=window.location.href;null!=localStorage.getItem(key)&&write()}</script>
```

##### 4. Specify which elements are editable

You specify which elements are editable using the hashedit attribute.  You must also specify a hashedit-selector attribute so the app knows which HTML to replace when the save button is clicked.

```
<div id="editable-div" hashedit hashedit-selector="#editable-div">
```

##### 5. Setup Hashedit

The JS looks for the #edit in the URL and then calls setup on the hashedit singleton.  You must specify a path to the library and an array of selectors to make sortable.

```
<script>
	
// initialize hashedit
if(window.location.href.indexOf('#edit') != -1){

  // setup hashedit
  hashedit.setup({
    path: '/bower_components/hashedit/',
    sortable: ['.column']  
  });

}

// reload the page when hash changes to #edit
window.onhashchange = function(){
    if(window.location.href.indexOf('#edit') != -1){
        location.reload();
    }
}
</script>
```

### Building Hashedit

##### 1. Install dependencies (via Bower)

```
bower install Sortable
bower install dropzone
```

##### 2. Install gulp tools

```
npm install --global gulp
npm install --save-dev gulp
npm install --save-dev gulp-concat
npm install --save-dev gulp-minify-css
npm install --save-dev gulp-rename
npm install --save-dev gulp-minify
```

##### 3. Run Gulp

```
gulp
```

### Acknowledgements 

##### Sorting powered by Sortable
http://rubaxa.github.io/Sortable/

##### Polymer Iron Iconset
https://elements.polymer-project.org/elements/iron-icons?view=demo:demo/index.html