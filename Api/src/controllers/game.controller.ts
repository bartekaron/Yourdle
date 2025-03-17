import { getAllClassicService, getAllEmojiService, getSolutionClassicService, getSolutionEmojiService, getAllDescriptionService, getSolutionDescriptionService } from "../services/game.service";

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
