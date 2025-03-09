import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { t_document_types } from '../../entities/t_document_types.entity';

@Injectable()
export class DocumentTypesSeeder {
    constructor(
        @InjectRepository(t_document_types)
        private documentTypesRepository: Repository<t_document_types>,
    ) {}

    async seed() {
        const documentTypes = [
            { name: 'Documento de Identidad' },
            { name: 'Licencia de conducir' },
            { name: 'CV' }
        ];

        for (const documentType of documentTypes) {
            const exists = await this.documentTypesRepository.findOne({
                where: { name: documentType.name }
            });

            if (!exists) {
                await this.documentTypesRepository.save(documentType);
            }
        }

        console.log('Tipos de documentos creados exitosamente');
    }
} 