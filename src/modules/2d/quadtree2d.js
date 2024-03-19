import Bounds2D from "./bounds2d.js";

class QuadtreeNode {
    constructor(bounds, capacity) {
        this.bounds = bounds; // The bounding box of the node
        this.capacity = capacity; // Maximum number of objects before splitting
        this.objects = []; // Objects stored in this node
        this.children = null; // Sub-regions of this node (NW, NE, SW, SE), initially null
    }

    // Method to check if this node is a leaf node (has no children)
    isLeaf() {
        return this.children === null;
    }

    // Method to subdivide this node into four child nodes
    subdivide() {
        const x = this.bounds.x;
        const y = this.bounds.y;
        const w = this.bounds.width / 2;
        const h = this.bounds.height / 2;

        const nwBounds = new Bounds2D(x, y, w, h);
        const neBounds = new Bounds2D(x + w, y, w, h);
        const swBounds = new Bounds2D(x, y + h, w, h);
        const seBounds = new Bounds2D(x + w, y + h, w, h);

        this.children = [
            new QuadtreeNode(nwBounds, this.capacity),
            new QuadtreeNode(neBounds, this.capacity),
            new QuadtreeNode(swBounds, this.capacity),
            new QuadtreeNode(seBounds, this.capacity)
        ];
    }
}

class Quadtree2D {
    constructor(bounds, capacity) {
        this.root = new QuadtreeNode(bounds, capacity); // The root node of the quadtree
        this.objects = [];
    }
    update() {
        this.clear();
        const tempObjects = [...this.objects];
        this.objects.length = 0;
        tempObjects.forEach((object) => {
            this.insert(object);
        })
    }
    clear() {
        this._clearRecursively(this.root);
    }

    // Recursive function to clear objects from the quadtree
    _clearRecursively(node) {
        node.objects = []; // Clear objects array

        if (!node.isLeaf()) {
            // Recursively clear child nodes
            for (const childNode of node.children) {
                this._clearRecursively(childNode);
            }
            node.children = null; // Reset children array
        }
    }

    // Method to insert an object into the quadtree
    insert(object) {
        this.objects.push(object);
        this._insertRecursively(object, this.root);
    }

    // Recursive function to insert an object into the quadtree
    _insertRecursively(object, node) {
        if (!node.bounds.contains(object.position)) {
            return; // Object is outside the bounds of this node, ignore
        }

        if (node.isLeaf() && node.objects.length < node.capacity) {
            // If this node is a leaf and has room for more objects, insert here
            node.objects.push(object);

        } else {
            // If this node is not a leaf or is full, subdivide and insert into child nodes
            if (node.isLeaf()) {
                node.subdivide();
            }

            // Recursively insert into appropriate child node(s)
            for (const childNode of node.children) {
                this._insertRecursively(object, childNode);
            }
        }
    }

    // Method to retrieve objects within a given range
    queryRange(range) {
        const foundObjects = [];
        this._queryRangeRecursively(range, this.root, foundObjects);
        return foundObjects;
    }

    // Recursive function to retrieve objects within a given range
    _queryRangeRecursively(range, node, foundObjects) {
        if (!node.bounds.intersects(range)) {
            return; // Node does not intersect the query range, ignore
        }

        for (const object of node.objects) {
            if (range.contains(object.position)) {
                foundObjects.push(object); // Add object to results if it's within the range
            }
        }

        if (!node.isLeaf()) {
            // Recursively query child nodes
            for (const childNode of node.children) {
                this._queryRangeRecursively(range, childNode, foundObjects);
            }
        }
    }
}

export default Quadtree2D;
