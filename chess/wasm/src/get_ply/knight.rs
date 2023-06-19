use crate::{ply::Ply, position::Position, state::board::Board};

pub fn get_knight_ply(board: &Board, from: &Position) -> Vec<Ply> {
    let mut plies = Vec::new();

    push_step_if_valid(&mut plies, board, from, 1, 2);
    push_step_if_valid(&mut plies, board, from, 1, -2);
    push_step_if_valid(&mut plies, board, from, -1, 2);
    push_step_if_valid(&mut plies, board, from, -1, -2);
    push_step_if_valid(&mut plies, board, from, 2, 1);
    push_step_if_valid(&mut plies, board, from, 2, -1);
    push_step_if_valid(&mut plies, board, from, -2, 1);
    push_step_if_valid(&mut plies, board, from, -2, -1);

    plies
}

fn push_step_if_valid(plies: &mut Vec<Ply>, board: &Board, from: &Position, x: i8, y: i8) {
    if let Some(to) = from.rel_new(x, y) {
        if !board.is_same_mark(from, &to) {
            plies.push(Ply::new_move(*from, to));
        }
    }
}
