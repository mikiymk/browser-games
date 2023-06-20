use crate::{ply::Ply, position::Position, state::board::Board};

pub struct StepPlyIterator<'a> {
    step_targets: &'static [(i8, i8)],
    board: &'a Board,
    from: Position,

    count: usize,
}

impl<'a> StepPlyIterator<'a> {
    pub fn new(step_targets: &'static [(i8, i8)], board: &'a Board, from: Position) -> Self {
        StepPlyIterator {
            step_targets,
            board,
            from,
            count: 0,
        }
    }
}

impl<'a> Iterator for StepPlyIterator<'a> {
    type Item = Ply;

    fn next(&mut self) -> Option<Self::Item> {
        loop {
            match self.step_targets.get(self.count) {
                Some((x, y)) => {
                    self.count += 1;

                    match self.from.rel_new(*x, *y) {
                        Some(to) => {
                            if !self.board.is_same_mark(&self.from, &to) {
                                break Some(Ply::new_move(self.from, to));
                            }
                        }
                        None => continue,
                    }
                }
                None => break None,
            }
        }
    }
}
