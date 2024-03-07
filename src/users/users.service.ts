import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Le Tuan',
      email: 'letuan@gmail.com',
      role: 'INTERN',
    },
    {
      id: 2,
      name: 'Tuan Le',
      email: 'tuanle@gmail.com',
      role: 'ENGINEER',
    },
  ];

  findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      const filteredUsers = this.users.filter((user) => user.role === role);
      if (filteredUsers.length === 0) {
        throw new NotFoundException('Role not found exception');
      }
      return filteredUsers;
    }
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  create(createUserDto: CreateUserDto) {
    const users = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: users[0].id + 1,
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role,
    };

    this.users.push(newUser);
    return newUser;
  }

  // eslint-disable-next-line prettier/prettier
  update(id: number, updateUserDto: UpdateUserDto) {
    this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });

    return this.findOne(id);
  }

  delete(id: number) {
    this.users.filter((user) => user.id !== id);

    return this.findOne(id);
  }
}
