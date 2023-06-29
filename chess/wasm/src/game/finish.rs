use std::collections::HashMap;

use crate::{
    get_ply::{filter_checked_ply, get_all_board_ply},
    message_const::{
        MESSAGE_BLACK_WIN, MESSAGE_INSUFFICIENT_MATERIAL, MESSAGE_NO_BLACK_KING,
        MESSAGE_NO_WHITE_KING, MESSAGE_STALEMATE, MESSAGE_WHITE_WIN,
    },
    state::{board::Board, board_square::Square, mark::Mark},
    state::{castling::Castling, piece::Piece},
    state::{en_passant::EnPassant, position::Position},
};

pub fn is_finish(
    board: &Board,
    mark: &Mark,
    castling: &Castling,
    en_passant: &EnPassant,
) -> Option<&'static str> {
    // キングがいない
    if board.get_king_position(&Mark::White).is_none() {
        return Some(MESSAGE_NO_WHITE_KING);
    } else if board.get_king_position(&Mark::Black).is_none() {
        return Some(MESSAGE_NO_BLACK_KING);
    }

    // チェックメイト
    if is_check(board, mark)
        && !get_all_board_ply(mark, board, castling, en_passant)
            .any(|ply| filter_checked_ply(&ply, mark, board))
    {
        return Some(match mark {
            Mark::White => MESSAGE_BLACK_WIN,
            Mark::Black => MESSAGE_WHITE_WIN,
        });
    }

    // ステイルメイト
    if get_all_board_ply(mark, board, castling, en_passant)
        .next()
        .is_none()
    {
        return Some(MESSAGE_STALEMATE);
    }

    // 駒がチェックメイトに充分
    if is_enough_for_checkmate(board) {
        return Some(MESSAGE_INSUFFICIENT_MATERIAL);
    }

    None
}

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
            if square == Square::new(mark.invert(), Piece::Pawn) {
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
            if square == Square::new(mark.invert(), Piece::King) {
                return true;
            }
        }

        // ビショップとクイーン
        let mut position = *position;
        while let Some(new_pos) = position.rel_new(dx, dy) {
            position = new_pos;
            let square = board.get_piece(&position);
            if square == Square::new(mark.invert(), Piece::Bishop)
                || square == Square::new(mark.invert(), Piece::Queen)
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
            if square == Square::new(mark.invert(), Piece::King) {
                return true;
            }
        }

        // ビショップとクイーン
        let mut position = *position;
        while let Some(new_pos) = position.rel_new(dx, dy) {
            position = new_pos;
            let square = board.get_piece(&position);
            if square == Square::new(mark.invert(), Piece::Rook)
                || square == Square::new(mark.invert(), Piece::Queen)
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
            if square == Square::new(mark.invert(), Piece::Knight) {
                return true;
            }
        }
    }

    false
}

pub fn is_enough_for_checkmate(board: &Board) -> bool {
    let mut pieces = HashMap::new();
    for square in board.square_iter() {
        let piece_num = pieces.get(square);
        pieces.insert(square, piece_num.map_or(1_u32, |num| num + 1));
    }

    let black_pawn = *pieces.get(&Square::BLACK_PAWN).unwrap_or(&0);
    let black_knight = *pieces.get(&Square::BLACK_KNIGHT).unwrap_or(&0);
    let black_bishop = *pieces.get(&Square::BLACK_BISHOP).unwrap_or(&0);
    let black_rook = *pieces.get(&Square::BLACK_ROOK).unwrap_or(&0);
    let black_queen = *pieces.get(&Square::BLACK_QUEEN).unwrap_or(&0);

    let white_pawn = *pieces.get(&Square::WHITE_PAWN).unwrap_or(&0);
    let white_knight = *pieces.get(&Square::WHITE_KNIGHT).unwrap_or(&0);
    let white_bishop = *pieces.get(&Square::WHITE_BISHOP).unwrap_or(&0);
    let white_rook = *pieces.get(&Square::WHITE_ROOK).unwrap_or(&0);
    let white_queen = *pieces.get(&Square::WHITE_QUEEN).unwrap_or(&0);

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
