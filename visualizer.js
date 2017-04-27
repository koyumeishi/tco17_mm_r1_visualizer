//visualizer.js

// input file format
// L1 : { NV:nv, Edge:[edge] }
// Lx : [output #x]
// ...


//http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l){
  var r, g, b;

  if(s == 0){
      r = g = b = l; // achromatic
  }else{
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return Math.round(r * 255)*256*256 + Math.round(g * 255)*256 + Math.round(b * 255);
}

let sqrt_memo = new Array(701);
for(let dx=0; dx<=700; dx++){
  sqrt_memo[dx] = new Array(701);
  for(let dy=0; dy<=700; dy++){
    sqrt_memo[dx][dy] = Math.sqrt(dx*dx + dy*dy);
  }
}

/* File Format
** L1   : NV
** L2   : E...
** L3   : Frame0...
** L4   : Frame1...
** L5   : .
** LN+3 : FrameN...
*/

class Visualizer{
  constructor( inputText ){
    const L = inputText.split(/\r\n|\r|\n/);
    this.testCase = {};
    this.testCase["NV"] = Number(L[0]);
    this.testCase["Edge"] = L[1].split(/\s/).map(x=>Number(x));

    this.data = [];
    for(let i=2; i<L.length; i++){
      if( L[i].length > 0 ) this.data.push( L[i].split(/\s/).map(x=>Number(x)) );
    }
    this.numSteps = this.data.length;

    $('#time_bar').attr("max", this.data.length-1);

    this.canvas = document.getElementById('canv');
    this.app = PIXI.autoDetectRenderer( 
      720,
      720
    );
    this.canvas.appendChild( this.app.view );

    this.app.backgroundColor = 0x000000;

    this.stage = new PIXI.Container();
    this.container = new PIXI.Graphics();
    this.stage.addChild( this.container );
  }

  interval(t){
    if(running === false) return;

    $('#time_bar').val(t);
    $('#time_bar_display').val(t);

    this.draw(t);
    if( t+1 < this.data.length ){
      setTimeout( ()=>this.interval( Number($('#time_bar_display').val())+1), 1.0/15 );
    }else{
      running = false;
    }
  }

  draw(time){
    let container = this.container;
    container.clear();

    // ctx.clearRect(0,0, 701, 701);
    // ctx.fillStyle = 'rgba(0,0,0,0.5)';
    // ctx.fillRect(0,0, 701, 701);

    const points = this.data[time];
    let min_ratio = 114514;
    let max_ratio = -1;

    for(let i=0; i<points.length; i+=2){
      container.beginFill( hslToRgb(i/points.length*0.5, 1.0, 0.5), 0.6 );
      container.drawCircle( points[i], points[i+1], 3);
      container.endFill();
    }

    const edge = this.testCase.Edge;
    for(let i=0; i<edge.length; i+=3){
      const u = edge[i+0];
      const v = edge[i+1];
      const dx = points[2*u+0] - points[2*v+0];
      const dy = points[2*u+1] - points[2*v+1];

      const dist = Math.sqrt( dx*dx + dy*dy );
      // const dist = sqrt_memo[Math.abs(dx)][Math.abs(dy)];

      const ratio = dist / edge[i+2];

      min_ratio = Math.min(min_ratio, ratio);
      max_ratio = Math.max(max_ratio, ratio);
    }

    $('#score').val( min_ratio / max_ratio );
    $('#min_ratio').val( min_ratio );
    $('#max_ratio').val( max_ratio );


    if(show_edge) for(let i=0; i<edge.length; i+=3){
      const u = edge[i+0];
      const v = edge[i+1];
      const dx = points[2*u+0] - points[2*v+0];
      const dy = points[2*u+1] - points[2*v+1];

      const dist = Math.sqrt( dx*dx + dy*dy );
      // const dist = sqrt_memo[Math.abs(dx)][Math.abs(dy)];

      const ratio = dist / edge[i+2];

      // const h = ratio / max_ratio * 180;
      const h = ratio < 1.0 ? (120 * ratio*ratio) : 240 - (120 * 1.0/(ratio*ratio));
      // const h = ratio < 0.75 ? 0 : ratio < 1.35 ? 120 : 240;
      const s = (ratio < 1.0 ? 100-ratio*50 : 100-50/ratio);
      const l = (ratio < 1.0 ? 1-ratio : 1-1/ratio) * 50+30;
      // const a = (ratio/max_ratio) * 0.6 + 0.1;
      const a = (ratio < 1.0 ? 70-ratio*70 : 70-70/ratio)*0.01 + 0.1;

      container.beginFill().lineStyle(
        (1.0-Math.min(max_ratio/ratio, ratio/max_ratio)) * 2 + 1,
        hslToRgb(h/360, s/100, l/100),
        a)
      .moveTo( points[2*u+0], points[2*u+1] )
      .lineTo( points[2*v+0], points[2*v+1] )
      .endFill();
    }

    // this.stage.renderWebGL( this.app );
    this.app.render( this.stage );
  }
}

vis = null;

show_edge = document.getElementById("show_edge").checked;

// initialize
$('#time_bar').on( 'input', (e)=>{
  $('#time_bar_display').val( e.target.value );
  vis.draw( e.target.value );
});

$('#input_file').change( (e) => {
  let f = e.target.files[0];

  let reader  = new FileReader();
  reader.onload = (e) => {
    if( vis !== null ){
      vis.stage.destroy({children:true});
      vis.app.destroy(true);
    }
    vis = new Visualizer( e.target.result );
    $('#time_bar').val(0);
    $('#time_bar_display').val(0);
    vis.draw(0);
  };

  reader.readAsText(f);
});

// drag & drop
$('body').on( 'dragover', (e)=>{
  e.preventDefault();
  e.stopPropagation();
});
$('body').on( 'dragleave', (e)=>{
  e.preventDefault();
  e.stopPropagation();
});

$('body').on( 'drop', (e)=>{
  e.preventDefault();
  e.stopPropagation();
  let f = e.originalEvent.dataTransfer.files[0];

  let reader  = new FileReader();
  reader.onload = (e) => {
    if( vis !== null ){
      vis.stage.destroy({children:true});
      vis.app.destroy(true);
    }
    vis = new Visualizer( e.target.result );
    $('#time_bar').val(0);
    $('#time_bar_display').val(0);
    vis.draw(0);
  };

  reader.readAsText(f);
});

$('#show_edge').change( (e)=>{
  show_edge = e.target.checked;
});

running = false;
$('#run').click( ()=>{
  running = !running;
  vis.interval( Number( $('#time_bar').val() ) );
});