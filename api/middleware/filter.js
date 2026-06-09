const META_FILTER_KEYS = new Set(["startDate", "endDate", "skip", "limit", "searchkey", "id", "_id", "sort", "sortBy", "sortOrder", "sorting", "page", "pageSize"]);

const sanitizeFilterValue = (value) => {
  if (value === "" || value === null || typeof value === "undefined") {
    return undefined;
  }

  if (Array.isArray(value)) {
    const sanitizedItems = value
      .map((item) => sanitizeFilterValue(item))
      .filter((item) => typeof item !== "undefined");

    return sanitizedItems.length ? sanitizedItems : undefined;
  }

  if (typeof value === "object") {
    const sanitizedObject = Object.entries(value).reduce((acc, [key, currentValue]) => {
      if (META_FILTER_KEYS.has(key)) {
        return acc;
      }

      const sanitizedValue = sanitizeFilterValue(currentValue);
      if (typeof sanitizedValue !== "undefined") {
        acc[key] = sanitizedValue;
      }

      return acc;
    }, {});

    return Object.keys(sanitizedObject).length ? sanitizedObject : undefined;
  }

  return value;
};

const filter = (req, res, next) => {
  req.filter = sanitizeFilterValue(req.query) || {};
  next();
};

module.exports.reqFilter = filter;
