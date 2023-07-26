// Getting DOM elements
const displayContent = document.querySelector('.numbers-display');
const buttons = document.querySelectorAll('button');
const deleteNumber = document.querySelector('.delete');
const pointButton = document.querySelector('.point');
const answer = document.querySelector('.answer');
const equealButton = document.querySelector('.equal');
const restartButton = document.querySelector('.set');

let allOperatorsValues = [];
let allOperatorsValuesJs = ['-','*', '/', '+'];
let numberToRender = '';

let calculatorDisplay = [];
let codeToRenderInDOM = ['<span><div class="box"></div></span>'];

function createNumberWithComas(numberToPutComas){
    // If the number has a dot
    let numbersReversed;
    if(numberToRender.indexOf('.') !== -1){
        const numberEntire_Decimals = numberToPutComas.split('.');
        numbersReversed = numberEntire_Decimals[0].split('').reverse();

        for (let i = 0; i < numbersReversed.length; i++) {
            if(i % 4 === 0){
                numbersReversed.splice(i, 0, ',');
            }
        }
        numbersReversed.splice(0, 1);
        const finalStringWithComas = numbersReversed.reverse().join('').concat('.' + numberEntire_Decimals[1]);
        calculatorDisplay.push(finalStringWithComas);
    } else{
        numbersReversed = numberToPutComas.split('').reverse();
        // Add comas to numberToRender
        for (let i = 0; i < numbersReversed.length; i++) {
            if(i % 4 === 0){
                numbersReversed.splice(i, 0, ',');
            }
        }
        // Delete the first coma created accidently
        numbersReversed.splice(0, 1);
    
        const finalStringWithComas = numbersReversed.reverse().join('');
        calculatorDisplay.push(finalStringWithComas);
    }
}


function renderNumbers(number){
    // Check if the first number put is a 0 and it does not have a dot
    if(numberToRender.split('').shift() === '0' && numberToRender.indexOf('.') === -1){
        numberToRender = number.value;

        // Delete last value in array and add the new one hopping it is not a 0
        calculatorDisplay.pop();
        calculatorDisplay.push(numberToRender);
        displayContent.textContent = calculatorDisplay.join('');
        console.log(calculatorDisplay);
        flashBox();
        return;
    }

    numberToRender += number.value;
    
    if(numberToRender.length > 8){
        alert('You can not inset a number bigger than 8 digits');
        numberToRender = numberToRender.split('');
        numberToRender.pop();
        numberToRender = numberToRender.join('');
        return;
    } 

    if(numberToRender.length > 1){
        // Delete last number to render new number with correct comas position
        calculatorDisplay.pop();
    }

    if (numberToRender.length > 3) {
        createNumberWithComas(numberToRender);

    } else {
        calculatorDisplay.push(numberToRender);
    }
   
    displayContent.textContent = calculatorDisplay.join('');
    console.log(calculatorDisplay);
    mathOperation();
    flashBox();
}

function renderOperators(op){
    if(calculatorDisplay.length === 0){
        return;
    }
    // Reset numbers to render
    numberToRender = '';

    allOperatorsValues.forEach((value) => {
        // Si el último valor del array es un operador se elimina para reemplazarlo
        if(calculatorDisplay[calculatorDisplay.length - 1] === value){
            calculatorDisplay.pop();
        }
    });

    calculatorDisplay.push(op.value);
    displayContent.textContent = calculatorDisplay.join('');
    flashBox();
    console.log(calculatorDisplay);
}

function deleteNumber_Operation(){
    if(calculatorDisplay.length === 0){
        return;
    }

    const popped = calculatorDisplay.pop();
    const lastNumberDeleted = popped.slice(0,-1).split(',').join('');
    numberToRender = numberToRender.slice(0,-1);

    // If the element deleted was an operator
    allOperatorsValues.forEach((value) => {
        if(popped === value){
            // Se le asigna el ultimo número del array después de que se eliminó el operador y si el numero tiene comas se eliminan
            numberToRender = calculatorDisplay[calculatorDisplay.length - 1].split(',').join('');
        }
    });
    
    if(lastNumberDeleted === ''){
        if(calculatorDisplay.length === 0){
            displayContent.textContent = 0;
            answer.textContent = `Answer: 0`;
            flashBox();
            return;
        }
    } else{
        createNumberWithComas(lastNumberDeleted);        
    }
    displayContent.textContent = calculatorDisplay.join('');

    mathOperation();
    flashBox();
}

function addDotToNumber(){
    if(numberToRender.indexOf('.') !== -1){
        return;
    }
    if(numberToRender.length === 0){
        numberToRender = 0;
    }
    numberToRender += '.';

    allOperatorsValues.forEach((value) => {
        // Si el último valor del array es un operador NO se elimina nada
        if(calculatorDisplay[calculatorDisplay.length - 1] === value){
            calculatorDisplay.push(numberToRender);
            return;
        }
    });
    calculatorDisplay.pop();
    createNumberWithComas(numberToRender);
    displayContent.textContent = calculatorDisplay.join('');
    flashBox();
}

function mathOperation(){
    const newArr = [];
    calculatorDisplay.forEach((value) => {
        if(value === '×'){
            newArr.push('*');
        } else if(value === '÷'){
            newArr.push('/');
        } else if(value === '-' || value === '+'){
            newArr.push(value);
        } else{
            newArr.push(value.split(',').join(''));
        }
    });
    allOperatorsValuesJs.forEach((value) => {
        if(newArr[newArr.length - 1] === value){
            newArr.pop();
        }
    });
    // Aquí se usa la librería de math js que se descargó
    const result = math.evaluate(newArr.join(''));
    // También se puede usar eval que forma parte del código de js
    // const result = eval(newArr.join(''));
    answer.textContent = `Answer: ${result}`;
}

function resetValues(){
    calculatorDisplay = [];
    numberToRender = '';
    displayContent.textContent = '0';
    answer.textContent = `Answer: 0`;
    flashBox();
}

function equalOperation(){
    const newValue = answer.textContent.split('Answer: ');
    numberToRender = `${newValue[1]}`;
    calculatorDisplay = [];
    createNumberWithComas(`${newValue[1]}`);
    displayContent.textContent = calculatorDisplay.join('');
    flashBox();
}

function flashBox(){
    confirmFlashBox = true;
    displayContent.innerHTML += codeToRenderInDOM;
    const box = displayContent.querySelector('.box');
    setInterval(() => {
        box.classList.toggle('flash');
    }, 500);
    console.log(box);
}
flashBox();

// EVENTS
deleteNumber.addEventListener('click', deleteNumber_Operation);
pointButton.addEventListener('click', addDotToNumber);
restartButton.addEventListener('click', resetValues);
equealButton.addEventListener('click', equalOperation);

Array.from(buttons).map(button => {
    if(button.classList.contains('number')){
        button.addEventListener('click', renderNumbers.bind(null, button));
    } else if(button.classList.contains('operator')){
        allOperatorsValues.push(button.value);
        button.addEventListener('click', renderOperators.bind(null, button));
    }
});
