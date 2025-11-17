const db = require('../../db.json');

exports.handler = async (event, context) => {
    const { httpMethod, path } = event;

    // Extract the path after /users
    const pathParts = path.split('/').filter(p => p);
    const resource = pathParts[1]; // 'users'
    const id = pathParts[2]; // optional ID

    try {
        switch (httpMethod) {
            case 'GET':
                if (id) {
                    const user = db.users.find(u => u.id === id);
                    if (!user) {
                        return {
                            statusCode: 404,
                            body: JSON.stringify({ error: 'User not found' }),
                        };
                    }
                    return {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        },
                        body: JSON.stringify(user),
                    };
                } else {
                    return {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        },
                        body: JSON.stringify(db.users),
                    };
                }

            case 'POST':
                const newUser = JSON.parse(event.body);
                newUser.id = Date.now().toString();
                db.users.push(newUser);
                return {
                    statusCode: 201,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    body: JSON.stringify(newUser),
                };

            case 'PUT':
                if (!id) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'User ID required' }),
                    };
                }
                const updateData = JSON.parse(event.body);
                const userIndex = db.users.findIndex(u => u.id === id);
                if (userIndex === -1) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'User not found' }),
                    };
                }
                db.users[userIndex] = { ...db.users[userIndex], ...updateData };
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    body: JSON.stringify(db.users[userIndex]),
                };

            case 'DELETE':
                if (!id) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'User ID required' }),
                    };
                }
                const deleteIndex = db.users.findIndex(u => u.id === id);
                if (deleteIndex === -1) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'User not found' }),
                    };
                }
                const deletedUser = db.users.splice(deleteIndex, 1)[0];
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    body: JSON.stringify(deletedUser),
                };

            case 'OPTIONS':
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    body: '',
                };

            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: 'Method not allowed' }),
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
