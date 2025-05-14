## 如何用栈实现队列

栈是一种后进先出（LIFO）的数据结构，而队列是一种先进先出（FIFO）的数据结构。通过巧妙地使用两个栈，我们可以模拟队列的行为。

```js
function StackToQueue() {
  // 用于入队操作的栈
  this.stack1 = [];
  // 用于出队操作的栈
  this.stack2 = [];

  // 入队操作 - 将元素添加到队列尾部
  this.enqueue = function(element) {
    // 直接将元素推入stack1，相当于添加到队列尾部
    this.stack1.push(element);
  };

  // 出队操作 - 从队列头部移除元素
  this.dequeue = function() {
    // 如果stack2为空，需要将stack1中的所有元素转移到stack2中
    // 这样做会使stack1中的元素顺序在stack2中反转，从而实现FIFO
    if (this.stack2.length === 0) {
      // 当stack1也为空时，表示队列中没有元素
      if (this.stack1.length === 0) {
        return undefined; // 队列为空，返回undefined
      }
      
      // 将stack1中的所有元素依次弹出并推入stack2
      // 这个过程会使元素顺序反转，使最先入队的元素位于stack2的顶部
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }
    
    // 从stack2弹出顶部元素，相当于从队列头部移除元素
    return this.stack2.pop();
  };

  // 查看队列头部元素但不移除
  this.peek = function() {
    // 如果stack2为空，需要将stack1中的所有元素转移到stack2中
    if (this.stack2.length === 0) {
      // 当stack1也为空时，表示队列中没有元素
      if (this.stack1.length === 0) {
        return undefined; // 队列为空，返回undefined
      }
      
      // 将stack1中的所有元素依次弹出并推入stack2
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop());
      }
    }
    
    // 返回stack2的顶部元素但不移除，相当于查看队列头部元素
    return this.stack2[this.stack2.length - 1];
  };

  // 获取队列长度
  this.size = function() {
    // 队列的总长度是两个栈中元素数量的总和
    return this.stack1.length + this.stack2.length;
  };

  // 检查队列是否为空
  this.isEmpty = function() {
    // 当两个栈都为空时，队列为空
    return this.stack1.length === 0 && this.stack2.length === 0;
  };
}
```

## 时间复杂度分析

- **入队操作 (enqueue)**：时间复杂度为 O(1)，因为只需要将元素推入stack1，这是一个常数时间操作。

- **出队操作 (dequeue)**：
  - 最坏情况：当stack2为空时，需要将stack1中的所有n个元素转移到stack2，时间复杂度为O(n)。
  - 平均情况：每个元素最多被转移一次，所以n个元素的n次操作的平均时间复杂度为O(1)（均摊分析）。

- **查看队列头部元素 (peek)**：与出队操作类似，最坏情况时间复杂度为O(n)，平均时间复杂度为O(1)。

- **获取队列长度 (size)和检查队列是否为空 (isEmpty)**：时间复杂度均为O(1)，因为只需要检查两个栈的长度。

总结：虽然某些操作在最坏情况下的时间复杂度为O(n)，但从均摊分析的角度来看，所有操作的平均时间复杂度都是O(1)，这使得用栈实现的队列在实际应用中非常高效。