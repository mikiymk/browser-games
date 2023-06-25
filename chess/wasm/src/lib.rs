mod game;
mod get_ply;
mod js_function;
mod message_const;
mod player;
mod state;

use game::Game;
use get_ply::{get_castling_ply, get_ply};
use js_function::JsFunction;
use player::Player;
use state::{
    board::Board, castling::Castling, en_passant::EnPassant, mark::Mark, position::Position,
    GameState,
};
use wasm_bindgen::prelude::*;

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
    let mut castling_vec = get_castling_ply(&mark, &board, &castling);

    ply_vec.append(&mut castling_vec);

    Ok(
        ply_vec
            .into_iter()
            .map(|ply| format!("{}", ply))
            .collect::<Vec<_>>()
            .join(":"),
    )
}
