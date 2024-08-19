/**
 * 冒泡排序
 * @param {*} arr 无序数组
 * @returns arr 返回排好的数组
 */
let step = 0;
function bubbleSort(arr) {
  if(arr.length <=1) return false
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      let _temp;
      step++;
      if(arr[j] > arr[j+1]){
        _temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = _temp
      }
    }
  }
  return arr
}

const array = [4,2,7,1,3]
console.log('bubbleSort result:',bubbleSort(array));
console.log('bubbleSort step:',step);