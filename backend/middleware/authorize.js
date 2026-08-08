function authorize(...allowedRoles) {

    return (req, res, next) => {

        try {

            // Ensure user is authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized."
                });
            }

            // User roles from JWT
            const userRoles = req.user.roles || [];

            // Check if user has at least one allowed role
            const hasPermission = allowedRoles.some(role =>
                userRoles.includes(role)
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden. You do not have permission to perform this action."
                });
            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Authorization error."
            });

        }

    };

}

module.exports = authorize;