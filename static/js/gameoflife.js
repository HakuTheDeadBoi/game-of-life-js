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
    const rowRate = canvas.height / matrix.length;
    const colRate = canvas.width / matrix[0].length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255 255 255)";

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j]) {
                ctx.fillRect(i * rowRate + 1, j * colRate + 1, rowRate - 1, colRate - 1);
            }
        }
    }
}

function main() {
    let state = true;

    document.body.addEventListener("click", () => {state = true;});

    /* DECLARING SECTION */
    const DEAD = 0;
    const ALIVE = 0;

    let mainMatrix = [];
    let backMatrix = [];

    let rules = {};

    const canvas = document.getElementById("gol-canvas");
    const ctx = canvas.getContext("2d");

    let ROWS = 150;  // temporarily hardcoded
    let COLS = 150;

    let msecs = 100; //milliseconds between two cycles

    /* INIT SECTION */
    mainMatrix = getMatrix(ROWS, COLS);
    backMatrix = getMatrix(ROWS, COLS);

    rules = {
        0: new Array(9).fill(0),
        1: new Array(9).fill(0)
    };

    rules[1][2] = 1;
    rules[1][3] = 1;
    rules[0][3] = 1;

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