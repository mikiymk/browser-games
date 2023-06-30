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
            let value = mini_max_recursion(&state.get_next(&ply), depth - 1);
            max = max.max(value);
        }

        max
    } else {
        let mut min = f64::INFINITY;

        for ply in state.get_legal_plies() {
            let value = mini_max_recursion(&state.get_next(&ply), depth - 1);

            min = min.min(value);
        }

        min
    }
}

#[allow(dead_code)]
pub fn mini_max_loop(state: &GameState, depth: u8) -> f64 {
    if depth == 0 || state.is_finish() {
        return evaluate_function(state);
    }

    let mut stack = vec![(state.clone(), depth, 0, state.mark)];
    let mut max_stack = vec![if state.mark == Mark::White {
        f64::NEG_INFINITY
    } else {
        f64::INFINITY
    }];

    while let Some((state, depth, collect_max, color)) = stack.pop() {
        if depth == 0 || state.is_finish() {
            // 探索を終了する場合 (深さに到達した・終了条件を満たした)
            // 結果をスタックに追加する
            let value = evaluate_function(&state);

            max_stack.push(value);
        } else if collect_max > 0 {
            // １ノードの子ノード内で最大・最小を計算する

            if color == Mark::White {
                let mut max = f64::NEG_INFINITY;

                for _ in 0..collect_max {
                    let value = max_stack.pop().unwrap();

                    max = max.max(value);
                }

                max_stack.push(max)
            } else {
                let mut min = f64::INFINITY;

                for _ in 0..collect_max {
                    let value = max_stack.pop().unwrap();

                    min = min.min(value);
                }

                max_stack.push(min)
            }
        } else {
            let plies: Vec<_> = state.get_legal_plies().collect();
            stack.push((state.clone(), depth, plies.len(), state.mark));

            for ply in plies {
                stack.push((state.get_next(&ply), depth - 1, 0, state.mark));
            }
        }
    }

    max_stack.pop().unwrap()
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

    #[test]
    fn test_mini_max_depth_3() {
        let board = initial_board();

        let mark = Mark::White;
        let castling = Castling::new(0);
        let en_passant = EnPassant::new(None);
        let state = GameState::new(board, mark, castling, en_passant);
        let depth = 3;

        let result_recursion = mini_max_recursion(&state, depth);
        let result_loop = mini_max_loop(&state, depth);

        assert_eq!(result_recursion, result_loop);
    }
}
