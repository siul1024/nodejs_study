// var arr = [1, 2, 3, 4, 5];

// console.log(arr);

// console.log(arr.length);

// arr.push(6);
// console.log(arr);
// console.log(arr.length);


// arr.pop(); //뒤에서부터 pop
// console.log(arr);
// console.log(arr.length);


// console.log(arr);
// console.log(arr.length);
        

var numbers = [1, 3, 123, 123123, 44444444];
var sum = 0;

for(i=0; i<numbers.length; ++i)
{
    console.log(numbers[i]);
    sum += numbers[i];
}

console.log(`sum: ${sum}`);
console.log('sum: '+sum);