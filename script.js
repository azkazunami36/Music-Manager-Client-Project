// class
import { ActiveElement } from "./scripts/class/ActiveElement.js";
import { PopupManage } from "./htmlOperationScripts/class/PopupManage.js";
import { TabManage } from "./htmlOperationScripts/class/TabManage.js";
import { MainFileTabManager } from "./htmlOperationScripts/class/MainFileTabManager.js";
import { MusicPlayerClass } from "./htmlOperationScripts/class/MusicPlayerClass.js";
import { MainMusicFileManager } from "./htmlOperationScripts/class/MainMusicFileManager.js";
// function
// ページがロードされたときのイベントリスナー
addEventListener("load", async () => {
    // 各種クラスのインスタンスを作成
    const activeElement = new ActiveElement();
    const popupManage = new PopupManage();
    const tabManage = new TabManage();
    const mainFileTabManager = new MainFileTabManager(activeElement, popupManage);
    const musicPlayerClass = new MusicPlayerClass(mainFileTabManager);
    const mainMusicFileManager = new MainMusicFileManager(activeElement, popupManage);
    mainFileTabManager.on("selectItem", fileName => { console.log(fileName); });
});
