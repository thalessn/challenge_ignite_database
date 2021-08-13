import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const gameResult =  await this.repository
      .createQueryBuilder("games")
      .where(`games.title ILIKE '%${param}%'`)
      .getMany();
    
    return gameResult;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(*) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("games.users", "users")
      .where({
        id
      }).getOne();
    
    if(!result){
      throw new Error("User not find");
    }

    return result.users;
  }
}
