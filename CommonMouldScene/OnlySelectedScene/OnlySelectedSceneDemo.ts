/**
 * by 郑岩
 * 需要显示选择状态的场景
 * @param arr : Array<Array<eui.Image>> 
 * 当传入一个数组时，只显示点击选择状态
 * 当多个数组时，请把相同类型状态放入同一个数组 例如: A B  分别放入两个数组
 */
class OnlySelectedSceneDemo extends OnlySelectedScene {

    static key:string = "Page1Scene";

    private img1: eui.Image;
    private img2: eui.Image;

    private _arr1: Array<eui.Image>;
    private _arr2: Array<eui.Image>;
    private _arrList: Array<Array<eui.Image>>;

    public constructor() {
        super();
        this.skinName = "Page11Scene_Skin";

        this._arr1 = new Array<eui.Image>();
        this._arr2 = new Array<eui.Image>();
        this._arrList = new Array<Array<eui.Image>>();
    }

    /** 每次进入 */
    public onAdd(): void {
        this._arr1.push(this.img1);
        this._arr2.push(this.img2);
        this._arrList.push(this._arr1);
        this._arrList.push(this._arr2);

        super.initScene(this._arrList);
    }

    /** 这里进行移出场景的处理 **/
    public onDestroy(): void {

    }
}
