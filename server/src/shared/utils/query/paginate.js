import { sortByFieldLength } from "./sort-by-field-length.js";

const paginate = async (model, conditions = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = null,
    projection = null,
    populate = null,
    sortByLengthField = null,
  } = options;

  const pageNum = Math.max(parseInt(page, 10), 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
  const skip = (pageNum - 1) * limitNum;
  const total = await model.countDocuments(conditions);

  let results;

  if (sortByLengthField) {
    results = await sortByFieldLength(model, conditions, sortByLengthField, {
      skip,
      limit: limitNum,
      select,
      projection,
    });
  } else {
    const query = model.find(conditions, projection).skip(skip).limit(limitNum).sort(sort);

    if (select) query.select(select);
    if (populate) query.populate(populate);

    results = await query.exec();
  }

  return {
    results,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
    hasMore: skip + results.length < total,
  };
};

export { paginate };
