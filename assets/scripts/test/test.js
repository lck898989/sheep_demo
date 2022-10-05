function createRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function swap(a, b) {
    let temp = b;
    b = a;
    a = temp;
}

let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < a.length; i++) {
    let randomNumber = createRandom(0, a.length);

    let temp = a[randomNumber];
    a[randomNumber] = a[i];
    a[i] = temp;

}
console.log('a is ', a);