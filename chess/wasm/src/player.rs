use crate::ply::Ply;

pub enum Player {
    RandomAIPlayer(),
}

impl Player {
    pub fn new() -> Self {
        Player::RandomAIPlayer()
    }

    pub fn get_ply(&self) -> Ply {
        todo!()
    }
}

impl TryFrom<u8> for Player {
    type Error = String;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            1 => Ok(Self::new()),
            v => Err(format!("{} is not valid id", v)),
        }
    }
}
