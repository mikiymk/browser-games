pub mod ai;

use std::fmt::Debug;

use js_sys::Promise;
use wasm_bindgen::{JsCast, JsValue};
use wasm_bindgen_futures::JsFuture;

use crate::{
    get_ply::{get_castling_ply, get_ply},
    js_function::JsFunction,
    log,
    message_const::{
        PROMOTION, PROMOTION_BISHOP, PROMOTION_KNIGHT, PROMOTION_QUEEN, PROMOTION_ROOK, RESET,
    },
    state::piece::Piece,
    state::ply::Ply,
    state::position::Position,
    state::{
        board::Board,
        castling::{Castling, CastlingType},
        en_passant::EnPassant,
        mark::Mark,
    },
};

#[derive(Debug)]
pub enum Player<'a> {
    HumanPlayer(&'a js_sys::Function, &'a JsFunction<'a, Vec<usize>>),
    RandomAIPlayer,
}

impl<'a> Player<'a> {
    pub fn try_new(
        value: u8,
        human_input: &'a js_sys::Function,
        set_highlight: &'a JsFunction<'a, Vec<usize>>,
    ) -> Result<Self, String> {
        match value {
            0 => Ok(Player::HumanPlayer(human_input, set_highlight)),
            1 => Ok(Player::RandomAIPlayer),
            v => Err(format!("{} is not valid id", v)),
        }
    }

    pub async fn get_ply(
        &self,
        board: &Board,
        mark: &Mark,
        castling: &Castling,
        en_passant: &EnPassant,
    ) -> Result<Ply, String> {
        log(&format!("board in Player::get_ply {}", board));

        match self {
            Player::HumanPlayer(human_input, set_highlight) => {
                Self::get_human_input_ply(
                    board,
                    mark,
                    castling,
                    en_passant,
                    human_input,
                    set_highlight,
                )
                .await
            }
            Player::RandomAIPlayer => Self::get_random_ai_ply(board, mark, castling, en_passant),
        }
    }

    async fn get_human_input_ply(
        board: &Board,
        mark: &Mark,
        castling: &Castling,
        en_passant: &EnPassant,
        human_input: &js_sys::Function,
        set_highlight: &'a JsFunction<'a, Vec<usize>>,
    ) -> Result<Ply, String> {
        'input_loop: loop {
            let from_f64: f64 = Player::get_input(human_input).await?;
            let from = from_f64 as u8;

            if from == RESET as u8 {
                // reset;
            }

            let from = Position::try_from(from)?;
            let square = board.get_piece(&from);

            log(&format!("from in Player::get_human_input_ply {}", from));
            log(&format!("square in Player::get_human_input_ply {}", square));

            if square.mark() != Some(*mark) {
                continue;
            }

            let mut ply_vec = match get_ply(board, &from, en_passant) {
                Some(ply_iter) => {
                    let vec: Vec<_> = ply_iter.collect();
                    if vec.is_empty() {
                        continue;
                    }
                    vec
                }
                None => continue,
            };
            let mut castling_vec = get_castling_ply(mark, board, castling);
            ply_vec.append(&mut castling_vec);

            Player::send_highlight(set_highlight, &ply_vec)?;

            // todo get castling

            let to: f64 = Player::get_input(human_input).await?;
            Player::send_highlight(set_highlight, &[])?;

            let to = to as u8;

            if to == RESET as u8 {
                // reset;
            }

            let to = Position::try_from(to)?;

            for ply in ply_vec {
                if to.index() == convert_move_to_usize(&ply) {
                    if let Ply::Promotion { from, to, .. } = ply {
                        set_highlight.call(&vec![PROMOTION])?;
                        let promotion_target: f64 = Player::get_input(human_input).await?;
                        let promotion_target = promotion_target as u8;
                        let piece = match promotion_target {
                            PROMOTION_KNIGHT => Piece::Knight,
                            PROMOTION_BISHOP => Piece::Bishop,
                            PROMOTION_ROOK => Piece::Rook,
                            PROMOTION_QUEEN => Piece::Queen,
                            _ => continue 'input_loop,
                        };

                        return Ok(Ply::new_promotion(from, to, piece));
                    }

                    return Ok(ply);
                }
            }
        }
    }

    fn get_random_ai_ply(
        board: &Board,
        mark: &Mark,
        castling: &Castling,
        en_passant: &EnPassant,
    ) -> Result<Ply, String> {
        let mut ply_vec = Vec::new();

        for (from, _) in board.square_position_iter() {
            if let Some(ply_iter) = get_ply(board, &from, en_passant) {
                ply_vec.extend(ply_iter);
            }

            let mut castling_vec = get_castling_ply(mark, board, castling);
            ply_vec.append(&mut castling_vec);
        }

        use rand::seq::SliceRandom;
        let ply = ply_vec
            .choose(&mut rand::thread_rng())
            .ok_or("0".to_string())?;

        Ok(*ply)
    }

    async fn get_input<T>(human_input: &js_sys::Function) -> Result<T, String>
    where
        T: TryFrom<JsValue>,
        <T as TryFrom<JsValue>>::Error: Debug,
    {
        let promise = human_input
            .call0(&JsValue::NULL)
            .map_err(|err| format!("{:?}", err))?;

        if !Promise::instanceof(&promise) {
            return Err("return value is not instanceof Promise".to_string());
        }

        JsFuture::from(Promise::unchecked_from_js(promise))
            .await
            .map_err(|err| format!("{:?}", err))
            .and_then(|value| value.try_into().map_err(|err| format!("{:?}", err)))
    }

    fn send_highlight(
        set_highlight: &'a JsFunction<'a, Vec<usize>>,
        ply_vec: &[Ply],
    ) -> Result<(), String> {
        set_highlight.call(&ply_vec.iter().map(convert_move_to_usize).collect())?;
        Ok(())
    }
}

fn convert_move_to_usize(ply: &Ply) -> usize {
    match ply {
        Ply::Move { to, .. } => to.index(),
        Ply::Castling(castling) => match castling {
            CastlingType::BlackQueen => 0,
            CastlingType::BlackKing => 7,
            CastlingType::WhiteQueen => 56,
            CastlingType::WhiteKing => 63,
        },
        Ply::EnPassant { to, .. } => to.index(),
        Ply::Promotion { to, .. } => to.index(),
    }
}
