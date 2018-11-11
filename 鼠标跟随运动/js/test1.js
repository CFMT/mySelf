$(function(){
	$(".cursorPlay li").on("mouseenter mouseleave",function(event){
		var inOrOut = event.type;
		//console.log(inOrOut);
		var direction = getDir($(this),{
			x:event.pageX,
			y:event.pageY
		})
		
		
		moveTo($(this),direction,inOrOut);
		//获取从哪个方向进入
		//获取鼠标移入点的坐标
		
	});
	
	function getDir($ele,coord){
		var inX = coord.x;
		var inY = coord.y;
		
		//获取图片的宽度、高度
		var w = $ele.width();
		var h = $ele.height();
		//判断划入的方向0,1,2,3各代表上，右，下，左
		var x = (inX - $ele.offset().left - (w / 2)) * (w > h ? (h / w) : 1);
		var y = (inY - $ele.offset().top - (h / 2)) * (h > w ? (w / h) : 1);
		var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
		
		return direction;
	}
	
	function moveTo($ele,direction,inOrOut){
			var $div = $ele.find("div");
			if(inOrOut == "mouseenter"){
				switch (direction){
					case 0:
						$div.css({top:"-100%",left:0});	
						$div.animate({top:0,left:0});
						console.log("上")
						break;
					case 1:
						$div.css({top:"0%",left:"100%"});	
						$div.animate({top:0,left:0});
						console.log("右")
						break;
					case 2:
						$div.css({top:"100%",left:0});	
						$div.animate({top:0,left:0});
						console.log("下")
						break;
					case 3:
						$div.css({top:"0%",left:"-100%"});	
						$div.animate({top:0,left:0});
						console.log("左")
						break;
					default:
						break;
				}
			}else{
				switch (direction){
					case 0:
						$div.animate({top:"-100%",left:0});
						console.log("上")
						break;
					case 1:
						$div.animate({top:0,left:"100%"});
						console.log("右")
						break;
					case 2:
						$div.animate({top:"100%",left:0});
						console.log("下")
						break;
					case 3:
						$div.animate({top:0,left:"-100%"});
						console.log("左")
						break;
					default:
						break;
				}
			}
				
	}
});
