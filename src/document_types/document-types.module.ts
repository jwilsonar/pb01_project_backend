import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { t_document_types } from '../entities/t_document_types.entity';

@Module({
    imports: [TypeOrmModule.forFeature([t_document_types])],
    controllers: [DocumentTypesController],
    providers: [DocumentTypesService],
    exports: [DocumentTypesService],
})
export class DocumentTypesModule {} 