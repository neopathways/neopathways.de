import * as crypto from 'crypto';

export function hashPassword(password: string) {
	return crypto.createHash('sha256').update(password).digest('base64');
}

export function validatePasswordHash(known: string, unknown: string) {
	return known === hashPassword(unknown);
}