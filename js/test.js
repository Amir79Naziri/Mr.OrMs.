async function f() {
    for (let i = 0; i < 10000; i++){
        for (let j = 0; j < 10000; j++) {
            for (let z =0; z < 1000; z++) {
                var k = i + j * z;
            }
        }
    }
    console.log(k)
}

console.log('here')
