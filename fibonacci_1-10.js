//学习JavaScript，列出各种各样的斐波那契数列函数
const f = n => {
    if (n == 0) return 0
    else if (n == 1) return 1
    else return fibonacci(n - 1) + fibonacci(n - 2)
}