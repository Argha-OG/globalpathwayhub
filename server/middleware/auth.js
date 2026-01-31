const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token !== 'siam-secret-token') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = { uid: 'admin', email: 'Siam#18767:)' };
    next();
};

module.exports = verifyToken;
