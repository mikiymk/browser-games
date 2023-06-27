use crate::{
    game::finish::is_finish,
    get_ply::{filter_checked_ply, get_all_board_ply},
};

use super::{board::Board, castling::Castling, en_passant::EnPassant, mark::Mark, ply::Ply};

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct GameState {
    pub board: Board,
    pub mark: Mark,
    pub castling: Castling,
    pub en_passant: EnPassant,
}

impl GameState {
    pub fn new(board: Board, mark: Mark, castling: Castling, en_passant: EnPassant) -> Self {
        Self {
            board,
            mark,
            castling,
            en_passant,
        }
    }

    pub fn get_next(&self, ply: &Ply) -> Self {
        let next_board = self.board.get_next(ply);
        let next_mark = self.mark.invert();
        let next_castling = self.castling.get_next(ply);
        let next_en_passant = EnPassant::get_next(&self.board, ply);

        Self::new(next_board, next_mark, next_castling, next_en_passant)
    }

    pub fn is_finish(&self) -> bool {
        is_finish(&self.board, &self.mark, &self.castling, &self.en_passant).is_some()
    }

    pub fn get_legal_plies(&self) -> impl Iterator<Item = Ply> + '_ {
        get_all_board_ply(&self.mark, &self.board, &self.castling, &self.en_passant)
            .filter(|ply| filter_checked_ply(ply, &self.mark, &self.board))
    }
}
