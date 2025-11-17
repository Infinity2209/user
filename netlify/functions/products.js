const db = require('../../db.json');

exports.handler = async (event, context) => {
    const { httpMethod, path } = event;

    // Extract the path after /products
    const pathParts = path.split('/').filter(p => p);
    const resource = pathParts[1]; // 'products'
    const id = pathParts[2]; // optional ID

    try {
        switch (httpMethod) {
            case 'GET':
                if (id) {
                    const product = db.products.find(p => p.id === id);
                    if (!product) {
                        return {
                            statusCode: 404,
                            body: JSON.stringify({ error: 'Product not found' }),
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
                        body: JSON.stringify(product),
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
                        body: JSON.stringify(db.products),
                    };
                }

            case 'POST':
                const newProduct = JSON.parse(event.body);
                newProduct.id = Date.now().toString();
                db.products.push(newProduct);
                return {
                    statusCode: 201,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    body: JSON.stringify(newProduct),
                };

            case 'PUT':
                if (!id) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Product ID required' }),
                    };
                }
                const updateData = JSON.parse(event.body);
                const productIndex = db.products.findIndex(p => p.id === id);
                if (productIndex === -1) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'Product not found' }),
                    };
                }
                db.products[productIndex] = { ...db.products[productIndex], ...updateData };
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    body: JSON.stringify(db.products[productIndex]),
                };

            case 'DELETE':
                if (!id) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ error: 'Product ID required' }),
                    };
                }
                const deleteIndex = db.products.findIndex(p => p.id === id);
                if (deleteIndex === -1) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'Product not found' }),
                    };
                }
                const deletedProduct = db.products.splice(deleteIndex, 1)[0];
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    body: JSON.stringify(deletedProduct),
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
