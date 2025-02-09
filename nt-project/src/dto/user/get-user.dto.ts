export class GetUserDto {
  constructor(
    public userId: string,
    public name: string,
    public lastName: string,
    public email: string,
  ) { }
}
