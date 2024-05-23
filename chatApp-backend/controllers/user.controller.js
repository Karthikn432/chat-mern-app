import User from "../models/user.model.js";

export const getUsersForSidebars = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 20;
    const searchTerm = req.query.search || '';

    try {
        const loggedInUserId = req.user._id
        const query = { _id: { $ne: loggedInUserId } };
        if (searchTerm) {
            // Use a case-insensitive regular expression for searching names
            query.fullName = { $regex: new RegExp(searchTerm, 'i') };
        }
        const totalCount = await User.countDocuments(query);
        const pageCount = Math.ceil(totalCount / perPage);

        const filteredUsers = await User.find(query).select("-password")
        const respose = {
            page,
            per_page: perPage,
            total_pages: pageCount,
            total_records: totalCount,
            filteredUsers
        }
        res.status(200).json(respose)

    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}