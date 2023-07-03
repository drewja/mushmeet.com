export { rangeBounce };

// Closure implementation
function rangeBounce(low, high, step, begin) {
  let x = begin-step;
  if (begin == undefined) x = low-step;

  return () => {
    //bounce off our bounds
    if (x + step > high || x + step < low) step *= -1;
    return x += step;
  };
}

function test_range(rangeFunc){
  let pass = true;
  let expected = [3,6,9,12,9,6,3,6]
  let out = [];
  const rf = rangeFunc(3,14,3);
  expected.forEach((e)=>{
    let o = rf();
    out.push(o);
    if (o !== e) pass = false;
  })
  console.log('e ', expected);
  console.log('o', out);
  if (pass) { console.log('test pass (rangeBounce)')}
  else console.log('test fail! (rangeBounce)')
}
test_range(rangeBounce);