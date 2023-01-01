class View {
    constructor() {
        this.app = document.querySelector('#root');
        this.cells = [256];

        this.gridContainer = document.createElement('div');
        this.gridContainer.setAttribute('id', 'grid');
        for (let i = 0; i < 256; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            this.cells[i] = cell;
            this.gridContainer.appendChild(cell);
        }

        


        this.app.append(this.gridContainer);

        const width = this.gridContainer.offsetWidth;
        const cellWidth = Math.floor(width/17);

        for (let i = 0; i < 256; i++) {
            let cell = this.cells[i];
            cell.style.width = cellWidth.toString() + "px";
            cell.style.height = cellWidth.toString() + "px";
        }

        
    }
}




const view = new View();