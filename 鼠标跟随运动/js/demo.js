$(function(){
	$(".cursorPlay li").on("mouseenter mouseleave",function(event){
		var inOrOut = event.type;
		//console.log(inOrOut);
		var direction = getDir($(this),{
			x:event.pageX,
			y:event.pageY
		});
		
		moveTo($(this),direction,inOrOut);
		
	});
	
	function getDir ($ele,coord) {
		//console.log("1x:"+coord.x+"y:"+coord.y)
		var w = $ele.width(),
			h = $ele.height(),
			x = coord.x - $ele.offset().left - w/2,
			y = coord.y - $ele.offset().top -  h/2;
		var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4; 
		//console.log(direction)
	//	console.log("2x:"+x+"y:"+y)
		return direction;
	}
	
	function moveTo($ele,direction,inOrOut){
		var $oDiv = $ele.find("div");
		var moveData = {};
		//console.log(inOrOut);
		if(inOrOut == "mouseenter"){
			switch (direction){
				case 0:
					$oDiv.css({"top":"-100%","left":0});
					console.log("上方进来啦");
					break;
				case 1:
					$oDiv.css({"top":0,"left":"100%"});
					console.log("右方进来啦");
					break;
				case 2:
					$oDiv.css({"top":"100%","left":0});
					console.log("下方进来啦");
					break;
				case 3:
					$oDiv.css({"top":0,"left":"-100%"});
					break;
			}
			moveData ={"left":0,"top":0}
			
		}else if(inOrOut == "mouseleave"){
			switch (direction){
				case 0:
					moveData = {"top":"-100%","left":0};
					console.log("上方出去啦");
					break;
				case 1:
					moveData = {"top":0,"left":"100%"};
					console.log("右方出去啦");
					break;
				case 2:
					moveData = {"top":"100%","left":0};
					console.log("下方出去啦");
					break;
				case 3:
					moveData = {"top":0,"left":"-100%"};
					console.log("左方出去啦");
					break;
			}
		}
		
		$oDiv.stop().animate(moveData,300);
	}
});
