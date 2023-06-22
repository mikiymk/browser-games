#![allow(dead_code)]

mod game;
mod get_ply;
mod js_function;
mod piece;
mod player;
mod ply;
mod position;
mod state;

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
pub fn game(
    player_white: u8,
    player_black: u8,
    set_state: &js_sys::Function,
) -> Result<(), String> {
    let player_white = Player::try_from(player_white)?;
    let player_black = Player::try_from(player_black)?;
    let set_state: JsFunction<'_, GameState> = JsFunction::new(set_state);

    let mut game = Game::new(player_white, player_black, set_state);

    game.run()?;

    Ok(())
}
