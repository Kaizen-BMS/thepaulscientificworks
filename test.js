const bcrypt = require('bcryptjs');
bcrypt.hash('Password@1234', 12).then(console.log);