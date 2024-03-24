function getMatrix(rows, cols) {
    let newMatrix = new Array(rows);

    for (let idx = 0; idx < rows; idx++) {
        newMatrix[idx] = new Array(cols).fill(0);
    }

    return newMatrix;
}

function fillMatrixWithRandom(matrix) {
    for (let idx = 0; idx < matrix.length; idx++) {
        for (let jdx = 0; jdx < matrix[0].length; jdx++) {
            matrix[idx][jdx] = Math.floor(Math.random() * 2);
        }
    }
}

function swapMatrices(main, back) {
    return [back, main];
}

function countNeighbors(main, row, col) {
    let count = 0;
    for (let rowIdx = -1; rowIdx <= 1; rowIdx++) {
        for (let colIdx = -1; colIdx <= 1; colIdx++) {
            if (rowIdx != 0 || colIdx != 0) {
                if (main[row - rowIdx] != undefined && main[row - rowIdx][col - colIdx] != undefined) {
                    count += main[row - rowIdx][col - colIdx];
                }
            }
        }
    }

    return count;
}

function computeNewGeneration(main, back, rules) {
    let [rows, cols] = [main.length, main[0].length];
    let cellState = 0;
    let neighbors = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            cellState = main[i][j];
            neighbors = countNeighbors(main, i, j);
            back[i][j] = rules[cellState][neighbors];
        }
    }
}

function drawMatrix(canvas, ctx, matrix) {
    /* this is bad way to determine cell size - change it! */
    const [rows, cols] = [matrix.length, matrix[0].length];
    const rate = rows / cols;
    const cellWidth = canvas.height / rows;

    if (canvas.height / canvas.width !== rate) {
        canvas.height = Math.floor(canvas.height * rate);
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255 255 255)";

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j]) {
                ctx.fillRect(i * cellWidth + 1, j * cellWidth + 1, cellWidth - 1, cellWidth - 1);
            }
        }
    }
}

function main() {
    /* DECLARING SECTION */
    const DEAD = 0;
    const ALIVE = 1;

    let mainMatrix = [];
    let backMatrix = [];

    let rules = {};

    const canvas = document.getElementById("gol-canvas");
    const ctx = canvas.getContext("2d");

    const queryStr = window.location.search;
    const urlParams = new URLSearchParams(queryStr);

    let ROWS = 0;
    let COLS = 0;

    let msecs = 0;

    /* INIT SECTION */
    ROWS = Number(urlParams.get('rows'));
    console.log(ROWS);
    COLS = Number(urlParams.get('columns'));
    console.log(COLS);
    msecs = Number(urlParams.get('speed'));
    console.log(msecs);

    mainMatrix = getMatrix(ROWS, COLS);
    backMatrix = getMatrix(ROWS, COLS);

    rules = {
        0: new Array(9).fill(0),
        1: new Array(9).fill(0)
    };

    for (let i = 0; i < 9; i++) {
        if (urlParams.get('alive' + String(i)) == 'on') {
            rules[ALIVE][i] = 1;
        }
        if (urlParams.get('dead' + String(i)) == 'on') {
            rules[DEAD][i] = 1;
        }
    }

    console.log(rules);

    fillMatrixWithRandom(mainMatrix);

    /* CYCLE SECTION */
    setInterval(
        () => {
            computeNewGeneration(mainMatrix, backMatrix, rules);
            [mainMatrix, backMatrix] = swapMatrices(mainMatrix, backMatrix);
            drawMatrix(canvas, ctx, mainMatrix);
        },
        msecs
    );    
}

main();