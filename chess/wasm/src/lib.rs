mod game;
mod get_ply;
mod js_function;
mod message_const;
mod player;
mod state;

use game::{
    finish::{is_check, is_enough_for_checkmate},
    Game,
};
use get_ply::{filter_checked_ply, get_all_board_ply, get_castling_ply, get_ply};
use js_function::JsFunction;
use message_const::{
    MESSAGE_BLACK_WIN, MESSAGE_INSUFFICIENT_MATERIAL, MESSAGE_NO_BLACK_KING, MESSAGE_NO_WHITE_KING,
    MESSAGE_STALEMATE, MESSAGE_WHITE_WIN,
};
use player::Player;
use state::{
    board::Board,
    castling::{Castling, CastlingType},
    en_passant::EnPassant,
    mark::Mark,
    position::Position,
    GameState,
};
use wasm_bindgen::prelude::*;

use crate::state::ply::Ply;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {

    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

}

#[wasm_bindgen]
pub fn add(left: u32, right: u32) -> u32 {
    left + right
}

#[wasm_bindgen]
pub async fn game(
    player_white: u8,
    player_black: u8,
    set_state: &js_sys::Function,
    set_highlight: &js_sys::Function,
    player_input: &js_sys::Function,
) -> Result<(), String> {
    let set_highlight: JsFunction<'_, Vec<usize>> = JsFunction::new(set_highlight);
    let player_white = Player::try_new(player_white, player_input, &set_highlight)?;
    let player_black = Player::try_new(player_black, player_input, &set_highlight)?;
    let set_state: JsFunction<'_, GameState> = JsFunction::new(set_state);

    let mut game = Game::new(player_white, player_black, set_state);

    game.run().await?;

    Ok(())
}

#[wasm_bindgen]
pub fn get_selected_piece_moves(
    from: u8,
    mark: u8,
    board: &[u8],
    en_passant: Option<u8>,
    castling: &[u8],
) -> Result<String, String> {
    let mark = Mark::try_from_u8(mark).ok_or("mark")?;
    let from = Position::try_from_u8(from).ok_or("from")?;
    let board = Board::try_from_slice(board).ok_or("board")?;
    let en_passant = EnPassant::try_from_u8(en_passant).ok_or("en passant")?;
    let castling = Castling::try_from_slice(castling).ok_or("castling")?;

    let mut ply_vec = match get_ply(&board, &from, &en_passant) {
        Some(ply_iter) => {
            let vec: Vec<_> = ply_iter.collect();
            vec
        }
        None => Vec::new(),
    };

    if from == Position::B_K || from == Position::W_K {
        let mut castling_vec = get_castling_ply(&mark, &board, &castling);

        ply_vec.append(&mut castling_vec);
    }

    Ok(ply_vec
        .into_iter()
        .filter(|ply| filter_checked_ply(ply, &mark, &board))
        .map(|ply| format!("{}", ply))
        .collect::<Vec<_>>()
        .join(":"))
}

#[wasm_bindgen]
pub fn get_next_board(board: &[u8], ply: &str) -> Result<Vec<u8>, String> {
    let board = Board::try_from_slice(board).ok_or("board")?;
    let ply = Ply::try_from_str(ply).ok_or("ply")?;

    let board = board.apply_ply(&ply);

    Ok(board.as_vec_u8())
}

#[wasm_bindgen]
pub fn get_next_castling(castling: &[u8], ply: &str) -> Result<Vec<u8>, String> {
    let castling = Castling::try_from_slice(castling).ok_or("castling")?;
    let ply = Ply::try_from_str(ply).ok_or("ply")?;

    let castling = castling.apply_ply(&ply);

    Ok(vec![
        castling.get(CastlingType::BlackKing) as u8,
        castling.get(CastlingType::BlackQueen) as u8,
        castling.get(CastlingType::WhiteKing) as u8,
        castling.get(CastlingType::WhiteQueen) as u8,
    ])
}

#[wasm_bindgen]
pub fn get_next_en_passant(board: &[u8], ply: &str) -> Result<Option<u8>, String> {
    let board = Board::try_from_slice(board).ok_or("board")?;
    let ply = Ply::try_from_str(ply).ok_or("ply")?;

    let en_passant = EnPassant::next_turn_available(&board, &ply);

    Ok(en_passant.as_option())
}

#[wasm_bindgen]
pub fn is_finished(
    board: &[u8],
    mark: u8,
    en_passant: Option<u8>,
) -> Result<Option<String>, String> {
    let board = Board::try_from_slice(board).ok_or("board")?;
    let mark = Mark::try_from_u8(mark).ok_or("mark")?;
    let en_passant = EnPassant::try_from_u8(en_passant).ok_or("en_passant")?;

    // キングがいない
    if board.get_king_position(&Mark::White).is_none() {
        return Ok(Some(MESSAGE_NO_WHITE_KING.to_string()));
    } else if board.get_king_position(&Mark::Black).is_none() {
        return Ok(Some(MESSAGE_NO_BLACK_KING.to_string()));
    }

    // チェックメイト
    if is_check(&board, &mark) {
        for ply in get_all_board_ply(&mark, &board, &en_passant) {
            let board = board.apply_ply(&ply);
            if is_check(&board, &mark) {
                return Ok(Some(
                    match mark {
                        Mark::White => MESSAGE_WHITE_WIN,
                        Mark::Black => MESSAGE_BLACK_WIN,
                    }
                    .to_string(),
                ));
            }
        }
    }

    // ステイルメイト
    if get_all_board_ply(&mark, &board, &en_passant)
        .next()
        .is_none()
    {
        return Ok(Some(MESSAGE_STALEMATE.to_string()));
    }

    // 駒がチェックメイトに充分
    if is_enough_for_checkmate(&board) {
        return Ok(Some(MESSAGE_INSUFFICIENT_MATERIAL.to_string()));
    }

    Ok(None)
}
