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
        eprintln!("depth: {}", depth,);
        return evaluate_function(state);
    }

    if state.mark == Mark::White {
        let mut max = f64::NEG_INFINITY;

        for ply in state.get_legal_plies() {
            let prev_max = max;
            let value = mini_max_recursion(&state.get_next(&ply), depth - 1);
            max = prev_max.max(value);

            let width = depth as usize;
            eprintln!(
                "{:width$}depth: {} {:05.1} <= max {:05.1}, {:05.1}",
                "", depth, max, prev_max, value
            );
        }

        max
    } else {
        let mut min = f64::INFINITY;

        for ply in state.get_legal_plies() {
            let prev_min = min;
            let value = mini_max_recursion(&state.get_next(&ply), depth - 1);

            min = prev_min.min(value);

            let width = depth as usize;
            eprintln!(
                "{:width$}depth: {} {:05.1} <= min {:05.1}, {:05.1}",
                "", depth, min, prev_min, value
            );
        }

        min
    }
}

#[allow(dead_code)]
pub fn mini_max_loop(state: &GameState, depth: u8) -> f64 {
    if depth == 0 || state.is_finish() {
        return evaluate_function(state);
    }

    let mut stack = vec![(state.clone(), depth, state.mark == Mark::White)];
    let mut max_stack = vec![(state.mark == Mark::White, f64::NEG_INFINITY)];

    let mut prev_depth = depth;

    while let Some((state, depth, is_white)) = stack.pop() {
        // 探索を終了する場合 (深さに到達した・終了条件を満たした)
        if depth == 0 || state.is_finish() {
            // 結果のスタックの値を詰め直す
            let (_, prev_max) = max_stack.pop().unwrap();
            let value = evaluate_function(&state);
            let max = if is_white {
                let min = prev_max.max(value);
                eprintln!(
                    "depth: {} {:05.1} <= min {:05.1}, {:05.1}",
                    depth, min, prev_max, value
                );
                min
            } else {
                let max = prev_max.min(value);
                eprintln!(
                    "depth: {} {:05.1} <= max {:05.1}, {:05.1}",
                    depth, max, prev_max, value
                );
                max
            };

            max_stack.push((is_white, max));

            continue;
        }

        // 前の深さが今より深い場合 (前のループでその深さの探索が終了した)
        for _ in prev_depth..depth {
            // 結果のスタックの値を詰め直す
            let (_, value) = max_stack.pop().unwrap();
            let (_, max) = max_stack.pop().unwrap();
            let max = if is_white {
                max.max(value)
            } else {
                max.min(value)
            };
            max_stack.push((is_white, max));
        }

        if state.mark == Mark::White {
            max_stack.push((true, f64::NEG_INFINITY));

            for ply in state.get_legal_plies() {
                stack.push((state.get_next(&ply), depth - 1, true));
            }
        } else {
            max_stack.push((false, f64::INFINITY));

            for ply in state.get_legal_plies() {
                stack.push((state.get_next(&ply), depth - 1, false));
            }
        }

        eprintln!("{:?}", max_stack);

        prev_depth = depth;
    }

    eprintln!("{:?}", max_stack);

    while let Some((is_white, value)) = max_stack.pop() {
        // 結果のスタックの値を詰め直す
        let (_, max) = match max_stack.pop() {
            Some(x) => x,
            None => return value,
        };
        let max = if is_white {
            max.max(value)
        } else {
            max.min(value)
        };
        max_stack.push((is_white, max));
    }

    f64::NEG_INFINITY
}

#[cfg(test)]
mod tests {
    use crate::{
        state::{castling::Castling, en_passant::EnPassant},
        test_utils::{initial_board, set_board_pieces},
    };

    use super::*;

    #[test]
    fn test_mini_max_depth_0() {
        let board = initial_board();

        let mark = Mark::White;
        let castling = Castling::new(0);
        let en_passant = EnPassant::new(None);
        let state = GameState::new(board, mark, castling, en_passant);
        let depth = 0;

        let result_recursion = mini_max_recursion(&state, depth);
        let result_loop = mini_max_loop(&state, depth);

        assert_eq!(result_recursion, result_loop);
    }

    #[test]
    fn test_mini_max_depth_1() {
        let board = set_board_pieces!(
            (0, 4) => (Black, King),
            (7, 4) => (White, King),

            (6, 4) => (White, Pawn),
            (5, 3) => (Black, Pawn),
            (4, 2) => (Black, Rook),
            (4, 4) => (Black, Knight),
        );

        let mark = Mark::White;
        let castling = Castling::new(0);
        let en_passant = EnPassant::new(None);
        let state = GameState::new(board, mark, castling, en_passant);
        let depth = 1;

        let result_recursion = mini_max_recursion(&state, depth);
        let result_loop = mini_max_loop(&state, depth);

        assert_eq!(result_recursion, result_loop);
    }

    #[test]
    fn test_mini_max_depth_2() {
        let board = set_board_pieces!(
            (0, 4) => (Black, King),
            (7, 4) => (White, King),

            (6, 4) => (White, Pawn),
            (5, 3) => (Black, Pawn),
            (4, 2) => (Black, Rook),
            (4, 4) => (Black, Knight),
        );

        let mark = Mark::White;
        let castling = Castling::new(0);
        let en_passant = EnPassant::new(None);
        let state = GameState::new(board, mark, castling, en_passant);
        let depth = 2;

        let result_recursion = mini_max_recursion(&state, depth);
        let result_loop = mini_max_loop(&state, depth);

        assert_eq!(result_recursion, result_loop);
    }
}
