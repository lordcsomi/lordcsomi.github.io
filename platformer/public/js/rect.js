/**
 * Rectangle/Box class
 * Specifically designed to lordcsomi's platformer game
 * 
 * Additional functionality can be added if needed.
 */
export class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
    }

    get top() {return this.y}
    get bottom() {return this.y + this.h}
    get left() {return this.x}
    get right() {return this.x + this.w}
    
    // just to be complete:)
    set top(newTop) {this.y = newTop}
    set bottom(newBottom) {this.y = newBottom - this.h}
    set left(newLeft) {this.x = newLeft}
    set right(newRight) {this.x = newRight - this.w}
}