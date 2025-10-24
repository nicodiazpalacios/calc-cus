const display = document.getElementById('display');
let waitingForNewInput = false;

function clearDisplay() {
    display.value = '';
    waitingForNewInput = false;
}

/**
 * Agrega un número o el punto decimal a la pantalla.
 * En este diseño, los guiones bajos ('-') representan el punto decimal.
 * @param {string} value El número o decimal a agregar.
 */
function appendValue(value) {
    // Manejamos los botones '-' de la Fila 5 como el punto decimal '.'
    if (value === '-') value = '.'; 

    if (waitingForNewInput) {
        display.value = '';
        waitingForNewInput = false;
    }
    if (value === '0' && display.value === '0') return;
    // Permitimos solo un punto decimal por número
    if (value === '.') {
         // Verificamos si ya existe un punto en el número actual
        const currentDisplay = display.value;
        const lastOperatorIndex = Math.max(
            currentDisplay.lastIndexOf('+'),
            currentDisplay.lastIndexOf('-'), // Este puede ser confuso si es parte de un número negativo
            currentDisplay.lastIndexOf('*'),
            currentDisplay.lastIndexOf('/')
        );
        
        // Obtenemos el segmento del número después del último operador
        const currentNumberSegment = lastOperatorIndex === -1 
            ? currentDisplay 
            : currentDisplay.substring(lastOperatorIndex + 1);

        // Si el segmento ya contiene un punto, no agregamos otro
        if (currentNumberSegment.includes('.')) return;
    }
    

    display.value += value;
}

function appendOperator(operator) {
    waitingForNewInput = false;
    const currentDisplay = display.value;
    const lastChar = currentDisplay.slice(-1);
    const operators = ['+', '-', '*', '/'];

    if (operators.includes(lastChar)) {
        // Reemplazar el operador si el último carácter ya era uno
        display.value = currentDisplay.slice(0, -1) + operator;
    } else if (currentDisplay !== '') {
        // Agregar el operador si no está vacío
        display.value += operator;
    }
}

function calculateResult() {
    try {
        // Reemplazamos los caracteres de la pantalla por los operadores estándar de JS
        const expression = display.value.replace(/÷/g, '/').replace(/×/g, '*');
        let result = eval(expression);

        if (result === Infinity || result === -Infinity) {
            display.value = 'Error: Div/0';
        } else {
            if (typeof result === 'number') {
                // Redondeo para evitar problemas de coma flotante de JS
                result = parseFloat(result.toFixed(6));
            }
            display.value = result;
        }
        
        waitingForNewInput = true;

    } catch (error) {
        display.value = 'Error';
        waitingForNewInput = true;
    }
}