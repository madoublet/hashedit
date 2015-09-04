		// .block-actions
		var arr = document.querySelectorAll('.block-actions');
		
		for(var x=0; x<arr.length; x++){
		
			// delegate CLICK, FOCUS event
			['click'].forEach(function(e){
			
		    	arr[x].addEventListener(e, function(e){
		    	
		    		var el = e.target;
		    	
			    });
			    
			});
			
		}
		
var li = document.querySelector('#pageUrl li');
						li.classList.remove('selected');