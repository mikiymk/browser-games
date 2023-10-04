use crate::state::{game_state::GameState, mark::Mark};

use super::evaluate::evaluate_function;

#[allow(dead_code)]
pub fn alpha_beta(state: &GameState, depth: usize, alpha: f64, beta: f64) -> f64 {
    let is_white = state.mark == Mark::White;

    if depth == 0 || state.is_finish() {
        return if is_white { -1.0 } else { 1.0 } * evaluate_function(state);
    }

    let mut max = alpha;
    for ply in state.get_legal_plies() {
        let value = alpha_beta(&state.get_next(&ply), depth - 1, -beta, -alpha);
        max = max.max(-value);

        if max >= beta {
            break;
        }
    }

    max
}
