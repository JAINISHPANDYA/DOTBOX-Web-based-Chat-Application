const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: 'dpvhgnyid',
    api_key: '243312538818341',
    api_secret: 'Xo3DjR3J4CU6DJntlNrO6CLwiOQ'
})

module.exports = cloudinary;