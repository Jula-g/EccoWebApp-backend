export class RegisterResponseDto {
  public id: string;
  public username: string;
  public token: string;
  public role: string;

  constructor(id: string, username: string, token: string, role: string) {
    this.id = id;
    this.username = username;
    this.token = token;
    this.role = role;
  }
}
