import { ScoreDto } from './score-dto';

export interface GetScoreDto {
  firstInnings: ScoreDto;
  secondInnings: ScoreDto;
}
