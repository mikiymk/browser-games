use crate::{state::board::Board, state::ply::Ply, state::position::Position};

pub enum RunDirection {
    Up,
    Down,
    Left,
    Right,
    LeftUp,
    LeftDown,
    RightUp,
    RightDown,
}

impl RunDirection {
    fn get_direction_position(&self) -> (i8, i8) {
        match self {
            RunDirection::Up => (-1, 0),
            RunDirection::Down => (1, 0),
            RunDirection::Left => (0, -1),
            RunDirection::Right => (0, 1),
            RunDirection::LeftUp => (-1, -1),
            RunDirection::LeftDown => (1, -1),
            RunDirection::RightUp => (-1, 1),
            RunDirection::RightDown => (1, 1),
        }
    }
}

pub struct RunPlyIterator<'a> {
    run_directions: &'static [RunDirection],

    board: &'a Board,
    from: Position,

    direction_count: usize,
    step_count: usize,
}

impl<'a> RunPlyIterator<'a> {
    pub fn new(run_directions: &'static [RunDirection], board: &'a Board, from: Position) -> Self {
        RunPlyIterator {
            run_directions,
            board,
            from,
            direction_count: 0,
            step_count: 1,
        }
    }
}

impl<'a> Iterator for RunPlyIterator<'a> {
    type Item = Ply;

    fn next(&mut self) -> Option<Self::Item> {
        loop {
            match self.run_directions.get(self.direction_count) {
                Some(direction) => {
                    let (x, y) = direction.get_direction_position();
                    let x = x * (self.step_count as i8);
                    let y = y * (self.step_count as i8);

                    match self.from.rel_new(x, y) {
                        Some(to) => {
                            self.step_count += 1;

                            if self.board.is_same_mark(&self.from, &to) {
                                self.step_count = 1;
                                self.direction_count += 1;

                                continue;
                            } else if self.board.is_other_mark(&self.from, &to) {
                                self.step_count = 1;
                                self.direction_count += 1;

                                break Some(Ply::new_move(self.from, to));
                            } else {
                                break Some(Ply::new_move(self.from, to));
                            }
                        }
                        None => {
                            self.step_count = 1;
                            self.direction_count += 1;

                            continue;
                        }
                    }
                }
                None => break None,
            }
        }
    }
}
