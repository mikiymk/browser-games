mod board;
mod en_passant;
mod piece;
mod ply;
mod position;
mod state;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, {{project-name}}!");
}

#[wasm_bindgen]
pub fn add(left: u32, right: u32) -> u32 {
    left + right
}
