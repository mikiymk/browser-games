use std::collections::VecDeque;

use crate::state::{game_state::GameState, mark::Mark};

use super::evaluate::evaluate_function;

#[allow(dead_code)]
pub fn neg_max_recursion(state: &GameState, depth: u8) -> f64 {
    if depth == 0 || state.is_finish() {
        return evaluate_function(state);
    }

    let mut max = f64::NEG_INFINITY;

    for ply in state.get_legal_plies() {
        let value = -neg_max_recursion(&state.get_next(&ply), depth - 1);

        if value > max {
            max = value;
        }
    }

    max
}

#[allow(dead_code)]
pub fn neg_max_loop(state: &GameState, depth: u8) -> f64 {
    let mut queue = VecDeque::new();
    queue.push_back((state.clone(), depth, state.mark == Mark::Black));

    let mut max_value = f64::NEG_INFINITY;
    let mut min_value = f64::INFINITY;

    while let Some((state, depth, is_max)) = queue.pop_front() {
        if depth == 0 || state.is_finish() {
            let value = evaluate_function(&state);

            if is_max {
                max_value = max_value.max(value);
            } else {
                min_value = min_value.min(value);
            }

            if max_value >= min_value {
                break;
            }

            continue;
        }

        for ply in state.get_legal_plies() {
            queue.push_back((state.get_next(&ply), depth - 1, !is_max))
        }
    }

    if state.mark == Mark::Black {
        max_value
    } else {
        -min_value
    }
}
