function greet(name) {
    console.log(`Hi ${name}`);
}

function formalGreet(name) {
    console.log(`Hello, ${name} ! How do you do ?`);
}

module.exports = {
    greet,
    formalGreet
};