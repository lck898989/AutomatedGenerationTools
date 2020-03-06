// from 刘斌毅
// need: this.ImgSelectedList
//       this.rectListSelect
// desc: 单选  点击方框  对应的img显示  其余的隐藏
//       ImgSelectedList 和 ImgSelectedList 必须一一对应
class ClickOneChooseSceneDemo extends ClickOneChooseScene {

    static key:string = "Page7Scene";

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
        this.skinName = "Page7Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {

        this.ImgSelectedList.push(this.img_1)
        this.ImgSelectedList.push(this.img_2)
        this.ImgSelectedList.push(this.img_3)
        this.ImgSelectedList.push(this.img_4)

        this.rectListSelect.push(this.rect_1)
        this.rectListSelect.push(this.rect_2)
        this.rectListSelect.push(this.rect_3)
        this.rectListSelect.push(this.rect_4)

        super.onAdd()
    }

}
