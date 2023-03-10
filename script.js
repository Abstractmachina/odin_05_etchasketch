class EtchaSketch {
    constructor(){}

    initGrid() {

    }

}

class View {
    gridSize = 16;
    drawingMode = 'grey';
    
    constructor() {
        this.app = document.querySelector('#root');
        this.cells = [256];

        //create header
        this.headerContainer = document.createElement('div');
        this.headerContainer.classList.add('headerContainer');

        this.title = document.createElement('h1');
        this.title.classList.add('title');
        this.title.textContent = 'Etch-A-Sketch';

        this.headerContainer.appendChild(this.title);

        this.app.appendChild(this.headerContainer);

        //create content
        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add('mainContainer');
        this.app.appendChild(this.mainContainer);

        //create controls
        this.controlContainer = document.createElement('div');
        this.controlContainer.setAttribute('id', 'controls');

        this.sliderContainer = document.createElement('div');
        this.sliderContainer.classList.add('sliderContainer');
        this.sliderContainer.style.width = '100%';
        this.slider = document.createElement('input');
        this.slider.setAttribute("type", "range");
        this.slider.setAttribute("min", "16");
        this.slider.setAttribute("max", "100");
        this.slider.setAttribute("value", "16");
        this.slider.style.width = '100%';

        this.slider.addEventListener('click', (e) => {
            this.updateGridResolution(e.target.value);
            this.buildGrid();
        });

        this.sliderContainer.appendChild(this.slider);

        this.gridDisplay = document.createElement('p');
        this.gridDisplay.classList.add('gridDisplay');
        this.gridDisplay.textContent = 'Grid size: ' + this.gridSize.toString() + " x " + this.gridSize.toString();
    
        //create buttons
        this.btn_grey = document.createElement('button');
        this.btn_grey.setAttribute('id', 'btn_grey');
        this.btn_grey.classList.add("btn");
        this.btn_grey.classList.add("btnActive");
        this.btn_grey.textContent = "Grey";
        this.btn_rainbow = document.createElement('button');
        this.btn_rainbow.setAttribute('id', 'btn_rainbow');
        this.btn_rainbow.classList.add("btn");
        this.btn_rainbow.textContent = "Rainbow";

        this.btn_grey.addEventListener('click', (e) => {
            this.setDrawingMode('grey');
        });
        this.btn_rainbow.addEventListener('click', (e) => {
            this.setDrawingMode('rainbow');
        });

        this.btnContainer = document.createElement('div');
        this.btnContainer.classList.add('btnContainer');

        this.btnContainer.append(this.btn_grey, this.btn_rainbow);

        this.controlContainer.append(this.sliderContainer, this.gridDisplay, this.btnContainer);


        this.mainContainer.appendChild(this.controlContainer);



        //create canvas
        this.gridContainer = document.createElement('div');
        this.gridContainer.setAttribute('id', 'grid');
        const width = this.gridContainer.offsetWidth;
        console.log(width);
        
        this.mainContainer.append(this.gridContainer);

        //set up cells
        this.buildGrid();
    }

    updateGridResolution(val) {
        this.gridSize = val;
        this.gridDisplay.textContent = 'Grid size: ' + this.gridSize.toString() + " x " + this.gridSize.toString();
    }


    buildGrid() {
        //remove all existing cells
        while (this.gridContainer.lastChild) {
            this.gridContainer.removeChild(this.gridContainer.lastChild);
        }
        //get dimensions
        const sizeSquared = this.gridSize * this.gridSize;
        const width = this.gridContainer.offsetWidth;
        const cellWidth = Math.floor(width/this.gridSize) ;
        this.mainContainer.style.height = width.toString() + 'px';
        //this.gridContainer.style.height = width.toString() + 'px';

        //create cells
        for (let i = 0; i < sizeSquared; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('id', 'c' + i.toString());
            cell.style.backgroundColor = 'rgb(255,255,255)';
            cell.style.width = cellWidth.toString() + "px";
            cell.style.height = cellWidth.toString() + "px";
            cell.addEventListener('mouseenter', (e) => {
                var c = document.querySelector("#" + e.target.id);
                this.draw(c);
            });
            this.cells[i] = cell;
            this.gridContainer.appendChild(cell);
        }
    }

    draw(cell) {
        var rgb = View.colorValues(cell.style.backgroundColor);

        //grey value mode
        if (this.drawingMode === 'grey') {
            for (let i = 0; i < 3;i++) {
                if (rgb[i] >= 20) rgb[i] = rgb[i] - 20;
            }
        }

        //rainbow mode
        if (this.drawingMode === 'rainbow') {
            for (let i = 0; i < 3;i++) {
                rgb[i] = Math.random() * 255;
            }
        }

        //apply new color
        var newcol = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
        cell.style.backgroundColor = newcol;

    }

    setDrawingMode(mode){

        console.log('button clicked!');
        if (mode.toLowerCase() !== 'grey' && mode.toLowerCase() !== 'rainbow') return

        this.resetButtons();
        this.drawingMode = mode.toLowerCase();

        if (this.drawingMode === 'grey') {
            
            //set to active
            this.btn_grey.classList.add('btnActive');
        }
        if (this.drawingMode === 'rainbow') {
            //set to active
            this.btn_rainbow.classList.add('btnActive');
        }

        console.log(this.drawingMode);
    }

    resetButtons() {
        //set all buttons to inactive
        var children = this.btnContainer.children;
        for (var i = 0; i < children.length; i++) {
            children[i].classList.remove('btnActive');
        }
    }

    //helper methods

    // return array of [r,g,b,a] from any valid color. if failed returns undefined
    static colorValues(color){
        if (color === '')
            return;
        if (color.toLowerCase() === 'transparent')
            return [0, 0, 0, 0];
        if (color[0] === '#')
        {
            if (color.length < 7)
            {
                // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
                color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
            }
            return [parseInt(color.substr(1, 2), 16),
                parseInt(color.substr(3, 2), 16),
                parseInt(color.substr(5, 2), 16),
                color.length > 7 ? parseInt(color.substr(7, 2), 16)/255 : 1];
        }
        if (color.indexOf('rgb') === -1)
        {
            // convert named colors
            var temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
            var flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
            temp_elem.style.color = flag;
            if (temp_elem.style.color !== flag)
                return; // color set failed - some monstrous css rule is probably taking over the color of our object
            temp_elem.style.color = color;
            if (temp_elem.style.color === flag || temp_elem.style.color === '')
                return; // color parse failed
            color = getComputedStyle(temp_elem).color;
            document.body.removeChild(temp_elem);
        }
        if (color.indexOf('rgb') === 0)
        {
            if (color.indexOf('rgba') === -1)
                color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
            return color.match(/[\.\d]+/g).map(function (a)
            {
                return +a
            });
        }
    }
}




const view = new View();