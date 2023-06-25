use std::collections::HashMap;

use crate::{
    state::piece::Piece,
    state::position::Position,
    state::{board::Board, board_square::BoardSquare, mark::Mark},
};

pub fn is_check(board: &Board, mark: &Mark) -> bool {
    let king_position = match board.get_king_position(mark) {
        Some(position) => position,
        None => return false,
    };

    is_attacked_there(board, mark, &king_position)
}

pub fn is_attacked_there(board: &Board, mark: &Mark, position: &Position) -> bool {
    let front_direction = mark.front_direction();
    for (dx, dy) in [(front_direction, 1), (front_direction, -1)] {
        // ポーン
        if let Some(position) = position.rel_new(dx, dy) {
            let square = board.get_piece(&position);
            if square == BoardSquare::new(mark.invert(), Piece::Pawn) {
                return true;
            }
        }
    }

    const BISHOP_DIR: [(i8, i8); 4] = [(1, 1), (1, -1), (-1, 1), (-1, -1)];
    const ROOK_DIR: [(i8, i8); 4] = [(1, 0), (-1, 0), (0, 1), (0, -1)];
    const KNIGHT_DIR: [(i8, i8); 8] = [
        (1, 2),
        (1, -2),
        (-1, 2),
        (-1, -2),
        (2, 1),
        (2, -1),
        (-2, 1),
        (-2, -1),
    ];

    for (dx, dy) in BISHOP_DIR {
        // キング
        if let Some(position) = position.rel_new(dx, dy) {
            let square = board.get_piece(&position);
            if square == BoardSquare::new(mark.invert(), Piece::King) {
                return true;
            }
        }

        // ビショップとクイーン
        let mut position = *position;
        while let Some(new_pos) = position.rel_new(dx, dy) {
            position = new_pos;
            let square = board.get_piece(&position);
            if square == BoardSquare::new(mark.invert(), Piece::Bishop)
                || square == BoardSquare::new(mark.invert(), Piece::Queen)
            {
                return true;
            } else if !square.is_empty() {
                break;
            }
        }
    }

    for (dx, dy) in ROOK_DIR {
        // キング
        if let Some(position) = position.rel_new(dx, dy) {
            let square = board.get_piece(&position);
            if square == BoardSquare::new(mark.invert(), Piece::King) {
                return true;
            }
        }

        // ビショップとクイーン
        let mut position = *position;
        while let Some(new_pos) = position.rel_new(dx, dy) {
            position = new_pos;
            let square = board.get_piece(&position);
            if square == BoardSquare::new(mark.invert(), Piece::Rook)
                || square == BoardSquare::new(mark.invert(), Piece::Queen)
            {
                return true;
            } else if !square.is_empty() {
                break;
            }
        }
    }

    for (dx, dy) in KNIGHT_DIR {
        // ナイト
        if let Some(position) = position.rel_new(dx, dy) {
            let square = board.get_piece(&position);
            if square == BoardSquare::new(mark.invert(), Piece::Knight) {
                return true;
            }
        }
    }

    false
}

pub fn is_enough_for_checkmate(board: &Board) -> bool {
    let mut pieces = HashMap::new();
    for (_, square) in board.square_iter() {
        let piece_num = pieces.get(&square);
        pieces.insert(square, piece_num.map_or(1_u32, |num| num + 1));
    }

    use Mark::*;
    use Piece::*;

    let black_pawn = *pieces.get(&BoardSquare::new(Black, Pawn)).unwrap_or(&0);
    let black_knight = *pieces.get(&BoardSquare::new(Black, Knight)).unwrap_or(&0);
    let black_bishop = *pieces.get(&BoardSquare::new(Black, Bishop)).unwrap_or(&0);
    let black_rook = *pieces.get(&BoardSquare::new(Black, Rook)).unwrap_or(&0);
    let black_queen = *pieces.get(&BoardSquare::new(Black, Queen)).unwrap_or(&0);

    let white_pawn = *pieces.get(&BoardSquare::new(White, Pawn)).unwrap_or(&0);
    let white_knight = *pieces.get(&BoardSquare::new(White, Knight)).unwrap_or(&0);
    let white_bishop = *pieces.get(&BoardSquare::new(White, Bishop)).unwrap_or(&0);
    let white_rook = *pieces.get(&BoardSquare::new(White, Rook)).unwrap_or(&0);
    let white_queen = *pieces.get(&BoardSquare::new(White, Queen)).unwrap_or(&0);

    if black_pawn == 0
        && black_knight == 0
        && black_bishop == 0
        && black_rook == 0
        && black_queen == 0
    {
        return white_pawn >= 1
            || white_knight >= 1 && white_bishop >= 1
            || white_bishop >= 2
            || white_rook >= 1
            || white_queen >= 1;
    }

    if white_pawn == 0
        && white_knight == 0
        && white_bishop == 0
        && white_rook == 0
        && white_queen == 0
    {
        return black_pawn >= 1
            || black_knight >= 1 && black_bishop >= 1
            || black_bishop >= 2
            || black_rook >= 1
            || black_queen >= 1;
    }

    false
}
