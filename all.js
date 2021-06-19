const boardTop = document.querySelector(".board-top");
const addtxt = document.querySelector(".addtxt");
const addBtn = document.querySelector(".addBtn");
const allBtn = document.querySelector(".allBtn");
const undoBtn = document.querySelector(".undoBtn");
const doneBtn = document.querySelector(".doneBtn");
const itemList = document.querySelector(".itemList");

let data = [];

// 將物件格式的資料轉為JSON格式字串後，在儲存至localStorage，因為localStorage只接受字串
// localStorage.setItem('itemData',JSON.stringify(data));

// 從localStorage取出資料，並將字串格式轉換成物件格式
data = JSON.parse(localStorage.getItem('itemData'));

// 避免初始化階段，localStorage為空值時而產生錯誤
if(data == null || data.length == 0){
    data = [];
    // 當資料為0筆時，則不顯示record-board列表
    recordBoardHide();
}

// 監聽滑鼠點擊addtxt鈕
addBtn.addEventListener("click", function(e){
    addContent();
});

// 監聽鍵盤按下Enter鈕
addtxt.addEventListener("keydown", function(e){
    if(e.keyCode == 13){
        addContent();
    }
});


// 將新增的內容加入列表
function addContent(){
    // 若未填寫任何內容則return
    if(addtxt.value == ""){
        return;
    }
    // 顯示record-board
    const recordBoard = document.querySelector(".record-board");
    recordBoard.classList.remove("hide");
    // 待新增到data的資料
    let undoItem = {};
    undoItem.content = addtxt.value;
    undoItem.status = false;
    data.push(undoItem);
    // 將物件格式的資料轉為JSON格式字串後，在儲存至localStorage
    localStorage.setItem('itemData',JSON.stringify(data));
    render();
    addtxt.value = "";
}

// ============================畫面渲染函數============================

// 根據當下指向的按鈕頁面(全部/待完成/完成)，進行對應的渲染
function render(){
    
    // 依據在不同的頁面進行對應的渲染
    if(document.querySelector(".allBtn.selected")){
        renderAll();
    }else if(document.querySelector(".undoBtn.selected")){
        renderUndo();
    }else{
        renderDone();
    }
}

render();

// 渲染data中的「全部」資料
function renderAll(){
    if(data == null){
        return;
    }
    let itemListStr = "";
    data.forEach(function(item, index){
        itemListStr += 
        `<li data-item="${index}" class="${item.status? 'checked':''}">
            <div class="checkArea">
                <button class="checkBtn"></button>
                <i class="fas fa-check"></i>
            </div>
            <h2 class="decord-item"><span class="complete">${item.content}</span></h2>
            <i class="fas fa-times"></i>
        </li>`
    });
    itemList.innerHTML= itemListStr;

    changeUndoInfo();
}



// 渲染data中的「待完成」資料
function renderUndo(){
    let itemListStr = "";
    data.forEach(function(item, index){
        if(item.status ==  false){
            itemListStr += 
            `<li data-item="${index}" class="${item.status? 'checked':''}">
                <div class="checkArea">
                    <button class="checkBtn"></button>
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="decord-item"><span class="complete">${item.content}</span></h2>
                <i class="fas fa-times"></i>
            </li>`
        }
    });
    itemList.innerHTML= itemListStr;

    changeUndoInfo();
}

// 渲染data中的「已完成」資料
function renderDone(){
    let itemListStr = "";
    data.forEach(function(item, index){
        // console.log(item.status);
        if(item.status ==  true){
            itemListStr += 
            `<li data-item="${index}" class="${item.status? 'checked':''}">
                <div class="checkArea">
                    <button class="checkBtn"></button>
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="decord-item"><span class="complete">${item.content}</span></h2>
                <i class="fas fa-times"></i>
            </li>`
        }
    });
    itemList.innerHTML= itemListStr;

    changeUndoInfo();
}

// ====================================================================


boardTop.addEventListener("click", function(e){
    // 判斷點擊 全部/待完成/完成
    // console.log(e.target.classList[1])
    var clickBtnName = e.target.classList[1];
    if(clickBtnName == "allBtn"){
        renderAll();
    } else if(clickBtnName == "undoBtn"){
        renderUndo();
    } else{
        renderDone();
    }
    btnSelected(clickBtnName);
})

// 改變 全部/待完成/完成 按鈕狀態 (在點擊的按鈕上加上selected樣式)
function btnSelected(clickTarget){
    // console.log(clickTarget);
    // 清除案件上所有 selected樣式
    let btnName = [allBtn, undoBtn, doneBtn];
    btnName.forEach(function(btn, index){
        btn.classList.remove("selected");
    });

    // 在點擊的按鈕上加上selected樣式
    const target = document.querySelector("." + clickTarget);
    target.classList.add("selected");
}


// 若<li data-item="0"> 富有 class="checked"屬性，則表示此筆item完成 
// 若指定的item已完成，則該筆的status = true，並在該筆的li元素加上class="checked"
itemList.addEventListener("click", function(e){
    // checkbox中的待完成 / 已完成 樣式切換
    if(e.target.nodeName == "BUTTON" || e.target.classList[1] == "fa-check"){
        if(e.target.getAttribute("class") == "checkBtn"){
            // 指定li元素
            const eleLi = li = e.target.parentNode.parentNode;
            // 抓取資料為第幾筆
            let itemNum = eleLi.getAttribute("data-item");
            data[itemNum].status = true;
            eleLi.classList.add("checked");
        }else{
            const eleLi = li = e.target.parentNode.parentNode;
            // 抓取資料為第幾筆
            let itemNum = eleLi.getAttribute("data-item");
            data[itemNum].status = false;
            eleLi.classList.remove("checked");
        }
        // 將物件格式的資料轉為JSON格式字串後，在儲存至localStorage
        localStorage.setItem('itemData',JSON.stringify(data));
        render();
    }
    changeUndoInfo();
})


// 刪除指定的單筆資料
itemList.addEventListener("click", function(e){
    if(e.target.classList[1] == "fa-times"){
        // 指定li元素
        // console.log("刪除指定的單筆資料");
        const eleLi = li = e.target.parentNode;
        let itemNum = eleLi.getAttribute("data-item");
        data.splice(itemNum,1);
        // 將物件格式的資料轉為JSON格式字串後，在儲存至localStorage
        localStorage.setItem('itemData',JSON.stringify(data));

        // 判斷若刪除資料後，資料筆數為0，則隱藏record-board列表
        if(data.length == 0){
            recordBoardHide();
        }

        // 依據在不同的頁面進行對應的渲染
        render();
    }
})


// 計算待完成項目筆數
function calUndoQty(rowdata){
    let backarr = rowdata.filter(function(el){
        // console.log(el);
        return el.status == false;
    });
    return backarr.length;
}

// 變更未完成項目訊息
function changeUndoInfo(){
    const undoQty = document.querySelector(".undo-qty");
    undoQty.innerHTML = calUndoQty(data) + "個待完成項目";
}


// 清除已完成項目
const clearDoneBtn = document.querySelector(".clearDoneBtn");
clearDoneBtn.addEventListener("click", function(e){
    let dataLng = data.length;
    for(i=0; i<dataLng; i++){
        let j = dataLng-i-1;
        if(data[j].status == true){
            data.splice(j,1);
        }
    }
    // 將物件格式的資料轉為JSON格式字串後，再儲存至localStorage
    localStorage.setItem('itemData',JSON.stringify(data));
    // 判斷若刪除資料後，資料筆數為0，則隱藏record-board列表
    if(data.length == 0){
        recordBoardHide();
    }
    render();
});


// 當資料為0筆時，則隱藏record-board列表
function recordBoardHide(){
    const recordBoard = document.querySelector(".record-board");
    recordBoard.classList.add("hide");
}



