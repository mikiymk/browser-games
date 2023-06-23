pub mod finish;

use std::collections::HashMap;

use crate::{
    game::finish::{is_check, is_enough_for_checkmate},
    get_ply::get_all_board_ply,
    js_function::JsFunction,
    piece::Piece,
    player::Player,
    ply::Ply,
    state::{board::Board, castling::Castling, en_passant::EnPassant, mark::Mark, GameState},
};

pub struct Game<'a> {
    board: Board,
    mark: Mark,
    castling: Castling,
    en_passant: EnPassant,
    fifty_move: u32,
    threefold: HashMap<(Board, Mark), u8>,
    moves: u32,
    message: String,

    player_white: Player<'a>,
    player_black: Player<'a>,
    set_state: JsFunction<'a, GameState>,
}

impl<'a> Game<'a> {
    /// Creates a new [`Game`].
    pub fn new(
        player_white: Player<'a>,
        player_black: Player<'a>,
        set_state: JsFunction<'a, GameState>,
    ) -> Self {
        Game {
            board: Board::initial(),
            mark: Mark::White,
            castling: Castling::new(),
            en_passant: EnPassant::new(),
            fifty_move: 0,
            threefold: HashMap::new(),
            moves: 1,

            message: "".to_string(),

            player_white,
            player_black,
            set_state,
        }
    }

    pub async fn run(&mut self) -> Result<(), String> {
        self.initialize();
        self.set_state()?;

        loop {
            self.ply().await?;
            self.set_state()?;

            if self.is_finished() {
                self.set_state()?;

                break;
            }
        }

        Ok(())
    }

    fn set_state(&self) -> Result<(), String> {
        self.set_state
            .call(&GameState::new(self.board.clone(), self.message.clone()))?;

        Ok(())
    }

    fn initialize(&mut self) {}

    async fn ply(&mut self) -> Result<(), String> {
        let player = match self.mark {
            Mark::White => &self.player_white,
            Mark::Black => &self.player_black,
        };

        let ply = player
            .get_ply(&self.board, &self.mark, &self.castling, &self.en_passant)
            .await?;

        self.update_state(&ply);

        Ok(())
    }

    fn update_state(&mut self, ply: &Ply) {
        self.en_passant = self.en_passant.next_turn_available(&self.board, &ply);
        self.mark = self.mark.invert();
        self.castling = self.castling.apply_ply(ply);
        self.message = format!("{} turn", self.mark);

        self.fifty_move = if match ply {
            Ply::Move { from, to, .. } => {
                // 動かし元がポーン （ポーンを動かす）
                self.board.get_piece(from).piece() == Some(Piece::Pawn)
                // 動かし先が空ではない （駒を取る動き）
                    || !self.board.get_piece(to).is_empty()
            }
            // プロモーションとアンパッサンはポーンを動かす
            Ply::Promotion { .. } | Ply::EnPassant { .. } => true,
            // キャスリングはポーンを動かさない、相手の駒を取らない
            Ply::Castling(_) => false,
        } {
            0
        } else {
            self.fifty_move + 1
        };

        let key = (self.board.clone(), self.mark);
        let n = self.threefold.get(&key);
        self.threefold.insert(key, n.map_or(0, |x| x + 1));

        self.board = self.board.apply_ply(ply);
    }

    fn is_finished(&mut self) -> bool {
        // チェックメイト
        if is_check(&self.board, &self.mark) {
            for ply in get_all_board_ply(&self.mark, &self.board, &self.en_passant) {
                let board = self.board.apply_ply(&ply);
                if is_check(&board, &self.mark) {
                    self.message = format!("{} win", self.mark);

                    return true;
                }
            }
        }

        // ステイルメイト
        if None == get_all_board_ply(&self.mark, &self.board, &self.en_passant).next() {
            self.message = "Draw - stalemate".to_string();

            return true;
        }

        // 駒がチェックメイトに充分
        if is_enough_for_checkmate(&self.board) {
            self.message = "Draw - insufficient material".to_string();

            return true;
        }

        if self.fifty_move > 100 {
            self.message = "Draw - fifty-move rule".to_string();

            return true;
        }

        for (_, num) in &self.threefold {
            if num >= &3 {
                self.message = "Draw - threefold repetition".to_string();

                return true;
            }
        }

        false
    }
}
