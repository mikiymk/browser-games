use std::collections::VecDeque;

use crate::{
    get_ply::{filter_checked_ply, get_all_board_ply},
    state::{
        board::Board, board_square::BoardSquare, castling::Castling, en_passant::EnPassant,
        game_state::GameState, mark::Mark, piece::Piece,
    },
};

#[allow(dead_code)]
pub fn neg_max_recursion(state: &GameState, depth: u8) -> f64 {
    if depth == 0 || state.is_finish() {
        return -evaluate_function(state);
    }

    let mut max = f64::NEG_INFINITY;

    for ply in state.get_legal_plies() {
        let value = -neg_max_recursion(&state.get_next(&ply), depth - 1);

        if value > max {
            max = value;
        }
    }

    max
}

#[allow(dead_code)]
pub fn neg_max_loop(state: &GameState, depth: u8) -> f64 {
    let mut queue = VecDeque::new();
    queue.push_back((state.clone(), depth, state.mark == Mark::Black));

    let mut max_value = f64::NEG_INFINITY;
    let mut min_value = f64::INFINITY;

    while let Some((state, depth, is_max)) = queue.pop_front() {
        if depth == 0 || state.is_finish() {
            let value = evaluate_function(&state);

            if is_max {
                max_value = max_value.max(value);
            } else {
                min_value = min_value.min(value);
            }

            if max_value >= min_value {
                break;
            }

            continue;
        }

        for ply in state.get_legal_plies() {
            queue.push_back((state.get_next(&ply), depth - 1, !is_max))
        }
    }

    if state.mark == Mark::Black {
        max_value
    } else {
        -min_value
    }
}

#[allow(dead_code)]
pub fn alpha_beta(state: &GameState, depth: usize, alpha: f64, beta: f64) -> f64 {
    let is_white = state.mark == Mark::White;

    if depth == 0 || state.is_finish() {
        return if is_white { -1.0 } else { 1.0 } * evaluate_function(state);
    }

    let mut max = alpha;
    for ply in state.get_legal_plies() {
        let value = alpha_beta(&state.get_next(&ply), depth - 1, -beta, -alpha);
        max = max.max(-value);

        if max >= beta {
            break;
        }
    }

    max
}

fn evaluate_function(state: &GameState) -> f64 {
    (match state.mark {
        Mark::White => 1.0,
        Mark::Black => -1.0,
    }) * count_pieces(&state.board)
        + 0.2
            * count_movable(
                &state.board,
                &state.mark,
                &state.castling,
                &state.en_passant,
            )
        + -0.1
            * count_movable(
                &state.board,
                &state.mark.invert(),
                &state.castling,
                &state.en_passant,
            )
}

fn count_pieces(board: &Board) -> f64 {
    let mut sum = 0.0;
    for square in board.square_iter() {
        sum += match square {
            BoardSquare::Piece(Mark::White, Piece::Pawn) => 1.0,
            BoardSquare::Piece(Mark::White, Piece::Knight) => 3.0,
            BoardSquare::Piece(Mark::White, Piece::Bishop) => 3.0,
            BoardSquare::Piece(Mark::White, Piece::Rook) => 5.0,
            BoardSquare::Piece(Mark::White, Piece::Queen) => 9.0,
            BoardSquare::Piece(Mark::White, Piece::King) => 1.0e7,
            BoardSquare::Piece(Mark::Black, Piece::Pawn) => -1.0,
            BoardSquare::Piece(Mark::Black, Piece::Knight) => -3.0,
            BoardSquare::Piece(Mark::Black, Piece::Bishop) => -3.0,
            BoardSquare::Piece(Mark::Black, Piece::Rook) => -5.0,
            BoardSquare::Piece(Mark::Black, Piece::Queen) => -9.0,
            BoardSquare::Piece(Mark::Black, Piece::King) => -1.0e7,
            BoardSquare::Empty => 0.0,
        };
    }

    sum
}

fn count_movable(board: &Board, mark: &Mark, castling: &Castling, en_passant: &EnPassant) -> f64 {
    get_all_board_ply(mark, board, castling, en_passant)
        .filter(|ply| filter_checked_ply(ply, mark, board))
        .count() as f64
}
