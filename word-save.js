

const form = document.getElementById("wordForm");
const word = document.getElementById("word-input");
const btn = document.getElementById("word-btn");
const wordList= document.getElementById("word-saved");
const content = document.getElementById("content");

const WORD_LS = 'Saved Words';
let wordSaved = [];
let temp = "";






// 발생한 event에서의 단어값(word)을 저장하고 paintWord 함수에 넣고, 초기화
function handleClick(event){
    event.preventDefault();
    if (word.value == ""){
        alert("단어를 입력해주세요!")
    } else {
        paintWord(word.value);
        word.value = "";  
    };
}

function search(wordIn){

    if (wordIn = word.value.replace(/^\s+|\s+$/g, "")) {

        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open("GET", buildString(wordIn));
        xhr.onload = function() {

            if (xhr.response.items[0][0] === undefined) {
                temp = "결과가 없습니다.";
                return;
            }

            var queriedWord = xhr.response.items[0][0][0][0];
            var definitionList = xhr.response.items[0][0][1][0].split(",");
            definitionList = definitionList.map(item => item.trim());
            definitionList = definitionList.join(", ");
            
            temp = definitionList;
        }
        xhr.send();
    }
}



// word를 리스트 형태로 표기한다. 
function paintWord(word){
    // 단어 검색
    search(word);
    
    if(wordSaved.length === 0){
        const table = document.createElement("table");
        const tr = document.createElement("tr");
        const th1 = document.createElement("th");
        const th2 = document.createElement("th");
        const th3 = document.createElement("th");
        table.id = "wordSavedTable";
        th1.innerText = "단어";
        th2.innerText = "뜻";
        th3.innerText = "암기";
        th1.id = "th1";
        th2.id = "th2";
        th3.id = "th3";
        table.appendChild(tr);
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        wordList.appendChild(table);
    }

    // 단어 검색 후 setTimeout 통해 Paint
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td")
    td1.id = "td1";
    td2.id = "td2";
    td3.id = "td3";
    const delBtn = document.createElement("button");
    const newId = wordSaved.length + 1;
    td1.innerText = word;
    delBtn.innerText = "완료";
    delBtn.id = "delBtn"
    delBtn.addEventListener("click", deleteWord);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    setTimeout( function(){
        td2.innerText = temp;
    }, 300);
    td3.appendChild(delBtn);
    tr.id = newId;
    wordSavedTable.appendChild(tr);
    setTimeout( function(){
    const wordObj = {
        id : newId,
        word: word,
        meaning: temp
    };
    wordSaved.push(wordObj);
    saveWords();
    temp = "";
    }, 300);
}

function loadPaint(word){
    
    if(wordSaved.length === 0){
        const table = document.createElement("table");
        const tr = document.createElement("tr");
        const th1 = document.createElement("th");
        const th2 = document.createElement("th");
        const th3 = document.createElement("th");
        table.id = "wordSavedTable";
        th1.innerText = "단어";
        th2.innerText = "뜻";
        th3.innerText = "암기";
        th1.id = "th1";
        th2.id = "th2";
        th3.id = "th3";
        table.appendChild(tr);
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        wordList.appendChild(table);
    }

    // 단어 검색 후 setTimeout 통해 Paint
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td")
    td1.id = "td1";
    td2.id = "td2";
    td3.id = "td3";
    const delBtn = document.createElement("button");
    const newId = wordSaved.length + 1;
    td1.innerText = word;
    delBtn.innerText = "완료";
    delBtn.id = "delBtn"
    delBtn.addEventListener("click", deleteWord);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    td2.innerText = temp;
    td3.appendChild(delBtn);
    tr.id = newId;
    wordSavedTable.appendChild(tr);
    const wordObj = {
        id : newId,
        word: word,
        meaning: temp
    };
    wordSaved.push(wordObj);
    saveWords();
    temp = "";
}


// Loacal Storage에 저장되어있던 단어들을 불러와서 PaintWord 한다. 
function loadWords(){
    const loadedWords = localStorage.getItem(WORD_LS);
    if(loadedWords !== null){
      const parsedWords = JSON.parse(loadedWords);
      for (let [id, word, meaning] of Object.entries(parsedWords)) {
        setTimeout( function(){
            temp = word.meaning;
            loadPaint(word.word);
    }, 100);
    }
    }
}

// Load만 잡으면된다!!!



// 입력받은 단어의 쿼리 URL을 생성한다. 
function buildString(query) {
    var queryString = "https://ac.dict.naver.com/enendict/ac?&q=" + query + "&q_enc=utf-8&st=11001&r_format=json&r_enc=utf-8&r_lt=11001&r_unicode=0&r_escape=1";
    queryString = encodeURI(queryString);
    return queryString;
}




// wordSaved Array에 저장되어 있는 단어들을 Localstorage에 저장한다. 
function saveWords(){
    localStorage.setItem(WORD_LS, JSON.stringify(wordSaved));
}



// 암기 버튼을 누르면 리스트에서 지우기
function deleteWord(event){
    const btn = event.target;
    const tr = btn.parentNode.parentNode;
    wordSavedTable.removeChild(tr);
    const cleanWords = wordSaved.filter(function(word){
        return word.id !== parseInt(tr.id);
    });
    wordSaved = cleanWords;
    saveWords();
    if(wordSaved.length === 0){
        wordList.removeChild(wordSavedTable);
    }
}





// Init 함수 
function init(){
    loadWords();
    btn.addEventListener("click", handleClick);
    word.addEventListener("keydown", function(event){
        if(event.keyCode === 13){
            search();
        }
    })
}


// init 실행 
init(); 