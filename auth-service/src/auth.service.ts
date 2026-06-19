import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { User } from "./user/user.entity";
import { AuthSubject } from "./observers/auth.subject";
import { AuthObserver } from "./observers/auth.logger.observer";

@Injectable()
export class AuthService {
  private authsubject = new AuthSubject();
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private jwtService: JwtService,
  ) {
    this.authsubject.subscribe(new AuthObserver());
  }

  async register(name: string, email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      name,
      email,
      password: hash,
    });

    return this.userRepo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      this.authsubject.notify(`Login Failed For ${email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      this.authsubject.notify(`Login Failed for ${email}`);
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.role === "admin") {
      this.authsubject.notify(`Admin logged in successfully`);
    } else {
      this.authsubject.notify(`User logged in successfully`);
    }
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
