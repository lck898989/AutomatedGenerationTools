// from 刘斌毅
// need:    this.ImgList        可以拖动的列表
//          this.numMax         暂时未使用  
//          页面中需要包含        btnReset     重置
//                              rectCancle   取消物品的方框区域
// desc:    点击图片        生成新图片 
//          随意拖动        
//          拖动到取消位置   删除图片             
class DragAnyMakeForMaxAndCancleSceneDemo extends DragAnyMakeForMaxAndCancleScene {

    static key:string = "Page2Scene";

    private img_1:eui.Image;
    private img_2:eui.Image;
    private img_3:eui.Image;

    public constructor() {
        super();
        this.skinName = "Page2Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {

        this.ImgList.push(this.img_1)
        this.ImgList.push(this.img_2)
        this.ImgList.push(this.img_3)

        this.numMax = 7

        super.onAdd()
    }

    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {
        super.onDestroy()
    }
}
