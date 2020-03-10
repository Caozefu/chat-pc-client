export default function (array, key) {
    if (!Array.isArray(array) || !key) return;
    array.sort((a, b) => a[key] < b[key] ? 1 : -1);
}
