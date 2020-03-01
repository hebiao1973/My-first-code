//参照网上的例子（python写的），用JS改写，目的是练习JS
const test_grid1 = "003020600900305001001806400008102900700000008006708200002609500800203009005010300";
const test_grid2 = "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......";

const Cols = "123456789";
const Rows = "ABCDEFGHI";

const Cross = (A, B) => {
    let arr = [];
    for (let a of A) {
        for (let b of B)
            arr.push(a + b)
    }
    return arr
}

const TwoArr_To_Obj = (arr1, arr2) => {     //注意两个长度一样
    let obj = {};
    arr1.forEach((e, index) => obj[e] = arr2[index]);
    return obj;
}


const Squares = Cross(Rows, Cols);
const UnitArr = [];
for (let c of Cols) {
    UnitArr.push(Cross(Rows, c))
}
for (let r of Rows) {
    UnitArr.push(Cross(r, Cols))
}
const Nums = ["123", "456", "789"];
const Lets = ["ABC", "DEF", "GHI"];
for (let n of Nums) {
    for (let l of Lets) {
        UnitArr.push(Cross(l, n))
    }
}

let Units = {};
Squares.forEach(e => Units[e] = UnitArr.filter(a => a.includes(e)))
let Peers = {};
Squares.forEach(e => Peers[e] = [...new Set(Units[e].flat().filter(a => a !== e))]);

const Parse_Sudoku = (str_sudoku) => {
    let obj = {};
    Squares.forEach(e => obj[e] = Cols);
    let SudokuOfObj = TwoArr_To_Obj(Squares, str_sudoku);
    for (let i of Squares) {
        let v = SudokuOfObj[i]
        if (Cols.includes(v) && !MyAssign(obj, i, v)) {
            return false
        }
    }
    return obj
}

const MyAssign = (obj, key, value) => {
    //从obj[key]中删除除了value以外的所有值，因为value是唯一的值
    //如果在过程中发现矛盾，则返回false
    let others = obj[key].replace(value, '');
    let str_arr = [...others];
    if (str_arr.every(n => eliminate(obj, key, n))) {
        return obj
    } else {
        return false
    }
}

const eliminate = (obj, key, num) => {
    // 从obj[key]中删除值num，因为num是不可能的
    if (!obj[key].includes(num)) {
        return obj
    } else {
        obj[key] = obj[key].replace(num, '')
    }

    //以下采用了约束传播
    //1.如果一个方块只有一个可能值，把这个值从方块的对等方块（的可能值）中排除。
    if (obj[key].length === 0) {
        return false
    } else {
        if (obj[key].length === 1) {
            let only_value = obj[key];
            //从与之相关的20个元素中删除only_value,注意此处的“直接”递归调用！！！
            if (!Peers[key].every(p => eliminate(obj, p, only_value))) {
                return false
            }
        }
    }

    //2.如果一个方格只有一个可能位置来放某个值，就把值放那。
    let dplaces = [];
    Units[key].forEach(u => {
        for (let i of u) {
            if (obj[i].includes(num)) {
                dplaces.push(i)
            }
        }
    });
    if (dplaces.length === 0) {
        return false
    } else {
        if (dplaces.length === 1) {
            let only_key = dplaces[0];
            //注意此处的“间接”递归调用！！！
            if (!MyAssign(obj, only_key, num)) {
                return false
            }
        }
    }

    return obj

}

const Solve_Sudoku = str => {
    return Search_Sudoku(Parse_Sudoku(str))
}

const Search_Sudoku = (obj) => {
    if (!obj)
        return false
    if (Squares.every(e => obj[e].length === 1)) {    //全部解决返回
        return obj
    }

    // 选择可能值数目最少的方块, 进行深度优先搜索
    let Arr_temp = Object.entries(obj).filter(e => e[1].length > 1);
    Arr_temp.forEach(e => e[1] = e[1].length);
    Arr_temp.sort((x, y) => x[1] - y[1]);
    let key = Arr_temp[0][0];
    for (let num of obj[key]) {
        let result = Search_Sudoku(MyAssign(Object.assign({}, obj), key, num))
        if (result) return result
    }
    return false
}

//以下代码将题目和答案输出在浏览器上面
const Show_In_Exp = (str_sudoku) => {
    for (let i = 0; i < str_sudoku.length; i++) {
        document.writeln(str_sudoku[i] + "&nbsp")
        if ((i + 1) % 9 === 0) {
            document.writeln("<br/>")
        }
    }
    document.writeln("---------------------<br/>");
}

Show_In_Exp(test_grid1);
let answer = Solve_Sudoku(test_grid1);
if (answer) {
    Answer_Str = Object.values(answer).join('');
    Show_In_Exp(Answer_Str);
} else {
    document.writeln("No Answer")
}
//以上代码已调试通过
