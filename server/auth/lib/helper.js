
// mapRight : Functor f => (a -> b -> c) -> Pair a (f b) -> f c
const mapRight = f => (l, r) => r.map(f(l))

module.exports = { mapRight }