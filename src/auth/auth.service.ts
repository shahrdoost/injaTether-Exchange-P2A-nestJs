import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(private usersService: UsersService, private jwtService: JwtService) {

  }

  async validateUserByPassword(loginAttempt: LoginUserDto) {

    // This will be used for the initial login
    const userToAttempt = await this.usersService.findOneByEmail(loginAttempt.email);

    return new Promise(async (resolve, reject) => {

      const returnerr = async () => {
        throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
      };

      if (userToAttempt == null) {
        await resolve(returnerr());
      }

      // Check the supplied password against the hash stored for this email address
      // @ts-ignore
      await userToAttempt.checkPassword(loginAttempt.password, async (err, isMatch) => {

        if (err) {
          await resolve(returnerr());
        }

        if (isMatch) {
          // If there is a successful match, generate a JWT for the user
          await resolve(this.createJwtPayload(userToAttempt));
        } else {
          await resolve(returnerr());
        }

      });

    });

  }

  async getUser(token: string) {
    const user = await this.jwtService.verifyAsync(token);
    return user;
  }

  async validateUserByJwt(payload: JwtPayload) {

    // This will be used when the user has already logged in and has a JWT
    const user = await this.usersService.findOneByEmail(payload.email);

    if (user) {
      return this.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }

  }

  async createJwtPayload(user) {

    const data: JwtPayload = {
      email: user.email,
    };

    const jwt = await this.jwtService.sign(data);

    return {
      expiresIn: 3600,
      token: jwt,
    };

  }
}
