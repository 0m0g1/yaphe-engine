import Bounds2D from "./bounds2d.js";
 
class QuadtreeNode {
    constructor(bounds, capacity) {
        this.bounds   = bounds;
        this.capacity = capacity;
        this.objects  = [];
        this.children = null;
    }
    isLeaf() { return this.children === null; }
    subdivide() {
        const x = this.bounds.x, y = this.bounds.y;
        const w = this.bounds.width / 2, h = this.bounds.height / 2;
        this.children = [
            new QuadtreeNode(new Bounds2D(x,     y,     w, h), this.capacity),
            new QuadtreeNode(new Bounds2D(x + w, y,     w, h), this.capacity),
            new QuadtreeNode(new Bounds2D(x,     y + h, w, h), this.capacity),
            new QuadtreeNode(new Bounds2D(x + w, y + h, w, h), this.capacity),
        ];
    }
}
 
class Quadtree2D {
    constructor(bounds, capacity) {
        this.root    = new QuadtreeNode(bounds, capacity);
        this.objects = [];
        // FIX 2: pre-allocated temp array reused every update() call
        this._tempObjects = [];
    }
 
    update() {
        this.clear();
 
        // FIX 2: copy into pre-allocated array instead of [...this.objects]
        // Then re-insert from that snapshot.
        const temp = this._tempObjects;
        temp.length = 0;
        for (let i = 0; i < this.objects.length; i++) temp[i] = this.objects[i];
        this.objects.length = 0;
 
        for (let i = 0; i < temp.length; i++) this.insert(temp[i]);
    }
 
    clear() { this._clearRecursively(this.root); }
 
    _clearRecursively(node) {
        node.objects.length = 0; // clear in place — no new array
        if (!node.isLeaf()) {
            for (const child of node.children) this._clearRecursively(child);
            node.children = null;
        }
    }
 
    insert(object) {
        this.objects.push(object);
        this._insertRecursively(object, this.root);
    }
 
    _insertRecursively(object, node) {
        if (!node.bounds.contains(object.position)) return;
        if (node.isLeaf() && node.objects.length < node.capacity) {
            node.objects.push(object);
        } else {
            if (node.isLeaf()) node.subdivide();
            for (const child of node.children) this._insertRecursively(object, child);
        }
    }
 
    queryRange(range) {
        const found = [];
        this._queryRangeRecursively(range, this.root, found);
        return found;
    }
 
    _queryRangeRecursively(range, node, found) {
        if (!node.bounds.intersects(range)) return;
        for (const obj of node.objects) {
            if (range.contains(obj.position)) found.push(obj);
        }
        if (!node.isLeaf()) {
            for (const child of node.children) this._queryRangeRecursively(range, child, found);
        }
    }
}
 
export default Quadtree2D;