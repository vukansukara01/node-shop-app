export function NotFound(entryName) {
    return {
        key: "NOT_FOUND",
        message: `${entryName} not found`,
    }
}

export function UnauthorizedRequest() {
    return {
        key: "UNAUTHORIZED",
        message: "Unauthorized",
    }
}

export function BadRequest(message) {
    return {
        key: "BAD_REQUEST",
        message: message || "your request is bad",
    }
}

export function DuplicateEntry(entryName) {
    return {
        key: "DUPLICATE_ENTRY",
        message: `Entry [${entryName}] must be unique`,
        status: 409,
    }
}

export const ServerError = {
    key: "SERVER_ERR",
    message: "Ops something went wrong please try again...",
    status: 500,
}

export function handleDatabaseErrors(error) {
    console.log(error)
    if (error?.parent?.errno === 1062) {
        return DuplicateEntry
    }

    console.log(error)
    return ServerError
}

export function handleJoiValidationErrors(error) {
    const errData = error.details.map((err) => {
        return {
            message: err.message,
            path: err.path
        }
    })

    return {
        key: "VALIDATION_ERR",
        message: "Validation failed",
        errors: errData,
        status: 400,
    }
}

export const InternalServerError = {
    key: "INTERNAL_ERR",
    message: "Sorry something went wrong...",
    status: 500,
}