use std::collections::VecDeque;

use crate::{
    game::finish::is_finish,
    get_ply::{filter_checked_ply, get_all_board_ply, get_castling_ply},
    state::{
        board::Board, board_square::BoardSquare, castling::Castling, en_passant::EnPassant,
        mark::Mark, piece::Piece,
    },
};

#[allow(dead_code)]
pub fn neg_max_recursion(
    board: &Board,
    mark: &Mark,
    castling: &Castling,
    en_passant: &EnPassant,
    depth: u8,
) -> f64 {
    if depth == 0 || is_finish(board, mark, en_passant).is_some() {
        return -evaluate_function(board, mark, castling, en_passant);
    }

    let mut max = f64::NEG_INFINITY;

    for ply in get_all_board_ply(mark, board, en_passant)
        .filter(|ply| filter_checked_ply(ply, mark, board))
    {
        let value = -neg_max_recursion(
            &board.apply_ply(&ply),
            &mark.invert(),
            &castling.apply_ply(&ply),
            &EnPassant::next_turn_available(board, &ply),
            depth - 1,
        );

        if value > max {
            max = value;
        }
    }

    max
}

#[allow(dead_code)]
pub fn neg_max_loop(
    board: &Board,
    mark: &Mark,
    castling: &Castling,
    en_passant: &EnPassant,
    depth: u8,
) -> f64 {
    let mut queue = VecDeque::new();
    queue.push_back((
        board.clone(),
        *mark,
        *castling,
        *en_passant,
        depth,
        *mark == Mark::Black,
    ));

    let mut max_value = f64::NEG_INFINITY;
    let mut min_value = f64::INFINITY;

    while let Some((board, mark, castling, en_passant, depth, is_max)) = queue.pop_front() {
        if depth == 0 || is_finish(&board, &mark, &en_passant).is_some() {
            let value = evaluate_function(&board, &mark, &castling, &en_passant);

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

        for ply in get_all_board_ply(&mark, &board, &en_passant)
            .filter(|ply| filter_checked_ply(ply, &mark, &board))
        {
            queue.push_back((
                board.apply_ply(&ply),
                mark.invert(),
                castling.apply_ply(&ply),
                EnPassant::next_turn_available(&board, &ply),
                depth - 1,
                !is_max,
            ))
        }
    }

    if *mark == Mark::Black {
        max_value
    } else {
        -min_value
    }
}

#[allow(dead_code)]
pub fn alpha_beta(
    board: &Board,
    mark: &Mark,
    castling: &Castling,
    en_passant: &EnPassant,
    depth: usize,
    alpha: f64,
    beta: f64,
) -> f64 {
    if depth == 0 || is_finish(board, mark, en_passant).is_some() {
        return if *mark == Mark::Black { 1.0 } else { -1.0 }
            * evaluate_function(board, mark, castling, en_passant);
    }

    let mut max = alpha;
    for ply in get_all_board_ply(mark, board, en_passant)
        .filter(|ply| filter_checked_ply(ply, mark, board))
    {
        let value = alpha_beta(
            &board.apply_ply(&ply),
            &mark.invert(),
            &castling.apply_ply(&ply),
            &EnPassant::next_turn_available(board, &ply),
            depth - 1,
            -beta,
            -alpha,
        );
        max = max.max(-value);

        if max >= beta {
            break;
        }
    }

    max
}

fn evaluate_function(
    board: &Board,
    mark: &Mark,
    castling: &Castling,
    en_passant: &EnPassant,
) -> f64 {
    (match mark {
        Mark::White => 1.0,
        Mark::Black => -1.0,
    }) * count_pieces(board)
        + 0.2 * count_movable(board, mark, castling, en_passant)
        + -0.1 * count_movable(board, &mark.invert(), castling, en_passant)
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
    (get_all_board_ply(mark, board, en_passant).count()
        + get_castling_ply(mark, board, castling).len()) as f64
}
