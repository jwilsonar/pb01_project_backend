import { SetMetadata } from '@nestjs/common';

export const HR_ROLE_KEY = 'requiresHrRole';
export const RequireHrRole = () => SetMetadata(HR_ROLE_KEY, true); 