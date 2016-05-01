//IMPORTANT!

// This script will not work on Chrome due to CORS restrictions.
// Run chrome with this command:
// "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --allow-file-access-from-files
// before opening index.html

window.onload = function(){
  var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
  var audioFile = document.getElementById('audio');
  audioFile.crossOrigin = 'anonymous';
  var url = 'Futurisma.mp3';


  var audioSrc = audioCtx.createMediaElementSource(audioFile);
  var analyzer = audioCtx.createAnalyser();

  audioSrc.connect(analyzer);
  audioSrc.connect(audioCtx.destination);

  var frequencyData = new Uint8Array(200);

  var svgHeight = '600';
  var svgWidth = '1200';
  var barPadding = '1';

  var colorOffset = 0;

  var createSvg = function(parent, height, width){
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, svgWidth);

  svg.selectAll

  svg.selectAll('rect')
    .data(frequencyData)
    .enter()
    .append('rect')
    .attr('x', function(d,i) {
      return i * (svgWidth / frequencyData.length);
    })
    .attr('width', svgWidth / frequencyData.length);
 
  svg.selectAll('circle')
    .data(frequencyData)
    .enter()
    .append('circle')
    .attr('cx', function(d,i) {
      return i * (svgWidth / frequencyData.length);
    })
    .attr('r', svgWidth / frequencyData.length)
    .attr('cy', svgHeight / 1.5);

  var renderChart = function(){
    var minVal = Math.min.apply(null, frequencyData);
    var maxVal = Math.max.apply(null, frequencyData);

    requestAnimationFrame(renderChart);
    //console.log(frequencyData);

    analyzer.getByteFrequencyData(frequencyData);

    svg.selectAll('rect')
       .data(frequencyData)
       .attr('y', function(d) {
         return (svgHeight - d*2)/1.5;
       })
       .attr('height', function(d) {
         return d*2;
       })
       .attr('fill', function(d){
         return 'hsl( ' + colorOffset + d*1.5 + ', ' + d / 2 + '%, 50%)';
       });

    svg.selectAll('circle')
       .data(frequencyData)
       .attr('r', function(d) {
         return d/3;
       })
       .attr('fill', function(d){
         return 'hsl( ' + colorOffset + d*1.5 + ', 100%, 50%)';
       });

  };
  renderChart();

  setInterval(function(){
    colorOffset++;
    d3.select('body').transition()
      .duration(2000)
      .style('background-color', 'hsl( ' + colorOffset * 10  + ', 50%, 20%)');
  }, 2000);
  //console.log("testing...");  
}

