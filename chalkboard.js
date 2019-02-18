//Script for the chalkboard
$(document).ready(function() {
  // Canvas Variables
  var cv, ctx;
  (function() {
    var cv = document.getElementById('chalkboard'),
      ctx = chalkboard.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
      chalkboard.width = window.innerWidth;
      chalkboard.height = window.innerHeight - 150;

      /**
       * Your drawings need to be inside this function otherwise they will be reset when
       * you resize the browser window and the canvas goes will be cleared.
       */
      drawStuff();
    }
    resizeCanvas();

    function drawStuff() {
      // Tool variables
      var curTool = pen;
      var tool, x, y;
      var boolMouseDown = false;

      // Tool option variables
      var color, width;

      function pen() {
        this.mousedown = function(e) {
          ctx.beginPath();
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(x, y);
          boolMouseDown = true;
        };

        this.mousemove = function(e) {
          if (boolMouseDown) {
            ctx.lineTo(x, y);
            ctx.strokeStyle = color;
            ctx.stroke();
          }
        };

        this.mouseup = function(e) {
          if (boolMouseDown) {
            tool.mousemove(e);
            boolMouseDown = false;
          }
        };
      }

      function eraser() {
        this.mousedown = function(e) {
          ctx.beginPath();
          ctx.lineWidth = width;
          ctx.moveTo(x, y);
          boolMouseDown = true;
        };

        this.mousemove = function(e) {
          if (boolMouseDown) {
            ctx.lineTo(x, y);
            ctx.strokeStyle = '#000';
            ctx.stroke();
          }
        };

        this.mouseup = function(e) {
          if (boolMouseDown) {
            tool.mousemove(e);
            boolMouseDown = false;
          }
        };
      }

      $('#red, #green, #blue').slider({
        range: 'min',
        min: 0,
        max: 255,
        value: 127,
        slide: updColor,
        change: updColor
      });

      $('#width').slider({
        range: 'min',
        min: 1,
        max: 50,
        value: 10,
        slide: updWidth,
        change: updWidth
      });

      function updTool() {
        var sel = $('#tools').val();
        switch (sel) {
          case 'pen':
            curTool = pen;
            break;
          case 'eraser':
            curTool = eraser;
            break;
        }
      }

      function updWidth() {
        width = $('#width').slider('value');
        $('#widthval').val(width);
      }

      function updXY(e) {
        var elem = e.target;
        var top = 0,
          left = 0;
        while (elem.offsetParent) {
          top += elem.offsetTop;
          left += elem.offsetLeft;
          elem = elem.offsetParent;
        }

        x = e.pageX - left;
        y = e.pageY - top;
      }

      function updColor() {
        var red = $('#red').slider('value'),
          green = $('#green').slider('value'),
          blue = $('#blue').slider('value'),
          hex = hexFromRGB(red, green, blue);
        $('#swatch').css('background-color', '#' + hex);
        $('#redval').val(red);
        $('#greenval').val(green);
        $('#blueval').val(blue);
        color = '#' + hex;
      }

      function hexFromRGB(r, g, b) {
        var hex = [r.toString(16), g.toString(16), b.toString(16)];
        $.each(hex, function(nr, val) {
          if (val.length == 1) {
            hex[nr] = '0' + val;
          }
        });
        return hex.join('').toUpperCase();
      }

      function clearAll() {
        ctx.clearRect(0, 0, cv.width, cv.height);
      }
      $('#chalkboard').bind('mousedown mousemove mouseup', util);
      $('#clear').bind('click', clearAll);

      function util(e) {
        updColor();
        updTool();
        updWidth();
        updXY(e);
        tool = new curTool();
        var call = tool[e.type];
        call(e);
      }
    }
  })();
});
