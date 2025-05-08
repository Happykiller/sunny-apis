import { describe, expect, it } from '@jest/globals';

import { PasswordService } from '@service/password/password.service';
import { PasswordServiceReal } from '@service/password/password.service.real';

describe('PasswordServiceReal', () => {
  const service: PasswordService = new PasswordServiceReal();

  it('should build', () => {
    // arrange
    // act
    // assert
    expect(service).toBeDefined();
  });

  describe('#generate', () => {
    it('should create a password with specials', () => {
      // arrange
      // act
      const password = service.generate({
        length: 10,
        specials: true,
      });
      // assert
      expect(password).toBeDefined();
    });

    it('should create a password without specials', () => {
      // arrange
      // act
      const password = service.generate({
        length: 10,
        specials: false,
      });
      // assert
      expect(password).toBeDefined();
    });
  });
});
