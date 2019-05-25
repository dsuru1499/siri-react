import * as _ from "lodash";
import * as T from "./types";


export function getParams(location) {
    const search = new URLSearchParams(location.search);
    let result = {
        [T.VERSION]: T.DEFAULT_VERSION,
    };
    for (let item of search) {
        let key = _.camelCase(item[0]);
        result[key] = item[1];
    }
    return result;
}