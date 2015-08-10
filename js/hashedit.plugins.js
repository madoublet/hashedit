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
		"display":	"<svg viewBox='0 0 24 24' height='100%' width='100%' preserveAspectRatio='xMidYMid meet' fit='' style='pointer-events: none; display: block;'><g><path d='M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z'></path></g></svg>"
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