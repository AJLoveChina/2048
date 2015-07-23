(function(){
/*
*	2015-07-17 AJ Made This
*	--2048对一个程序员来说，最重要的是领悟它的思想
*	--this.arr 		对应的是游戏的模型（model）
*	--this.dealArr 	是控制 this.arr 数据与结构的方法
*	--this.render 	是渲染 this.arr 的方法
*	--全部代码就是如何控制(control)模型(model)来生成视图(view).
*	--如果你能感悟这些，就不枉我写这个教程了。
*	--谢谢^_^
*/
$(document).ready(function(){
	yy.start();
});

var yy = {};
yy.start = function(){
	var div = $( '#container' );
	window.m = M2048( div );
};

function M2048( div ){
	if( this instanceof M2048 ){
		this.div = div;					//容器dom对象
		var box = this.getDivInfo();	//获取容器的信息
		this.w = box.width;				//容器 div#container的width值
		this.h = box.height;
		this.cols = 4;					//几列--你可以尝试一下10行10列哦~
		this.rows = 4;					//几行
		this.arr = [];					//16个元素的数组
		this.divs = [];					//16个div
		this.ranks = [0,2,4,8,16,32,64,128,256,512,1024,2048,4096];	
										//每个等级对应显示的值，第一个0请不要改动。
										//你阔以改成什么“宫廷版”啊~~( 即2换成”侍女“ )
		this.marks = [0,2,4,8,16,32,64,128,256,512,1024,2048,4096];	
										//每个等级对应的分数
		this.result = 0;				//总分数
		this.initial();					//开始！出发\(^o^)/
	}else{
		return new M2048( div );
	}
}
M2048.prototype = {
	initial : function(){
		this.makeCssCode();		//初始化css样式(不重要)
		this.makeDivs();		//制造16(this.rows*this.cols)个div，并装入容器，用来显示每个等级对应的值（不重要）

		this.randMake();		//随机生成俩个数并在this.arr中修改（默认随机生成俩个2）
		this.render();			//渲染 this.arr 数组
		
		this.event();			//获取用户键盘“上下左右”事件	（核心）
	},
	makeDivs : function(){
		var rows = this.rows,
			cols = this.cols,
			that = this;			
		for( var i = 1; i <= rows ; i++ ){
			for( var j = 1; j <= cols; j++  ){
			
        make( i, j );

			}
		}
		function make(i,j){
			var div = document.createElement( "div" );
			$( div ).attr( 'class', 'div tran' );
			$( div ).appendTo( that.div );
			that.divs.push( div );
			
			that.arr.push({
				rank : 0,
				index : (i-1)*cols + j -1
			});
		}
	},
	makeCssCode : function(){
		var id = $( this.div ).attr( 'id' ),
			style = document.createElement( "style" ),
			w = this.w / this.cols -1,
			h = this.h / this.rows -1;
		$( style ).html("#"+id+" .div{width:"+ w +"px;height:"+ h +"px;float:left;border-right:1px solid #aaa;border-bottom:1px solid #aaa;text-align:center;line-height:"+h+"px;font-size:20px;"+
							"font-family:arial;color:#333;} .tran{transition:all 0.3s;-webkit-transition:all 0.3s;-moz-transition:all 0.3s;-o-transition:all 0.3s;-ms-transition:all 0.3s;}");
		$( style ).appendTo( document.head );
	},
	getDivInfo : function(){
		var prop = {};
		
		prop.width = $( this.div ).width();
		prop.height = $( this.div ).height();
		return prop;
	},
	randMake : function(){ //make two new items
		var num = 2,
			randNum,
			index = 0,
			total = 0;
		for( ; index <= this.rows*this.cols-1; index++ ){
			if( this.arr[index].rank === 0 ){
				total ++;
			}
		}
		if( total === 0 ){
			console.log("no blank space!");
			if( !this.check() ){
				alert( "输了啊~~" );
			}
			return true;
		}else if( total === 1 ){
			num = 1;
		}
		while( num ){
			randNum = this.rand( 0, 15 );
			if( this.arr[randNum].rank === 0 ){
				this.arr[randNum].rank = 1;
				num--;
			}
		}
	},
	check : function(){		//游戏是否结束
		var bool = false;
		var i,j;
		for(  i=1; i<=this.rows; i++ ){
			for(  j=1; j<this.cols; j++ ){
				if( this.arr[(i-1)*this.cols+j-1].rank === this.arr[(i-1)*this.cols+j].rank ){
					bool = true;
				}
			}
		}
		
		for(  j=1; j<=this.cols; j++ ){
			for(  i=1; i<this.rows; i++ ){
				if( this.arr[(i-1)*this.cols+j-1].rank === this.arr[i*this.cols+j-1].rank ){
					bool = true;
				}
			}
		}
		return bool;
	},
	rand : function( a, b ){
		return Math.round( (b-a)*Math.random() + a );
	},
	render : function(){	//渲染 this.arr 数组
		var r,g,b,
			ranksLen = this.ranks.length,
			rank;
		for( var i=0; i<this.arr.length; i++ ){
			rank = this.arr[i].rank;
			if( rank !== 0 ){
				$( this.divs[i] ).html( this.ranks[rank] );
				r = Math.floor( (1-rank/ranksLen)*255 );
				g = Math.floor( (1-rank/ranksLen)*255 );
				b = Math.floor( (1-rank/ranksLen)*255 );
				$( this.divs[i] ).css( {'backgroundColor':'rgb('+ r +','+g+','+b+')'} );
				
			}else{
				$( this.divs[i] ).css( {'backgroundColor':'white'} );
				$( this.divs[i] ).css( {'color':'black'} );
				$( this.divs[i] ).html( "" );
			}
		}
	},
	event : function(){	//37=>left; 38=>up; 39=>right; 40=>down;  
		var that = this;
		$( window ).on( "keydown", function(e){
			e.stopPropagation();
			e.preventDefault();
			if( !(e.keyCode in {37:'',38:'',39:'',40:''}) ){
				return false;
			}
			// that.printArr();
			var i, j, arr = [];
			switch( e.keyCode ){
				case 37:
					for( i = 1; i<=that.rows; i++ ){
						arr = [];
						for( j = 1; j<=that.cols; j++ ){
							arr.push( (i-1)*that.cols + j -1 );
						}
						that.dealArr( arr );
					}
					break;
				case 38:
					for( j = 1; j<=that.rows; j++ ){
						arr = [];
						for( i = 1; i<=that.cols; i++ ){
							arr.push( (i-1)*that.cols + j -1 );
						}
						that.dealArr( arr );
					}
					break;
				case 39:
					for( i = 1; i<=that.rows; i++ ){
						arr = [];
						for( j = that.cols; j>=1; j-- ){
							arr.push( (i-1)*that.cols + j -1 );
						}
						that.dealArr( arr );
					}
					break;
				case 40:
					for( j = 1; j<=that.rows; j++ ){
						arr = [];
						for( i = that.cols; i>=1; i-- ){
							arr.push( (i-1)*that.cols + j -1 );
						}
						that.dealArr( arr );
					}
					break;
			}
			// that.printArr();
			that.render();
			
			that.randMake();
			that.render();
			
			that.calculateMarks();
			// that.printArr();
		});
	},
	dealArr : function( arr ){		//核心部分
/*
	这一部分我想了许久，要怎么才能解释清楚，我想就以向左为例吧。(只有这时我才知道语文没学好是多么后悔。。)
	向左时：看第一行
	先合并：
		从左往右遍历找不是0的元素 叫X
		X从右边找一个而且是第一个 不为0又与自己 相等的元素，那就把它kill（即变为0），并把自己等级加1。
		不管X有木有找到与它相同的元素。X都成功了，继续往后遍历（记住那个被kill的已经不在这个世界了）
			
*/		
		//合并
		var i, j;
		for( i =0; i<arr.length; i++ ){
			if( this.arr[arr[i]].rank !== 0 ){
				for( j=i+1; j <arr.length; j++ ){
					if( this.arr[arr[i]].rank === this.arr[arr[j]].rank ){
						this.arr[arr[i]].rank ++;
						this.arr[arr[j]].rank = 0;
						break;
					}
				}
			}
		}
		//移位
		for( i=0; i<arr.length; i++ ){
			if( this.arr[arr[i]].rank === 0 ){
				for( j =i+1; j<arr.length; j++ ){
					if( this.arr[arr[j]].rank !== 0 ){
						this.arr[arr[i]].rank = this.arr[arr[j]].rank + 0;
						this.arr[arr[j]].rank = 0;
						break;
					}
				}				
			}
		}
	},
	printArr : function(){		//在console中打印this.arr的内容
		var back = [];
		for( var i =1; i<= this.rows; i++ ){
			back = [];
			for( var j=1; j<= this.cols; j++ ){
				back.push( this.arr[(i-1)*this.cols + j-1].rank ); 
			}
			console.log( back.join() );
		}
		console.log('----------------');
	},
	calculateMarks : function(){	//计算分数并显示
		var result = 0,
			that = this;
		this.arr.forEach(function( obj ){
			result += that.marks[ obj.rank ];
		});
		this.result = result;
		$('#scores .result').html( this.result );
	}
	
};

})();
