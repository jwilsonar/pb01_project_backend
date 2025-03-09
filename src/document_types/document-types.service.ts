import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_document_types } from '../entities/t_document_types.entity';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';

@Injectable()
export class DocumentTypesService {
    constructor(
        @InjectRepository(t_document_types)
        private documentTypesRepository: Repository<t_document_types>,
    ) {}

    async create(createDocumentTypeDto: CreateDocumentTypeDto): Promise<t_document_types> {
        const newDocumentType = this.documentTypesRepository.create(createDocumentTypeDto);
        return await this.documentTypesRepository.save(newDocumentType);
    }

    async findAll(): Promise<t_document_types[]> {
        return await this.documentTypesRepository.find();
    }

    async findOne(id: number): Promise<t_document_types> {
        const documentType = await this.documentTypesRepository.findOne({ where: { id } });
        if (!documentType) {
            throw new NotFoundException('Tipo de documento no encontrado');
        }
        return documentType;
    }

    async update(id: number, updateDocumentTypeDto: CreateDocumentTypeDto): Promise<t_document_types> {
        const documentType = await this.findOne(id);
        this.documentTypesRepository.merge(documentType, updateDocumentTypeDto);
        return await this.documentTypesRepository.save(documentType);
    }

    async remove(id: number): Promise<void> {
        const documentType = await this.findOne(id);
        await this.documentTypesRepository.remove(documentType);
    }
} 