mod game;
mod get_ply;
mod js_function;
mod message_const;
mod player;
mod state;

use game::finish::is_finish;
use get_ply::{filter_checked_ply, get_all_board_ply, get_castling_ply, get_ply};

use player::ai::neg_max_recursion;
use state::{
    board::Board, castling::Castling, en_passant::EnPassant, game_state::GameState, mark::Mark,
    position::Position,
};
use wasm_bindgen::prelude::*;

use crate::state::ply::Ply;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn get_selected_piece_moves(
    from: u8,
    mark: u8,
    board: &[u8],
    en_passant: Option<u8>,
    castling: u8,
) -> Result<String, String> {
    let mark = Mark::try_from_u8(mark).ok_or("mark")?;
    let from = Position::try_from_u8(from).ok_or("from")?;
    let board = Board::try_from_slice(board).ok_or("board")?;
    let en_passant = EnPassant::try_from_u8(en_passant).ok_or("en passant")?;
    let castling = Castling::new(castling);

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

    let board = board.get_next(&ply);

    Ok(board.as_vec_u8())
}

#[wasm_bindgen]
pub fn get_next_castling(castling: u8, ply: &str) -> Result<u8, String> {
    let castling = Castling::new(castling);
    let ply = Ply::try_from_str(ply).ok_or("ply")?;

    let castling = castling.get_next(&ply);

    Ok(castling.as_u8())
}

#[wasm_bindgen]
pub fn get_next_en_passant(board: &[u8], ply: &str) -> Result<Option<u8>, String> {
    let board = Board::try_from_slice(board).ok_or("board")?;
    let ply = Ply::try_from_str(ply).ok_or("ply")?;

    let en_passant = EnPassant::get_next(&board, &ply);

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

    Ok(is_finish(&board, &mark, &en_passant).map(|s| s.to_string()))
}

#[wasm_bindgen]
pub fn get_ai_ply(
    board: &[u8],
    mark: u8,
    castling: u8,
    en_passant: Option<u8>,
    depth: u8,
) -> Result<String, String> {
    let board = Board::try_from_slice(board).ok_or("board")?;
    let mark = Mark::try_from_u8(mark).ok_or("mark")?;
    let castling = Castling::new(castling);
    let en_passant = EnPassant::try_from_u8(en_passant).ok_or("en_passant")?;

    let state = GameState::new(board, mark, castling, en_passant);

    let mut best_ply = None;
    let mut eval_value = f64::NEG_INFINITY;
    for ply in get_all_board_ply(&mark, &state.board, &en_passant)
        .filter(|ply| filter_checked_ply(ply, &mark, &state.board))
    {
        let state = state.get_next(&ply);

        let value = neg_max_recursion(&state, depth);

        if eval_value < value {
            eval_value = value;
            best_ply = Some(ply);
        }
    }

    match best_ply {
        Some(ply) => Ok(format!("{}", ply)),
        None => Err("no ply".to_string()),
    }
}
