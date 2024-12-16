export class UserAlreadyExistsException extends Error {
    constructor(username) {
      super(`User with username ${username} already exists.`);
      this.name = 'UserAlreadyExistsException';
    }
  }
  module.exports = { UserAlreadyExistsException };
