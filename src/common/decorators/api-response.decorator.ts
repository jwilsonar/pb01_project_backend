import { applyDecorators, Type } from '@nestjs/common';
import { 
    ApiResponse, 
    ApiOkResponse, 
    ApiCreatedResponse, 
    ApiNoContentResponse,
    getSchemaPath 
} from '@nestjs/swagger';

export interface ApiResponseOptions {
    type?: Type<any>;
    isArray?: boolean;
    description?: string;
    status?: number;
}

export const ApiCustomResponse = (options: ApiResponseOptions) => {
    const { type, isArray = false, description, status = 200 } = options;

    if (!type) {
        return applyDecorators(
            ApiResponse({
                status,
                description
            })
        );
    }

    const schema = {
        schema: {
            allOf: [
                {
                    properties: {
                        data: isArray ? {
                            type: 'array',
                            items: { $ref: getSchemaPath(type) }
                        } : {
                            $ref: getSchemaPath(type)
                        }
                    }
                }
            ]
        }
    };

    switch (status) {
        case 201:
            return applyDecorators(
                ApiCreatedResponse({
                    description,
                    ...schema
                })
            );
        case 204:
            return applyDecorators(
                ApiNoContentResponse({
                    description
                })
            );
        default:
            return applyDecorators(
                ApiOkResponse({
                    description,
                    ...schema
                })
            );
    }
}; 