import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { t_document_types } from '../entities/t_document_types.entity';

@ApiTags('Tipos de Documentos')
@Controller('api/document-types')
export class DocumentTypesController {
    constructor(private readonly documentTypesService: DocumentTypesService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo tipo de documento' })
    @ApiResponse({ status: 201, description: 'Tipo de documento creado exitosamente', type: t_document_types })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
        return this.documentTypesService.create(createDocumentTypeDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los tipos de documentos' })
    @ApiResponse({ status: 200, description: 'Lista de tipos de documentos', type: [t_document_types] })
    findAll() {
        return this.documentTypesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un tipo de documento por ID' })
    @ApiParam({ name: 'id', description: 'ID del tipo de documento' })
    @ApiResponse({ status: 200, description: 'Tipo de documento encontrado', type: t_document_types })
    @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.documentTypesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un tipo de documento' })
    @ApiParam({ name: 'id', description: 'ID del tipo de documento' })
    @ApiResponse({ status: 200, description: 'Tipo de documento actualizado', type: t_document_types })
    @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDocumentTypeDto: CreateDocumentTypeDto,
    ) {
        return this.documentTypesService.update(id, updateDocumentTypeDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un tipo de documento' })
    @ApiParam({ name: 'id', description: 'ID del tipo de documento' })
    @ApiResponse({ status: 200, description: 'Tipo de documento eliminado' })
    @ApiResponse({ status: 404, description: 'Tipo de documento no encontrado' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.documentTypesService.remove(id);
    }
} 