import { writeFileSync, readFileSync } from 'fs';

writeFileSync('test.txt', 'Hello, world!, sexo pito')

const data = readFileSync('test.txt', 'utf8') // => 'Hello, world!'
console.log(data)
