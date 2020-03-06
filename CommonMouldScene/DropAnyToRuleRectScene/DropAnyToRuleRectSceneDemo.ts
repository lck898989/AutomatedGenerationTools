// from 刘斌毅
// need:    this.ImgList        可以拖动的列表             锚点需要在中心
//          this.ruleRectList   可以放置的位置列表          锚点需要在中心 
// desc:    点击图片       拖动图片 
//          拖动        
//          拖动结束       可放置区域放置 随意放置
class DropAnyToRuleRectSceneDemo extends DropAnyToRuleRectScene {

    static key:string = "Page8Scene";

    private img_1:eui.Image
    private img_2:eui.Image
    private img_3:eui.Image
    private img_4:eui.Image
    private img_5:eui.Image
    private img_6:eui.Image
    private img_7:eui.Image
    private img_8:eui.Image

    private rect_1:eui.Rect

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
        this.ImgList.push(this.img_5)
        this.ImgList.push(this.img_6)
        this.ImgList.push(this.img_7)
        this.ImgList.push(this.img_8)

        this.ruleRectList.push(this.rect_1)

        super.onAdd()

    }

}
