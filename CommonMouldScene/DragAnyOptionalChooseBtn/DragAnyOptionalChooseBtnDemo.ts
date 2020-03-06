// from 刘斌毅
// need:    this.ImgList       可以拖动的列表             锚点需要在中心
//          需要提供            btnReset    
//          可选参数            this.rectList            回答选择框区域
//                             this.imgSelected         回答选择框图片
//                             this.indexTrueAnswer     回答正确index  
//                             需要拷贝 animation  sound
// desc:    点击图片       随意拖动图片 
//          点击选择框     弹出回答正确or错误
class DragAnyOptionalChooseBtnDemo extends DragAnyOptionalChooseBtn {

    static key:string = "Page5Scene";

    private img_choose:eui.Image;
    private img_1:eui.Image;
    private img_2:eui.Image;
    private img_3:eui.Image;

    private rect_1:eui.Image;
    private rect_2:eui.Image;
    private rect_3:eui.Image;

    public constructor() {
        super();
        this.skinName = "Page5Scene_Skin";
    }

    public onAdd(): void {

        this.ImgList.push(this.img_1)
        this.ImgList.push(this.img_2)
        this.ImgList.push(this.img_3)

        // 可选参数
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
