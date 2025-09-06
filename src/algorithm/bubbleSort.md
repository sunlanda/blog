# 冒泡排序


```js

var arr = [4,2,7,1,3]
var result =[]

/**
 * 冒泡排序
 * @param {*} arr 无序数组
 * @returns arr 返回排好的数组
 */
function bubbleSort(arr) {
  let step = 0;
  if(arr.length <=1) return false
  // 思路就是i和j比较  谁大就交换到后面
  // 1. 第一层循环拿到i的下标 
  // 2. 第二层循环拿到j下标 这一层进行j与j+1的大小交换 同时在本轮交换完后缩小继续循环的范围(每轮范围就是i 所以是arr.length-1-i)
  // 3. 交换完毕后return arr ,冒泡排序的时间复杂度较高 达到了O(N²)
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length-1-i; j++) {
      let _temp;
      step++;
      console.log("🚀 ~ bubbleSort ~ _temp:", step)
      if(arr[j] > arr[j+1]){
        _temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = _temp
      }
    }
  }
  return arr
}
console.log("🚀 ~ bubbleSort(arr):", bubbleSort(arr))


```