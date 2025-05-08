// src\services\db\fake\db.service.test.fake.ts
export class BddServiceTestFake {
  test(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
