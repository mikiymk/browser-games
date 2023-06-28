use crate::state::{game_state::GameState, mark::Mark};

use super::evaluate::evaluate_function;

/// ミニマックス法に基づいてゲームの状態を探索し、最善手を選択する。
///
/// # Arguments
///
/// * `state` - ゲームの現在の状態を表すGameStateオブジェクトへの参照。
/// * `depth` - 探索の深さを表す整数値。探索する手の数を制限するために使用される。
/// * `is_maximize` - 現在のプレーヤーが最大化プレーヤーかどうかを表すブール値。
///
/// # Returns
///
/// 最善手の評価値を表すf64型の値。
#[allow(dead_code)]
pub fn mini_max_recursion(state: &GameState, depth: u8) -> f64 {
    if depth == 0 || state.is_finish() {
        return evaluate_function(state);
    }

    if state.mark == Mark::White {
        let mut max = f64::NEG_INFINITY;

        for ply in state.get_legal_plies() {
            max = max.max(mini_max_recursion(&state.get_next(&ply), depth - 1));
        }

        max
    } else {
        let mut min = f64::INFINITY;

        for ply in state.get_legal_plies() {
            min = min.min(mini_max_recursion(&state.get_next(&ply), depth - 1));
        }

        min
    }
}

#[allow(dead_code)]
pub fn mini_max_loop(state: &GameState, depth: u8) -> f64 {
    let mut stack = vec![(state.clone(), depth)];
    let mut max_stack = vec![f64::NEG_INFINITY];

    let mut prev_depth = depth;

    while let Some((state, depth)) = stack.pop() {
        // 探索を終了する場合 (深さに到達した・終了条件を満たした)
        if depth == 0 || state.is_finish() {
            // 結果のスタックの値を詰め直す
            let max = max_stack.pop().unwrap_or_default();
            let value = evaluate_function(&state);
            let max = if state.mark == Mark::White {
                max.min(value)
            } else {
                max.max(value)
            };
            max_stack.push(max);

            continue;
        }

        // 前の深さが今より深い場合 (前のループでその深さの探索が終了した)
        if prev_depth > depth {
            // 結果のスタックの値を詰め直す
            let value = max_stack.pop().unwrap_or_default();
            let max = max_stack.pop().unwrap_or_default();
            let max = if state.mark == Mark::White {
                max.min(value)
            } else {
                max.max(value)
            };
            max_stack.push(max);
        }

        if state.mark == Mark::White {
            max_stack.push(f64::NEG_INFINITY);

            for ply in state.get_legal_plies() {
                stack.push((state.get_next(&ply), depth - 1));
            }
        } else {
            max_stack.push(f64::INFINITY);

            for ply in state.get_legal_plies() {
                stack.push((state.get_next(&ply), depth - 1));
            }
        }

        prev_depth = depth;
    }

    max_stack.pop().unwrap()
}

#[cfg(test)]
mod tests {
    use crate::{
        state::{castling::Castling, en_passant::EnPassant},
        test_utils::initial_board,
    };

    use super::*;

    macro_rules! test_gen {
        ($name:ident, $func:ident, $depth:expr, $right:expr) => {
            #[test]
            fn $name() {
                let board = initial_board();

                let mark = Mark::White;
                let castling = Castling::new(0);
                let en_passant = EnPassant::new(None);
                let state = GameState::new(board, mark, castling, en_passant);
                let depth = $depth;

                let result = $func(&state, depth);

                assert_eq!(result, $right);
            }
        };
    }

    // test_gen!(test_mini_max_recursion_depth_0, mini_max_recursion, 0, 0.0);
    // test_gen!(test_mini_max_recursion_depth_1, mini_max_recursion, 1, 0.0);
    // test_gen!(test_mini_max_recursion_depth_2, mini_max_recursion, 2, 0.0);
    // test_gen!(test_mini_max_loop_depth_0, mini_max_loop, 0, 0.0);
    // test_gen!(test_mini_max_loop_depth_1, mini_max_loop, 1, 0.0);
    // test_gen!(test_mini_max_loop_depth_2, mini_max_loop, 2, 0.0);
}
