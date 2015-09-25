// create namespace
var hashedit = hashedit || {};

// setup menu
hashedit.menu = [
	{
		"action":	"hashedit.h1",
		"selector":	"h1",
		"title":	"H1 Headline",
		"display":	"H1"
	},
	{
		"action":	"hashedit.h2",
		"selector":	"h2",
		"title":	"H2 Headline",
		"display":	"H2"
	},
	{
		"action":	"hashedit.h3",
		"selector":	"h3",
		"title":	"H3 Headline",
		"display":	"H3"
	},
	{
		"action":	"hashedit.h4",
		"selector":	"h4",
		"title":	"H4 Headline",
		"display":	"H4"
	},
	{
		"action":	"hashedit.h5",
		"selector":	"h5",
		"title":	"H5 Headline",
		"display":	"H5"
	},
	{
		"action":	"hashedit.p",
		"selector":	"p",
		"title":	"Paragraph",
		"display":	"P"
	},
	{
		"action":	"hashedit.blockquote",
		"selector":	"blockquote",
		"title":	"Blockquote",
		"display":	"<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'></path></g></svg>"
	},
	{
		"action": "hashedit.ul",
		"selector": "ul",
		"title": "Unordered List",
		"display": "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12.17c-.74 0-1.33.6-1.33 1.33s.6 1.33 1.33 1.33 1.33-.6 1.33-1.33-.59-1.33-1.33-1.33zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z'></path></g></svg>"
	},
	{
		"action": "hashedit.ol",
		"selector": "ol",
		"title": "Ordered List",
		"display": "<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' style='pointer-events: none; display: block;'><g><path d='M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z'></path></g></svg>"
	}
];


// blockquote element
hashedit.blockquote = {
	
	// creates blockquote
	create:function(){
	
		hashedit.append('<blockquote></blockquote>');
		
	}
	
};

// h1 element
hashedit.h1 = {
	
	// create element
	create:function(){
	
		hashedit.append('<h1></h1>');
		
	}
	
};

// h2 element
hashedit.h2 = {
	
	// creates h2
	create:function(){
	
		hashedit.append('<h2></h2>');
		
	}
	
};

// h3 element
hashedit.h3 = {
	
	// creates h3
	create:function(){
	
		hashedit.append('<h3></h3>');
		
	}
	
};

// h4 element
hashedit.h4 = {
	
	// creates h4
	create:function(){
	
		hashedit.append('<h4></h4>');
		
	}
		
};

// h5 element
hashedit.h5 = {
	
	// creates h5
	create:function(){
	
		hashedit.append('<h5></h5>');
		
	}
	
};

// p element
hashedit.p = {
	
	// creates p
	create:function(){
	
		hashedit.append('<p></p>');
		
	}
	
};

// ul element
hashedit.ul = {
	
	// creates ul
	create:function(){
	
		hashedit.append('<ul><li></li></ul>');

	}
	
};

// ol element
hashedit.ol = {
	
	// creates ul
	create:function(){
	
		hashedit.append('<ol><li></li></ol>');

	}
	
};