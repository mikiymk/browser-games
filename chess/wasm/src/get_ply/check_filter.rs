use crate::{
    game::finish::is_check,
    state::{board::Board, mark::Mark, ply::Ply},
};

pub fn filter_checked_ply(ply: &Ply, mark: &Mark, board: &Board) -> bool {
    let board = board.apply_ply(ply);

    !is_check(&board, mark)
}
