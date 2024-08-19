/**
 * 快速排序
 * @param arr 传入数组
 * @returns 返回排序过的数组
 */
// 如果中位数刚好是多次出现,那是否能保证排序后的数据位数正确 for循环第一行先拿pivot做判断
// 第一次循环后其实区分了三段, 能否直接用arr设置 1 3 段中的数据 (ind知道 ,前提得排好序)
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
}
  // 1. 取中间一个数值,设定左右两组arr 小于就放左边,大于就放右边
  let _middleTemp = arr[Math.floor(arr.length / 2)]
  let leftArr = []
  let rightArr = []
  // console.log("🚀 ~ 中间数:", _middleTemp)
  for (let i = 0; i < arr.length; i++) {
    if(i === Math.floor(arr.length / 2)){
      continue
    }
    if(_middleTemp<arr[i]){
      rightArr.push(arr[i])
    }
    else{
      leftArr.push(arr[i])
    }
  }
  // let _arr = quickSort(leftArr).concat(_middleTemp).concat(quickSort(rightArr))
  return quickSort(leftArr).concat(_middleTemp, quickSort(rightArr));

}
const array = [123, 58, 532, 58, 88, 100, 9, 58, 11]
console.log('quickSort(array)',quickSort(array));




