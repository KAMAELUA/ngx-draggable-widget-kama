import {INgWidgetContainer, INgWidgetPlaceholder, INgWidgetPosition, INgWidgetSize} from '../interfaces/INgDraggableWidgetConfig';
import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';

@Component({
    selector: 'ng-widget-placeholder',
    template: ''
})
export class NgWidgetPlaceholder implements OnInit, INgWidgetPlaceholder {
    private _size: INgWidgetSize = { x: 0, y: 0 };
    private _position: INgWidgetPosition = { col: 0, row: 0 };
    private _ngWidgetContainer: INgWidgetContainer;
    private _cascadeMode: string = 'left';

    constructor(private _ngEl: ElementRef, private _renderer2: Renderer2) { }

    public registerGrid(ngGrid: INgWidgetContainer) {
        this._ngWidgetContainer = ngGrid;
    }

    public ngOnInit(): void {
        this._renderer2.addClass(this._ngEl.nativeElement, 'widget-placeholder');

        if (this._ngWidgetContainer.autoStyle) {
            this._renderer2.setStyle(this._ngEl.nativeElement, 'position', 'absolute');
        }
    }

    public setSize(newSize: INgWidgetSize): void {
        this._size = newSize;
        this._recalculateDimensions();
    }

    public setGridPosition(newPosition: INgWidgetPosition): void {
        this._position = newPosition;
        this._recalculatePosition();
    }

    public setCascadeMode(cascade: string): void {
        this._cascadeMode = cascade;
        switch (cascade) {
            case 'up':
            case 'left':
            default:
                this._renderer2.setStyle(this._ngEl.nativeElement, 'left', '0px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'top', '0px');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'right');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'bottom');
                break;
            case 'right':
                this._renderer2.setStyle(this._ngEl.nativeElement, 'right', '0px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'top', '0px');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'left');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'bottom');
                break;
            case 'down':
                this._renderer2.setStyle(this._ngEl.nativeElement, 'left', '0px');
                this._renderer2.setStyle(this._ngEl.nativeElement, 'bottom', '0px');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'right');
                this._renderer2.removeStyle(this._ngEl.nativeElement, 'top');
                break;
        }
    }

    // 	private methods
    private _setDimensions(w: number, h: number): void {
        this._renderer2.setStyle(this._ngEl.nativeElement, 'width', w + 'px');
        this._renderer2.setStyle(this._ngEl.nativeElement, 'height', h + 'px');
    }

    private _setPosition(x: number, y: number): void {
        const translateX = this._cascadeMode === 'right' ? -x : x;
        const translateY = this._cascadeMode === 'down' ? -y : y;
        this._renderer2.setStyle(this._ngEl.nativeElement, 'transform', `translate(${translateX}px, ${translateY}px)`);
    }

    private _recalculatePosition(): void {
        const x: number = (this._ngWidgetContainer.colWidth + this._ngWidgetContainer.marginLeft + this._ngWidgetContainer.marginRight) * (this._position.col - 1) + this._ngWidgetContainer.marginLeft;
        const y: number = (this._ngWidgetContainer.rowHeight + this._ngWidgetContainer.marginTop + this._ngWidgetContainer.marginBottom) * (this._position.row - 1) + this._ngWidgetContainer.marginTop;
        this._setPosition(x, y);
    }

    private _recalculateDimensions(): void {
        const w: number = (this._ngWidgetContainer.colWidth * this._size.x) + ((this._ngWidgetContainer.marginLeft + this._ngWidgetContainer.marginRight) * (this._size.x - 1));
        const h: number = (this._ngWidgetContainer.rowHeight * this._size.y) + ((this._ngWidgetContainer.marginTop + this._ngWidgetContainer.marginBottom) * (this._size.y - 1));
        this._setDimensions(w, h);
    }
}
