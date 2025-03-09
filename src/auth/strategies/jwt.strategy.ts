import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_users } from '../../entities/t_users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectRepository(t_users)
        private usersRepository: Repository<t_users>
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new UnauthorizedException('JWT_SECRET no está configurado');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: any) {
        const user = await this.usersRepository.findOne({ 
            where: { id: payload.sub },
            select: ['id', 'email', 'is_hr']
        });

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return {
            id: user.id,
            email: user.email,
            is_hr: user.is_hr
        };
    }
} 