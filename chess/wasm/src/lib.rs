#![allow(dead_code)]

mod game;
mod get_ply;
mod js_function;
mod piece;
mod player;
mod ply;
mod position;
mod state;
mod message_const;

use game::Game;
use js_function::JsFunction;
use player::Player;
use state::GameState;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

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
