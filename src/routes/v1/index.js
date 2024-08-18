const {express} = require('../../utils/imports.util');
const authRoutes = require('./profile.route');

const router = express.Router();

router.use('/user', authRoutes);

module.exports = router;
