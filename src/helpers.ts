export function logError(error: Error, shouldThrow: Boolean = true) {
	if (globalThis.ENVIRONMENT !== 'production') {
		console.error(error);
	}

	if (shouldThrow) {
		throw error;
	}

	return null;
}

export async function assertFecth(r: Response) {
	if (!r.ok) {
		logError(new Error(r.statusText));
	}
}
