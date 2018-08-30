//游戏选项
var Game = {
    x : 500,
    y : 500,
    size : 50,
    endstatus : 0,
    status : 0,
    background : "black",
    score : 0,
    canvas : "",
    pieceImg : [],
    init : function(canvas){
        this.canvas = canvas
        draw.init(this.canvas);//初始化画布
        draw.drawRect(0,0,this.x,this.y,this.background);//初始化游戏背景

        //need refactor
        var imgArr = ['blue','yellow','red','green','orange'];
        for(var i=0;i<5;i++){
            var img = new Image();
            img.src = "img/"+imgArr[i]+".png";
            this.pieceImg[i] = img;
        }
        //console.log(this.pieceImg);
        Happywipe.init();
    },
    
    restart : function(){
        this.init();
    },
    start : function(){
        this.init();
    },
}



var draw = {
    ctx : false,
    init : function(canvas){
        var c = document.getElementById(canvas);
        //getContext("2d") 是内建的html 5对象 
        this.ctx = c.getContext("2d");
    },
    
    //画矩形 无填充
    drawRect : function(x, y, length, size, color){
        this.ctx.fillStyle = color;
        this.ctx.strokeRect(x,y,length,size);
    },
    
    //绘制填充的矩形
    fillRect : function(x, y, length, size, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,length,size);
    },
    
    //清除指定像素
    clearRect : function(x, y, length, size){
        this.ctx.clearRect(x, y, length, size);
    },
    
    //画图像
    drawImage : function(img, x, y, width, height){
        this.ctx.drawImage(img, x, y, width, height);
    },
    
    //返回图像的数据
    getImageData : function(x, y, length, size){
        return this.ctx.getImageData(x, y, length, size);
    },
    
    //将图像的数据填充到某一个坐标
    putImageData : function(img, x, y){
        this.ctx.putImageData(img, x, y);
    },
    
    
    //方块下落动画
    fallDown : function(){
       //do something  
    },
    
        
        
    //方块消失动画
    disappear : function(flag, x, y, length, size){
        this.clearRect(x, y, length, size);
        length = length-4;
        size = size-4;
        x = x+2;
        y = y+2;
        if(length>0 && size>0){
            this.drawImage(Game.pieceImg[flag], x, y, length, size);
            setTimeout(function(){
                draw.disappear(flag, x, y, length, size);
            },100);
        }
    },
    
    //生成方块动画
    appear : function(img, x, y, length, size){
        this.drawImage(img, x, y, length, size);
        setTimeout(function(){
                draw.appear(img, x, y, length, size);
        },1000);
    }
    
}




var Happywipe = {
    nowPosition : {x:0,y:0},
    pieces : [],
    wipe : [],
    
    //初始化
    init : function(){
        this.pieces = Array(10);
        for(var i=0;i<10;i++){
            this.pieces[i] = new Array(10);
            for(var j=0;j<10;j++){
                draw.drawRect(i*50,j*50,50,50,Game.background);//画方格
                var flag = Helpers.random(0,4);
                this.pieces[i][j] = flag+1;
                
                draw.appear(Game.pieceImg[flag], i*50, j*50, 46, 46);
                //draw.drawImage(Game.pieceImg[flag], i*50, j*50, 46, 46);
            }
        }
        
        
        //var testdata = this.offset2posion(1,1);
        //var flag = this.pieces[1][1];
        //draw.disappear(flag, testdata.x,testdata.y,46,46);
        
        
        this.checkWipe();
        //this.printAll();
        this.fillPiece();
        
    },
    
    //消除重复元素
    wipePieces : function(){
        //console.log(this.wipe.length);
        if(this.wipe.length > 0){
            for(var w in this.wipe){
                var wx = this.wipe[w].x;
                var wy = this.wipe[w].y;
                var wv = this.wipe[w].value;
                this.clearPiece(wx,wy,wv);
                this.pieces[wx][wy] = 0;
            }
            this.wipe = [];
        }
        return true;
    },
    
    //消除后填充新的方块  自下而上遍历 如果为空 则去上元素最近的一个元素作为当前元素 调用下落动画效果 如果上面所有元素都是空元素 则生成最顶部元素  调用下落动画效果
    fillPiece : function(){
        for(var i=0; i<10; i++){
            for(var j=9; j>=0; j--){
                if(this.pieces[i][j] == 0){
                    var fillPosition = this.searchRow(this.pieces[i], j)
                    if( fillPosition == -1){
                        var tempFlag = Helpers.random(0,4)
                        this.pieces[i][j] = tempFlag+1;
                        this.dorwPiece(tempFlag,i,j);
                    }else{
                        this.pieces[i][j] = this.pieces[i][fillPosition];
                        this.dorwPiece(this.pieces[i][fillPosition]-1,i,j);
                        this.pieces[i][fillPosition] = 0;
                    }
                }
            }
        }
        
        this.checkWipe();
    },
    
    //对数组逆遍历  找到数组不为空的元素
    searchRow : function(row, start){
        while(start>=0){
            if(row[start] > 0){
                break;
            }
            --start;
        }
        return start;
    },
    
    //交换两个块的元素以及图像
    swapPiece : function(offsetx, offsety, destOffextx, destOffexty){
        var prePosion = this.offset2posion(offsetx, offsety);
        var afterPosion = this.offset2posion(destOffextx, destOffexty)
        var preImg = draw.getImageData(prePosion.x, prePosion.y, 46, 46);
        var afterImg = draw.getImageData(afterPosion.x, afterPosion.y, 46, 46);
        draw.clearRect(prePosion.x, prePosion.y, 49, 49);
        draw.clearRect(afterPosion.x, afterPosion.y, 49, 49);
        draw.putImageData(preImg, afterPosion.x, afterPosion.y);
        draw.putImageData(afterImg, prePosion.x, prePosion.y);
        
        //交换两个块中的值
        var temp = this.pieces[offsetx][offsety];
        this.pieces[offsetx][offsety] = this.pieces[destOffextx][destOffexty];
        this.pieces[destOffextx][destOffexty] = temp;
        this.checkWipe();
        this.wipePieces();
        this.fillPiece();
    },
    
    
    //把数组下标转换成坐标
    offset2posion : function(offsetx, offsety){
        var x = 50*offsetx;
        var y = 50*offsety;
        return {"x" :x , "y":y};
    },
    
    //把坐标转换成数组下标
    posion2offset : function(x, y){
        var offsetx = parseInt(x/50);
        var offsety = parseInt((y-250)/50);
        return {"offsetx":offsetx,"offsety":offsety};
    },
    
    
    run : function(){
        //
    },
    
    
    //打印所有元素
    printAll : function(){
        for(var p in this.pieces){
            console.log(this.pieces[p]);
        }
    },
    
    
    //检测待消除栈的元素是否满足入栈条件
    checkCanPushWipe : function(stack){
        if(stack.length >= 3){
            return true;
        }
        return false;
    },
    
    //将等待消除栈中的元素移到消除栈中
    pushWipe : function(stack){
        if(this.checkCanPushWipe(stack)){
            for(var s in stack){
                this.wipe.push(stack[s]);
            }
        }
    },
    
    //检测是否要清空预消除栈
    checkCanPushPreStack : function(stack, value){
        if(stack.length > 0){
            if(value != stack[stack.length-1].value){
                return true;
            }
        }
        return false;
    },

    //检测是否可以消去
    canWipe : function(){
        for(var i=0;i<10;i++){
            var line = this.pieces[i][0];
            var row = this.pieces[0][i];
            var lflag = 0;
            var rflag = 0;
            for(var j=0; j<10; j++){
                if(line == this.pieces[i][j]){
                    lflag++;
                }
                if(row == this.pieces[j][i]){
                    rflag++;
                }
                if(lflag>=3 || rflag>=3){
                    return true;
                }
            }
        }
        return false;
    },
    
    //消去方块 
    checkWipe : function(){
        //行与列 
        //此处用栈来实现 先第一个元素入栈  再判断第二个元素的值是否和第一个元素相等 如果相等则入栈 如果不相等则判断栈的长度 如果大于等于3 则记录下标 等待消去 如果栈的长度小于3 清空栈 当前元素入栈
        //i是列   j是行
        var wipeLineStack = new Array();
        var wipeRowStack = new Array();
        for(var i=0;i<10;i++){
            this.pushWipe(wipeLineStack);
            this.pushWipe(wipeRowStack);
            wipeLineStack = [];
            wipeRowStack = [];
            
            for(var j=0; j<10; j++){
                //判断行
                var lineP = {"x":j,"y":i,"value":this.pieces[j][i]};
                if(this.checkCanPushPreStack(wipeLineStack, this.pieces[j][i])){
                    this.pushWipe(wipeLineStack);
                    wipeLineStack = [];
                }
                wipeLineStack.push(lineP);
                
                //判断列
                var rowP = {"x":i,"y":j,"value":this.pieces[i][j]};
                if(this.checkCanPushPreStack(wipeRowStack, this.pieces[i][j])){
                    this.pushWipe(wipeRowStack);
                    wipeRowStack = [];
                }
                wipeRowStack.push(rowP);
                
            }
        }

        if(this.wipe.length > 0){
            if(this.wipePieces()){
                this.fillPiece();
            }
        }
    },
    
    
    //根据数组下标画一个方块
    dorwPiece : function(flag, offsetx, offsety){
        var position = this.offset2posion(offsetx, offsety);
        draw.drawImage(Game.pieceImg[flag], position.x, position.y, 46, 46)
    },
    
    //清除方块
    clearPiece : function(offsetx, offsety, flag){
        var Posion = this.offset2posion(offsetx, offsety);
        draw.disappear(flag-1, Posion.x, Posion.y, 49, 49);
        draw.clearRect();
    }
}


document.getElementById("myCanvas").onmousedown = function(e){
    Happywipe.nowPosition.x = e.clientX;
    Happywipe.nowPosition.y = e.clientY;
}


document.getElementById("myCanvas").onmouseup = function(e){

    var a = Happywipe.posion2offset(Happywipe.nowPosition.x,Happywipe.nowPosition.y);
    var ax = a.offsetx;
    var ay = a.offsety;
    
    var b = Happywipe.posion2offset(e.clientX, e.clientY);
    var bx = b.offsetx;
    var by = b.offsety;

    if(ax<bx && ay==by){
        //右移
        Happywipe.swapPiece(ax, ay, ax+1, ay);
    }else if(ax>bx && ay==by){
        Happywipe.swapPiece(ax, ay, ax-1, ay);
        //alert("左移")
    }else if(ax==bx && ay<by){
        Happywipe.swapPiece(ax, ay, ax, ay+1);
        //alert("下移")
    }else if(ax==bx && ay>by){
        Happywipe.swapPiece(ax, ay, ax, ay-1);
        //alert("上移")
    }else{
        console.log("无效移动");
        //alert("无效移动")
    }

}



//辅助类函数
var Helpers = {
    random : function(min, max){
        return Math.floor(Math.random()*(max,min))+min;
    },
}