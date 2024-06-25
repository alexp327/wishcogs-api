import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Release {
  @PrimaryColumn()
  release_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  desired_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  latest_price: number;
}
