import { Controller, Post, UseGuards, Request, Body, UseInterceptors, UploadedFile, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from './s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_employee_documents } from '../entities/t_employee_documents.entity';
import { t_users } from '../entities/t_users.entity';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UploadDocumentDto } from './dtos/upload-document.dto';
import { DocumentResponseDto, DeleteDocumentResponseDto } from './dtos/document-response.dto';
import { t_employees } from '../entities/t_employees';
import { t_document_types } from '../entities/t_document_types.entity';

@ApiTags('Documentos')
@Controller('api/documents')
@ApiBearerAuth()
export class DocumentsController {
    constructor(
        private readonly s3Service: S3Service,
        @InjectRepository(t_employee_documents)
        private employeeDocumentsRepository: Repository<t_employee_documents>,
        @InjectRepository(t_users)
        private usersRepository: Repository<t_users>,
        @InjectRepository(t_employees)
        private employeesRepository: Repository<t_employees>,
        @InjectRepository(t_document_types)
        private documentTypesRepository: Repository<t_document_types>
    ) {}

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: 'Subir documento',
        description: 'Permite a un usuario subir un documento asociado a su perfil.'
    })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 201,
        description: 'Documento subido correctamente',
        type: DocumentResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'No autorizado - Token JWT inválido o usuario no encontrado'
    })
    async uploadFile(
        @UploadedFile() file: any,
        @Request() req,
        @Body() body: UploadDocumentDto
    ) {
        console.log("\n\n",body,"\n\n");
        const employee = await this.employeesRepository.findOne({ where: { id: body.employee_id } });
        if (!employee) {
            throw new UnauthorizedException('Empleado no encontrado');
        }
        const documentType = await this.documentTypesRepository.findOne({ where: { id: body.document_type_id } });
        if (!documentType) {
            throw new UnauthorizedException('Tipo de documento no encontrado');
        }

        const existe = await this.employeeDocumentsRepository.findOne({ where: { employee_id: employee.id, document_type_id: documentType.id } });
        if (existe) {
            throw new UnauthorizedException('El documento ya existe');
        }
        const key = `documents/${employee.id}/${Date.now()}-${file.originalname}`;
        const fileUrl = await this.s3Service.uploadFile(file, key);
        const document = this.employeeDocumentsRepository.create({
            document_type: documentType,
            document_type_id: Number(body.document_type_id),
            employee: employee,
            employee_id: employee.id,
            file_path: fileUrl,
            is_active: true
        });

        return await this.employeeDocumentsRepository.save(document);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Eliminar documento',
        description: 'Permite eliminar un documento. Solo el propietario o un usuario de RRHH puede eliminarlo.'
    })
    @ApiParam({
        name: 'id',
        description: 'ID del documento a eliminar',
        type: 'number',
        example: 1
    })
    @ApiResponse({
        status: 200,
        description: 'Documento eliminado correctamente',
        type: DeleteDocumentResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'No autorizado - Token JWT inválido o usuario no encontrado'
    })
    @ApiResponse({
        status: 403,
        description: 'Prohibido - Usuario no tiene permisos para eliminar este documento'
    })
    @ApiResponse({
        status: 404,
        description: 'Documento no encontrado'
    })
    async deleteDocument(@Param('id') id: number, @Request() req) {
        const document = await this.employeeDocumentsRepository.findOne({ where: { id } });
        const employee = await this.employeesRepository.findOne({ where: { user: { id: req.user.id } } });
        if (!document) {
            throw new UnauthorizedException('Documento no encontrado');
        }

        const user = await this.usersRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        if (document.employee_id !== employee?.id && !user.is_hr) {
            throw new UnauthorizedException('No tienes permiso para eliminar este documento');
        }

        const urlParts = document.file_path.split('/');
        const key = urlParts.slice(3).join('/');
        
        await this.s3Service.deleteFile(key);
        await this.employeeDocumentsRepository.remove(document);

        return { message: 'Documento eliminado correctamente' };
    }
} 