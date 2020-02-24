//学习JavaScript，列出各种各样的斐波那契数列函数
const f1 = n => {
    if (n == 0) return 0
    else if (n == 1) return 1
    else return f1(n - 1) + f1(n - 2)
}

const f2 = n => {
    let last = 1
    let last2 = 0
    let current = last2
    for (let i = 1; i <= n; i++) {
        last2 = last
        last = current
        current = last + last2
    }
    return current
}