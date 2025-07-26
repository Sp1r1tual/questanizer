const sortByFieldLength = async (
    model,
    conditions,
    field,
    { skip = 0, limit = 10, select = null, projection = null } = {}
) => {
    const pipeline = [
        { $match: conditions },
        {
            $addFields: {
                fieldLength: { $strLenCP: `$${field}` },
            },
        },
        { $sort: { fieldLength: 1 } },
        { $skip: skip },
        { $limit: limit },
    ];

    if (select || projection) {
        pipeline.push({ $project: select || projection });
    }

    return model.aggregate(pipeline).exec();
};

export { sortByFieldLength };
