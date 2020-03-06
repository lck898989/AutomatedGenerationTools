// from 刘斌毅
// need:    this.ImgSelectedList        可以点击的列表
//          posList                     坐标列表            index = 0 为初始位置 
//          ImgIndexToPosIndex           点击的列表 对应的坐标位置索引  例如 点击1 走到5索引的位置  push(5)
//          moveCallBack                走到位置的回调方法
// desc:    点击rect or img    从当前索引 移动到 目标位置
//          例: 点击小明家  从起始位置移动到小明家  移动位置为当前位置到小明家的行走路径列表
class ClickMoveFromPathSceneDemo extends ClickMoveFromPathScene {

    static key:string = "Page7Scene";

    private rect_1:eui.Rect;
    private rect_2:eui.Rect;

    private img_people1:eui.Image;
    private img_people2:eui.Image;

    private img_carPeople1:eui.Image;
    private img_carPeople2:eui.Image;

    public constructor() {
        super();
        this.skinName = "Page7Scene_Skin";
    }

    /** 每次进入 */
    public onAdd(): void {

        this.rightRot = 0

        this.ImgSelectedList.push(this.rect_1)
        this.ImgSelectedList.push(this.rect_2)

        this.posList.push(new egret.Point(363, 575))
        this.posList.push(new egret.Point(1325, 575))
        this.posList.push(new egret.Point(1325, 986))

        this.ImgIndexToPosIndex.push(1)
        this.ImgIndexToPosIndex.push(2)
        
        super.onAdd()

        this.img_people1.visible = true
        this.img_people2.visible = true
        this.img_carPeople1.visible = false
        this.img_carPeople2.visible = false
    }

    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {

        super.onDestroy()
    }

    protected moveCallBack(imgIndex:number){

        super.moveCallBack(imgIndex)
        if(imgIndex == 0){
            this.img_people1.visible = false
            this.img_carPeople1.visible = true
        } else if(imgIndex == 1){
            this.img_people2.visible = false
            this.img_carPeople2.visible = true
        }

    }
}
