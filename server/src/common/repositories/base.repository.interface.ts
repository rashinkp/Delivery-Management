export interface IBaseRepository<T> {
  create(entity: Partial<T>): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  update(id: string, updateData: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
