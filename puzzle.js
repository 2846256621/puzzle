const Puzzle = function (grade) {
    this.init(grade);
};
Puzzle.prototype = {
    init:function (grade) {
        this.grade = grade; //游戏等级
        this.select = document.getElementById("select");
        this.input =document.getElementById("file");
        this.gameArea = document.getElementById("gameArea");
        this.imgArea = document.getElementById("imgArea");
        this.gamesters = document.getElementById("gamesters");
        //图片区域大小
        this.imgAreaWidth =  400;
        this.imgAreaHeight = 400;
        //游戏区域大小
        this.gameArea.style.width = this.imgAreaWidth + 'px';
        this.gameArea.style.height = this.imgAreaHeight + this.gamesters.offsetHeight+'px';//游戏总高度包括：图片高度+按钮高+底部边距
        this.cellWidth = this.imgAreaWidth /this.grade;  //每个格子的宽
        this.cellHeight = this.imgAreaHeight /this.grade;//每个格子的高
        this.imgUrl = ''; //图片路径
        this.imgCells = ''; //每个格子
        this.orginArr = []; //原来存储的数组
        this.randomArr = []; //乱序数组
        this.hasStart = 0; //游戏未开始标志
        this.order = null; //未点击的默认状态
    },
    initGame:function () {
        this.getImgUrl();
    },
    //上传图片 得到图片路径
    getImgUrl:function () {
        const self = this;
        //点击div选择图片 模拟点击input（其他方法）
        this.select.onclick = function () {
            self.input.click();
        };
        this.input.addEventListener("change",handleFiles); //change 是存储事
        function handleFiles() {
            let reader = new FileReader(); //FileList代表被用户选择的文件
            let file = this.files[0]; //如果用户只选择了一个文件，只需要考虑fileList的第一个对象
            reader.readAsDataURL(file);//拿到图片base6编码
            reader.onload = function () {   // 读取完成时 拿到base64编码
                self.imgUrl = reader.result; //读取结果
                self.divImg();
            }
        }
        // this.input.onchange = function(){
        // let reader = new FileReader();
        // let file = this.files;
        // reader.readAsDataURL(file[0]);
        // reader.onload = function () {
        //     self.imgUrl = reader.result;
        //     self.divImg();
        // };
        // }
    },

    //分割图片
    divImg:function () {
        let cells = '';
        this.imgArea.innerText = '';
        for(let i = 0;i< this.grade;i++){
            for(let j = 0;j< this.grade;j++){
                this.orginArr.push(i*this.grade +j);
                cells = document.createElement("div");
                cells.className = 'imgCell';
                cells.index = i * this.grade +j;
                cells.style.width = this.cellWidth + 'px';
                cells.style.height = this.cellHeight + 'px';
                cells.style.left = j * this.cellWidth + 'px';//列*宽
                cells.style.top =  i * this.cellHeight + 'px'; //行*高
                cells.style.backgroundImage = 'url('+ this.imgUrl+')';
                cells.style.backgroundRepeat = 'no-repeat';
                cells.style.backgroundSize = (this.grade *100)+'% '+ (this.grade *100)+'%';
                cells.style.backgroundPosition = (-j *this.cellWidth) + 'px '+(-i * this.cellHeight)+'px';
                this.imgArea.appendChild(cells);
            }
        }
        console.log(this.orginArr);
        //移动文件选择框到屏幕外
        this.imgCells = document.querySelectorAll(".imgCell");
        this.select.style.left = - this.select.offsetWidth+'px';
        //游戏区域移动到屏幕中间
        this.gameArea.style.left = 50+'%';
        this.gameArea.style.transform = 'translateX(-50%)';
        this.gamesters.onclick = this.clickCells(); //点击开始
    },
    //打乱数组
    RandomArr:function () {
        this.randomArr = [];//因为递归调用，每次都要置空数组
        let flag = 0;
        let rand = Math.floor(Math.random()*this.orginArr.length);
        for(let i=0;i<this.orginArr.length;i++){
            if(this.randomArr.length > 0){
                while(this.randomArr.indexOf(rand) !== -1){
                    rand = Math.floor(Math.random()*this.orginArr.length);
                }
            }
            this.randomArr.push(rand);
        }
        //判断两个数组不同（完全乱序）
        for(let i = 0;i<this.randomArr.length ;i++){
            if(this.orginArr[i] === this.randomArr[i]){
                flag = 1;
                break;
            }
            else
                flag = 0;
        }
        if(flag){
            this.RandomArr();
        }
        console.log(this.randomArr);
    },
    //移动乱序图片到相应的位置
    orderCells:function () {
        let self = this;
        // 取余是列  取整是行
        // 再乘以一个格子的宽度 就是其left值，乘以一个格子的高度 就是top值
        this.imgCells.forEach(function (element ,i) {
            element.style.left = (self.randomArr[i] % self.grade) * self.cellWidth + 'px'; //列*宽
            element.style.top = Math.floor(self.randomArr[i] / self.grade) * self.cellHeight +'px'; //行*高
        })
    },
    //交换点击图片对应的格子
    exchangeCells:function (from ,to) {
        const fromRow = Math.floor(this.randomArr[from] / this.grade ); //行 数组存的位置
        const fromCol = this.randomArr[from] % this.grade ; //列
        const toRow = Math.floor(this.randomArr[to] / this.grade);
        const toCol = this.randomArr[to] % this.grade;
        //交换格子
        this.imgCells[from].style.left =  toCol * this.cellWidth + 'px';
        this.imgCells[from].style.top = toRow * this.cellHeight + 'px';
        this.imgCells[to].style.left = fromCol * this.cellWidth + 'px';
        this.imgCells[to].style.top = fromRow * this.cellHeight + 'px';
        //交换数组内容
        let temp = this.randomArr[from];
        this.randomArr[from] = this.randomArr[to];
        this.randomArr[to] = temp;
        //判断两个数组是否相同
        if(this.randomArr.toString() === this.orginArr.toString()){
            this.success();
        }
    },
    //拼图成功
    success:function () {
        this.hasStart = 0;
        setTimeout(function () {
            alert("恭喜你，拼图成功");
        },500);
    },
    //选中格子的点击事件
    clickCells:function () {
        let self = this;
        return function () {
            if(self.hasStart === 0){  //游戏未开始
                self.hasStart = 1;
                self.RandomArr();
                self.orderCells();
                for(let i =0;i < self.imgCells.length;i++){
                    self.imgCells[i].onclick = function () {
                        if(self.order === null){  //第一次点击
                            self.order = this.index;
                            this.style.border = '2px solid red';
                        }
                        else{ //第二次点击
                            self.imgCells.forEach(function (elements) {
                                elements.style.border = '1.5px solid white'; //去除所有选中
                            });
                            if(self.order === this.index){
                                self.order = null;
                                return;
                            }
                            else{
                                console.log(self.order,this.index);
                                self.exchangeCells(self.order ,this.index);
                            }
                            self.order = null;
                        }
                    }
                }
            }
        }
    }
};

//实例化对象
const puzzle = new Puzzle(3);
puzzle.initGame();
//二次初始化
function secInit(self,grade){
    self.grade = grade;
    self.orginArr = [];
    self.cellWidth = self.imgAreaWidth /self.grade;
    self.cellHeight = self.imgAreaHeight /self.grade;
}
//难度
window.onload = function(){
    const selects = document.getElementById("selects");
    selects.getElementsByTagName('option')[1].selected = "selected";  //默认选项为第二个
    //事件委托
    selects.onclick = function (event) {
        let target = event.target;
        if(puzzle.hasStart === 1){
            alert("游戏已经开始，不可以再更改难度了哦");
            return ;
        }
        secInit(puzzle,target.value); //需要重新初始化
        puzzle.divImg(); //分割图片
  }
};