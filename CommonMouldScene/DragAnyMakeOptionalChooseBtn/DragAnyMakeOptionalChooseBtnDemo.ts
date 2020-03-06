// from 刘斌毅
// need:    this.ImgList        可以拖动的列表
//          页面中需要包含        btnReset     重置
//                              rectCancle   取消物品的方框区域
//          可选参数            this.rectList            回答选择框区域
//                             this.imgSelected         回答选择框图片
//                             this.indexTrueAnswer     回答正确index  
//                             需要拷贝 animation  sound
// desc:    点击图片        生成新图片 
//          随意拖动        
//          拖动到取消位置   删除图片 
//          点击选择框     弹出回答正确or错误            
class DragAnyMakeOptionalChooseBtnDemo extends DragAnyMakeOptionalChooseBtn {

    static key:string = "Page3Scene";

    private img_choose:eui.Image;
    private img_1:eui.Image;
    private img_2:eui.Image;
    private img_3:eui.Image;

    private rect_1:eui.Image;
    private rect_2:eui.Image;
    private rect_3:eui.Image;

    public constructor() {
        super();
        this.skinName = "Page3Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {

        this.ImgList.push(this.img_1)
        this.ImgList.push(this.img_2)
        this.ImgList.push(this.img_3)

        let rectList = []
        rectList.push(this.rect_1)
        rectList.push(this.rect_2)
        rectList.push(this.rect_3)
        this.initSelectData(rectList, this.img_choose, 1)

        super.onAdd()
    }

    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {
        super.onDestroy()
    }
}
