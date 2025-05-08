// src\service\db\fake\mock\user.ropo.ts
import { UserDbModel } from '../../model/user.db.model';
import { USER_ROLE } from '../../../../graphql/guard/userRole';

export const userRopo: UserDbModel = {
  id: '65d4d015261e894a1da31a64',
  code: 'ropo',
  password:
    'B5DicCkBcu6twsf95mosv5wfjrR9YeCBl/v26tHQDwQB1fwoNjzipo51R8+IuCUQ7yijXFSzktxaSR3+9LXqyA==',
  name_first: 'Robert',
  name_last: 'Paulson',
  description: 'password with secret secretKey',
  mail: 'r.paulson@bob.com',
  role: USER_ROLE.ADMIN,
  active: true,
};
