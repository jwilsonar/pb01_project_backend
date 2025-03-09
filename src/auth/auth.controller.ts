import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LogoutDto } from './dto/logout.dto';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    logout(@Body() logoutDto: LogoutDto) {
        return this.authService.logout(logoutDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Obtener perfil del usuario',
        description: 'Obtiene el perfil del usuario autenticado. Si el usuario es un empleado, incluye detalles adicionales como puesto, salario y documentos.'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Perfil del usuario recuperado exitosamente',
        type: ProfileResponseDto
    })
    @ApiUnauthorizedResponse({
        description: 'No autorizado - Token JWT inválido o expirado'
    })
    getProfile(@Request() req) {
        return this.authService.getProfile(req);
    }
} 