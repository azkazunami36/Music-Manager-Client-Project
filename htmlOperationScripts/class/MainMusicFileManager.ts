import { ActiveElement } from "../../scripts/class/ActiveElement.js";
import { POSTData } from "../../scripts/interfaces/POSTData.js";
import { MusicFileManager } from "./MusicFileManager.js";
import { PopupManage } from "./PopupManage.js";

import { MusicInfo } from "../../scripts/interfaces/MusicInfo.js";
import { FileTabManager } from "./FileTabManager.js";
import { InfoInArtist } from "../../scripts/interfaces/InfoInArtist.js";

export class MainMusicFileManager extends MusicFileManager {
    musicTabWindow: HTMLElement;
    constructor(activeElement: ActiveElement, popupManage: PopupManage) {
        super(document.getElementById("musicListTabWindow") as HTMLElement,
            (document.getElementById("musicListTabWindow") as HTMLElement).getElementsByClassName("main")[0] as HTMLElement,
            activeElement);
        this.musicTabWindow = document.getElementById("musicListTabWindow") as HTMLElement;
        this.listReflash().then(() => {
            this.listReDraw();
        });
        if (this.musicTabWindow) {
            const functionBarElement = this.musicTabWindow.getElementsByClassName("functionbar")[0];
            if (functionBarElement) {
                const addMusicButton = functionBarElement.getElementsByClassName("addMusicButton")[0];
                if (addMusicButton) {
                    addMusicButton.addEventListener("click", async () => {
                        const editMusicInfoPopupWindow = document.getElementById("editMusicInfoPopupWindow");
                        if (editMusicInfoPopupWindow) {
                            const titleInput = editMusicInfoPopupWindow.getElementsByClassName("titleInput")[0] as HTMLInputElement | null;
                            if (titleInput) {
                                titleInput.value = "";
                            }
                        }
                        popupManage.view("editMusicInfoPopupWindow", "window");
                    });
                };
                const reFlashButton = functionBarElement.getElementsByClassName("reFlashButton")[0];
                if (reFlashButton) {
                    reFlashButton.addEventListener("click", async () => {
                        const musicListTBody = this.musicTabWindow.getElementsByTagName("tbody")[0];
                        console.log(musicListTBody)
                        if (musicListTBody) musicListTBody.innerHTML = "読み込み中...";
                        await this.listReflash();
                        this.listReDraw();
                    });
                };
                const removeButton = functionBarElement.getElementsByClassName("removeButton")[0];
                if (removeButton) {
                    removeButton.addEventListener("click", async () => {
                        const info = this.selectItemGet() as MusicInfo;
                        console.log(info)
                        if (this.tableElement && info) {
                            const query: POSTData = {};
                            query.type = "musicDelete";
                            query.musicuuid = info.musicuuid;
                            const url = window.location.origin + ":38671?" + new URLSearchParams(query);
                            const init: RequestInit = {};
                            init.method = "POST";
                            const res = await fetch(url, init);
                            await this.listReflash();
                            this.listReDraw();
                        }
                    });
                }
            };

            // 編集データとファイルタブマネージャの初期化
            let editingData: MusicInfo = {};
            let editMusicInfoAddFileTabManager: FileTabManager | undefined;
            const editMusicInfoAddFilePopup = document.getElementById("editMusicInfoAddFilePopup");
            if (editMusicInfoAddFilePopup) {
                const fileTabWindow = editMusicInfoAddFilePopup.getElementsByClassName("fileTabWindow")[0] as HTMLElement;
                const fileListTable = fileTabWindow.getElementsByTagName("table")[0];
                const fileListTBody = fileTabWindow.getElementsByTagName("tbody")[0];
                editMusicInfoAddFileTabManager = new FileTabManager(fileTabWindow, fileListTable, activeElement);
                // 各種設定関数を呼び出し
                setupFunctionBar(fileTabWindow, fileListTBody, editMusicInfoAddFileTabManager, popupManage, editingData);
                setupEditMusicInfoPopup(editingData, popupManage, editMusicInfoAddFileTabManager);
                setupMusicListTabWindow(popupManage, editingData);
            }
        };
    }
}

function setupEditMusicInfoPopup(editingData: MusicInfo, popupManage: PopupManage, editMusicInfoAddFileTabManager: FileTabManager | undefined) {
    const editMusicInfoPopupWindow = document.getElementById("editMusicInfoPopupWindow");
    if (editMusicInfoPopupWindow) {
        // タイトル入力フィールドの設定
        const titleInput = editMusicInfoPopupWindow.getElementsByClassName("titleInput")[0] as HTMLInputElement;
        titleInput.addEventListener("input", () => {
            // タイトル入力時に編集データを更新
            if (!editingData.infos) editingData.infos = [];
            editingData.infos[0] = {
                musicname: titleInput.value,
                languagetype: "ja"
            };
            console.log(editingData);
        });
        // アーティスト設定ボタンの設定
        const artistSettingButton = editMusicInfoPopupWindow.getElementsByClassName("artistSettingButton")[0] as HTMLDivElement;
        artistSettingButton.addEventListener("click", () => {
            const artistSettingPopup = document.getElementById("artistSettingPopup");
            const infoInArtist: InfoInArtist[] = [];
            infoInArtist[0]
            if (artistSettingPopup) {
                // アーティスト設定ポップアップの保存ボタンの設定
                const saveButton = artistSettingPopup.getElementsByClassName("saveButton")[0] as HTMLDivElement;
                saveButton.addEventListener("click", () => {
                    popupManage.close("artistSettingPopup", "window");
                });
                // アーティスト設定ポップアップのキャンセルボタンの設定
                const cancelButton = artistSettingPopup.getElementsByClassName("cancelButton")[0] as HTMLDivElement;
                cancelButton.addEventListener("click", () => {
                    popupManage.close("artistSettingPopup", "window");
                });
            }
            // アーティスト設定ポップアップを表示
            popupManage.close("editMusicInfoPopupWindow", "window");
            popupManage.view("artistSettingPopup", "window", () => {
                popupManage.view("editMusicInfoPopupWindow", "window");
            });
        });
        const soundfilelist = editMusicInfoPopupWindow.getElementsByClassName("soundfilelist")[0] as HTMLDivElement;

        // ファイル追加ボタンの設定
        const fileAddButton = editMusicInfoPopupWindow.getElementsByClassName("fileAddButton")[0] as HTMLDivElement;
        fileAddButton.addEventListener("click", () => {
            popupManage.close("editMusicInfoPopupWindow", "window");
            editMusicInfoAddFileTabManager?.listReflash().then(() => {
                editMusicInfoAddFileTabManager?.listReDraw();
            });
            popupManage.view("editMusicInfoAddFilePopup", "window", () => {
                soundfilelist.innerHTML = "";
                const filelist = editingData.sounds?.[0]?.filelist;
                if (filelist) for (const file of filelist) {
                    const div = document.createElement("div");
                    if (!file.filename) continue;
                    div.innerText = file.filename;
                    soundfilelist.appendChild(div);
                }
                popupManage.view("editMusicInfoPopupWindow", "window");
            });
        });
        // 保存ボタンの設定
        const saveButton = editMusicInfoPopupWindow.getElementsByClassName("saveButton")[0] as HTMLDivElement;
        saveButton.addEventListener("click", async () => {
            // 保存ボタンがクリックされたときの処理
            const query: POSTData = {};
            query.type = "musicInfoCreate";
            editingData.createdate = String(Date.now());
            editingData.updatedate = String(Date.now());
            query.editdata = JSON.stringify(editingData);
            const url = window.location.origin + ":38671?" + new URLSearchParams(query as any);
            const init: RequestInit = {};
            init.method = "POST";
            try {
                const res = await fetch(url, init);
                const text = await res.text();
                console.log(text);
            } catch (error) {
                console.error("Error:", error);
            }
            popupManage.close("editMusicInfoPopupWindow", "window");
        });
        // キャンセルボタンの設定
        const cancelButton = editMusicInfoPopupWindow.getElementsByClassName("cancelButton")[0] as HTMLDivElement;
        cancelButton.addEventListener("click", () => {
            popupManage.close("editMusicInfoPopupWindow", "window");
        });
    }
}

/**
 * 音楽リストタブウィンドウを設定します。
 * 
 * @param {PopupManage} popupManage - ポップアップ管理オブジェクト
 * @param {MusicInfo} editingData - 編集中の音楽情報
 * @param {HTMLElement | null} [editMusicInfoPopupWindow=document.getElementById("editMusicInfoPopupWindow")] - 音楽情報編集ポップアップウィンドウの要素
 */
function setupMusicListTabWindow(popupManage: PopupManage, editingData: MusicInfo, editMusicInfoPopupWindow: HTMLElement | null = document.getElementById("editMusicInfoPopupWindow")) {
    const musicListTabWindow = document.getElementById("musicListTabWindow");
    if (musicListTabWindow) {
        const functionBarElement = musicListTabWindow.getElementsByClassName("functionbar")[0];
        if (functionBarElement) {
            // 音楽追加ボタンの設定
            const addMusicButton = functionBarElement.getElementsByClassName("addMusicButton")[0];
            addMusicButton.addEventListener("click", () => {
                // 新しい音楽情報を追加するための設定
                editingData = {};
                const titleInput = editMusicInfoPopupWindow?.getElementsByClassName("titleInput")[0] as HTMLInputElement;
                titleInput.value = "";
                const soundfilelist = editMusicInfoPopupWindow?.getElementsByClassName("soundfilelist")[0] as HTMLDivElement;
                soundfilelist.innerHTML = "";
                popupManage.view("editMusicInfoPopupWindow", "window");
            });
        }
    }
}

function setupFunctionBar(fileTabWindow: HTMLElement, fileListTBody: HTMLElement, editMusicInfoAddFileTabManager: FileTabManager, popupManage: PopupManage, editingData: MusicInfo) {
    const functionBarElement = fileTabWindow.getElementsByClassName("functionbar")[0];
    if (functionBarElement) {
        // ファイル選択ボタンの設定
        const selectButton = functionBarElement.getElementsByClassName("selectButton")[0];
        if (selectButton) {
            selectButton.addEventListener("click", () => {
                const fileName = editMusicInfoAddFileTabManager?.selectNameGet();
                if (fileName) {
                    // 編集データにサウンド情報を追加
                    if (!editingData.sounds) editingData.sounds = [];
                    if (!editingData.sounds[0]) editingData.sounds[0] = { languagetype: "ja" };
                    if (!editingData.sounds[0].filelist) editingData.sounds[0].filelist = [];
                    if (!editingData.sounds[0].filelist.find(value => value.filename === fileName)) editingData.sounds[0].filelist.push({
                        filename: fileName,
                        filetypename: "default",
                        filetype: "default",
                        timediff: 0
                    });
                    // ポップアップを閉じる
                    popupManage.close("editMusicInfoAddFilePopup", "window");
                }
            });
        }
        // キャンセルボタンの設定
        const cancelButton = functionBarElement.getElementsByClassName("cancelButton")[0];
        if (cancelButton) {
            cancelButton.addEventListener("click", () => {
                popupManage.close("editMusicInfoAddFilePopup", "window");
            });
        }
        // リフレッシュボタンの設定
        const reFlashButton = functionBarElement.getElementsByClassName("reFlashButton")[0];
        if (reFlashButton) {
            reFlashButton.addEventListener("click", async () => {
                fileListTBody.innerHTML = "読み込み中...";
                await editMusicInfoAddFileTabManager?.listReflash();
                editMusicInfoAddFileTabManager?.listReDraw();
            });
        }
    }
}
