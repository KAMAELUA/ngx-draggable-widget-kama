import {Component} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'draggable';

    widgets = [
        {
            config: {
                resizable: true,
                col: 1,
                row: 1,
                sizey: 5,
                minRows: 2,
                dragHandle: '.widget-header',
                payload: 1,
                // minRows: 4,
            },
            title: 'Block 1',
            maximise: false,
            visible: true,
        },
        {
            config: {
                resizable: true,
                col: 2,
                row: 1,
                sizex: 3,
                sizey: 4,
                dragHandle: '.widget-header',
                payload: 2,
                minRows: 2,
                debug: true
            },
            title: 'Block 2',
            maximise: false,
            visible: true,
        },
        {
            config: {
                resizable: true,
                col: 5,
                row: 1,
                // sizex: 3,
                sizey: 3,
                minRows: 2,
                dragHandle: '.widget-header',
                payload: 3,
            },
            title: 'Block 3',
            maximise: false,
            visible: true
        },
        {
            config: {
                resizable: true,
                col: 6,
                row: 1,
                // sizex: 3,
                sizey: 5,
                minRows: 2,
                dragHandle: '.widget-header',
                payload: 3,
            },
            title: 'Block',
            maximise: false,
            visible: true
        },
    ];

    WIDGET_CONTAINER_FORMATINGS = {
      margins: [5, 5, 5, 5],
        max_cols: 6,
        cascade: 'left',
        auto_resize: true,
        row_height: (screen.availHeight - 50 - 80 - 70) / 7,
        min_height: (screen.availHeight - 50 - 80 - 70) / 7,
        debug: false,
        limit_to_screen: true
    };


}
