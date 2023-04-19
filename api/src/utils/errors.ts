export class ValidationError extends Error {
    private field: string;

    constructor(field = '', msg?: string) {
        const message = msg || `Validation error. Please check your input: ${field}`;
        super(message);
        this.field = field;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    public getField(): string {
        return this.field
    }
}

export class InternalServerError extends Error {
    constructor(msg = 'Something went wrong. Please try again later.') {
        super(msg);

        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

export class DBError extends Error {
    constructor(msg = 'Could not apply operation in the database') {
        super(msg);

        Object.setPrototypeOf(this, DBError.prototype);
    }
}

export class NoDocumentsFoundError extends DBError {
    constructor(msg = 'No Documents in the query') {
        super(msg);

        Object.setPrototypeOf(this, NoDocumentsFoundError.prototype);
    }
}
