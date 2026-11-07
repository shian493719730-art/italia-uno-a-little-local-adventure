// Original, fictional café host. No likeness of the restaurant's actual owner.
// Code-native hand-drawn artwork: same 96 × 128 coordinate box and drawChef API.
// Feet end at y = 126, so all existing world anchors and counter masks still work.
const INK = '#293b68';
const PAPER = '#f3e7cd';
const SHADE = '#e4d3b2';
const WARM = '#d99d7d';

function path(g, commands, {fill, width = 1.65, alpha = 1} = {}) {
  g.save(); g.globalAlpha *= alpha;
  g.beginPath();
  for (const [op, ...p] of commands) g[op](...p);
  if (fill) {g.fillStyle = fill; g.fill();}
  g.strokeStyle = INK; g.lineWidth = width; g.stroke();
  g.restore();
}

function ellipse(g, x, y, rx, ry, {fill = PAPER, width = 1.6} = {}) {
  g.beginPath(); g.ellipse(x, y, rx, ry, -.035, 0, Math.PI * 2);
  g.fillStyle = fill; g.fill(); g.lineWidth = width; g.strokeStyle = INK; g.stroke();
}

export function drawChef(g, x, y, {scale = 1, frame = 0, pose = 'idle'} = {}) {
  g.save();
  g.translate(x, y); g.scale(scale, scale);
  g.imageSmoothingEnabled = true;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const breath = Math.sin(frame * .065) * .35;
  const wave = Math.sin(frame * .22) * 2.1;
  const blink = frame % 61 > 57;

  // Hand-sewn trousers, with a lightly repeated pencil seam and small loafers.
  path(g, [['moveTo',30,96],['bezierCurveTo',27,103,29,111,28,119],['lineTo',42,120],['lineTo',47,103],['lineTo',51,120],['lineTo',66,119],['lineTo',64,96],['closePath']], {fill:PAPER});
  path(g, [['moveTo',34,101],['bezierCurveTo',32,107,34,111,32,116]], {width:.65, alpha:.65});
  path(g, [['moveTo',57,102],['bezierCurveTo',59,108,57,111,59,116]], {width:.65, alpha:.65});
  path(g, [['moveTo',28,118],['bezierCurveTo',26,121,22,122,23,125],['bezierCurveTo',31,127,39,126,43,125],['lineTo',42,119],['closePath']], {fill:INK,width:1.25});
  path(g, [['moveTo',52,119],['lineTo',51,125],['bezierCurveTo',58,127,67,127,72,125],['bezierCurveTo',73,122,68,119,65,118],['closePath']], {fill:INK,width:1.25});

  g.save(); g.translate(0,breath);
  // Sleeves are drawn behind the apron. The relaxed hand stays below its pocket.
  path(g, [['moveTo',31,59],['bezierCurveTo',22,60,16,68,15,79],['lineTo',14,88],['lineTo',25,91],['lineTo',31,77]], {fill:PAPER});
  path(g, [['moveTo',15,87],['bezierCurveTo',12,91,14,97,18,98],['bezierCurveTo',22,98,25,95,24,91],['lineTo',23,89]], {fill:PAPER,width:1.45});
  path(g, [['moveTo',18,91],['lineTo',18,94]], {width:.75});

  if (pose === 'wave') {
    path(g, [['moveTo',63,60],['bezierCurveTo',73,62,76,69,79,72],['bezierCurveTo',82,67,81,60,82,55],['lineTo',90,56],['bezierCurveTo',92,70,86,85,79,87],['bezierCurveTo',72,86,68,79,65,76]], {fill:PAPER});
    g.save(); g.translate(wave*.55,-wave);
    path(g, [['moveTo',82,56],['bezierCurveTo',78,54,76,49,78,47],['bezierCurveTo',80,46,82,50,83,49],['bezierCurveTo',81,42,81,38,83,38],['bezierCurveTo',85,38,84,45,86,46],['bezierCurveTo',85,38,86,35,88,36],['bezierCurveTo',90,37,87,44,89,46],['bezierCurveTo',90,39,92,38,93,40],['bezierCurveTo',94,43,91,47,92,49],['bezierCurveTo',94,46,95,46,95,49],['bezierCurveTo',95,54,92,58,88,59]], {fill:PAPER,width:1.25});
    g.restore();
    path(g, [['moveTo',81,58],['lineTo',89,59]], {width:.75});
  } else if (pose === 'present') {
    path(g, [['moveTo',63,60],['bezierCurveTo',71,60,77,69,79,78],['lineTo',88,76],['lineTo',91,83],['bezierCurveTo',81,89,75,90,70,84],['lineTo',65,76]], {fill:PAPER});
    path(g, [['moveTo',85,77],['bezierCurveTo',89,74,95,74,95,78],['bezierCurveTo',94,82,90,84,86,82]], {fill:PAPER,width:1.2});
    // An ordinary bread roll on a plate; no logo or attribution on the food.
    ellipse(g,82,73,13,2.4,{fill:PAPER,width:1.15});
    path(g, [['moveTo',74,72],['bezierCurveTo',73,65,89,63,91,72],['closePath']], {fill:SHADE,width:1.15});
    path(g, [['moveTo',78,69],['lineTo',80,67],['moveTo',84,69],['lineTo',86,67]], {width:.8});
  } else {
    path(g, [['moveTo',63,59],['bezierCurveTo',72,60,77,67,80,80],['lineTo',81,90],['lineTo',70,92],['lineTo',64,76]], {fill:PAPER});
    path(g, [['moveTo',72,90],['bezierCurveTo',69,95,74,100,78,98],['bezierCurveTo',82,97,83,93,80,90]], {fill:PAPER,width:1.45});
    path(g, [['moveTo',75,93],['lineTo',75,96]], {width:.75});
  }

  // Loose linen shirt and a lightly hatched apron rather than blocky shading.
  path(g, [['moveTo',31,58],['bezierCurveTo',39,55,57,55,64,59],['lineTo',67,97],['bezierCurveTo',57,103,39,102,28,98],['closePath']], {fill:PAPER});
  path(g, [['moveTo',35,63],['lineTo',36,73],['bezierCurveTo',43,76,53,75,59,71],['lineTo',59,63],['lineTo',63,65],['lineTo',64,99],['bezierCurveTo',53,102,39,101,31,98],['lineTo',32,65],['closePath']], {fill:PAPER,width:1.5});
  path(g, [['moveTo',39,83],['bezierCurveTo',45,84,52,84,57,82],['lineTo',57,92],['bezierCurveTo',52,96,44,96,39,93],['closePath']], {width:1.1});
  path(g, [['moveTo',40,85],['bezierCurveTo',46,86,51,86,56,84],['moveTo',34,78],['lineTo',33,94],['moveTo',60,78],['lineTo',61,94]], {width:.55,alpha:.6});
  path(g, [['moveTo',32,97],['bezierCurveTo',44,100,55,100,63,97]], {width:.8});
  // A small indigo neckerchief, its unfilled tails retain the paper's warmth.
  path(g, [['moveTo',36,55],['lineTo',46,61],['lineTo',57,55],['lineTo',60,61],['lineTo',49,69],['lineTo',36,63],['closePath']], {fill:PAPER,width:1.2});
  path(g, [['moveTo',45,62],['lineTo',50,63],['lineTo',50,69],['lineTo',46,74],['lineTo',43,69],['closePath']], {fill:INK,width:1});
  path(g, [['moveTo',50,67],['lineTo',56,76],['lineTo',50,73]], {width:1.1});

  // Ears, neck and round face. No photorealistic features or identifiable likeness.
  path(g, [['moveTo',39,48],['lineTo',39,57],['bezierCurveTo',45,62,52,62,57,56],['lineTo',56,47]], {fill:PAPER,width:1.35});
  ellipse(g,30,38,4,6,{fill:PAPER,width:1.3});
  ellipse(g,65,37.5,4,6,{fill:PAPER,width:1.3});
  path(g, [['moveTo',32,26],['bezierCurveTo',38,20,58,20,63,27],['bezierCurveTo',66,35,64,46,60,50],['bezierCurveTo',54,59,41,58,35,50],['bezierCurveTo',30,44,29,32,32,26],['closePath']], {fill:PAPER,width:1.7});
  // Little sideburns, cheek strokes, an asymmetric friendly smile and moustache.
  path(g, [['moveTo',31,28],['bezierCurveTo',29,33,32,37,33,39],['moveTo',63,28],['bezierCurveTo',65,32,62,36,63,39]], {width:2.3});
  path(g, [['moveTo',36,33],['quadraticCurveTo',40,30.8,44,33],['moveTo',52,32.5],['quadraticCurveTo',56,30.3,59,32.5]], {width:1.2});
  if(blink) {
    path(g, [['moveTo',37,37],['quadraticCurveTo',40,39,43,36.8],['moveTo',53,37],['quadraticCurveTo',56,39,59,36.6]], {width:1.1});
  } else {
    ellipse(g,40,37,1.05,1.65,{fill:INK,width:.6});
    ellipse(g,55.5,36.7,1.05,1.65,{fill:INK,width:.6});
  }
  path(g, [['moveTo',48,37],['quadraticCurveTo',45,43,49,43.5],['quadraticCurveTo',51,43.6,51,42]], {width:1.05});
  path(g, [['moveTo',39,46],['quadraticCurveTo',43,42.5,48,45.8],['quadraticCurveTo',54,42,59,45.2],['quadraticCurveTo',54,49.2,49,47],['quadraticCurveTo',43,50,39,46],['closePath']], {fill:INK,width:.7});
  path(g, [['moveTo',44,51],['quadraticCurveTo',49,54,54,50.6]], {width:1.05});
  path(g, [['moveTo',34,43],['lineTo',36.5,44],['moveTo',59,42.7],['lineTo',61,42]], {width:.6,alpha:.6});
  // Pale pink cheek ink is the only small accent; the rest remains two-tone.
  g.globalAlpha=.18; g.fillStyle=WARM;
  g.beginPath();g.ellipse(36,42.5,3,1.7,0,0,Math.PI*2);g.ellipse(59,42,3,1.7,0,0,Math.PI*2);g.fill();g.globalAlpha=1;

  // Soft, irregular toque: broad ink contours and fine stitched band details.
  path(g, [['moveTo',29,20],['bezierCurveTo',20,14,25,6,34,7],['bezierCurveTo',36,-.5,48,.5,50,6],['bezierCurveTo',58,-.5,70,4,67,12],['bezierCurveTo',73,17,67,23,63,23],['lineTo',32,24],['closePath']], {fill:PAPER,width:1.7});
  path(g, [['moveTo',32,18.5],['quadraticCurveTo',47,21,63,18.5],['lineTo',63,26],['quadraticCurveTo',47,28,32,26],['closePath']], {fill:PAPER,width:1.35});
  path(g, [['moveTo',36,22],['quadraticCurveTo',46,23.5,58,22],['moveTo',35,9],['quadraticCurveTo',34,13,37,16],['moveTo',52,8],['quadraticCurveTo',54,12,52,16]], {width:.65,alpha:.65});
  g.restore(); g.restore();
}
