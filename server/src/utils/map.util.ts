export const makeMapFunction =
  (fieldsMap: [string, string][]) =>
  (origin: any, prefix = '') => {
    const target = {} as any;
    for (const [oField, tField] of fieldsMap) {
      const originField = prefix ? `${prefix}.${oField}` : oField;
      target[tField] = origin[originField];
    }
    return target;
  };

type MappingRule = {
  idField: string;
  mapFunction: <T>(origin: any, prefix: string) => T;
  holderRules?: {model: string; field: string}[];
  memberRules?: {model: string; parentIdField: string}[];
};
export const makeAggregationFunction =
  (rules: {[key: string]: MappingRule}) => (data: any[]) => {
    const lookup = new Map<string, any>();
    const modelNames = new Set<string>();
    const highLevel = [] as any[];

    // Populate names
    for (const key of Object.keys(data[0])) {
      const [name] = key.split('.');
      modelNames.add(name);
    }

    for (const row of data) {
      for (const name of modelNames) {
        const objId = row[`${name}.${rules[name].idField}`];
        const instanceKey = `i-${name}+${objId}`;
        let obj = lookup.get(instanceKey);

        // Check if the object has been processed
        if (obj) continue;

        // Initialize and eference the instance
        obj = rules[name].mapFunction(row, name);
        lookup.set(instanceKey, obj);

        // Check if obj should hold an aggregation
        if (rules[name].holderRules) {
          for (const rule of rules[name].holderRules) {
            // Look for existing aggregations
            const heldAggrKey = `a-${name}+${objId}+${rule.model}`;
            let heldAggr = lookup.get(heldAggrKey);

            // Initialize and reference aggregation
            if (!heldAggr) {
              heldAggr = [];
              lookup.set(heldAggrKey, heldAggr);
            }

            // Set aggregation holding field
            obj[rule.field] = heldAggr;
          }
        }

        // Check if obj belongs to aggregation
        if (rules[name].memberRules) {
          for (const rule of rules[name].memberRules) {
            // Look for existing aggregations
            const parentId = row[`${name}.${rule.parentIdField}`];
            const memberAggrKey = `l-${rule.model}-${parentId}-${name}`;
            let memberAggr = lookup.get(memberAggrKey);

            // Initialize and reference aggregation
            if (!memberAggr) {
              memberAggr = [];
              lookup.set(memberAggrKey, memberAggr);
            }

            // Insert self in aggregation
            memberAggr.push(obj);
          }
        } else {
          highLevel.push(obj);
        }
      }
    }
  };
