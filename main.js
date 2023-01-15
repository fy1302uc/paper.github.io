(function() {
  var wrap = document.querySelector('.wrap');
  var writeData = document.querySelector('.wrap>section>.writeData');
  var textarea = document.querySelector('.wrap>section>.writeData>textarea');
  var writeBtn = document.querySelector('.wrap>section>.writeData>button');
  var readData = document.querySelector('.wrap>section>.readData');
  var readBtn = document.querySelector('.wrap>section>button');
  var leftId = document.querySelector('.wrap>header>.header-inner>span');
  var rightId = document.querySelectorAll('.wrap>header>.header-inner>span')[2];
  var editorWrite = document.querySelectorAll('.wrap>header>.header-inner>span')[3];
  var setting = document.querySelector('.wrap>header>.header-inner>.void>.setting');

  //var inputArr = document.querySelectorAll('.wrap>section>.readData>input');
  (function() { //写操作
    var setFace = document.querySelector('.wrap>header>.header-inner>.void>.setting>.setting-face');

    var writeDataStorage = localStorage.getItem('writeData');
    if (writeDataStorage) { //如果之前有试题数据就将载入页面
      rander(readData, writeDataStorage);
      writeData.style.display = 'none'; //将输入文本框及输入按钮隐藏
      readBtn.style.display = 'inline-block'; //将末尾的提交按钮显示;
      }
      editorWrite.addEventListener('click', () => { //弹出文本编辑框重新编辑文本
        writeDataStorage = localStorage.getItem('writeData');
        textarea.value = writeDataStorage;
        writeData.style.display = 'flex'; //将输入文本框及输入按钮显示
        readBtn.style.display = 'none'; //将末尾的提交按钮隐藏;
        readData.innerHTML = ''; //将主页数据清空使其隐藏
        setFace.style.display = 'none'; //关闭设置界面
      })
    
    writeBtn.addEventListener('click', filterText); //写入按钮被点击时载入处理数据并显示在页面上
    function filterText() { //将试卷文本处理后添加到页面中
      //判断文本是否符合要求
      if (textarea.value.trim() == '') {
        alert('文本不能为空');
        textarea.value = '';
        return;
      }

      // localStorage.setItem('writeData',textarea.value);
      rander(readData, textarea.value);
      localStorage.setItem('writeData', textarea.value);
      //乱序功能太难呢，等有时间在完善
      writeData.style.display = 'none'; //将输入文本框及输入按钮隐藏
      readBtn.style.display = 'inline-block'; //将末尾的提交按钮显示;
    }

  })();

  function rander(el, text) { //将文本数据处理后带input及span元素的内容插到指定的元素;
    var reg = new RegExp(`(?=\\${leftId.innerText}.*\\${rightId.innerText})`, 'g');
    var reg2 = new RegExp(`(?<=<div contenteditable></div>)\\${leftId.innerText}`, 'g');
    var reg3 = new RegExp(`(?<=<span>.*\\${rightId.innerText})`, 'g');
    var reg4 = new RegExp(`\\${rightId.innerText}(?=</span>)`, 'g');
    var textHTML = text.replaceAll(reg, '<div contenteditable></div>').replaceAll(reg2, '<span>').replaceAll(reg3, '</span>').replaceAll(reg4, '').replaceAll(/\n/g, '</br>');
    el.innerHTML = textHTML;
  }

  (function spanIdEvent() { //更改()标识
    var leftIdStorage = localStorage.getItem('leftId');
    var rightIdStorage = localStorage.getItem('rightId');
    if (leftIdStorage) leftId.innerText = leftIdStorage;
    if (rightIdStorage) rightId.innerText = rightIdStorage;

    leftId.addEventListener('click', alterId);
    rightId.addEventListener('click', alterId);

    function alterId() {
      var newId = prompt(this == leftId ? '请输入左侧新标识符' : '请输入右侧新标识符', this.innerText);
      if (newId != null && newId.trim() != '') {
        this.innerText = newId.trim();
        this == leftId ? localStorage.setItem('leftId', newId.trim()) : localStorage.setItem('rightId', newId.trim()); //向本地永久存储标识数据
      }
    }
  })();

  (function() { //按钮事件操作
    var editorBtnArr = document.querySelectorAll('.wrap>header>.header-inner>button');
    var spanArr = document.querySelectorAll('.wrap>section>.readData>span');
    var divInput = document.querySelectorAll('.wrap>section>.readData>div');
    var submitBtn = document.querySelector('.wrap>section>.submit');
    submitBtn.addEventListener('click', paperMarking); //尾部提交按钮事件
    var spanIsShow = false;
    isShowSpan(false); //主页载入不显示答案
    function isShowSpan(isShow) { //答案显示(true)与隐藏(false);
      spanArr = document.querySelectorAll('.wrap>section>.readData>span');
      spanArr.forEach((item, index) => {
        isShow ? item.style.display = 'inline' : item.style.display = 'none';
      })
      spanIsShow = isShow;
    }

    function paperMarking() { //试卷打分及错误提示;
      if (spanIsShow) return;
      spanArr = document.querySelectorAll('.wrap>section>.readData>span');
      divInput = document.querySelectorAll('.wrap>section>.readData>div');
      var count = 0;
      divInput.forEach((item, index) => {
        if (item.innerText != spanArr[index].innerText) {
          spanArr[index].style.display = 'inline';
          count++;
        }
      })
      var score = 100 * (divInput.length - count) / divInput.length;
      alert('得分:' + Math.round(score * 10) / 10);

    }

    function changeOrder() { //变序设置
      var data = localStorage.getItem('writeData');
      var setObj = JSON.parse(localStorage.getItem('setting'));
      var firstArr = setObj.parentNum.split(',');
      var firstEnd = setObj.parentNumTail;
      var twoArr = setObj.num.split(',');
      var twoEnd=setObj.numTail;

    
        addDataArr();
      

      function addDataArr() {

        var dataArr = [];
        var result = data;
        function setSort(){//随机改变顺序
          return Math.random()-0.5;
          
        }
        
      
        for (var i = 0; i < firstArr.length; i++) {//遍历一级符号并添加统一标识符
          result = result.replace(firstArr[i] + firstEnd, '^&$');
        }
        var firstParentArr = result.split('^&$');//根据统一标识符分割文本为数组
        var oneParentArr=firstParentArr[0];//将第一个元素单独存储;
        firstParentArr.shift();//删除第一个元素
        if(setObj.parentNumChecked)firstParentArr.sort(setSort);//改变顺序

        /*firstParentArr.forEach((item,index)=>{//一级数组重新添加序号
          firstParentArr[index]=firstArr[index]+firstEnd+item;
        });*/
        for(let i=0;i<firstParentArr.length;i++){//一级数组添加序号
          firstParentArr[i]=firstArr[i]+firstEnd+firstParentArr[i];
        }
        
        
        //二级元素乱序处理
        if(setObj.numChecked){
          for(let i=0;i<firstParentArr.length;i++){
            result=firstParentArr[i];
            for(let j=0;j<twoArr.length;j++){
              result = result.replace(twoArr[j] + twoEnd, '^&$');
            }
            var childArr=result.split('^&$');
            var oneArr=childArr[0];
            childArr.shift();
            childArr.sort(setSort);
            for(let j=0;j<childArr.length;j++){
              childArr[j]=twoArr[j]+twoEnd+childArr[j];
    
            }
            childArr.unshift(oneArr);
            firstParentArr[i]=childArr.join('');
          }
        }
        
        firstParentArr.unshift(oneParentArr);//一级重新加回第一个元素
        rander(readData,firstParentArr.join(''));
        writeData.style.display = 'none'; //将输入文本框及输入按钮隐藏
        readBtn.style.display = 'inline-block'; //将末尾的提交按钮显示;
  
    
      }



    }

    for (let i = 0; i < editorBtnArr.length; i++) { //遍历右上角4个按钮并添加事件
      editorBtnArr[i].addEventListener('click', function() {
        switch (i) {
          case 0: //试题按钮
            isShowSpan(false);
            break;
          case 1: //答案按钮
            isShowSpan(true);
            break;
          case 2: //变序按钮
            changeOrder();
            break;
          case 3: //提交按钮
            paperMarking();
            break;
        }

      })
    }


    (function() { //设置操作
      var setFace = document.querySelector('.wrap>header>.header-inner>.void>.setting>.setting-face');
      var setSortArr = document.querySelector('.wrap>header>.header-inner>.void>.setting>.setting-face>.setting-sort').children;
      var setObj = {};

      if (!localStorage.getItem('setting')) { //判断是否存在本地设置配置内容并添加到本地;
        setObj = {
          parentNum: '一,二,三,四,五,六,七,八,九,十,十一,十二,十三,十四,十五,十六,十七,十八,十九,二十,二十一,二十二,二十三,二十四,二十五,二十六,二十七,二十八,二十九,三十',
          parentNumTail: '、',
          parentNumChecked: true,
          num: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40',
          numTail: '.',
          numChecked: true,
          keyBtn: true
        }
        localStorage.setItem('setting', JSON.stringify(setObj)); //保存默认设置到本地存储;

      }
      setObj = JSON.parse(localStorage.getItem('setting'));




      setting.addEventListener('click', function() { //设置被点击显示设置界面后载入设置数据
        if (setFace.style.display == 'none') {
          setObj = JSON.parse(localStorage.getItem('setting'));
          setFace.style.display = 'block'; //显示设置界面
          setSortArr[1].children[0].checked = setObj.parentNumChecked;
          setSortArr[2].value = setObj.parentNum;
          setSortArr[3].value = setObj.parentNumTail;
          setSortArr[5].children[0].checked = setObj.numChecked;
          setSortArr[6].value = setObj.num;
          setSortArr[7].value = setObj.numTail;
          setSortArr[10].children[0].checked = setObj.keyBtn;
          setSortArr[11].addEventListener('click', saveSetting);
        } else {
          setFace.style.display = 'none';
        }
      });

      function saveSetting() { //保存设置界面的设置内容
        //setSortArr = document.querySelector('.wrap>header>.header-inner>.void>.setting>.setting-face>.setting-sort').children;
        setObj.parentNumChecked = setSortArr[1].children[0].checked;
        setObj.parentNum = setSortArr[2].value.trim();
        setObj.parentNumTail = setSortArr[3].value.trim();
        setObj.numChecked = setSortArr[5].children[0].checked;
        setObj.num = setSortArr[6].value.trim();
        setObj.numTail = setSortArr[7].value.trim();
        setObj.keyBtn = setSortArr[10].children[0].checked;
        localStorage.setItem('setting', JSON.stringify(setObj));
        setFace.style.display = 'none';
        setAppBtn();
      }
      setFace.addEventListener('click', function(ev) {
        ev.stopPropagation(); //取消冒泡
      })
      setAppBtn();

      function setAppBtn() { //将设置结果控制界面
        var sortBtn = document.querySelector(".wrap>header>.header-inner>.random");
        var keyBtn = document.querySelector(".wrap>header>.header-inner>.answer");
        if (setObj.numChecked == false && setObj.parentNumChecked == false) {
          sortBtn.style.display = 'none';


        } else {
          sortBtn.style.display = 'inline-block';
        }
        setObj.keyBtn ? keyBtn.style.display = 'inline-block' : keyBtn.style.display = 'none'

      }

    })();

  })()
})()
