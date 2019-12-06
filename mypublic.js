//根据给定的id查找页面元素
function $id(id){
	return document.getElementById(id);
}
//获取任意区间值
function rand(min,max){
    return  Math.round( Math.random()*(max-min) + min )
}

//定义一个函数 功能获取一个随机的颜色值
function getColor(){
	var str = "0123456789abcdef";// 0--15
	//从str中随机获取六位 拼成一个颜色
	var color = "#";
	for( var i = 0 ; i < 6 ; i++ ){
		//德大str中 0--15随机下标
		var index = rand(0,15);
		color += str.charAt(index);
	}
	return color;
}

//函数功能 ：显示自定义的日期时间格式 参数now为标准日期格式 转为 YYYY-MM-DD hh:mm:ss
function dateToString(now){
	var str1 = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
	var h = toTwo( now.getHours() );
	var m = toTwo( now.getMinutes() );
	var s = toTwo( now.getSeconds() );

	var str2 =h +":"+m+":"+s;

	return str1 + " " + str2;
}


//函数功能 ：  判断传递的参数是否小于10  如果小于10 就在数字前面拼接 0
function toTwo(num){
	//返回一个两位数
	return num<10 ? "0"+num : num;
}

//函数功能 ： 将字符串转成日期时间格式
function stringToDate(str){
	return new Date(str);
}
//时间差 函数
function diff(start,end){
	//返回时间差 单位 秒
	return Math.abs(start.getTime()-end.getTime()) /1000;
}

//创建一个元素
function create(ele){
	return document.createElement(ele);
}

//碰撞函数
function pz(d1,d2){
	var L1 = d1.offsetLeft;
	var R1 = d1.offsetWidth + d1.offsetLeft;
	var T1 = d1.offsetTop;
	var B1 = d1.offsetHeight + d1.offsetTop;

	var L2 = d2.offsetLeft;
	var R2 = d2.offsetWidth + d2.offsetLeft;
	var T2 = d2.offsetTop;
	var B2 = d2.offsetHeight + d2.offsetTop;

	//碰不上的条件
	if( R1<L2||L1>R2||B1<T2||T1>B2 ){
		return false;
	}else{
		return true;
	}
}

//  变速运动函数、、、、、、、、、、、、、、、、
//变换选项函数
function startMove(obj,json,callback){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var flag = true;//假设值为true时   所有运动结束了  可以停止定时器
		for( var attr in json ){
			//获取实际内容样式值
			var current;
			if( attr == "opacity" ){
				current =parseFloat( getStyle(obj,attr) )*100 ;
			}else if( attr == "zIndex" ){
				current =parseInt( getStyle(obj,attr) ) ;
			}else{
				current =parseInt( getStyle(obj,attr) ) ;
			}
			var speed = (json[attr]-current)/10;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
			if( current != json[attr] ){
				//如果没有达到目标值  就关闭开关变量为false
				flag = false;
			}
			//设置样式值
			if( attr == "opacity" ){
				obj.style.opacity = (current + speed)/100;
			}else if( attr == "zIndex" ){
				obj.style.zIndex = json[attr];
			}else{
				obj.style[attr] = current + speed + "px";
			}
		}

		//循环结束后  如果flag值为true   停止定时器
		if( flag ){
			clearInterval(obj.timer);
			//上移动作完成  开始进入下一个动作
			// 实现下一个动作代码
			if( callback ){//判断如果存在下一个动作  就执行
				callback();
			}
		}
	},30)
}

 //获取样式函数
function getStyle(obj,attr){
	return window.getComputedStyle?window.getComputedStyle(obj,false)[attr]:obj.currentStyle[attr];
}



//ajax函数
function getajax(url,callback,data){
	var ajax = null;
	ajax = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft XMLHTTP");
	if(data){
		url = url + "?" + data;
	}
	ajax.open("get",url);
	ajax.send();
	ajax.onreadystatechange = function(){
		if(ajax.status == 200 && ajax.readyState == 4){
			callback( JSON.parse(ajax.responseText) );
		}
	}
}


//ajax promise对象函数
function getajaxpromise(url,data){
	if(data){
		url = url + "?" + data;
	}
	var pro = new Promise(function(success,failed){
		var ajax = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft XMLHTTP");
		ajax.open("GET",url);
		ajax.send();
		ajax.onreadystatechange = function(){
			if(ajax.status = 200 && ajax.readyState == 4){
				success( JSON.parse( ajax.responseText) );
			}
		}
		setTimeout(function(){
			failed("请求失败");
		},3000)

	});
return pro;
}


	//jQuery拖拽插件
//	$.fn.extend({
//		down : function(){
//			this.mousedown(function(e){
//				this.disx = e.pageX-this.offset().left;
//				this.disy = e.pageY-this.offset().top;
//				this.move();
//				this.up()
//			}.bind(this))
//		},
//		move : function(){
//			$(document).bind("mousemove",function(e){
//				this.css({
//					left : e.pageX-this.disx,
//					top : e.pageY - this.disy
//				})
//			}.bind(this))
//		},
//		up : function(){
//			this.mouseup(function(){
//				$(document).unbind("mousemove");
//			})
//		}
//	})


//  value值  类型是一个  对象
//存取cookie
function setCookie(key,value,days){
	var now = new Date();
	now.setTime(now.getTime() + days*24*60*60*1000 )
	document.cookie=key+"="+value + ";expires="+now;
}
function getCookie(key){
	//如果cookie中有数据  才可以获取数据
	if(document.cookie){
		var cookieInfo = document.cookie;
		//cookie中可能会包含一些 额外的数据，这些数据特点是由   分号和空格间隔的
		//所以 先将 分号和空格  替换掉   替换成  ;
		var arr = cookieInfo.replace(/;\s/g,';').split(";");
		for(var i=0;i<arr.length;i++){
			item = arr[i].split("=");
			if(item[0] == key){
				brr = item[1];
				return JSON.parse(brr);//如果找到 我们想要的键，将值转成数组返回
			}
		}
		//如果cookie中 没有我们想获取的键值，直接返回一个空数组
		return [];
	}
	//如果cookie中没有数据，直接返回一个空数组
	return [];
}
function removeCookie(key){
	setCookie(key,"",-1);
}

//判断素数
function isPrimerNumber( m ){
	for( var i=2 ; i<=m-1 ; i++){
		if( m%i==0 ){
			return false;
		}
	}
	return true;
}


//判断闰年
function isLeapYear( m ){
	if( m%4==0 && m%100!=0 || m%400==0 ){
		return true;
	}
	return false;
}


//1,数组去重:判断原数组中的每一个数在空数组中是否存在，如果不存在，就将该数存入到新空数组中
function arrayRROne(arr){
	var brr=[];
	for(var i=0; i<arr.length; i++){
		if( brr.indexOf( arr[i] )==-1 ){
			brr.push( arr[i] );
		}
	}
	return brr;
}
//2.数组去重：先将原数组排序，在将新数组中第N个数和N+1个数比较，不相同就把第N个数添加到一个空数组中
function arrayRRTwo(arr){
	var arr=arr.sort( function( a, b ){
		return a - b;
	});
	var brr=[];
	for(var i=0; i<arr.length; i++){  //类似冒泡排序
		if( arr[i]!=arr[i+1] ){
		brr.push( arr[i] );
		}
	}
	return brr;
}
//3.数组去重：双重for循环去重：两两比较如果相等的话就利用splice()方法删除第二个
function arrayRRThree(arr){
	for(i=0;i<arr.length;i++){
		for(j=1+i; j<arr.length; j++){	 //类似选择排序
			if( arr[i]==arr[j] ){
				arr.splice(j,1);
			}
		}
	}
	return arr;
}
//4.数组去重:利用对象的思想 如果对象里没有这个属性的话就会返回undefined利用这个原理当返回的是undefined时 让其放入数组 然  后在给这个属性赋值
function arrayRRFour(arr) {
	var obj = {};
	var drr = [];
	for(var i = 0; i < arr.length; i++) {
		if(obj[arr[i]] == undefined) {
			drr.push(arr[i]);
			obj[arr[i]] = 1;
		}
	}
	return drr;
}

//5.数组去重:循环比较如果相等的让后面的元素赋值为0， 最后在输出的时候删除为0的!!!
//===但是===赋值的时候 ,所赋的值不能是原数组里存在的值，如果原数组存在这个值，会把原数组的值也去掉！！！
function arrayRRFive(){
	var drr= [];
	//控制外循环
	for(var i=0; i<arr.length-1;i++){  //内存循环 只比较后面的
		for(j=i+1;j<arr.length;j++){  //如果相等就让其值等于0
			if(arr[i]==arr[j]){
				arr[j]=0;
			}
		}
		if(arr[i]==0){  //去除值为0的
			continue;
		}else{
			drr.push(arr[i]); //放入新的数组
		}
	}
	return drr;
}

 // 时间段 秒格式化为 时分秒（00:00:00）
function secToTime (cellValue) {
    if ((cellValue !== 0) && !cellValue) {
      return 'wrong'
    }
    let t = ''
    if (cellValue >= 0) {
      let hour = Math.floor(cellValue / 3600)
      let min = Math.floor(cellValue / 60) % 60
      let sec = cellValue % 60
      hour < 10 ? t += '0' + hour + ':' : t += hour + ':'
      min < 10 ? t += '0' + min + ':' : t += min + ':'
      sec < 10 ? t += '0' + sec : t += sec
    } else {
      t = 'wrong'
    }
    return t
  }


//数组随机打乱顺序
function arrOrder (arr) {
	let len = arr.length
	while (len) {
		let lastItem = arr[--len]
		let targetNum = Math.floor(Math.random() * len )
		let targetItem = arr[targetNum]
		arr[targetNum] = lastItem
		arr[len] = targetItem
	}
	return arr
}



