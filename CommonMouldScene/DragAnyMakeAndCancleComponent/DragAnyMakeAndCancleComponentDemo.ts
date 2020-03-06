// from 刘斌毅
// need:    设置 view width height
//           rectCanSet 可放置区域
//          btnReset 重置按钮
//          curComponentIndex 当前component 在this的索引index
//          ImgList 可以拖动的图片
// desc:    点击图片       生成新图片 
//          拖动        
//          拖动结束       可放置区域放置 随意放置
//          左侧 和右侧是相同组件 需要共同初始化
//              
//          左侧和右侧 控件相同
class DragAnyMakeAndCancleComponentDemo extends UIObject {

    static key:string = "Page12Scene";

    private leftView:DragAnyMakeAndCancleComponent = null
    private rightView:DragAnyMakeAndCancleComponent = null

    private group:eui.Group;
    private btnReset:eui.Image;

    private img_left1:eui.Image;
    private img_left2:eui.Image;
    private img_left3:eui.Image;
    private rect_left:eui.Rect;

    private img_right1:eui.Image;
    private img_right2:eui.Image;
    private img_right3:eui.Image;
    private rect_right:eui.Rect;

    public constructor() {
        super();
        this.skinName = "Page12Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {
        this.leftView = new DragAnyMakeAndCancleComponent()
        this.addChildAt(this.leftView, 0)
        this.leftView.width = 810
        this.leftView.height = 1349
        this.leftView.x = 0
        this.leftView.y = 0
        this.leftView.group = this.group
        this.leftView.rectCanSet = this.rect_left
        this.leftView.btnReset = this.btnReset
        this.leftView.curComponentIndex = 1
        this.leftView.ImgList.push(this.img_left1)
        this.leftView.ImgList.push(this.img_left2)
        this.leftView.ImgList.push(this.img_left3)
        this.leftView.onAdd()

        this.rightView = new DragAnyMakeAndCancleComponent()
        this.addChildAt(this.rightView, 0)
        this.rightView.width = 810
        this.rightView.height = 1349
        this.rightView.x = 0
        this.rightView.y = 0
        this.rightView.group = this.group
        this.rightView.rectCanSet = this.rect_right
        this.rightView.btnReset = this.btnReset
        this.leftView.curComponentIndex = 2
        this.rightView.ImgList.push(this.img_right1)
        this.rightView.ImgList.push(this.img_right2)
        this.rightView.ImgList.push(this.img_right3)
        this.rightView.onAdd()

        this.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    }
    protected touchEndLayerEvent(event:egret.TouchEvent):void
    { 
        this.leftView.touchEndLayerEvent(event);
        this.rightView.touchEndLayerEvent(event);
    }
    protected touchMoveLayerEvent(event:egret.TouchEvent):void{
        this.leftView.touchMoveLayerEvent(event);
        this.rightView.touchMoveLayerEvent(event);
    }
    

    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {
        this.leftView.onDestroy()
        this.removeChild(this.leftView)
        this.leftView = null

        this.rightView.onDestroy()
        this.removeChild(this.rightView)
        this.rightView = null

        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndLayerEvent, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveLayerEvent, this);
    }

    public execMessage(data:any):void{ 
        this.leftView.execMessage(data);
        this.rightView.execMessage(data);
    }
}
