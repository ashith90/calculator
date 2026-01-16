let display = document.getElementById("display");
let isDeg = true;
let isInv = false;
let usedInverseTrig = false;

const operators = ["+", "-", "*", "/", "%", "^"];

/* Append value with rules */
function appendValue(value) {
    let current = display.value;

    // Right-align display
    display.style.textAlign = "right";

    // Allow minus at beginning (negative number)
    if (current === "" && value === "-") {
        display.value = "-";
        return;
    }

    // Block other operators at beginning
    if (current === "" && operators.includes(value)) {
        return;
    }

    // Prevent multiple operators in a row
    let lastChar = current.slice(-1);
    if (operators.includes(lastChar) && operators.includes(value)) {
        display.value = current.slice(0, -1) + value;
        return;
    }

    display.value += value;
}
/* Append dot with rules */
function appendDot() {
    let current = display.value;

    let parts = current.split(/[\+\-\*\/\%\^]/);
    let lastPart = parts[parts.length - 1];

    if (lastPart.includes(".")) return;

    if (current === "" || operators.includes(current.slice(-1))) {
        display.value += "0.";
    } else {
        display.value += ".";
    }
}
/* Clear display */
function clearDisplay() {
    display.value = "";
}

/* Delete one character */
function deleteOne() {
    display.value = display.value.slice(0, -1);
}

/* Toggle DEG / RAD */
function toggleDegRad() {
    isDeg = !isDeg;
    document.getElementById("mode").innerText = isDeg ? "DEG" : "RAD";
}

/* Factorial */
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

/* Convert degrees to radians */
function toRadians(x) {
    return isDeg ? x * Math.PI / 180 : x;
}
/* healper function for square root */
function sqrt(x) {
    return Math.sqrt(x);
}
/* healper function for inverse */
function inv(x) {
    return 1 / x;
}
/* Convert radians to degrees */
function toDegrees(x) {
    return x * 180 / Math.PI;
}

/* Trig Append helper */
function appendTrig(fn) {
    if (isInv) {
        display.value += "a" + fn + "(";
    } else {
        display.value += fn + "(";
    }
}
/* Toggle INV */
function toggleInv() {
    isInv = !isInv;
    document.getElementById("inv").style.background =
        isInv ? "#ffd166" : "";
}


/* Calculate */
function calculate() {
    try {
        let expr = display.value;

        expr = expr.replace(/pi/g, "Math.PI");
        expr = expr.replace(/\be\b/g, "Math.E");

       

       // Inverse trigonometric functions
      // ✅ Inverse trig FIRST (supports nesting)
       // ✅ Inverse trig (always radians here)
      usedInverseTrig = false;

      expr = expr.replace(/asin\(([\s\S]+?)\)/g, function(_, v) {
      usedInverseTrig = true;
      return "Math.asin(" + v + ")";
});

      expr = expr.replace(/acos\(([\s\S]+?)\)/g, function(_, v) {
      usedInverseTrig = true;
      return "Math.acos(" + v + ")";
});

      expr = expr.replace(/atan\(([\s\S]+?)\)/g, function(_, v) {
      usedInverseTrig = true;
      return "Math.atan(" + v + ")";
});


       // ✅ normal trig (DO NOT touch asin / acos / atan)
      expr = expr.replace(/(?<!a)sin\(([^)]+)\)/g, "Math.sin(toRadians($1))");
      expr = expr.replace(/(?<!a)cos\(([^)]+)\)/g, "Math.cos(toRadians($1))");
      expr = expr.replace(/(?<!a)tan\(([^)]+)\)/g, "Math.tan(toRadians($1))");


        expr = expr.replace(/log\(/g, "Math.log10(");
        expr = expr.replace(/ln\(/g, "Math.log(");
        expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
        expr = expr.replace(/(\d+)!/g, "factorial($1)");

        // Percentage handling: A - B%  =>  A - (A * B / 100)
// Percentage handling: A + B%  =>  A + (A * B / 100)
expr = expr.replace(/(\d+(\.\d+)?)(\s*)([\+\-])(\s*)(\d+(\.\d+)?)%/g,
    function (_, base, _, __, op, ___, percent) {
        if (op === "+") {
            return base + " + (" + base + " * " + percent + " / 100)";
        } else {
            return base + " - (" + base + " * " + percent + " / 100)";
        }
    }
);


        let result = eval(expr);

       // ✅ Convert inverse trig output to degrees if needed
       if (isDeg && usedInverseTrig) {
    result = toDegrees(result);
}


display.value = result;

    } catch {
        display.value = "Error";
    }
}
