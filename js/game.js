var draw = {
    cxt : false,
    init : function(canvas){
        var c = document.getElementById(canvas);
        draw.cxt = c.getContext("2d");//getContext("2d") 是内建的html 5对象 拥有绘制多种图形的方法
        draw.drawDot(0,0,game.background,game.x,game.y);
    },
    drawDot : function(x,y,color,length,size){
        length = length || 10;
        size = size || 10;
        draw.cxt.fillStyle = color;
        draw.cxt.fillRect(x,y,length,size);
    },
}