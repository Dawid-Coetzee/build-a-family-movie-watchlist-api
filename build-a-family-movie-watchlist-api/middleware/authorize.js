export function authorizeModification(req, res, next) {
    const role = req.user.role;
    const uID = req.user.id;
    const paramsUID = req.params.userId;

    if (role === "child" && Number(uID) !== Number(paramsUID)) {
        return res.status(403).json({"error": "Access denied"});
    }

    next();
}