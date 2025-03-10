import { Injectable, OnModuleInit } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service implements OnModuleInit {
    private s3: S3;
    public bucket: string;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const region = this.configService.get<string>('AWS_REGION');
        const bucket = this.configService.get<string>('AWS_S3_BUCKET');

        if (!accessKeyId || !secretAccessKey || !region || !bucket) {
            throw new Error('Faltan credenciales de AWS en la configuración');
        }

        this.s3 = new S3({
            accessKeyId,
            secretAccessKey,
            region,
        });
        this.bucket = bucket;
    }

    async getSignedUrl(key: string): Promise<string> {
        if (!this.s3 || !this.bucket) {
            throw new Error('El servicio S3 no está inicializado correctamente');
        }

        const params = {
            Bucket: this.bucket,
            Key: key,
            Expires: 3600, // URL válida por 1 hora
        };

        return this.s3.getSignedUrlPromise('getObject', params);
    }
} 