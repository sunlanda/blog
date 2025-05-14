
## 求两个数组公共子序列

> 给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。如果不存在 公共子序列 ，返回 0 。
> 一个字符串的 子序列 是指这样一个新的字符串：它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。
> 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。




```js
/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
// 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
// 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。
var longestCommonSubsequence = function(text1, text2) {
    // 特殊情况处理
    if (!text1 || !text2) return 0;
    
    // 创建二维数组dp，dp[i][j]表示text1的前i个字符和text2的前j个字符的最长公共子序列长度
    const m = text1.length;
    const n = text2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    console.log("🚀 ~ longestCommonSubsequence ~ dp:", dp)
    
    // 动态规划填表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                // 如果当前字符相同，则最长公共子序列长度+1
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // 如果当前字符不同，则取前面计算的最大值
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // 返回最终结果
    return dp[m][n];
};

// 测试用例
console.log(longestCommonSubsequence('abc', 'def')); // 0 - 没有公共子序列
console.log(longestCommonSubsequence('abc', 'abcc')); // 3 - "abc"
console.log(longestCommonSubsequence('abcde', 'ace')); // 3 - "ace"
console.log(longestCommonSubsequence('ezupkr', 'ubmrapg')); // 2 - "ur"
console.log(longestCommonSubsequence('bsbininm', 'jmjkbkjkv')); // 1 - "m" 或 "j"
console.log(longestCommonSubsequence('oxcpqrsvwf', 'shmtulqrypy')); // 2 - "sr" 或 "qr"

```


## 参考
leetcode链接: 