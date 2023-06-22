#![allow(dead_code)]

mod game;
mod get_ply;
mod piece;
mod player;
mod ply;
mod position;
mod state;

use std::marker::PhantomData;

use game::Game;
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
    set_message: &js_sys::Function,
) -> Result<(), String> {
    let player_white = Player::try_from(player_white)?;
    let player_black = Player::try_from(player_black)?;
    let set_state: JsFunction<'_, GameState> = JsFunction::new(set_state);
    let set_message: JsFunction<'_, String> = JsFunction::new(set_message);

    let mut game = Game::new();

    game.run();

    Ok(())
}

struct JsFunction<'a, T> {
    js_function: &'a js_sys::Function,
    call_type: PhantomData<T>,
}

impl<'a, T> JsFunction<'a, T>
where
    T: serde::ser::Serialize,
{
    pub fn new(js_function: &'a js_sys::Function) -> Self {
        JsFunction {
            js_function,
            call_type: PhantomData,
        }
    }

    pub fn call(&self, value: T) -> Result<JsValue, JsValue> {
        self.js_function
            .call1(&JsValue::NULL, &serde_wasm_bindgen::to_value(&value)?)
    }
}
