export const getPageNumberParam = (path: string) => {
    if (path) {
        const index = path.indexOf("?");
        const search = path.substring(index + 1);
        const params = new URLSearchParams(search.replaceAll("&amp;", "&"));
        return params.get("page") || undefined;
    } else {
        return undefined;
    }
};
