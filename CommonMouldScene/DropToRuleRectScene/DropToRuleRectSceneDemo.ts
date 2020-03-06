// from 刘斌毅
// need:    this.ImgList        可以拖动的列表             锚点需要在中心
//          this.ruleRectList   可以放置的位置列表          锚点需要在中心
//          this.numMax         暂时未使用  
// desc:    点击图片       拖动图片 
//          拖动        
//          拖动结束       拖动到可放置区域       放置
//                        拖动到不可放置区域     回到起始位置
class DropToRuleRectSceneDemo extends DropToRuleRectScene {

    static key:string = "Page8Scene";

    private img_1:eui.Image;
    private img_2:eui.Image;
    private img_3:eui.Image;
    private img_4:eui.Image;

    private rect_1:eui.Rect;
    private rect_2:eui.Rect;
    private rect_3:eui.Rect;
    private rect_4:eui.Rect;


    public constructor() {
        super();
        this.skinName = "Page8Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {
        this.ImgList.push(this.img_1)
        this.ImgList.push(this.img_2)
        this.ImgList.push(this.img_3)
        this.ImgList.push(this.img_4)

        this.ruleRectList.push(this.rect_1)
        this.ruleRectList.push(this.rect_2)
        this.ruleRectList.push(this.rect_3)
        this.ruleRectList.push(this.rect_4)

        super.onAdd()
    }


}
