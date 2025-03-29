import { getAllClassicService, getAllEmojiService, getSolutionClassicService, getSolutionEmojiService, getAllDescriptionService, getSolutionDescriptionService, getAllQuoteService, getSolutionQuoteService, getAllPictureService, getSolutionPictureService, getAllLeaderboardService, getLeaderboardOneUserService } from "../services/game.service";

export const getAllClassic = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getAllClassicService(id) as any;

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
};

export const getSolutionClassic = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getSolutionClassicService(id) as any;

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
};



export const getAllEmoji = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getAllEmojiService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
};

export const getSolutionEmoji = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getSolutionEmojiService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
};

export const getAllDescription = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getAllDescriptionService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
};

export const getSolutionDescription = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getSolutionDescriptionService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
};

export const getAllQuote = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getAllQuoteService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {

        next(error);
    }
}

export const getSolutionQuote = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getSolutionQuoteService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
};


export const getAllPicture = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getAllPictureService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
}


export const getSolutionPicture = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó kategória azonosító!" });
        }

        const result = await getSolutionPictureService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error);
    }
}


export const getAllLeaderboard = async (req, res, next) =>{
    try {
        const result = await getAllLeaderboardService();
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }

    } catch (error) {
        next(error)
    }
}

export const getLeaderboardOneUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Hiányzó userID" });
        }

        const result = await getLeaderboardOneUserService(id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        next(error);
    }
};
