const verifyRole = (roles: string[]) => {
    return (req, res, next) => {
        const userRole = req.role; // Assume req.user is set after authentication
        if (!roles.includes(userRole)) {
            return res.status(403).send('Access denied. You are '+ userRole+". Need to be "+roles);
        }
        next();
    };
};
export default verifyRole;