class range {
  constructor(low, high, step, begin) {
    this.x = begin;
    if (begin == undefined) this.x = low;
    this.low = low;
    this.step = step;
    this.high = high;
  }
  next() {
    let x = this.x + this.step;
    if (x > this.high) {
      this.step *= -1;
      let r = x - this.high;
      this.x = this.high - r;
      return this.x;
    }
    if (x < this.low) {
      this.step *= -1;
      let r = this.low - x;
      this.x = this.low + r;
      return this.x;
    }
    this.x += this.step;
    return this.x;
  }
}

export {range};