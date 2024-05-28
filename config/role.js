


const ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
    SIMPLE_USER: "simple user" // Ensure this matches the role in your user model
};

const InRole = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Access Denied: No User Information!' });
    }

    const hasRole = roles.includes(req.user.role);
    if (!hasRole) {
        return res.status(401).json({ message: "Role not authorized" });
    }
    next();
};



module.exports = { InRole, ROLES };
