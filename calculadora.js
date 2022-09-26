const container = document.querySelector("#container_body");
const inputResult = document.querySelector(".result");

let resultValue = inputResult.textContent?.trim() || "";
let resultValueParsed = "";
const methods = ["c", "del", "="];
const operators = ["+", "-", "*", "/"];
const characters = ["(", ")", ".", ","];
const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

[...methods, ...operators, characters[0], characters[1], ...numbers, characters[2], characters[3]].forEach(value => {
    switch (value) {
        case "=":
            addElement({
                datas: ["item", "method"],
                onClick: `result('${value}')`,
                value,
            });
            break;
        case "c":
            addElement({
                datas: ["item", "method"],
                onClick: "reset()",
                value,
            });
            break;
        case "del":
            addElement({
                datas: ["item", "method"],
                onClick: "remove()",
                value,
            });
            break;
        case ",":
        case ".":
        case "(":
        case ")":
            addElement({
                datas: ["item", "character", "operator"],
                onClick: `character('${value}')`,
                value,
            });
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            addElement({
                datas: ["item", "operator"],
                onClick: `operation('${value}')`,
                value,
            });
            break;
        default: {
            const disabled = value === null ? "disabled" : "";
            addElement({
                datas: ["item", "number"],
                className: disabled,
                onClick: `operation('${value}')`,
                value,
                disabled,
            });
        }
    }
    function addElement({datas = [], className = "", onClick, value, disabled = ""}) {
        datas = datas.map(data => `${data}="true"`);
        const datasList = datas.length > 0 ? `data-${datas.join(" data-")}` : "";
        container.innerHTML += `<input class="${className}" type="button" onclick="${onClick}" value="${value}" ${datasList} ${disabled}/>`;
    }
});

setTimeout(() => listItemsToggle(true), 1);

function character(value) {
    const inputValue = inputResult.textContent?.trim().at(-1);
    if (inputValue === value) return;
    if (value === ",") resultValueParsed += ".";
    else if (value === ".") resultValueParsed += ",";
    logger("log", null, `Argumento añaido ${value}`);
    resultValue += value;
    inputResult.innerHTML = resultValue;
}

function operation(value) {
    const inputValue = inputResult.textContent?.trim().at(-1) || "";
    if (!operators.includes(value) || !operators.includes(inputValue)) {
        const listItem = document.querySelector("input[data-operator]");
        if (listItem.disabled) listItemsToggle(false);
        resultValue += value;
        resultValueParsed += value;
        logger("log", null, `Argumento añaido ${value}`);
    }
    resultValue.length >= 30 ? addScroll() : removeScroll();
    function addScroll() {
        if (!inputResult.className.includes("active-scroll")) {
            inputResult.className = "result active-scroll";
        }
    }
    function removeScroll() {
        if (inputResult.className.includes("active-scroll")) {
            inputResult.className = "result";
        }
    }
    inputResult.innerHTML = resultValue;
}

function result() {
    let evalResult = resultValueParsed;
    try {
        evalResult = eval(evalResult);
        logger("log", null, `Calculo resuelto ${evalResult}`);
    } catch (error) {
        handleError(error);
    }
    resultValue = evalResult;
    inputResult.innerHTML = resultValue;
}

function remove() {
    const inputValue = inputResult.textContent?.trim();
    resultValue = inputValue.slice(0, inputValue.length - 1);
    inputResult.innerHTML = resultValue;
    if (resultValue.length <= 0) listItemsToggle(true);
    logger("log", null, `Argumento eliminado ${inputValue.at(-1)}`);
}

function reset() {
    resultValue = "";
    inputResult.innerHTML = resultValue;
    listItemsToggle(true);
    logger("log", null, "Calculadora reiniciada");
}

function listItemsToggle(disabled) {
    const listItems = document.querySelectorAll("input[data-item]");
    listItems.forEach(item => {
        if ((item.getAttribute("data-operator") || item.getAttribute("data-method")) == "true") {
            item.classList[disabled ? "add" : "remove"]("input-disabled");
            item.disabled = disabled;
        }
    });
}

function logger(type = "log", title = "LOG INTERNAL", message = "") {
    if (!type) type = "log";
    if (!title) title = "LOG INTERNAL";
    console[type](title + ` [${type?.toUpperCase()}]:`, message);
}

function handleError(error) {
    let message;
    if (error instanceof SyntaxError) {
        message = "Hubo un error al hacer el cálculo. ¡La sintaxis está mal, revísalo!";
    } else {
        message = "Hubo un error al hacer el cálculo. Error: " + error.message || error;
    }
    logger("error", null, {
        ...error,
        message: message,
    });
    alert(message);
}
