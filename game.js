/* Reversie Game made in HTML/CSS/JS */

// wait for the DOM to load first
document.addEventListener("DOMContentLoaded", DomLoaded, false);

// DOMがloadした後実行される関数
function DomLoaded(e) {
    const table = document.getElementById("game-table");　 // テーブル
    const table_length = document.getElementById("game-table").rows[0].cells.length;　 //テーブルのサイズ
    const td = document.querySelectorAll("td"); // 全てのtdタッグ
    let game_over = false;

    // 横、縦、斜めの確認に必要のある方向の計算し方
    const directions = [
        [0, -1],
        [0, +1],
        [-1, 0],
        [+1, 0],
        [-1, -1],
        [+1, +1],
        [+1, -1],
        [-1, +1],
    ];

    // プレイヤクラス
    class Player {
        constructor(color) {
            this.color = color; //プレイヤの色
            this.all_pieces = document.querySelectorAll(`p.${this.color}`); //プレイヤのボードにある全てのピース
        };
    };
    const black = new Player("black"); //黒側
    const white = new Player("white"); //白側

    let current_player = black; //自分のプレイヤ
    let opposite_player = white; //相手のプレイヤ

    // プレイヤ交換の関数
    const change_turns = () => {
        console.log("change_turns()");
        if (current_player == black) {
            current_player = white;
            opposite_player = black;
        } else {
            current_player = black;
            opposite_player = white;
        }
        console.log(current_player);
    }

    //ボードの場所
    class Point {
        constructor(row, col) {
            this.row = row;　 // 縦
            this.col = col;　 // 横
        }
    }
    let point = new Point(undefined, undefined)　 // Pointのオブジェクト　まだ場所不明でundefined

    // current_player(自分)の横、縦、斜めに置けれる場所を探す関数
    const check = (row, col, direction) => {
        // console.log("check() for possible mves");
        row_change = direction[0];
        col_change = direction[1];
        // console.log(`checking (${row}, ${col} for ${row_change}, ${col_change})`);
        has_opposite = false;　 // 相手があるかどうか
        let i, j;
        for (i = row + row_change, j = col + col_change; i < 8 && j < 8 && i >= 0 && i >= 0; i += row_change, j += col_change) {
            let piece = table.rows[i].cells[j];
            if (piece.classList.contains(opposite_player.color)) {　 //もしpieceは相手の石だったら
                // console.log(`opposite ${opposite_player.color} player found at ${row}, ${i}`);
                has_opposite = true;　
                continue;
            } else if (piece.classList.contains("empty")) {　 //何もなかった場合
                // console.log(`empty player found at (${piece.parentNode.rowIndex},${piece.cellIndex})`);
                if (has_opposite) {　 // 前、相手があった場合、
                    piece.appendChild(document.createElement("p"));　 // 空いていることを表示するピース(p.ok)を入れる
                    piece.children[0].className = "ok";
                    piece.className = "ok";
                    console.log(`(${piece.parentNode.rowIndex},${piece.cellIndex}) is OK`);
                    return;
                }
                return;
            } else {
                return;
            }
        }
    }

    // 上のcheck()を自分の全部のピースで、横、縦、斜めで確認する関数
    const possible_moves = () => {
        console.log("possible_moves()");
        current_player.all_pieces.forEach(element => {
            element.parentNode.className = current_player.color;
            row = element.parentNode.parentNode.rowIndex;
            cell = element.parentNode.cellIndex;
            directions.forEach(direction => {
                check(row, cell, direction);
            });
        });
    };

    // check()が入れたp.okを消していく・リセットする関数
    const possible_moves_reset = () => {
        console.log("possible_moves_reset()");
        const ok_pieces = document.querySelectorAll("td.ok");
        ok_pieces.forEach(element => {
            element.className = "empty";
            element.removeChild(element.children[0]);
        });
    };

    // 相手のピースをひっくり返す関数
    const outflank = (row, col, direction) => {
        console.log("outflank()");
        has_opposite = false;
        row_change = direction[0];
        col_change = direction[1];
        let i, j, q, w;
        for (i = row + row_change, j = col + col_change; i >= 0 && j >= 0 && i < 8 && j < 8; i += row_change, j += col_change) {
            let piece = table.rows[i].cells[j];
            if (piece.className == opposite_player.color) {
                console.log("has opposite : ");
                console.log(piece);
                has_opposite = true;
                continue;
            } else if (piece.className == current_player.color) {
                if (has_opposite) {
                    console.log(`piece opposite changing`);
                    console.log(point.row, point.col);
                    for (q = point.row + row_change, w = point.col + col_change; q != i || w != j; q += row_change, w += col_change) {
                        table.rows[q].cells[w].className = current_player.color;
                        table.rows[q].cells[w].children[0].className = current_player.color;
                        console.log("piece changed");
                        console.log(table.rows[q].cells[w]);
                    }
                }
                return;
            }
            return;
        }
    }


    let go_ahead = false;　 // 関数の全部一気に実行させないために使おうとしています

    //check()でOKされたピースにclickがあったときの関数
    const clicked = () => {
        document.querySelectorAll("td.ok").forEach(element => {
            element.addEventListener('click', (e) => {
                go_ahead = true;
                console.log("clicked()");
                point.row = element.parentNode.rowIndex;
                point.col = element.cellIndex;
                // change element color to current playere color
                element.children[0].className = current_player.color;
                element.className = current_player.color;
                //outflank
                directions.forEach(direction => {
                    outflank(point.row, point.col, direction);
                });
                element.removeEventListener("click", e);
                possible_moves_reset();
            })
        });
    }

    //windowのloadが終了した後に実行する関数
    window.addEventListener("load", () => {
        possible_moves();
        clicked();
        if (go_ahead) {
            change_turns();
            go_ahead = false;
            possible_moves();
            clicked();
        };
    });
}