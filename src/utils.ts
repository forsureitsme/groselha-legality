export function logError(error: Error, shouldThrow: Boolean = true) {
	console.error(error);

	if (shouldThrow) {
		throw error;
	}

	return null;
}

/**
 * Receives an Acorn node and returns the parsed value from the expression.
 * @param node Acorn node
 * @returns Parsed expression
 */
export function getValueFromAcornNode(node: any) {
	if (node.type === 'ObjectExpression') {
		return node.properties.reduce(
			(obj: object, property: unknown) => ({ ...obj, ...getValueFromAcornNode(property) }),
			{}
		);
	}

	if (node.type === 'ArrayExpression') {
		return [...node.elements.map((property: unknown) => getValueFromAcornNode(property))];
	}

	if (node.type === 'Property') {
		return {
			[getValueFromAcornNode(node.key)]: getValueFromAcornNode(node.value)
		};
	}

	if (node.type === 'Identifier') {
		return node.name;
	}

	if (node.type === 'Literal') {
		return node.value;
	}

	return node.value;
}

export async function assertFecth(r: Response) {
	if (!r.ok) {
		logError(new Error(r.statusText));
	}
}
